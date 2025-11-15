# Setup User Deletion with Auth Account Removal

## Problem
When deleting a jobseeker or employer from the admin dashboard, the profile is deleted but the authentication account remains, allowing the user to still log in.

## Solution
Run the SQL script `delete_auth_user.sql` in your Supabase SQL Editor to create:
1. A database function that can delete auth users
2. Database triggers that automatically delete auth users when profiles are deleted

## Steps to Fix

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to **SQL Editor**

2. **Run the SQL Script**
   - Copy the contents of `database/delete_auth_user.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute

3. **Verify the Triggers**
   - Go to **Database** > **Triggers**
   - You should see:
     - `trigger_delete_auth_user_jobseeker` on `jobseeker_profiles` (for jobseekers)
     - `trigger_delete_auth_user_employer` on `employer_profiles` (for employers)

## How It Works

When you delete a profile from the admin dashboard:
1. The profile is deleted from `jobseeker_profiles` (for jobseekers) or `employer_profiles` (for employers)
2. The database trigger automatically fires
3. The trigger function deletes the corresponding user from `auth.users`
4. The user (jobseeker or employer) can no longer log in

**This works for both jobseekers and employers!**

## Important Notes

- **The RPC function (`delete_auth_user`) is the PRIMARY method** for deleting auth users
- The trigger is a backup method, but Supabase may restrict direct deletion from `auth.users` in triggers
- The function uses `SECURITY DEFINER` to run with elevated privileges
- The function has error handling to prevent profile deletion from failing if auth deletion fails
- **If deletion still doesn't work after running the SQL script:**
  1. Check Supabase Dashboard > Database > Functions to verify `delete_auth_user` exists
  2. Check Supabase Dashboard > Database > Triggers to verify the triggers exist
  3. You may need to use a Supabase Edge Function with service role key instead
  4. Or manually delete users from Supabase Dashboard > Authentication > Users

## Alternative: Supabase Edge Function

If the database trigger approach doesn't work due to Supabase security restrictions, you can create an Edge Function that uses the service role key to delete auth users. This is more secure but requires additional setup.

