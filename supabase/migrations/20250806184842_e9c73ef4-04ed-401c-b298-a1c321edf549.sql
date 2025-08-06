-- Create progress tracking table
CREATE TABLE public.goal_progress_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL,
  user_id UUID NOT NULL,
  progress_value INTEGER NOT NULL,
  progress_percentage DECIMAL(5,2),
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.goal_progress_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own progress history" 
ON public.goal_progress_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress history" 
ON public.goal_progress_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress history" 
ON public.goal_progress_history 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress history" 
ON public.goal_progress_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_goal_progress_history_goal_id ON public.goal_progress_history(goal_id);
CREATE INDEX idx_goal_progress_history_user_recorded ON public.goal_progress_history(user_id, recorded_at);

-- Create function to automatically log progress when goals are updated
CREATE OR REPLACE FUNCTION public.log_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if current_value actually changed
  IF OLD.current_value IS DISTINCT FROM NEW.current_value THEN
    INSERT INTO public.goal_progress_history (
      goal_id, 
      user_id, 
      progress_value, 
      progress_percentage,
      recorded_at
    ) VALUES (
      NEW.id,
      NEW.user_id,
      COALESCE(NEW.current_value, 0),
      CASE 
        WHEN NEW.target_value > 0 THEN 
          ROUND((COALESCE(NEW.current_value, 0)::DECIMAL / NEW.target_value::DECIMAL) * 100, 2)
        ELSE 0
      END,
      NEW.updated_at
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically log progress changes
CREATE TRIGGER log_health_goal_progress
  AFTER UPDATE ON public.health_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.log_goal_progress();