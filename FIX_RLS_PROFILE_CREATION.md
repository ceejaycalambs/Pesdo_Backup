# Fix: RLS Policy Error During Profile Creation

## The Problem

When email confirmation is enabled, users don't have an authenticated session immediately after signup. This causes RLS (Row Level Security) to block profile creation.

**Error**: `new row violates row-level security policy for table "jobseeker_profiles"`

## The Solution

Use a database function with `SECURITY DEFINER` to bypass RLS during profile creation.

## 🔧 Step 1: Run SQL Script

1. **Go to Supabase Dashboard** → Your Project
2. **Navigate to SQL Editor**
3. **Copy and paste** the contents of `fix_profile_creation_rls.sql`
4. **Click "Run"**

This creates:
- `create_jobseeker_profile()` function
- `create_employer_profile()` function
- Both functions bypass RLS using `SECURITY DEFINER`

## ✅ Step 2: Code Already Updated

The `AuthContext.jsx` has been updated to use these RPC functions instead of direct inserts.

## 🧪 Step 3: Test

1. **Try registering a new user**
2. **Check console** - should see "✅ Profile created successfully"
3. **Check database** - profile should be created

## 📋 What Changed

### Before:
```javascript
// Direct insert (blocked by RLS)
await supabase.from('jobseeker_profiles').insert([userProfile]);
```

### After:
```javascript
// RPC function (bypasses RLS)
await supabase.rpc('create_jobseeker_profile', {
  p_user_id: data.user.id,
  p_email: data.user.email,
  p_username: additionalData.username || null,
  p_first_name: additionalData.first_name || null,
  p_last_name: additionalData.last_name || null
});
```

## 🎯 Why This Works

1. **SECURITY DEFINER**: Function runs with creator's privileges (bypasses RLS)
2. **Works without session**: Can create profile even if user isn't authenticated yet
3. **Safe**: Only creates profile for the user who just signed up
4. **Handles conflicts**: Uses `ON CONFLICT` to update if profile already exists

## ✅ Result

- ✅ User signs up
- ✅ Profile created successfully (even without email confirmation)
- ✅ User can verify email later
- ✅ Profile is ready when they log in

---

**Run the SQL script and test registration again!**

