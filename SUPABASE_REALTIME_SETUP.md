# Supabase Realtime Setup Guide

## Important: Realtime vs Replication

**Realtime** and **Replication** are different features:
- **Realtime**: Real-time subscriptions to database changes (what we need) ✅ Already available
- **Replication**: Copying data to external destinations (different feature) ⚠️ Coming Soon

## Step 1: Enable Realtime for Tables

Realtime is enabled at the **table level**, not through the Replication section. Here's how:

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **Database** → **Tables**
3. Click on each table you want to enable:
   - `applications` (for jobseeker and employer notifications)
   - `jobvacancypending` (for admin notifications)
   - `jobs` (optional, for job updates)
4. In the table settings, look for **"Realtime"** toggle or **"Enable Realtime"** option
5. Enable it for each table

### Option B: Using SQL (Alternative)

Run this SQL in the Supabase SQL Editor:

```sql
-- Enable Realtime for applications table
ALTER PUBLICATION supabase_realtime ADD TABLE applications;

-- Enable Realtime for jobvacancypending table
ALTER PUBLICATION supabase_realtime ADD TABLE jobvacancypending;

-- Enable Realtime for jobs table (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE jobs;
```

**Note**: If you get an error about the publication not existing, Realtime might not be enabled for your project. Contact Supabase support or check your project settings.

## Step 2: Verify RLS Policies

Make sure your Row Level Security (RLS) policies allow users to:
- **Jobseekers**: Read their own applications
- **Employers**: Read applications for their jobs
- **Admins**: Read all pending jobs

## Step 3: Test the Integration

1. **For Jobseekers**: 
   - Have an employer accept/reject an application
   - The notification should appear in real-time

2. **For Employers**:
   - Have a jobseeker apply to a job
   - The notification should appear in real-time

3. **For Admins**:
   - Have an employer submit a new job
   - The notification should appear in real-time

## Troubleshooting

### Notifications not appearing?
- Check browser console for errors
- Verify Realtime is enabled in Supabase Dashboard
- Check RLS policies allow the user to read the data
- Ensure the user is authenticated

### Browser notifications not working?
- Check if notification permission is granted
- Some browsers require HTTPS for notifications
- Check browser console for permission errors

## Features Implemented

✅ Real-time application status updates (Jobseekers)
✅ Real-time new application notifications (Employers)
✅ Real-time job approval notifications (Admins)
✅ Unread notification count badge
✅ Mark as read functionality
✅ Browser push notifications (when permission granted)
✅ Notification dropdown with recent notifications

