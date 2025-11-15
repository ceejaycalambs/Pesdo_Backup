# Setup Cascade Delete for Related Data

## Problem
When deleting a jobseeker or employer from the admin dashboard, their related data (applications, jobs, referrals, etc.) may remain in the database, creating orphaned records.

## Solution
Run the SQL script `cascade_delete_related_data.sql` in your Supabase SQL Editor to create database triggers that automatically delete all related data when a profile is deleted.

## What Gets Deleted

### When a Jobseeker is Deleted:
- ✅ All applications submitted by the jobseeker
- ✅ All notifications for the jobseeker
- ⚠️ Activity logs (NOT deleted by default - preserves audit trail)
- ⚠️ Login logs (NOT deleted by default - preserves audit trail)

### When an Employer is Deleted:
- ✅ All job vacancies posted by the employer
- ✅ All pending job vacancies
- ✅ All applications for jobs posted by the employer
- ✅ All notifications for the employer
- ⚠️ Activity logs (NOT deleted by default - preserves audit trail)
- ⚠️ Login logs (NOT deleted by default - preserves audit trail)

### When a Job is Deleted:
- ✅ All applications for that job

## Steps to Setup

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to **SQL Editor**

2. **Run the SQL Script**
   - Copy the contents of `database/cascade_delete_related_data.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute

3. **Verify the Triggers**
   - Go to **Database** > **Triggers**
   - You should see:
     - `trigger_cascade_delete_jobseeker_data` on `jobseeker_profiles`
     - `trigger_cascade_delete_employer_data` on `employer_profiles`
     - `trigger_cascade_delete_job_data` on `jobs`

## How It Works

1. **Jobseeker Deletion:**
   - When a jobseeker profile is deleted, the trigger fires BEFORE deletion
   - It deletes all applications, job likes, and notifications
   - Then the profile is deleted
   - Finally, the auth user is deleted (via `delete_auth_user` trigger)

2. **Employer Deletion:**
   - When an employer profile is deleted, the trigger fires BEFORE deletion
   - It collects all job IDs for that employer
   - Deletes all applications for those jobs
   - Deletes all jobs posted by the employer
   - Deletes all pending jobs
   - Deletes all notifications
   - Then the profile is deleted
   - Finally, the auth user is deleted (via `delete_auth_user` trigger)

3. **Job Deletion:**
   - When a job is deleted, the trigger fires BEFORE deletion
   - It deletes all applications for that job
   - Deletes all job likes for that job
   - Then the job is deleted

## Important Notes

- **Activity and Login Logs:** By default, these are NOT deleted to preserve audit trails. If you want to delete them too, uncomment the DELETE statements in the SQL script.

- **Order Matters:** The triggers use `BEFORE DELETE` to ensure related data is cleaned up before the parent record is deleted, preventing foreign key constraint violations.

- **Error Handling:** If deletion of related data fails, a warning is logged but the profile deletion continues. This prevents one failed deletion from blocking the entire operation.

- **Performance:** For employers with many jobs and applications, deletion may take a moment. The triggers are optimized to batch operations where possible.

## Testing

After running the script, test the cascade deletion:

1. **Test Jobseeker Deletion:**
   - Create a test jobseeker
   - Submit some applications
   - Delete the jobseeker from admin dashboard
   - Verify applications are deleted

2. **Test Employer Deletion:**
   - Create a test employer
   - Post some job vacancies
   - Have jobseekers apply to those jobs
   - Delete the employer from admin dashboard
   - Verify jobs and all applications are deleted

3. **Test Job Deletion:**
   - Create a job with applications
   - Delete the job
   - Verify applications are deleted

## Troubleshooting

If cascade deletion doesn't work:

1. **Check Trigger Existence:**
   ```sql
   SELECT trigger_name, event_object_table
   FROM information_schema.triggers
   WHERE trigger_schema = 'public'
   AND trigger_name LIKE '%cascade%';
   ```

2. **Check Function Existence:**
   ```sql
   SELECT routine_name
   FROM information_schema.routines
   WHERE routine_schema = 'public'
   AND routine_name LIKE '%cascade%';
   ```

3. **Check for Errors:**
   - Look for warnings in Supabase logs
   - Check the browser console for errors
   - Verify RLS policies allow deletion

4. **Manual Cleanup:**
   If triggers fail, you may need to manually delete related data:
   ```sql
   -- Delete applications for a jobseeker
   DELETE FROM applications WHERE jobseeker_id = 'user-id-here';
   
   -- Delete jobs and applications for an employer
   DELETE FROM applications WHERE job_id IN (
     SELECT id FROM jobs WHERE employer_id = 'employer-id-here'
   );
   DELETE FROM jobs WHERE employer_id = 'employer-id-here';
   ```

