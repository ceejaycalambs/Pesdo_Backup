-- =====================================================
-- CLEAN JOBSEEKER AND EMPLOYER DATA FOR FRESH START
-- =====================================================
-- WARNING: This script will DELETE ALL data from:
--   - Jobseekers and their profiles
--   - Employers and their profiles
--   - All jobs posted by employers
--   - All job applications
--   - All notifications related to jobs/applications
--   - All pending job vacancies
--   - ALL FILES IN STORAGE (resumes, profile pictures, permits, legal documents, company logos)
--
-- This script will NOT delete:
--   - Admin profiles
--   - Authentication users (auth.users table) - optional deletion available
--
-- IMPORTANT: 
--   1. BACKUP YOUR DATA FIRST if you need it later
--   2. Run this script in Supabase SQL Editor
--   3. Make sure you understand what will be deleted
--   4. Storage files deletion requires manual steps (see below)
-- =====================================================

-- Disable triggers temporarily to avoid constraint issues
SET session_replication_role = 'replica';

-- Step 1: Delete all notifications (related to applications/jobs)
DELETE FROM public.notifications
WHERE jobseeker_id IS NOT NULL 
   OR employer_id IS NOT NULL;

-- Step 2: Delete all job applications (references jobs and jobseekers)
DELETE FROM public.applications;

-- Step 3: Delete all pending job vacancies (references jobs)
DELETE FROM public.jobvacancypending;

-- Step 4: Delete all jobs (posted by employers)
DELETE FROM public.jobs;

-- Step 5: Delete all jobseeker profiles
DELETE FROM public.jobseeker_profiles;

-- Step 6: Delete all employer profiles
DELETE FROM public.employer_profiles;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- =====================================================
-- STORAGE FILES DELETION
-- =====================================================
-- NOTE: SQL cannot directly delete files from Supabase Storage
-- You need to delete storage files manually through:
--
-- OPTION 1: Supabase Dashboard (Recommended)
--   1. Go to Storage section in Supabase Dashboard
--   2. Open the 'files' bucket
--   3. Navigate to 'profiles' folder
--   4. Delete all folders (each folder is a user ID)
--   5. Also check for employer files (permits, legal documents, company logos)
--
-- OPTION 2: Use Supabase Storage API (via your app or script)
--   Run this JavaScript code in your browser console or create a script:
--
--   ```javascript
--   import { createClient } from '@supabase/supabase-js'
--   
--   const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SERVICE_ROLE_KEY')
--   
--   // Delete all files in profiles folder
--   const { data: profiles, error: listError } = await supabase.storage
--     .from('files')
--     .list('profiles', { limit: 1000, offset: 0 })
--   
--   if (profiles) {
--     const filesToDelete = profiles.map(folder => `profiles/${folder.name}`)
--     const { error: deleteError } = await supabase.storage
--       .from('files')
--       .remove(filesToDelete)
--   }
--   
--   // Also delete employer files (adjust paths based on your structure)
--   // Check for permits, legal documents, company logos
--   ```
--
-- OPTION 3: Delete entire 'files' bucket and recreate (if you want complete cleanup)
--   1. Go to Storage in Supabase Dashboard
--   2. Delete the 'files' bucket
--   3. Create a new 'files' bucket with same settings
--
-- =====================================================
-- VERIFICATION QUERIES (Run these to confirm deletion)
-- =====================================================

-- Check remaining jobseekers (should be 0)
-- SELECT COUNT(*) as remaining_jobseekers FROM public.jobseeker_profiles;

-- Check remaining employers (should be 0)
-- SELECT COUNT(*) as remaining_employers FROM public.employer_profiles;

-- Check remaining jobs (should be 0)
-- SELECT COUNT(*) as remaining_jobs FROM public.jobs;

-- Check remaining applications (should be 0)
-- SELECT COUNT(*) as remaining_applications FROM public.applications;

-- Check remaining notifications (should be 0 or only admin-related)
-- SELECT COUNT(*) as remaining_notifications FROM public.notifications;

-- =====================================================
-- OPTIONAL: Also delete auth users (if you want complete cleanup)
-- =====================================================
-- WARNING: This will delete authentication records too
-- Only run if you want to completely remove user accounts
-- 
-- DELETE FROM auth.users 
-- WHERE id IN (
--   SELECT id FROM public.jobseeker_profiles
--   UNION
--   SELECT id FROM public.employer_profiles
-- );
-- 
-- Note: The above might fail if profiles are already deleted
-- Alternative approach - delete auth users directly:
-- 
-- DELETE FROM auth.users 
-- WHERE id NOT IN (SELECT id FROM public.admin_profiles);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- If you see this message, the database cleanup completed successfully!
-- 
-- NEXT STEPS:
-- 1. Delete storage files using one of the methods above
-- 2. Verify all data is deleted using the verification queries
-- 3. You can now start fresh with new registrations
--
-- REMEMBER: Storage files (resumes, profile pictures, permits, etc.)
--           must be deleted separately through Supabase Dashboard or
--           using the provided JavaScript script (delete_storage_files.js)

