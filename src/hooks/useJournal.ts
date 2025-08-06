import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood_rating: number | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

interface CreateJournalEntry {
  title: string;
  content: string;
  mood_rating?: number;
  tags?: string[];
}

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Journal fetch error:', error);
        setError(error.message);
        return;
      }

      setEntries(data || []);
    } catch (err: any) {
      console.error('Journal fetch error:', err);
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching journal entries',
        description: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData: CreateJournalEntry) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert([{
          user_id: user.id,
          ...entryData
        }])
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data, ...prev]);
      
      toast({
        title: 'Journal entry created!',
        description: 'Your reflection has been saved.'
      });

      return data;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error creating entry',
        description: err.message
      });
      throw err;
    }
  };

  const updateEntry = async (id: string, entryData: Partial<CreateJournalEntry>) => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(entryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => 
        prev.map(entry => entry.id === id ? data : entry)
      );

      toast({
        title: 'Entry updated!',
        description: 'Your changes have been saved.'
      });

      return data;
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating entry',
        description: err.message
      });
      throw err;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));

      toast({
        title: 'Entry deleted',
        description: 'Your journal entry has been removed.'
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error deleting entry',
        description: err.message
      });
      throw err;
    }
  };

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries
  };
};