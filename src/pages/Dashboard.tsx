
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {greeting}, Builder! 👋
          </h1>
          <p className="text-gray-600">Here's what Charlie has noticed about your journey today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Charlie's Insights */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Charlie's Daily Insights</CardTitle>
                    <CardDescription>AI-powered observations about your progress</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInsights.map((insight, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Charlie
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: '2 hours ago', action: 'Completed wellness check-in', type: 'health' },
                    { time: 'Yesterday', action: 'Added new journal entry about career goals', type: 'journal' },
                    { time: '3 days ago', action: 'Uploaded transcript from fall semester', type: 'document' },
                    { time: '1 week ago', action: 'Updated therapy session notes', type: 'health' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'health' ? 'bg-green-500' : 
                        activity.type === 'journal' ? 'bg-blue-500' : 'bg-orange-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  New Journal Entry
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Wellness Check-in
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Progress
                </Button>
              </CardContent>
            </Card>

            {/* Current Goals */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Current Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { goal: 'Complete college applications', progress: 75 },
                  { goal: 'Attend weekly therapy sessions', progress: 100 },
                  { goal: 'Build emergency savings fund', progress: 40 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.goal}</span>
                      <span className="text-gray-500">{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Privacy Reminder */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">Your Data, Your Control</span>
                </div>
                <p className="text-sm text-gray-600">
                  All your information is encrypted and private. You decide who sees what, always.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
