# Fix: Email Rate Limit Exceeded (429 Error)

## The Problem

You're seeing this error:
```
429 (Too Many Requests)
email rate limit exceeded
```

## What This Means

Supabase has **rate limits** on email sending to prevent spam:
- **Free Tier**: 4 emails per hour per user
- **Pro Tier**: Higher limits

You've hit the limit by sending too many registration emails in a short time.

## ✅ Solutions

### Solution 1: Wait (Easiest)

**Just wait 1 hour** and try again. The rate limit resets.

**For testing**: Use different email addresses or wait between attempts.

### Solution 2: Disable Email Confirmation (For Development)

If you're just testing and don't need email confirmation:

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. **Turn OFF** "Enable Email Confirmations"
4. Click **Save**

**Result**: No emails sent = no rate limit issues

### Solution 3: Configure Custom SMTP (For Production)

Use your own email service (Resend, SendGrid) which has higher limits:

1. Follow `SETUP_EMAIL_CONFIRMATION.md`
2. Configure Resend SMTP in Supabase
3. Resend free tier: 3,000 emails/month (much higher!)

### Solution 4: Upgrade Supabase Plan

- **Pro Plan**: Higher email rate limits
- **Team Plan**: Even higher limits

## 🔧 Code Already Updated

I've updated the error handling in `Register.jsx` to show a clear message:

```
"Email rate limit exceeded. Please wait a few minutes before trying again. 
Supabase limits email sending to prevent spam."
```

## 📊 Rate Limits

| Plan | Email Limit |
|------|-------------|
| Free | 4 emails/hour per user |
| Pro | Higher limits |
| Custom SMTP | Depends on provider (Resend: 3,000/month) |

## 🎯 For Capstone Testing

**Recommended**: Disable email confirmation during development/testing:

1. **Supabase Dashboard** → **Authentication** → **Settings**
2. **Turn OFF** "Enable Email Confirmations"
3. **Test freely** without rate limits
4. **Enable it back** when ready for production

## ⏰ How Long to Wait

- **Rate limit resets**: Every hour
- **Wait time**: 1 hour from first email
- **Then**: Can register again

## ✅ Quick Fix for Now

1. **Wait 1 hour** OR
2. **Disable email confirmation** temporarily
3. **Test registration** without emails
4. **Re-enable** when ready

---

**The error handling is now improved. Users will see a clear message instead of a technical error!** ✅

