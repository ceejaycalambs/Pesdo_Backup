# Testing Supabase Realtime Notifications

## ✅ Step 1: Verify Realtime is Enabled

Run this query in Supabase SQL Editor to verify:

```sql
-- Check if tables are in Realtime publication
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename IN ('applications', 'jobvacancypending', 'jobs');
```

You should see all three tables listed. If not, the Realtime might not be enabled for your project.

---

## 🧪 Step 2: Test Notifications

### Test 1: Jobseeker Notifications (Application Status Change)

1. **Open Jobseeker Dashboard** in one browser/tab
2. **Open Employer Dashboard** in another browser/tab (or different user)
3. In Employer Dashboard:
   - Go to "Manage Job Vacancy"
   - Click on a job with applications
   - Accept or Reject an application
4. **Check Jobseeker Dashboard**:
   - The notification button should show a badge with count
   - Click the notification button to see the update
   - Notification should appear in real-time (no page refresh needed)

### Test 2: Employer Notifications (New Application)

1. **Open Employer Dashboard** in one browser/tab
2. **Open Jobseeker Dashboard** in another browser/tab (different user)
3. In Jobseeker Dashboard:
   - Browse jobs and apply to a job
4. **Check Employer Dashboard**:
   - The notification button should show a badge
   - New application notification should appear in real-time

### Test 3: Admin Notifications (New Job Pending)

1. **Open Admin Dashboard** → Job Management in one browser/tab
2. **Open Employer Dashboard** in another browser/tab
3. In Employer Dashboard:
   - Submit a new job vacancy
4. **Check Admin Dashboard**:
   - Notification should appear for new pending job

---

## 🔍 Step 3: Check Browser Console

Open browser Developer Tools (F12) and check the Console tab. You should see:

**Success messages:**
```
🔔 Application status changed: {...}
🔔 New application received: {...}
✅ Resume modal opened
```

**If you see errors:**
- `Failed to fetch`: Check your Supabase connection
- `RLS policy violation`: Check Row Level Security policies
- `Channel subscription failed`: Realtime might not be enabled

---

## 🐛 Troubleshooting

### Notifications not appearing?

1. **Check Realtime is enabled:**
   ```sql
   SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
   ```

2. **Check RLS policies:**
   - Jobseekers can read their own applications
   - Employers can read applications for their jobs
   - Admins can read all pending jobs

3. **Check browser console** for errors

4. **Verify user is authenticated** - notifications only work for logged-in users

5. **Check network tab** - ensure WebSocket connection is established

### Browser notifications not working?

- Browser notifications require user permission
- Click the notification button first (it will request permission)
- Some browsers require HTTPS for notifications
- Check browser settings → Notifications → Allow for your site

---

## ✅ Expected Behavior

When everything is working:

1. **Real-time updates**: Notifications appear instantly without page refresh
2. **Unread badge**: Shows count of unread notifications
3. **Mark as read**: Clicking a notification marks it as read
4. **Browser notifications**: Optional browser popup notifications (if permission granted)
5. **Persistent**: Notifications persist across page refreshes

---

## 🎉 Success Indicators

- ✅ Notification button shows unread count badge
- ✅ Notifications appear in dropdown when clicked
- ✅ Real-time updates work (no refresh needed)
- ✅ Browser console shows subscription messages
- ✅ No errors in browser console

If all these work, your notification system is fully functional! 🚀

