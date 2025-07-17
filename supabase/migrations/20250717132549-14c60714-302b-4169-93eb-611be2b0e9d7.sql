-- Fix RLS policies for market_data_cache to allow system insertions
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.market_data_cache;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON public.market_data_cache;

-- Create more permissive policies for system operations
CREATE POLICY "Allow system to insert market data" 
ON public.market_data_cache 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow system to read market data" 
ON public.market_data_cache 
FOR SELECT 
USING (true);

-- Fix RLS policies for signal_feedback to allow system insertions
DROP POLICY IF EXISTS "Users can insert their own feedback" ON public.signal_feedback;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.signal_feedback;

-- Create permissive policies for signal feedback (system needs to log automatically)
CREATE POLICY "Allow system to insert signal feedback" 
ON public.signal_feedback 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow system to read signal feedback" 
ON public.signal_feedback 
FOR SELECT 
USING (true);

-- Also ensure signal_history has proper policies for tracking
DROP POLICY IF EXISTS "Users can view their own signals" ON public.signal_history;
DROP POLICY IF EXISTS "Users can insert their own signals" ON public.signal_history;
DROP POLICY IF EXISTS "Users can update their own signals" ON public.signal_history;

CREATE POLICY "Allow system to manage signal history" 
ON public.signal_history 
FOR ALL 
USING (true)
WITH CHECK (true);