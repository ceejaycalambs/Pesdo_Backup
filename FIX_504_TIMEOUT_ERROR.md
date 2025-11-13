# Fix: 504 Gateway Timeout Error

## What This Error Means

```
504 (Gateway Timeout)
AuthRetryableFetchError
```

This means:
- ✅ Supabase is trying to send the confirmation email
- ✅ SMTP is configured (otherwise you'd get a 500 error)
- ❌ The email service is taking too long to respond
- ❌ The request timed out before the email could be sent

## 🔧 Quick Fixes

### Fix 1: Wait and Retry (Most Common Solution)

**504 errors are often temporary**. The email service might be:
- Temporarily slow
- Processing other requests
- Having network issues

**Solution**:
1. **Wait 30-60 seconds**
2. **Try registering again**
3. **Often works on the second attempt**

### Fix 2: Check SMTP Settings

Even though SMTP is configured, verify it's correct:

1. **Supabase Dashboard** → **Authentication** → **Settings** → **SMTP Settings**
2. **Verify**:
   - Host: `smtp.resend.com`
   - Port: `587`
   - Username: `resend`
   - Password: Your Resend API key
3. **Click "Save"** (even if already saved)
4. **Wait 2-3 minutes**
5. **Try again**

### Fix 3: Check Resend Status

1. **Go to Resend Dashboard**: https://resend.com
2. **Check**:
   - Account is active
   - API key is valid
   - No service outages
3. **Check Resend Status Page**: https://status.resend.com

### Fix 4: Verify Network Connection

504 errors can be caused by:
- Slow internet connection
- Firewall blocking SMTP
- VPN issues

**Solution**:
- Try different network
- Disable VPN temporarily
- Check firewall settings

### Fix 5: Try Alternative Port

If port 587 is timing out, try port 465 (SSL):

1. **Supabase Dashboard** → **Authentication** → **Settings** → **SMTP Settings**
2. **Change Port**: `587` → `465`
3. **Click "Save"**
4. **Wait 2-3 minutes**
5. **Try registering**

**Note**: Port 465 uses SSL/TLS, which might be more reliable.

### Fix 6: Temporarily Disable Email Confirmation

If you need to test registration immediately:

1. **Supabase Dashboard** → **Authentication** → **Settings**
2. **Turn OFF** "Enable Email Confirmations"
3. **Click Save**
4. **Test registration** (should work now)
5. **Re-enable** after fixing timeout issue

## 🎯 Most Likely Solutions (In Order)

1. **Wait 30-60 seconds and retry** (90% of cases)
2. **Check SMTP settings are correct**
3. **Try port 465 instead of 587**
4. **Check Resend service status**
5. **Try different network/VPN**

## 📊 Understanding the Error

**504 Gateway Timeout** means:
- The request was sent successfully
- Supabase is trying to connect to SMTP
- But the SMTP server (Resend) is taking too long to respond
- The connection times out before completion

**This is different from**:
- **500 Error**: SMTP not configured or wrong settings
- **429 Error**: Rate limit exceeded
- **504 Error**: SMTP configured but connection timing out

## ✅ Success Indicators

When the timeout is resolved:
- ✅ Registration succeeds
- ✅ No 504 errors
- ✅ Email received in inbox
- ✅ Confirmation link works

## 🆘 If Still Timing Out

1. **Check Supabase Logs**:
   - Go to **Logs** → **Auth Logs**
   - Look for SMTP connection errors
   - See exact timeout message

2. **Contact Support**:
   - If Resend: Check their status page
   - If Supabase: Check their status page
   - Both services might be having issues

3. **Alternative**:
   - Use a different SMTP provider temporarily
   - Or disable email confirmation for testing

## 💡 Pro Tips

- **504 errors are usually temporary** - just retry
- **First attempt often fails**, second attempt usually works
- **Check both Resend and Supabase status pages** if persistent
- **Port 465 (SSL) is often more reliable** than port 587

---

**Most common fix: Wait 30-60 seconds and try again!** ⏱️

