# TextBee.dev Implementation - Quick Start Guide

## 🎯 Overview

This guide provides step-by-step instructions to migrate from Twilio to TextBee.dev for SMS notifications.

## ✅ Prerequisites

- Supabase project with Edge Functions enabled
- Supabase CLI installed and configured
- Android device with active SIM card
- TextBee.dev account

---

## 📋 Step-by-Step Implementation

### Step 1: Setup TextBee Account

1. **Register at TextBee.dev**
   - Visit: https://textbee.dev/
   - Click "Sign Up" or "Get Started"
   - Create your account

2. **Download TextBee Android App**
   - Visit: https://dl.textbee.dev/
   - Download and install the APK on your Android device
   - Grant SMS permissions when prompted

3. **Register Your Device**
   - Open TextBee dashboard: https://textbee.dev/dashboard
   - Click "Register Device" or "Add Device"
   - You'll get:
     - **API Key** (keep this secret!)
     - **Device ID** (unique identifier for your device)
   - Open TextBee app on your Android device
   - Enter the API key or scan the QR code to link your device

4. **Verify Device Connection**
   - Check dashboard - device should show as "Online" or "Connected"
   - Test sending an SMS from the dashboard to verify it works

---

### Step 2: Update Edge Function Code

**File to update:** `supabase/functions/send-sms/index.ts`

**Action:** Replace the entire file content with the TextBee implementation (see `TEXTBEE_INTEGRATION_ANALYSIS.md` for complete code)

**Key changes:**
- Replace Twilio API endpoint with TextBee API
- Change authentication from Basic Auth to API Key header
- Update request format from form-urlencoded to JSON
- Update environment variable names

---

### Step 3: Set Supabase Secrets

**Remove old Twilio secrets (optional, but recommended):**
```bash
supabase secrets unset TWILIO_ACCOUNT_SID
supabase secrets unset TWILIO_AUTH_TOKEN
supabase secrets unset TWILIO_PHONE_NUMBER
```

**Set new TextBee secrets:**
```bash
# Replace with your actual credentials from TextBee dashboard
supabase secrets set TEXTBEE_API_KEY=your_api_key_here
supabase secrets set TEXTBEE_DEVICE_ID=your_device_id_here
```

**Verify secrets are set:**
```bash
# Note: This won't show the values, just confirms they exist
supabase secrets list
```

---

### Step 4: Deploy Edge Function

```bash
# Make sure you're in the project root directory
cd /path/to/pesdo-web-app

# Deploy the updated function
supabase functions deploy send-sms
```

**Expected output:**
```
Deploying function send-sms...
Function send-sms deployed successfully
```

---

### Step 5: Test the Integration

#### Option A: Test via Supabase Dashboard

1. Go to Supabase Dashboard → Edge Functions
2. Find `send-sms` function
3. Click "Invoke" or "Test"
4. Use this test payload:
```json
{
  "to": "+639123456789",
  "message": "Test message from TextBee integration"
}
```
5. Replace `+639123456789` with a real phone number
6. Check if SMS is received

#### Option B: Test via Frontend

1. Use your existing application
2. Trigger an SMS notification (e.g., change application status)
3. Verify SMS is sent and received

#### Option C: Test via cURL

```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-sms \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+639123456789",
    "message": "Test message"
  }'
```

---

### Step 6: Monitor and Verify

1. **Check Edge Function Logs:**
   - Supabase Dashboard → Edge Functions → `send-sms` → Logs
   - Look for success/error messages
   - Verify API calls are being made

2. **Check TextBee Dashboard:**
   - Visit: https://textbee.dev/dashboard
   - Check "Sent Messages" or "Activity" section
   - Verify messages are being sent

3. **Verify SMS Delivery:**
   - Check recipient's phone
   - Confirm message was received
   - Verify message content is correct

---

## 🔧 Troubleshooting

### Issue: "TextBee credentials not configured"

**Solution:**
- Verify secrets are set: `supabase secrets list`
- Make sure secret names are exactly: `TEXTBEE_API_KEY` and `TEXTBEE_DEVICE_ID`
- Redeploy function after setting secrets

