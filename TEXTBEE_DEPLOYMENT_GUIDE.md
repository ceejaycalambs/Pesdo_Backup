# TextBee.dev Deployment Guide - Quick Start

## ✅ Your Credentials

- **API Key:** `816400d2-40fb-4914-94fd-6931a852e615`
- **Device ID:** `691cace882033f1609466984`

---

## 🚀 Quick Deployment Steps

### Step 1: Set Supabase Secrets

**Option A: Using PowerShell (Windows)**
```powershell
supabase secrets set TEXTBEE_API_KEY=816400d2-40fb-4914-94fd-6931a852e615
supabase secrets set TEXTBEE_DEVICE_ID=691cace882033f1609466984
```

**Option B: Using Bash (Linux/Mac)**
```bash
supabase secrets set TEXTBEE_API_KEY=816400d2-40fb-4914-94fd-6931a852e615
supabase secrets set TEXTBEE_DEVICE_ID=691cace882033f1609466984
```

**Option C: Using Scripts**
- Windows: Run `setup-textbee-secrets.ps1`
- Linux/Mac: Run `setup-textbee-secrets.sh`

### Step 2: Deploy Edge Function

```bash
supabase functions deploy send-sms
```

### Step 3: Verify Deployment

1. Go to Supabase Dashboard → Edge Functions → `send-sms`
2. Check that the function is deployed
3. View logs to ensure no errors

### Step 4: Test SMS Sending

**Test via Supabase Dashboard:**
1. Go to Edge Functions → `send-sms` → Invoke
2. Use this test payload:
```json
{
  "to": "+639123456789",
  "message": "Test message from TextBee integration"
}
```
3. Replace `+639123456789` with a real phone number
4. Check if SMS is received

**Test via Application:**
1. Use your application to trigger an SMS (e.g., change application status)
2. Verify SMS is sent and received
3. Check Edge Function logs for success/errors

---

## ✅ Verification Checklist

- [ ] Secrets set successfully
- [ ] Edge Function deployed
- [ ] Test SMS sent and received
- [ ] No errors in Edge Function logs
- [ ] TextBee dashboard shows device as online
- [ ] Application SMS notifications work

---

## 🔍 Troubleshooting

### Issue: "TextBee credentials not configured"

**Solution:**
- Verify secrets are set: `supabase secrets list`
- Make sure secret names are exactly: `TEXTBEE_API_KEY` and `TEXTBEE_DEVICE_ID`
- Redeploy function after setting secrets

### Issue: "Failed to send SMS via TextBee"

**Check:**
1. Device is online in TextBee dashboard
2. Android device is connected to internet
3. SIM card has active service
4. API key and Device ID are correct

### Issue: SMS not received

**Check:**
1. Device is online in TextBee dashboard
2. Phone number is correct (E.164 format: +639123456789)
3. SIM card has SMS capability
4. Check TextBee dashboard for delivery status

---

## 📊 Monitoring

### Check Edge Function Logs
- Supabase Dashboard → Edge Functions → `send-sms` → Logs
- Look for success/error messages

### Check TextBee Dashboard
- Visit: https://textbee.dev/dashboard
- Check device status (should be "Online")
- View sent messages and delivery status

---

## 🎉 Success!

Once you've completed these steps, your SMS notifications will be sent via TextBee.dev for **FREE** using your Android device's SIM card!

**Cost Savings:** $0 vs ~$15-150+/month with Twilio 💰

---

## 📞 Need Help?

- Check Edge Function logs for specific errors
- Verify device is online in TextBee dashboard
- Review error messages carefully
- Test with a simple SMS first

---

**Ready to deploy?** Follow the steps above and you're all set! 🚀

