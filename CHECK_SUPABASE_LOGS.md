# How to Check Supabase Logs for SMTP Errors

## 🔍 Step-by-Step: Find the Exact Error

### Step 1: Go to Supabase Logs

1. **Open Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Click "Logs"** in the left sidebar
4. **You'll see different log types**

### Step 2: Check Auth Logs

1. **Click "Auth Logs"** tab
2. **Look for recent entries** (around the time you tried to register)
3. **Find entries with**:
   - Status: `ERROR` or `500`
   - Message containing: "email", "SMTP", "confirmation"
4. **Click on the error** to see details

### Step 3: Check Postgres Logs (Alternative)

1. **Click "Postgres Logs"** tab
2. **Look for**:
   - SMTP errors
   - Email sending errors
   - Authentication errors

### Step 4: What to Look For

**Common error messages**:

1. **"SMTP connection failed"**
   - Problem: Can't connect to Resend
   - Fix: Check host and port

2. **"Authentication failed"**
   - Problem: Wrong username or password
   - Fix: Check username is `resend` and password is your API key

3. **"Host not found"**
   - Problem: Wrong host name
   - Fix: Should be `smtp.resend.com`

4. **"Invalid credentials"**
   - Problem: Wrong API key
   - Fix: Get new API key from Resend

5. **"Sender email not verified"**
   - Problem: Using wrong sender email
   - Fix: Use `onboarding@resend.dev` for free tier

## 📸 What Logs Look Like

You'll see entries like:
```
[ERROR] SMTP connection failed: Connection timeout
[ERROR] Email sending failed: Authentication failed
[ERROR] Error sending confirmation email: Invalid credentials
```

## 🎯 Next Steps Based on Error

### If you see "SMTP connection failed":
1. Verify host: `smtp.resend.com`
2. Verify port: `587`
3. Check internet connection

### If you see "Authentication failed":
1. Verify username: `resend` (lowercase)
2. Verify password: Your full Resend API key
3. Check for extra spaces

### If you see "Invalid credentials":
1. Get new API key from Resend
2. Update in Supabase
3. Wait 2-3 minutes
4. Try again

### If you see "Sender email not verified":
1. Use `onboarding@resend.dev` as sender email
2. Don't use your own email unless domain is verified

## 💡 Pro Tip

**Take a screenshot** of the error from logs and share it - it will help identify the exact issue!

---

**Check the logs first - they'll tell you exactly what's wrong!** 🔍

