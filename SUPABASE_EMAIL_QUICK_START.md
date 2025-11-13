# Supabase Email Quick Start (5 Minutes)

Get Supabase built-in email working in 5 minutes!

## ✅ Step 1: Configure Supabase Dashboard (2 minutes)

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Settings**
3. Under **Email Auth**, ensure:
   - ✅ **Enable Email Signup** is ON
   - ✅ **Enable Email Confirmations** is ON (optional)
4. Scroll to **Email Templates** section
5. You can customize templates here (optional)

**That's it for basic setup!** Supabase will now send:
- ✅ Email confirmation on signup
- ✅ Password reset emails
- ✅ Magic link emails

## 📧 Step 2: Test Email Confirmation (1 minute)

Your existing signup code already works! Just register a user:

```javascript
// This is already in your AuthContext.jsx
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123'
});
```

**What happens**:
1. User receives confirmation email automatically
2. Email contains verification link
3. User clicks link → email verified ✅

## 🎨 Step 3: Custom Emails (Welcome, Notifications) - Optional

For custom emails (welcome emails, notifications), you have two options:

### Option A: Use Supabase Auth Emails Only (Simplest)

**Pros**: 
- ✅ Already works
- ✅ No additional setup
- ✅ 100% free

**Cons**:
- ❌ Limited to auth emails only
- ❌ No welcome emails
- ❌ No custom notification emails

**Best for**: Quick setup, basic needs

### Option B: Add Edge Function for Custom Emails (Recommended)

**Pros**:
- ✅ Welcome emails
- ✅ Custom notifications
- ✅ Professional templates
- ✅ 3,000 emails/month free (Resend)

**Setup** (10 minutes):

1. **Sign up for Resend** (free):
   - Go to https://resend.com
   - Sign up (no credit card)
   - Get API key

2. **Deploy Edge Function**:
   ```bash
   # Install Supabase CLI (if not installed)
   npm install -g supabase
   
   # Login
   supabase login
   
   # Link project
   supabase link --project-ref your-project-ref
   
   # Set Resend API key
   supabase secrets set RESEND_API_KEY=re_your_api_key
   
   # Deploy function
   supabase functions deploy send-email
   ```

3. **Update .env**:
   ```env
   REACT_APP_EMAIL_SERVICE=supabase
   ```

4. **Test**:
   ```javascript
   import { sendWelcomeEmail } from './src/services/emailService';
   await sendWelcomeEmail('test@example.com', 'John', 'jobseeker');
   ```

## 🎯 What You Get

### With Supabase Auth Only:
- ✅ Email confirmation
- ✅ Password reset
- ✅ Magic links

### With Edge Function Added:
- ✅ Everything above, PLUS
- ✅ Welcome emails
- ✅ Application notifications
- ✅ Status update emails
- ✅ Custom email templates

## 📝 Current Status

Your app **already uses Supabase Auth emails**! 

When users sign up, they automatically receive:
- ✅ Confirmation email (if enabled)
- ✅ Verification link

**To add custom emails** (welcome, notifications):
- Follow Option B above
- Takes 10 minutes
- 100% free (Resend free tier)

## 🚀 Next Steps

1. **Test current setup**: Register a user → Check email
2. **Customize templates** (optional): Supabase Dashboard → Email Templates
3. **Add custom emails** (optional): Deploy Edge Function

**Total time**: 5 minutes for basic, 15 minutes for full setup
**Cost**: $0.00 ✅

---

## 🆘 Troubleshooting

**Email not received?**
- Check spam folder
- Verify email in Supabase Dashboard → Authentication → Users
- Check Supabase logs for errors

**Want custom emails?**
- Deploy Edge Function (Option B above)
- Uses Resend (3,000 emails/month free)

**Need help?**
- Check Supabase Dashboard → Logs
- Verify email settings in Authentication → Settings

