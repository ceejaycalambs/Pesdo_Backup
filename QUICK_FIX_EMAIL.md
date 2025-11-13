# Quick Fix: Email Error

## The Problem
```
Error sending confirmation email
```

## The Solution (30 seconds)

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Disable Email Confirmation**
   - Click **Authentication** → **Settings**
   - Scroll to **Email Auth**
   - Turn **OFF** "Enable Email Confirmations"
   - Click **Save**

3. **Test Again**
   - Try registering a user
   - Should work now! ✅

---

## Why This Happens

Supabase tries to send a confirmation email, but:
- Email service isn't configured, OR
- SMTP settings are missing

**For capstone**: Disabling confirmation is fine! You can enable it later when you set up email properly.

---

## Alternative: Configure Email (If You Want Confirmation)

If you want email confirmation:

1. **Set up Resend** (free):
   - Sign up at https://resend.com
   - Get API key

2. **Configure in Supabase**:
   - Authentication → Settings → SMTP
   - Enable Custom SMTP
   - Use Resend SMTP settings

3. **Enable Email Confirmations** again

**For now**: Just disable it and continue! ✅