### Issue: "Failed to send SMS via TextBee"

**Possible causes:**
1. **Device offline:**
   - Check TextBee app on Android device
   - Ensure device is connected to internet
   - Verify device shows as "Online" in dashboard

2. **Invalid API key:**
   - Verify API key is correct
   - Check for extra spaces or characters
   - Regenerate API key if needed

3. **Invalid Device ID:**
   - Verify Device ID matches dashboard
   - Ensure device is properly registered

4. **Phone number format:**
   - Must be in E.164 format: `+639123456789`
   - Check phone number normalization in logs

### Issue: SMS not received

**Check:**
1. Device is online in TextBee dashboard
2. SIM card has active service
3. Phone number is correct
4. Message isn't blocked by carrier
5. Check TextBee dashboard for delivery status

### Issue: Function deployment fails

**Solution:**
- Check Supabase CLI is logged in: `supabase login`
- Verify project is linked: `supabase link --project-ref YOUR_PROJECT_REF`
- Check for syntax errors in TypeScript code
- Review deployment logs for specific errors

---

## 📊 Verification Checklist

After implementation, verify:

- [ ] TextBee account created and device registered
- [ ] API Key and Device ID obtained
- [ ] Edge Function code updated
- [ ] Supabase secrets set correctly
- [ ] Function deployed successfully
- [ ] Test SMS sent and received
- [ ] Application status SMS works (Employer Dashboard)
- [ ] New application SMS works (Jobseeker Dashboard)
- [ ] Phone number formatting works correctly
- [ ] Error handling works (test with invalid phone)
- [ ] Logs show successful API calls

---

## 🔄 Rollback Plan

If you need to rollback to Twilio:

1. **Restore old Edge Function code:**
   ```bash
   git checkout HEAD -- supabase/functions/send-sms/index.ts
   ```

2. **Restore Twilio secrets:**
   ```bash
   supabase secrets set TWILIO_ACCOUNT_SID=your_sid
   supabase secrets set TWILIO_AUTH_TOKEN=your_token
   supabase secrets set TWILIO_PHONE_NUMBER=your_number
   ```

3. **Remove TextBee secrets:**
   ```bash
   supabase secrets unset TEXTBEE_API_KEY
   supabase secrets unset TEXTBEE_DEVICE_ID
   ```

4. **Redeploy:**
   ```bash
   supabase functions deploy send-sms
   ```

---

## 📝 Notes

- **No frontend changes needed** - The `smsService.js` interface remains the same
- **Phone number format** - TextBee uses the same E.164 format as Twilio
- **Cost** - TextBee is completely free (uses your SIM card)
- **Reliability** - Depends on Android device being online
- **Scalability** - Can register multiple devices for load balancing

---

## 🎉 Success Criteria

You've successfully implemented TextBee.dev when:

1. ✅ SMS notifications work from your application
2. ✅ Messages are delivered to recipients
3. ✅ No errors in Edge Function logs
4. ✅ TextBee dashboard shows sent messages
5. ✅ Cost is $0 (using your SIM card)

---

## 📚 Additional Resources

- **TextBee Quickstart:** https://textbee.dev/quickstart
- **TextBee GitHub:** https://github.com/vernu/textbee
- **TextBee Dashboard:** https://textbee.dev/dashboard
- **Supabase Edge Functions Docs:** https://supabase.com/docs/guides/functions

---

## 💡 Tips

1. **Keep device online:** Ensure Android device stays connected to internet
2. **Monitor dashboard:** Regularly check TextBee dashboard for issues
3. **Test regularly:** Send test SMS periodically to verify functionality
4. **Backup credentials:** Store API key and Device ID securely
5. **Multiple devices:** Consider registering multiple devices for redundancy

---

## ❓ Need Help?

If you encounter issues:

1. Check Edge Function logs in Supabase Dashboard
2. Check TextBee dashboard for device status
3. Review error messages carefully
4. Verify all credentials are correct
5. Test with a simple cURL request first

---

**Ready to implement?** Follow the steps above and you'll have TextBee.dev integrated in no time! 🚀

