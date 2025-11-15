-- Cascade Delete Related Data When Jobseeker or Employer is Deleted
-- This script ensures that when a profile is deleted, all related data is also cleaned up

-- ============================================================================
-- PART 1: Delete Applications When Jobseeker is Deleted
-- ============================================================================

-- Function to delete all applications when a jobseeker profile is deleted
CREATE OR REPLACE FUNCTION public.cascade_delete_jobseeker_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all applications by this jobseeker
  DELETE FROM public.applications WHERE jobseeker_id = OLD.id;
  
  -- Delete any notifications for this jobseeker
  DELETE FROM public.notifications WHERE user_id = OLD.id AND user_type = 'jobseeker';
  
  -- Delete any activity logs for this jobseeker (optional - you may want to keep logs)
  -- DELETE FROM public.activity_log WHERE user_id = OLD.id AND user_type = 'jobseeker';
  
  -- Delete any login logs for this jobseeker (optional - you may want to keep logs)
  -- DELETE FROM public.login_log WHERE user_id = OLD.id AND user_type = 'jobseeker';
  
  RAISE NOTICE 'Deleted all related data for jobseeker %', OLD.id;
  RETURN OLD;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error deleting related data for jobseeker %: %', OLD.id, SQLERRM;
    RETURN OLD;
END;
$$;

-- Create trigger for jobseeker_profiles
DROP TRIGGER IF EXISTS trigger_cascade_delete_jobseeker_data ON public.jobseeker_profiles;
CREATE TRIGGER trigger_cascade_delete_jobseeker_data
  BEFORE DELETE ON public.jobseeker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.cascade_delete_jobseeker_data();

-- ============================================================================
-- PART 2: Delete Jobs and Related Data When Employer is Deleted
-- ============================================================================

-- Function to delete all jobs and related data when an employer profile is deleted
CREATE OR REPLACE FUNCTION public.cascade_delete_employer_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  job_ids UUID[];
BEGIN
  -- Get all job IDs for this employer
  SELECT ARRAY_AGG(id) INTO job_ids
  FROM public.jobs
  WHERE employer_id = OLD.id;
  
  -- Delete all applications for jobs posted by this employer
  IF job_ids IS NOT NULL AND array_length(job_ids, 1) > 0 THEN
    DELETE FROM public.applications WHERE job_id = ANY(job_ids);
  END IF;
  
  -- Delete all jobs posted by this employer
  DELETE FROM public.jobs WHERE employer_id = OLD.id;
  
  -- Delete all pending jobs posted by this employer
  DELETE FROM public.jobvacancypending WHERE employer_id = OLD.id;
  
  -- Delete any notifications for this employer
  DELETE FROM public.notifications WHERE user_id = OLD.id AND user_type = 'employer';
  
  -- Delete any activity logs for this employer (optional - you may want to keep logs)
  -- DELETE FROM public.activity_log WHERE user_id = OLD.id AND user_type = 'employer';
  
  -- Delete any login logs for this employer (optional - you may want to keep logs)
  -- DELETE FROM public.login_log WHERE user_id = OLD.id AND user_type = 'employer';
  
  RAISE NOTICE 'Deleted all related data for employer % (including % jobs)', OLD.id, COALESCE(array_length(job_ids, 1), 0);
  RETURN OLD;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error deleting related data for employer %: %', OLD.id, SQLERRM;
    RETURN OLD;
END;
$$;

-- Create trigger for employer_profiles
DROP TRIGGER IF EXISTS trigger_cascade_delete_employer_data ON public.employer_profiles;
CREATE TRIGGER trigger_cascade_delete_employer_data
  BEFORE DELETE ON public.employer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.cascade_delete_employer_data();

-- ============================================================================
-- PART 3: Delete Applications When a Job is Deleted (if not already handled)
-- ============================================================================

-- Function to delete all applications when a job is deleted
CREATE OR REPLACE FUNCTION public.cascade_delete_job_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete all applications for this job
  DELETE FROM public.applications WHERE job_id = OLD.id;
  
  RAISE NOTICE 'Deleted all related data for job %', OLD.id;
  RETURN OLD;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error deleting related data for job %: %', OLD.id, SQLERRM;
    RETURN OLD;
END;
$$;

-- Create trigger for jobs
DROP TRIGGER IF EXISTS trigger_cascade_delete_job_data ON public.jobs;
CREATE TRIGGER trigger_cascade_delete_job_data
  BEFORE DELETE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.cascade_delete_job_data();

-- ============================================================================
-- VERIFICATION QUERIES (Run these after creating triggers to verify)
-- ============================================================================

-- Check if triggers exist:
-- SELECT trigger_name, event_object_table, action_timing, event_manipulation
-- FROM information_schema.triggers
-- WHERE trigger_schema = 'public'
-- AND trigger_name LIKE '%cascade%'
-- ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. Activity logs and login logs are NOT deleted by default (commented out)
--    This preserves audit trails. Uncomment if you want to delete them too.
--
-- 2. The triggers use BEFORE DELETE to ensure related data is cleaned up
--    before the profile is deleted, preventing orphaned records.
--
-- 3. If you have other tables that reference jobseekers or employers,
--    add DELETE statements for those tables in the respective functions.
--
-- 4. The order of deletion is important:
--    - For jobseekers: Applications -> Notifications
--    - For employers: Applications (for all jobs) -> Jobs -> Pending Jobs -> Notifications
--    - For jobs: Applications
--
-- 5. These triggers work in conjunction with the delete_auth_user triggers
--    to ensure complete cleanup when a user is deleted.

