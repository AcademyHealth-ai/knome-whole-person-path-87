import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HealthGoal {
  id: string;
  user_id: string;
  goal_type: string;
  title: string;
  description: string | null;
  target_value: number | null;
  current_value: number | null;
  unit: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useHealthGoals = () => {
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('No authenticated user found');
          return;
        }

        const { data, error } = await supabase
          .from('health_goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Goals fetch error:', error);
          setError(error.message);
          return;
        }

        setGoals(data || []);
      } catch (err: any) {
        console.error('Goals fetch error:', err);
        setError(err.message);
        toast({
          variant: 'destructive',
          title: 'Error fetching goals',
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [toast]);

  const updateGoalProgress = async (goalId: string, currentValue: number) => {
    try {
      const { error } = await supabase
        .from('health_goals')
        .update({ current_value: currentValue, updated_at: new Date().toISOString() })
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => 
        prev.map(goal => 
          goal.id === goalId 
            ? { ...goal, current_value: currentValue }
            : goal
        )
      );

      toast({
        title: 'Progress updated!',
        description: 'Your goal progress has been saved.'
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating progress',
        description: err.message
      });
    }
  };

  return { goals, loading, error, updateGoalProgress, refetch: () => setLoading(true) };
};