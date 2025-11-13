# Setup Email Confirmation with Resend (Recommended)

Complete guide to enable and configure email confirmation using Resend (free tier: 3,000 emails/month).

> 💡 **Quick Start**: See `SETUP_RESEND_EMAIL.md` for step-by-step instructions.

## 🎯 Goal

Enable email confirmation so users must verify their email before they can use the app.

## 📋 Step 1: Sign Up for Resend (FREE - 3,000 emails/month)

Resend is the easiest free email service to use with Supabase.

1. **Go to Resend**: https://resend.com
2. **Click "Get Started"** or "Sign Up"
3. **Sign up** with your email (school email works)
4. **No credit card required** ✅
5. **Verify your email** (check inbox)
6. **Go to API Keys** section
7. **Create API Key**:
   - Name: "PESDO Supabase"
   - Permission: "Sending access"
   - Click "Create"
8. **Copy the API key** (starts with `re_`)

**Time**: 5 minutes  
**Cost**: $0 (3,000 emails/month free)

---

## 📧 Step 2: Configure SMTP in Supabase

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication → Settings**
   - Click **Authentication** in left sidebar
   - Click **Settings** tab

3. **Scroll to SMTP Settings**
   - Find **"SMTP Settings"** section
   - Click **"Enable Custom SMTP"** toggle

4. **Enter SMTP Configuration**:
   ```
   Host: smtp.resend.com
   Port: 587
   Username: resend
   Password: re_your_api_key_here (paste your Resend API key)
   Sender email: onboarding@resend.dev (or your verified domain)
   Sender name: PESDO Surigao City
   ```

5. **Click "Save"**

**Important Notes**:
- Use `smtp.resend.com` as host
- Port should be `587`
- Username is always `resend`
- Password is your Resend API key
- Sender email: Use `onboarding@resend.dev` for free tier (or your custom domain if you have one)

---

## ✅ Step 3: Enable Email Confirmation

1. **Still in Authentication → Settings**
2. **Scroll to Email Auth section**
3. **Enable Email Confirmations**:
   - Find **"Enable Email Confirmations"**
   - Toggle it **ON**
4. **Configure Email Redirect URL**:
   - Find **"Site URL"** or **"Redirect URLs"**
   - Add: `http://localhost:5173` (for development)
   - Add: `https://your-domain.com` (for production)
5. **Click "Save"**

---

## 🎨 Step 4: Customize Email Templates (Optional)

1. **Go to Authentication → Email Templates**
2. **Click on "Confirm signup"** template
3. **Customize**:
   - Subject: "Verify your PESDO account"
   - Body: Add your branding, logo, etc.
4. **Click "Save"**

You can customize:
- ✅ Confirm signup email
- ✅ Magic Link email
- ✅ Change Email Address email
- ✅ Reset Password email

---

## 🧪 Step 5: Test Email Confirmation

1. **Try registering a new user**:
   ```javascript
   // This is already in your code
   await supabase.auth.signUp({
     email: 'test@example.com',
     password: 'password123'
   });
   ```

2. **Check the email inbox**:
   - User should receive confirmation email
   - Email should come from `onboarding@resend.dev` (or your custom domain)

3. **Click the confirmation link**:
   - User is redirected to your app
   - Email is verified ✅
   - User can now log in

---

## 🔧 Step 6: Update Your Code (If Needed)

Your existing code should work, but you can add email redirect:

```javascript
// In AuthContext.jsx - signup function
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`, // Add this
    data: {
      userType: userType,
      ...additionalData
    }
  }
});
```

Create a callback page to handle email confirmation:

```javascript
// src/pages/AuthCallback.jsx (if not exists)
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (type === 'signup' && token) {
        // Email confirmed, redirect to login
        navigate('/login/jobseeker', { 
          state: { message: 'Email verified! Please log in.' } 
        });
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate]);

  return <div>Verifying email...</div>;
};

export default AuthCallback;
```

Add route in `App.jsx`:
```javascript
<Route path="/auth/callback" element={<AuthCallback />} />
```

---

## 📊 Resend Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| Emails/month | 3,000 |
| API requests/day | 100 |
| Custom domain | Not included (use resend.dev) |
| **Perfect for** | Capstone projects ✅ |

**For capstone**: 3,000 emails/month is more than enough!

---

## 🆘 Troubleshooting

### Email not received?

1. **Check spam folder**
2. **Verify SMTP settings** are correct
3. **Check Resend dashboard** for delivery status
4. **Verify API key** is correct
5. **Check Supabase logs** for errors

### SMTP connection failed?

1. **Verify host**: `smtp.resend.com`
2. **Verify port**: `587`
3. **Verify username**: `resend`
4. **Verify password**: Your Resend API key (starts with `re_`)
5. **Check Resend API key** is active

### Email goes to spam?

1. **Use custom domain** (if available)
2. **Set up SPF/DKIM records** (for custom domain)
3. **For free tier**: Use `onboarding@resend.dev` (may go to spam, but works)

### Confirmation link doesn't work?

1. **Check redirect URL** in Supabase settings
2. **Verify Site URL** is set correctly
3. **Check callback route** exists in your app

---

## ✅ Checklist

- [ ] Signed up for Resend (free)
- [ ] Got Resend API key
- [ ] Configured SMTP in Supabase Dashboard
- [ ] Enabled Email Confirmations
- [ ] Set redirect URLs
- [ ] Tested registration
- [ ] Received confirmation email
- [ ] Clicked confirmation link
- [ ] User can log in after confirmation

---

## 🎯 What Happens Now

1. **User registers** → Account created
2. **Confirmation email sent** → Via Resend SMTP
3. **User clicks link** → Email verified
4. **User can log in** → Account activated ✅

---

## 📝 Next Steps

After email confirmation works:

1. **Add welcome emails** (using Edge Function)
2. **Add notification emails** (application status, etc.)
3. **Customize email templates** (branding)

See `SUPABASE_EMAIL_SETUP.md` for custom email setup.

---

**Total Setup Time**: 15 minutes  
**Cost**: $0.00 ✅  
**Result**: Professional email confirmation system!

