# Verify SMTP Setup - Step by Step

Follow these steps to verify your Resend SMTP is configured correctly.

## 🔍 Step 1: Check Supabase Logs (Most Important!)

This will show you the exact error:

1. **Go to Supabase Dashboard** → Your Project
2. **Click "Logs"** in left sidebar
3. **Select "Auth Logs"** or **"Postgres Logs"**
4. **Look for recent errors** around the time you tried to register
5. **Find the error message** - it will tell you exactly what's wrong

**Common errors you might see**:
- "SMTP connection failed"
- "Authentication failed"
- "Invalid credentials"
- "Host not found"

## ✅ Step 2: Verify Resend API Key

1. **Go to Resend Dashboard**: https://resend.com/api-keys
2. **Check**:
   - [ ] Do you have an API key?
   - [ ] Does it start with `re_`?
   - [ ] Is it active (not deleted)?
   - [ ] Does it have "Sending access" permission?

3. **If no key or key is wrong**:
   - Create new API key
   - Copy the full key (starts with `re_`)
   - Update in Supabase

## ⚙️ Step 3: Verify Supabase SMTP Settings

Go to: **Supabase Dashboard** → **Authentication** → **Settings** → **SMTP Settings**

### Check Each Field:

1. **Enable Custom SMTP**:
   - [ ] Toggle is **ON** (green/enabled)
   - [ ] Not grayed out or disabled

2. **Host**:
   - [ ] Value: `smtp.resend.com`
   - [ ] No extra spaces
   - [ ] No port number included
   - [ ] Exactly: `smtp.resend.com`

3. **Port**:
   - [ ] Value: `587`
   - [ ] Not `465`, not `25`, not `5870`
   - [ ] Exactly: `587`

4. **Username**:
   - [ ] Value: `resend`
   - [ ] Lowercase (not `Resend` or `RESEND`)
   - [ ] Exactly: `resend`

5. **Password**:
   - [ ] Value: Your full Resend API key
   - [ ] Starts with `re_`
   - [ ] No extra spaces before/after
   - [ ] Complete key (not truncated)

6. **Sender email**:
   - [ ] Value: `onboarding@resend.dev`
   - [ ] For free tier, use this exact email
   - [ ] Don't use your own email unless domain verified

7. **Sender name**:
   - [ ] Value: `PESDO Surigao City` (or your choice)
   - [ ] Can be anything

8. **Save Button**:
   - [ ] Clicked "Save" after entering all fields
   - [ ] See confirmation message
   - [ ] Settings are persisted

## 🧪 Step 4: Test SMTP Connection

After saving settings:

1. **Wait 2-3 minutes** (settings need to propagate)
2. **Try registering** a test user
3. **Check Supabase Logs** again for any new errors
4. **Check email inbox** (and spam folder)

## 🔧 Step 5: Common Fixes

### If "SMTP connection failed":
- Double-check host: `smtp.resend.com`
- Double-check port: `587`
- Verify Resend API key is correct

### If "Authentication failed":
- Verify username: `resend` (lowercase)
- Verify password: Your full Resend API key
- Make sure no extra spaces in fields

### If "Host not found":
- Check host spelling: `smtp.resend.com`
- Make sure no typos
- Try saving again

### If still 500 error:
1. **Disable Custom SMTP**
2. **Click Save**
3. **Re-enable Custom SMTP**
4. **Re-enter all settings**
5. **Click Save**
6. **Wait 3 minutes**
7. **Try again**

## 📋 Quick Copy-Paste Configuration

Copy this exactly into Supabase SMTP settings:

```
Host: smtp.resend.com
Port: 587
Username: resend
Password: [paste your Resend API key here - starts with re_]
Sender email: onboarding@resend.dev
Sender name: PESDO Surigao City
```

## 🆘 Still Not Working?

1. **Check Supabase Logs** (Step 1 above) - this is crucial!
2. **Verify Resend API key** is active
3. **Try creating a new Resend API key** and updating Supabase
4. **Wait 5 minutes** after saving (sometimes takes longer)
5. **Contact Supabase support** if logs show specific error

## ✅ Success Indicators

When SMTP is working correctly:
- ✅ No 500 errors
- ✅ Registration succeeds
- ✅ Email received in inbox
- ✅ Email comes from `onboarding@resend.dev`
- ✅ Confirmation link works

---

**Most important**: Check Supabase Logs first - they'll tell you exactly what's wrong! 🔍

