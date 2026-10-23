-- Migration 023: Secure visitor_logs table RLS policy
-- Prevents unauthenticated public clients from querying visitor telemetry data (IPs, locations, timestamps)

-- 1. Ensure RLS is enabled on visitor_logs
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

-- 2. Drop insecure public read policy
DROP POLICY IF EXISTS "Allow read to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow authenticated read to visitor_logs" ON public.visitor_logs;

-- 3. Restrict SELECT to authenticated users only
CREATE POLICY "Allow authenticated read to visitor_logs"
  ON public.visitor_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- 4. Retain public insert for analytics logging while restricting reads
DROP POLICY IF EXISTS "Allow public insert to visitor_logs" ON public.visitor_logs;
CREATE POLICY "Allow public insert to visitor_logs"
  ON public.visitor_logs FOR INSERT
  WITH CHECK (true);

-- 5. Retain authenticated delete for log management
DROP POLICY IF EXISTS "Allow authenticated delete to visitor_logs" ON public.visitor_logs;
CREATE POLICY "Allow authenticated delete to visitor_logs"
  ON public.visitor_logs FOR DELETE
  USING (auth.role() = 'authenticated');

