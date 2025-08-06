import { useState } from 'react';
import { useProgressAnalytics } from '@/hooks/useProgressAnalytics';
import { IOSCard } from '@/components/ios/IOSCard';
import { IOSButton } from '@/components/ios/IOSButton';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  X, 
  Target,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProgressAnalyticsProps {
  onClose: () => void;
}

const GOAL_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', 
  '#d084d0', '#ffb347', '#87ceeb', '#dda0dd', '#98fb98'
];

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ onClose }) => {
  const { goalsWithHistory, loading, getGoalProgressTrend, getOverallProgress } = useProgressAnalytics();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'bg-green-100 text-green-800';
      case 'declining':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedGoalData = selectedGoal 
    ? goalsWithHistory.find(g => g.id === selectedGoal)
    : null;

  const chartData = selectedGoalData?.history.map(point => ({
    date: format(new Date(point.recorded_at), 'MMM dd'),
    fullDate: point.recorded_at,
    progress: point.progress_percentage,
    value: point.progress_value
  })) || [];

  const pieData = goalsWithHistory.map((goal, index) => ({
    name: goal.title,
    value: goal.target_value ? Math.min(((goal.current_value || 0) / goal.target_value) * 100, 100) : 0,
    color: GOAL_COLORS[index % GOAL_COLORS.length]
  }));

  const overallData = goalsWithHistory.map((goal, index) => ({
    name: goal.title.length > 15 ? goal.title.slice(0, 15) + '...' : goal.title,
    progress: goal.target_value ? Math.min(((goal.current_value || 0) / goal.target_value) * 100, 100) : 0,
    color: GOAL_COLORS[index % GOAL_COLORS.length]
  }));

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <IOSCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </IOSCard>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <IOSCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Progress Analytics</h2>
              <p className="text-sm text-muted-foreground">Track your wellness journey over time</p>
            </div>
          </div>
          <IOSButton variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </IOSButton>
        </div>

        {goalsWithHistory.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Progress Data Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your goals to see analytics here
            </p>
            <IOSButton onClick={onClose}>Get Started</IOSButton>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Progress Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <IOSCard className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {getOverallProgress()}%
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                </div>
              </IOSCard>
              
              <IOSCard className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {goalsWithHistory.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                </div>
              </IOSCard>

              <IOSCard className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {goalsWithHistory.filter(g => getGoalProgressTrend(g.id) === 'improving').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Improving</p>
                </div>
              </IOSCard>
            </div>

            {/* Chart Type Selector */}
            <div className="flex gap-2">
              <IOSButton
                variant={chartType === 'line' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('line')}
              >
                Line Chart
              </IOSButton>
              <IOSButton
                variant={chartType === 'bar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                Bar Chart
              </IOSButton>
              <IOSButton
                variant={chartType === 'pie' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType('pie')}
              >
                <PieChartIcon className="h-4 w-4 mr-1" />
                Overview
              </IOSButton>
            </div>

            {/* Goal Selection for Line/Bar Charts */}
            {(chartType === 'line' || chartType === 'bar') && (
              <div className="space-y-3">
                <h3 className="font-semibold">Select a goal to analyze:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goalsWithHistory.map((goal) => {
                    const trend = getGoalProgressTrend(goal.id);
                    const isSelected = selectedGoal === goal.id;
                    const currentProgress = goal.target_value 
                      ? Math.min(((goal.current_value || 0) / goal.target_value) * 100, 100)
                      : 0;

                    return (
                      <IOSCard
                        key={goal.id}
                        className={cn(
                          'p-4 cursor-pointer transition-all',
                          isSelected && 'ring-2 ring-primary bg-primary/5'
                        )}
                        onClick={() => setSelectedGoal(goal.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{goal.title}</h4>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(trend)}
                            <Badge variant="outline" className={getTrendColor(trend)}>
                              {trend}
                            </Badge>
                          </div>
                        </div>
                        <Progress value={currentProgress} className="h-2 mb-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{currentProgress.toFixed(1)}% complete</span>
                          <span>{goal.history.length} data points</span>
                        </div>
                      </IOSCard>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Charts */}
            <IOSCard className="p-6">
              <div className="h-80">
                {chartType === 'pie' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Progress']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : chartType === 'bar' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overallData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Progress']} />
                      <Bar dataKey="progress" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : selectedGoalData && chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(1)}%`, 'Progress']}
                        labelFormatter={(label) => {
                          const dataPoint = chartData.find(d => d.date === label);
                          return dataPoint ? format(new Date(dataPoint.fullDate), 'PPP') : label;
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="progress" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={{ fill: '#8884d8' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-4" />
                      <p>Select a goal to view its progress timeline</p>
                    </div>
                  </div>
                )}
              </div>
            </IOSCard>

            {/* Selected Goal Details */}
            {selectedGoalData && (chartType === 'line' || chartType === 'bar') && (
              <IOSCard className="p-4">
                <h3 className="font-semibold mb-3">{selectedGoalData.title} - Progress Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Value</p>
                    <p className="font-medium">{selectedGoalData.current_value || 0} {selectedGoalData.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Target Value</p>
                    <p className="font-medium">{selectedGoalData.target_value} {selectedGoalData.unit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Data Points</p>
                    <p className="font-medium">{selectedGoalData.history.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trend</p>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(getGoalProgressTrend(selectedGoalData.id))}
                      <span className="font-medium capitalize">
                        {getGoalProgressTrend(selectedGoalData.id)}
                      </span>
                    </div>
                  </div>
                </div>
              </IOSCard>
            )}
          </div>
        )}
      </IOSCard>
    </div>
  );
};

export default ProgressAnalytics;