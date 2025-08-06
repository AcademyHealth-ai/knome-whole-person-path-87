import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProgressHistory {
  id: string;
  goal_id: string;
  progress_value: number;
  progress_percentage: number;
  recorded_at: string;
  notes?: string;
}

interface GoalWithHistory {
  id: string;
  title: string;
  goal_type: string;
  target_value: number | null;
  current_value: number | null;
  unit: string | null;
  history: ProgressHistory[];
}

export const useProgressAnalytics = () => {
  const [goalsWithHistory, setGoalsWithHistory] = useState<GoalWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No authenticated user found');
        return;
      }

      // Fetch goals
      const { data: goals, error: goalsError } = await supabase
        .from('health_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (goalsError) throw goalsError;

      // Fetch progress history for all goals
      const { data: progressHistory, error: historyError } = await supabase
        .from('goal_progress_history')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: true });

      if (historyError) throw historyError;

      // Combine goals with their history
      const goalsWithHistoryData: GoalWithHistory[] = (goals || []).map(goal => ({
        ...goal,
        history: (progressHistory || []).filter(h => h.goal_id === goal.id)
      }));

      setGoalsWithHistory(goalsWithHistoryData);
    } catch (err: any) {
      console.error('Progress analytics fetch error:', err);
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching progress data',
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const getGoalProgressTrend = (goalId: string) => {
    const goal = goalsWithHistory.find(g => g.id === goalId);
    if (!goal || goal.history.length < 2) return 'stable';

    const recent = goal.history.slice(-2);
    const change = recent[1].progress_percentage - recent[0].progress_percentage;
    
    if (change > 5) return 'improving';
    if (change < -5) return 'declining';
    return 'stable';
  };

  const getOverallProgress = () => {
    if (goalsWithHistory.length === 0) return 0;
    
    const totalProgress = goalsWithHistory.reduce((sum, goal) => {
      const currentProgress = goal.target_value 
        ? Math.min(((goal.current_value || 0) / goal.target_value) * 100, 100)
        : 0;
      return sum + currentProgress;
    }, 0);
    
    return Math.round(totalProgress / goalsWithHistory.length);
  };

  return {
    goalsWithHistory,
    loading,
    error,
    getGoalProgressTrend,
    getOverallProgress,
    refetch: fetchProgressData
  };
};