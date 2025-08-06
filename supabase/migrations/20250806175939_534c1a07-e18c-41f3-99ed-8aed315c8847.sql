-- Fix RLS issues by enabling RLS on tables that need it
ALTER TABLE public.cognitive_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cognitive_test_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cognitive_test_results
CREATE POLICY "Users can view their own test results" 
ON public.cognitive_test_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test results" 
ON public.cognitive_test_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for cognitive_test_sessions
CREATE POLICY "Users can view their own test sessions" 
ON public.cognitive_test_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own test sessions" 
ON public.cognitive_test_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own test sessions" 
ON public.cognitive_test_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);