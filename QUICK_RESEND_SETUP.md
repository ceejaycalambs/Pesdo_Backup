# Quick Setup: Resend Email (10 Minutes)

Get Resend working with Supabase in 10 minutes!

## 🚀 Step 1: Get Resend API Key (5 min)

1. **Sign up**: https://resend.com (free, no credit card)
2. **Verify email** (check inbox)
3. **Go to API Keys** → **Create API Key**
4. **Name**: "PESDO"
5. **Permission**: "Sending access"
6. **Copy the key** (starts with `re_`)

## ⚙️ Step 2: Configure in Supabase (5 min)

1. **Supabase Dashboard** → **Authentication** → **Settings**
2. **Scroll to SMTP Settings**
3. **Enable Custom SMTP** (toggle ON)
4. **Enter EXACTLY** (copy-paste to avoid typos):
   ```
   Host: smtp.resend.com
   Port: 587
   Username: resend
   Password: re_your_api_key_here (paste your full Resend API key)
   Sender email: onboarding@resend.dev
   Sender name: PESDO Surigao City
   ```
5. **Click Save**
6. **Wait 2-3 minutes** (settings need to propagate)

**⚠️ Important**: 
- Host must be exactly `smtp.resend.com` (no port, no spaces)
- Port must be exactly `587` (not 465)
- Username must be exactly `resend` (lowercase)
- Password must be your full Resend API key (starts with `re_`)

## ✅ Step 3: Enable Email Confirmation

1. **Still in Authentication → Settings**
2. **Enable Email Confirmations** (toggle ON)
3. **Set Site URL**: `http://localhost:5173`
4. **Click Save**

## 🧪 Step 4: Test

1. **Register a new user**
2. **Check email** (should come from `onboarding@resend.dev`)
3. **Click confirmation link**
4. **Log in** ✅

---

**Done!** No more rate limit errors. 3,000 emails/month free! 🎉

See `SETUP_RESEND_EMAIL.md` for detailed instructions.

