# Troubleshoot: "Error sending confirmation email" (500 Error)

## The Problem

```
500 (Internal Server Error)
Error sending confirmation email
```

This means:
- ✅ Email confirmation is enabled
- ❌ SMTP is not configured OR configuration is incorrect

## 🔧 Quick Fix Steps

### Step 1: Verify SMTP is Enabled

1. **Go to Supabase Dashboard** → Your Project
2. **Authentication** → **Settings**
3. **Scroll to "SMTP Settings"**
4. **Check**: Is "Enable Custom SMTP" **toggled ON**?
   - If **OFF**: Turn it ON and configure
   - If **ON**: Check configuration below

### Step 2: Verify SMTP Configuration

Make sure your SMTP settings are **exactly** like this:

```
Host: smtp.resend.com
Port: 587
Username: resend
Password: re_your_actual_api_key_here
Sender email: onboarding@resend.dev
Sender name: PESDO Surigao City
```

**Common Mistakes**:
- ❌ Wrong host (should be `smtp.resend.com`, not `smtp.resend.com:587`)
- ❌ Wrong port (should be `587`, not `465` or `25`)
- ❌ Wrong username (should be `resend`, not your email)
- ❌ Wrong password (should be your Resend API key, not your password)
- ❌ Missing `re_` prefix in API key

### Step 3: Verify Resend API Key

1. **Go to Resend Dashboard**: https://resend.com/api-keys
2. **Check your API key**:
   - Should start with `re_`
   - Should be active (not deleted)
   - Should have "Sending access" permission
3. **If key is missing**: Create a new one and update Supabase

### Step 4: Test SMTP Connection

1. **In Supabase Dashboard** → **Authentication** → **Settings**
2. **After saving SMTP settings**, try registering again
3. **Check Supabase Logs**:
   - Go to **Logs** → **Postgres Logs** or **Auth Logs**
   - Look for SMTP connection errors

### Step 5: Alternative - Disable Email Confirmation (Temporary)

If you need to test registration immediately:

1. **Supabase Dashboard** → **Authentication** → **Settings**
2. **Turn OFF** "Enable Email Confirmations"
3. **Click Save**
4. **Test registration** (should work now)
5. **Re-enable** after fixing SMTP

## 🔍 Detailed Troubleshooting

### Check 1: Resend API Key Format

Your API key should look like:
```
re_1234567890abcdefghijklmnopqrstuvwxyz
```

**Not**:
- ❌ `1234567890...` (missing `re_` prefix)
- ❌ Your email address
- ❌ Your Resend password

### Check 2: SMTP Settings Format

**Correct**:
```
Host: smtp.resend.com
Port: 587
Username: resend
Password: re_abc123... (your full API key)
```

**Incorrect**:
```
Host: smtp.resend.com:587  ❌ (port should be separate)
Port: 465  ❌ (should be 587)
Username: your-email@example.com  ❌ (should be "resend")
Password: your-password  ❌ (should be API key)
```

### Check 3: Verify Resend Account

1. **Log into Resend**: https://resend.com
2. **Check account status**: Should be active
3. **Check API key**: Should be visible and active
4. **Check limits**: Should have remaining emails

### Check 4: Supabase Logs

1. **Go to Supabase Dashboard** → **Logs**
2. **Check "Auth Logs"** or **"Postgres Logs"**
3. **Look for**:
   - SMTP connection errors
   - Authentication errors
   - Email sending errors

## 🆘 Common Issues & Solutions

### Issue 1: "SMTP connection failed"

**Solution**:
- Verify host: `smtp.resend.com`
- Verify port: `587`
- Verify username: `resend`
- Check API key is correct

### Issue 2: "Authentication failed"

**Solution**:
- API key might be wrong
- Copy API key again from Resend
- Make sure no extra spaces in password field

### Issue 3: "Sender email not verified"

**Solution**:
- Use `onboarding@resend.dev` for free tier
- Don't use your own email unless you've verified domain

### Issue 4: Still getting 500 error after configuration

**Solution**:
1. **Wait 2-3 minutes** (settings need to propagate)
2. **Try registering again**
3. **Check Supabase logs** for specific error
4. **Verify all settings** are saved correctly

## ✅ Verification Checklist

- [ ] Resend account created and verified
- [ ] API key created (starts with `re_`)
- [ ] SMTP enabled in Supabase
- [ ] Host: `smtp.resend.com`
- [ ] Port: `587`
- [ ] Username: `resend`
- [ ] Password: Your full Resend API key
- [ ] Sender email: `onboarding@resend.dev`
- [ ] Settings saved in Supabase
- [ ] Waited 2-3 minutes after saving
- [ ] Tested registration

## 🎯 Quick Test

After configuring SMTP:

1. **Wait 2-3 minutes** (important!)
2. **Try registering** a new user
3. **Check email inbox** for confirmation email
4. **If still fails**: Check Supabase logs for specific error

## 📝 Next Steps

1. **Verify SMTP settings** are correct (see Step 2 above)
2. **Wait 2-3 minutes** after saving
3. **Try registering** again
4. **Check email inbox** (and spam folder)
5. **If still fails**: Check Supabase logs for specific error message

---

**Most common issue**: Wrong API key or settings not saved properly. Double-check all fields! ✅

