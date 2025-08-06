
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import SafeAreaView from '@/components/ios/SafeAreaView';
import IOSCard from '@/components/ios/IOSCard';
import IOSButton from '@/components/ios/IOSButton';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useHealthGoals } from '@/hooks/useHealthGoals';
import { 
  Brain, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Heart, 
  Shield, 
  Plus,
  MessageCircle,
  Target,
  BookOpen,
  Activity,
  User,
  Loader2
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { goals, loading: goalsLoading, updateGoalProgress } = useHealthGoals();

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  const userName = profile?.first_name || 'there';
  const isLoading = profileLoading || goalsLoading;

  // Calculate overall goal progress
  const overallProgress = useMemo(() => {
    if (goals.length === 0) return 0;
    const totalProgress = goals.reduce((sum, goal) => {
      const current = goal.current_value || 0;
      const target = goal.target_value || 100;
      return sum + (current / target) * 100;
    }, 0);
    return Math.min(Math.round(totalProgress / goals.length), 100);
  }, [goals]);

  const activeGoalsCount = goals.filter(goal => goal.is_active).length;

  const quickStats = [
    { label: 'Active Goals', value: activeGoalsCount.toString(), change: `${goals.length} total`, icon: Target, color: 'text-purple-600' },
    { label: 'Overall Progress', value: `${overallProgress}%`, change: 'This week', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Profile Setup', value: profile?.onboarding_completed ? '100%' : '50%', change: 'Complete', icon: User, color: 'text-blue-600' },
    { label: 'Wellness Areas', value: new Set(goals.map(g => g.goal_type)).size.toString(), change: 'Categories', icon: Heart, color: 'text-pink-600' }
  ];

  const recentInsights = [
    `Welcome ${userName}! Your wellness journey is looking great.`,
    `You have ${activeGoalsCount} active goals to focus on.`,
    goals.length > 0 ? `Your ${goals[0].title} goal is making progress!` : "Consider setting up some wellness goals to get started."
  ];

  return (
    <SafeAreaView className="bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Header */}
        <IOSCard className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              `${greeting}, ${userName}! 👋`
            )}
          </h1>
          <p className="text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-64" />
            ) : (
              "Here's your wellness dashboard with real-time insights."
            )}
          </p>
        </IOSCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <IOSCard key={index} className="p-3">
                <Skeleton className="h-16 w-full" />
              </IOSCard>
            ))
          ) : (
            quickStats.map((stat, index) => (
              <IOSCard key={index} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-foreground">{stat.value}</span>
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </IOSCard>
            ))
          )}
        </div>

        <div className="space-y-4">
          {/* Charlie's Insights */}
          <IOSCard className="bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Charlie's Daily Insights</h3>
                <p className="text-sm text-muted-foreground">AI-powered observations about your progress</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {recentInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                  <p className="text-sm text-foreground">{insight}</p>
                </div>
              ))}
            </div>
            <IOSButton className="w-full bg-gradient-to-r from-primary to-accent">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Charlie
            </IOSButton>
          </IOSCard>

          {/* Recent Activity */}
          <IOSCard>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {[
                { time: '2 hours ago', action: 'Completed wellness check-in', type: 'health' },
                { time: 'Yesterday', action: 'Added new journal entry about career goals', type: 'journal' },
                { time: '3 days ago', action: 'Uploaded transcript from fall semester', type: 'document' },
                { time: '1 week ago', action: 'Updated therapy session notes', type: 'health' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'health' ? 'bg-green-500' : 
                    activity.type === 'journal' ? 'bg-primary' : 'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </IOSCard>

          {/* Quick Actions */}
          <IOSCard>
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <IOSButton variant="outline" size="sm" className="flex-col h-16 justify-center">
                <Plus className="h-4 w-4 mb-1" />
                <span className="text-xs">Journal</span>
              </IOSButton>
              <IOSButton variant="outline" size="sm" className="flex-col h-16 justify-center">
                <FileText className="h-4 w-4 mb-1" />
                <span className="text-xs">Upload</span>
              </IOSButton>
              <IOSButton variant="outline" size="sm" className="flex-col h-16 justify-center">
                <Heart className="h-4 w-4 mb-1" />
                <span className="text-xs">Wellness</span>
              </IOSButton>
              <IOSButton variant="outline" size="sm" className="flex-col h-16 justify-center">
                <TrendingUp className="h-4 w-4 mb-1" />
                <span className="text-xs">Progress</span>
              </IOSButton>
            </div>
          </IOSCard>

          {/* Current Goals */}
          <IOSCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Your Wellness Goals</h3>
              </div>
              {!isLoading && goals.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {activeGoalsCount} active
                </Badge>
              )}
            </div>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))
              ) : goals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No wellness goals set yet</p>
                  <IOSButton variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Goal
                  </IOSButton>
                </div>
              ) : (
                goals.slice(0, 5).map((goal) => {
                  const progress = goal.target_value 
                    ? Math.min(Math.round(((goal.current_value || 0) / goal.target_value) * 100), 100)
                    : 0;
                  
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">{goal.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{progress}%</span>
                          {goal.unit && goal.current_value !== null && goal.target_value && (
                            <span className="text-xs text-muted-foreground">
                              ({goal.current_value}/{goal.target_value} {goal.unit})
                            </span>
                          )}
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                      {goal.description && (
                        <p className="text-xs text-muted-foreground">{goal.description}</p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </IOSCard>

          {/* Privacy Reminder */}
          <IOSCard className="bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Your Data, Your Control</span>
            </div>
            <p className="text-sm text-muted-foreground">
              On-device encryption ensures your information stays private. You decide who sees what, always.
            </p>
          </IOSCard>
        </div>
      </div>
    </SafeAreaView>
  );
};

export default Dashboard;
