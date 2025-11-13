# Setup Resend Email for Supabase (Step-by-Step)

Complete guide to use Resend instead of Supabase's built-in email service.

## ✅ Why Resend?

- **3,000 emails/month FREE** (vs Supabase's 4/hour)
- **No rate limit issues** during testing
- **Professional email delivery**
- **Easy setup** with Supabase
- **Perfect for capstone** projects

## 📋 Step 1: Sign Up for Resend (5 minutes)

1. **Go to Resend**: https://resend.com
2. **Click "Get Started"** or "Sign Up"
3. **Sign up** with your email (school email works)
4. **No credit card required** ✅
5. **Verify your email** (check inbox for verification email)
6. **Complete onboarding** (if prompted)

**Time**: 5 minutes  
**Cost**: $0 (3,000 emails/month free)

---

## 🔑 Step 2: Get Resend API Key (2 minutes)

1. **After logging in**, go to **API Keys** section
   - Click on **"API Keys"** in the left sidebar
   - Or go to: https://resend.com/api-keys

2. **Create API Key**:
   - Click **"Create API Key"** button
   - **Name**: "PESDO Supabase" (or any name)
   - **Permission**: Select **"Sending access"**
   - Click **"Add"** or **"Create"**

3. **Copy the API Key**:
   - The key starts with `re_`
   - **Important**: Copy it now! You won't see it again
   - Example: `re_1234567890abcdef...`

**Save this key** - you'll need it in the next step!

---

## ⚙️ Step 3: Configure SMTP in Supabase (5 minutes)

1. **Go to Supabase Dashboard**:
   - https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication → Settings**:
   - Click **"Authentication"** in left sidebar
   - Click **"Settings"** tab
   - Scroll down to **"SMTP Settings"** section

3. **Enable Custom SMTP**:
   - Find **"Enable Custom SMTP"** toggle
   - **Turn it ON**

4. **Enter Resend SMTP Configuration**:
   ```
   Host: smtp.resend.com
   Port: 587
   Username: resend
   Password: re_your_api_key_here (paste your Resend API key)
   Sender email: onboarding@resend.dev
   Sender name: PESDO Surigao City
   ```

5. **Click "Save"**

**Important Notes**:
- ✅ Host: `smtp.resend.com` (exactly as shown)
- ✅ Port: `587` (not 465)
- ✅ Username: `resend` (always this)
- ✅ Password: Your Resend API key (starts with `re_`)
- ✅ Sender email: `onboarding@resend.dev` (free tier default)

---

## ✅ Step 4: Enable Email Confirmation (2 minutes)

1. **Still in Authentication → Settings**
2. **Scroll to "Email Auth" section**
3. **Enable Email Confirmations**:
   - Find **"Enable Email Confirmations"**
   - **Toggle it ON**
4. **Set Site URL**:
   - Find **"Site URL"** field
   - Enter: `http://localhost:5173` (for development)
   - For production: `https://your-domain.com`
5. **Set Redirect URLs** (if available):
   - Add: `http://localhost:5173/auth/callback`
   - Add: `https://your-domain.com/auth/callback` (for production)
6. **Click "Save"**

---

## 🧪 Step 5: Test Email Confirmation (3 minutes)

1. **Try registering a new user**:
   - Go to your registration page
   - Enter email and password
   - Click "Register"

2. **Check email inbox**:
   - You should receive confirmation email
   - Email comes from `onboarding@resend.dev`
   - Subject: "Confirm your signup" (or custom)

3. **Click confirmation link**:
   - User is redirected to `/auth/callback`
   - Email is verified ✅
   - User can now log in

---

## 📊 Resend Free Tier Limits

| Feature | Free Tier |
|---------|-----------|
| **Emails/month** | 3,000 |
| **API requests/day** | 100 |
| **Custom domain** | Not included (use resend.dev) |
| **Perfect for** | Capstone projects ✅ |

**For capstone**: 3,000 emails/month is more than enough!

---

## 🎨 Step 6: Customize Email Templates (Optional)

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

## 🔧 Troubleshooting

### Email not received?

1. **Check spam folder**
2. **Verify SMTP settings** are correct:
   - Host: `smtp.resend.com`
   - Port: `587`
   - Username: `resend`
   - Password: Your Resend API key
3. **Check Resend dashboard**:
   - Go to https://resend.com/emails
   - See delivery status
4. **Verify API key** is correct
5. **Check Supabase logs** for errors

### SMTP connection failed?

1. **Verify host**: `smtp.resend.com` (not `smtp.resend.com:587`)
2. **Verify port**: `587` (not 465 or 25)
3. **Verify username**: `resend` (exactly this)
4. **Verify password**: Your Resend API key (starts with `re_`)
5. **Check Resend API key** is active in Resend dashboard

### Still getting rate limit errors?

1. **Make sure Custom SMTP is enabled** in Supabase
2. **Verify SMTP settings** are saved correctly
3. **Wait a few minutes** for settings to propagate
4. **Try registering again**

### Email goes to spam?

1. **For free tier**: Emails from `onboarding@resend.dev` may go to spam
2. **Solution**: Check spam folder, or add custom domain later
3. **For production**: Set up custom domain with SPF/DKIM records

---

## ✅ Checklist

- [ ] Signed up for Resend (free)
- [ ] Got Resend API key
- [ ] Configured SMTP in Supabase Dashboard
- [ ] Enabled Email Confirmations
- [ ] Set Site URL and Redirect URLs
- [ ] Tested registration
- [ ] Received confirmation email
- [ ] Clicked confirmation link
- [ ] User can log in after confirmation

---

## 🎯 What Happens Now

1. **User registers** → Account created
2. **Confirmation email sent** → Via Resend SMTP (not Supabase)
3. **User clicks link** → Email verified
4. **User can log in** → Account activated ✅

**No more rate limit errors!** 🎉

---

## 📝 Next Steps

After Resend is set up:

1. **Test registration** - Should work without rate limits
2. **Test email confirmation** - Should receive emails instantly
3. **Customize email templates** - Add your branding
4. **For production**: Consider custom domain (optional)

---

**Total Setup Time**: 15 minutes  
**Cost**: $0.00 ✅  
**Result**: Professional email system with 3,000 emails/month free!

