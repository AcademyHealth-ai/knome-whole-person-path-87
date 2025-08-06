import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  onboarding_completed: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('No authenticated user found');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Profile fetch error:', error);
          setError(error.message);
          return;
        }

        setProfile(data);
      } catch (err: any) {
        console.error('Profile fetch error:', err);
        setError(err.message);
        toast({
          variant: 'destructive',
          title: 'Error fetching profile',
          description: err.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  return { profile, loading, error, refetch: () => setLoading(true) };
};