
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import SafeAreaView from '@/components/ios/SafeAreaView';
import IOSCard from '@/components/ios/IOSCard';
import IOSButton from '@/components/ios/IOSButton';
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
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  const recentInsights = [
    "Your stress levels have been lower this week - great job with those breathing exercises!",
    "I noticed you've been more active in your journal. This consistent reflection is building strong self-awareness.",
    "Your academic goals are on track. Consider scheduling that college prep meeting we discussed."
  ];

  const quickStats = [
    { label: 'Journal Entries', value: '12', change: '+3', icon: BookOpen, color: 'text-blue-600' },
    { label: 'Wellness Score', value: '78%', change: '+8%', icon: Heart, color: 'text-green-600' },
    { label: 'Goals Progress', value: '65%', change: '+12%', icon: Target, color: 'text-purple-600' },
    { label: 'Check-ins', value: '8', change: '+2', icon: Activity, color: 'text-orange-600' }
  ];

  return (
    <SafeAreaView className="bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Header */}
        <IOSCard className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {greeting}, Builder! 👋
          </h1>
          <p className="text-muted-foreground">Here's what Charlie has noticed about your journey today.</p>
        </IOSCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {quickStats.map((stat, index) => (
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
          ))}
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
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Current Goals</h3>
            </div>
            <div className="space-y-4">
              {[
                { goal: 'Complete college applications', progress: 75 },
                { goal: 'Attend weekly therapy sessions', progress: 100 },
                { goal: 'Build emergency savings fund', progress: 40 }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">{item.goal}</span>
                    <span className="text-muted-foreground">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
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
