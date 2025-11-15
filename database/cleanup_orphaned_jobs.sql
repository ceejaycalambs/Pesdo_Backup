-- Cleanup Orphaned Jobs from Deleted Employers
-- This script removes all jobs and pending jobs where the employer no longer exists
-- Run this script to clean up existing orphaned data

-- ============================================================================
-- PART 1: Delete Orphaned Jobs (from jobs table)
-- ============================================================================

-- Delete all jobs where the employer_id doesn't exist in employer_profiles
DELETE FROM public.jobs
WHERE employer_id IS NOT NULL
AND employer_id NOT IN (SELECT id FROM public.employer_profiles);

-- Show count of deleted jobs
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % orphaned jobs from jobs table', deleted_count;
END $$;

-- ============================================================================
-- PART 2: Delete Orphaned Pending Jobs (from jobvacancypending table)
-- ============================================================================

-- Delete all pending jobs where the employer_id doesn't exist in employer_profiles
DELETE FROM public.jobvacancypending
WHERE employer_id IS NOT NULL
AND employer_id NOT IN (SELECT id FROM public.employer_profiles);

-- Show count of deleted pending jobs
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % orphaned pending jobs from jobvacancypending table', deleted_count;
END $$;

-- ============================================================================
-- PART 3: Delete Orphaned Applications
-- ============================================================================

-- Delete applications for jobs that no longer exist
DELETE FROM public.applications
WHERE job_id IS NOT NULL
AND job_id NOT IN (SELECT id FROM public.jobs)
AND job_id NOT IN (SELECT id FROM public.jobvacancypending);

-- Show count of deleted applications
DO $$
DECLARE
  deleted_count INTEGER;
BEGIN
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RAISE NOTICE 'Deleted % orphaned applications', deleted_count;
END $$;

-- ============================================================================
-- PART 4: Verification Queries (Run these to check for remaining orphaned data)
-- ============================================================================

-- Check for remaining orphaned jobs
-- SELECT COUNT(*) as orphaned_jobs_count
-- FROM public.jobs
-- WHERE employer_id IS NOT NULL
-- AND employer_id NOT IN (SELECT id FROM public.employer_profiles);

-- Check for remaining orphaned pending jobs
-- SELECT COUNT(*) as orphaned_pending_jobs_count
-- FROM public.jobvacancypending
-- WHERE employer_id IS NOT NULL
-- AND employer_id NOT IN (SELECT id FROM public.employer_profiles);

-- Check for remaining orphaned applications
-- SELECT COUNT(*) as orphaned_applications_count
-- FROM public.applications
-- WHERE job_id IS NOT NULL
-- AND job_id NOT IN (SELECT id FROM public.jobs)
-- AND job_id NOT IN (SELECT id FROM public.jobvacancypending);

-- ============================================================================
-- NOTES:
-- ============================================================================
-- 1. This script is safe to run multiple times - it only deletes orphaned records
-- 2. After running this, make sure to run cascade_delete_related_data.sql
--    to set up automatic cleanup for future deletions
-- 3. The script will show notices about how many records were deleted
-- 4. Uncomment the verification queries at the end to check for any remaining
--    orphaned data

