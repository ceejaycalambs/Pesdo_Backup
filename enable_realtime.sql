-- Enable Supabase Realtime for notification tables
-- Run this in your Supabase SQL Editor

-- Enable Realtime for applications table (jobseeker & employer notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE applications;

-- Enable Realtime for jobvacancypending table (admin notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE jobvacancypending;

-- Enable Realtime for jobs table (optional - for job updates)
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;

-- Verify Realtime is enabled (check if tables are in publication)
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename IN ('applications', 'jobvacancypending', 'jobs');

