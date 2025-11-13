# SMTP Configuration Checklist

Use this checklist to verify your Resend SMTP is configured correctly.

## ✅ Step-by-Step Verification

### 1. Resend Account
- [ ] Signed up at https://resend.com
- [ ] Email verified
- [ ] Account is active

### 2. Resend API Key
- [ ] Created API key in Resend dashboard
- [ ] Key starts with `re_`
- [ ] Key has "Sending access" permission
- [ ] Key is copied (you have it ready)

### 3. Supabase SMTP Settings

Go to: **Supabase Dashboard** → **Authentication** → **Settings** → **SMTP Settings**

- [ ] **Enable Custom SMTP**: Toggled **ON**
- [ ] **Host**: `smtp.resend.com` (exactly this)
- [ ] **Port**: `587` (not 465, not 25)
- [ ] **Username**: `resend` (exactly this, lowercase)
- [ ] **Password**: Your Resend API key (starts with `re_`)
- [ ] **Sender email**: `onboarding@resend.dev`
- [ ] **Sender name**: `PESDO Surigao City` (or your choice)
- [ ] **Click "Save"** button

### 4. Email Confirmation Settings

Still in: **Authentication** → **Settings** → **Email Auth**

- [ ] **Enable Email Confirmations**: Toggled **ON**
- [ ] **Site URL**: `http://localhost:5173` (for development)
- [ ] **Redirect URLs**: `http://localhost:5173/auth/callback`
- [ ] **Click "Save"** button

### 5. Wait and Test

- [ ] **Wait 2-3 minutes** after saving (settings need to propagate)
- [ ] **Try registering** a new user
- [ ] **Check email inbox** (and spam folder)
- [ ] **Email received?** ✅

## 🔍 Common Configuration Errors

### ❌ Wrong Host
```
❌ smtp.resend.com:587
❌ resend.com
❌ smtp.resend
✅ smtp.resend.com
```

### ❌ Wrong Port
```
❌ 465
❌ 25
❌ 5870
✅ 587
```

### ❌ Wrong Username
```
❌ your-email@gmail.com
❌ resend@resend.com
❌ Resend (capitalized)
✅ resend (lowercase)
```

### ❌ Wrong Password
```
❌ Your Resend account password
❌ Your email password
❌ Just the key without re_ prefix
✅ re_abc123... (full API key)
```

### ❌ Wrong Sender Email
```
❌ your-email@gmail.com (not verified)
❌ noreply@yourdomain.com (domain not verified)
✅ onboarding@resend.dev (free tier default)
```

## 🧪 Test After Configuration

1. **Save all settings** in Supabase
2. **Wait 2-3 minutes**
3. **Register a test user**:
   - Email: `test@example.com`
   - Password: `Test123!`
4. **Check email inbox**
5. **Should receive** confirmation email from `onboarding@resend.dev`

## 🆘 If Still Not Working

1. **Double-check** all settings match the checklist above
2. **Verify** Resend API key is active
3. **Check** Supabase logs for specific error
4. **Wait** another 2-3 minutes and try again
5. **Try** disabling and re-enabling Custom SMTP

---

**Follow this checklist exactly and your SMTP should work!** ✅

