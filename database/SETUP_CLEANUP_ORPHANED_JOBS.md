# Cleanup Orphaned Jobs from Deleted Employers

## Problem
After deleting employers from the admin dashboard, their jobs and pending jobs remain in the database tables (`jobs` and `jobvacancypending`), creating orphaned records.

## Solution
Run the cleanup script `cleanup_orphaned_jobs.sql` to remove all jobs from deleted employers.

## What Gets Deleted

1. **Orphaned Jobs** - All jobs in the `jobs` table where the employer no longer exists
2. **Orphaned Pending Jobs** - All jobs in the `jobvacancypending` table where the employer no longer exists
3. **Orphaned Applications** - All applications for jobs that no longer exist

## Steps to Clean Up

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to **SQL Editor**

2. **Run the Cleanup Script**
   - Copy the contents of `database/cleanup_orphaned_jobs.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute

3. **Check the Results**
   - The script will show notices about how many records were deleted
   - Look for messages like:
     - `Deleted X orphaned jobs from jobs table`
     - `Deleted X orphaned pending jobs from jobvacancypending table`
     - `Deleted X orphaned applications`

4. **Verify Cleanup (Optional)**
   - Uncomment the verification queries at the end of the script
   - Run them to check if any orphaned data remains
   - All counts should be 0

## After Cleanup

**IMPORTANT:** After running the cleanup script, make sure to also run:
- `database/cascade_delete_related_data.sql` - This sets up automatic cleanup for future deletions

This ensures that when you delete employers in the future, their jobs will be automatically deleted too.

## Safety

- ✅ Safe to run multiple times - only deletes orphaned records
- ✅ Won't delete jobs from existing employers
- ✅ Won't delete applications for existing jobs
- ✅ Shows detailed notices about what was deleted

## Example Output

When you run the script, you should see output like:
```
NOTICE:  Deleted 5 orphaned jobs from jobs table
NOTICE:  Deleted 3 orphaned pending jobs from jobvacancypending table
NOTICE:  Deleted 12 orphaned applications
```

## Troubleshooting

If the script doesn't delete anything:
1. Check if there are actually orphaned records (uncomment verification queries)
2. Verify that employers were actually deleted from `employer_profiles`
3. Check if `employer_id` values in jobs match the format of IDs in `employer_profiles`

If you get permission errors:
- Make sure you're running the script as a user with DELETE permissions
- Check RLS policies on the tables

