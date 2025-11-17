# SMS Notification Testing Guide

## ✅ Implementation Complete

SMS notifications have been integrated into the following features:

### 1. **Application Status Notifications** (Employer → Jobseeker)
- **Location**: `src/pages/Employer/EmployerDashboard.jsx`
- **Trigger**: When employer accepts/rejects/refers an application
- **Recipient**: Jobseeker phone number (`jobseeker_profiles.phone`)
- **Status**: ✅ Implemented

### 2. **Job Approval Notifications** (Admin → Employer)
- **Location**: `src/pages/Admin/JobManagementSimplified.jsx`
- **Trigger**: When admin approves a job vacancy
- **Recipient**: Employer mobile number (`employer_profiles.mobile_number`)
- **Status**: ✅ Implemented

### 3. **Employer Verification Notifications** (Admin → Employer)
- **Location**: `src/pages/Admin/EmployerVerificationSimple.jsx`
- **Trigger**: When admin approves/rejects employer verification
- **Recipient**: Employer mobile number (`employer_profiles.mobile_number`)
- **Status**: ✅ Implemented

### 4. **New Application Notifications** (Jobseeker → Employer)
- **Location**: `src/pages/Jobseeker/JobseekerDashboard.jsx`
- **Trigger**: When jobseeker applies to a job
- **Recipient**: Employer mobile number (`employer_profiles.mobile_number`)
- **Status**: ✅ Implemented

---

## 🚀 Deployment Steps

### Step 1: Deploy Supabase Edge Function

```bash
# Navigate to project directory
cd c:\Users\User\Desktop\pesdo-web-app

# Deploy the SMS function
supabase functions deploy send-sms
```

### Step 2: Set Environment Secrets

```bash
# Set SMS Gateway credentials
supabase secrets set SMS_GATEWAY_USERNAME=7ONAGO
supabase secrets set SMS_GATEWAY_PASSWORD=25mmhgtotnjptk
supabase secrets set SMS_GATEWAY_DEVICE_ID=JOfKfT_s1aT-kOYRNVFjy
```

### Step 3: Verify Android Device

- ✅ Android device is powered on
- ✅ SMS Gateway app is running
- ✅ Device has active SIM card with SMS capability
- ✅ Device is connected to internet
- ✅ Cloud server is enabled in SMS Gateway app

---

## 🧪 Testing Checklist

### Test 1: Application Status SMS (Employer → Jobseeker)

**Setup:**
1. Ensure a jobseeker profile has a valid phone number (`+639XXXXXXXXX` format)
2. Ensure an employer has a job with applications

**Steps:**
1. Login as employer
2. Go to "Manage Job Vacancy"
3. View applications for a job
4. Accept/Reject/Refer an application

**Expected Result:**
- ✅ Application status updates successfully
- ✅ Jobseeker receives SMS notification
- ✅ Console shows: `✅ SMS notification sent to jobseeker`
- ✅ SMS message format: "Hi [Name]! Your application for [Job] at [Company] has been [STATUS]..."

**Check Console:**
- Look for: `✅ SMS notification sent to jobseeker`
- If error: `⚠️ Failed to send SMS notification (non-critical):`

---

### Test 2: Job Approval SMS (Admin → Employer)

**Setup:**
1. Ensure an employer profile has a valid mobile number (`+639XXXXXXXXX` format)
2. Have a pending job vacancy

**Steps:**
1. Login as admin
2. Go to "Job Management"
3. Find a pending job
4. Click "Approve"

**Expected Result:**
- ✅ Job is approved successfully
- ✅ Employer receives SMS notification
- ✅ Console shows: `✅ SMS notification sent to employer`
- ✅ SMS message: "Hi [Employer]! Your job vacancy '[Job Title]' has been APPROVED..."

**Check Console:**
- Look for: `✅ SMS notification sent to employer`

---

### Test 3: Employer Verification SMS (Admin → Employer)

**Setup:**
1. Ensure an employer profile has a valid mobile number
2. Have an employer with pending verification

**Steps:**
1. Login as admin
2. Go to "Employer Verification"
3. Select an employer
4. Approve or Reject verification

**Expected Result:**
- ✅ Verification status updates
- ✅ Employer receives SMS notification
- ✅ Console shows: `✅ SMS notification sent to employer`
- ✅ SMS message: "Hi [Employer]! Your employer account has been APPROVED..." or "REJECTED..."

**Check Console:**
- Look for: `✅ SMS notification sent to employer`

---

### Test 4: New Application SMS (Jobseeker → Employer)

**Setup:**
1. Ensure an employer profile has a valid mobile number
2. Have an approved job vacancy
3. Login as jobseeker

**Steps:**
1. Browse jobs
2. Apply to a job vacancy
3. Complete application

**Expected Result:**
- ✅ Application is created successfully
- ✅ Employer receives SMS notification
- ✅ Console shows: `✅ SMS notification sent to employer`
- ✅ SMS message: "Hi [Employer]! New application for [Job] from [Jobseeker]..."

**Check Console:**
- Look for: `✅ SMS notification sent to employer`

---

## 🔍 Debugging

### Check SMS Edge Function Logs

1. Go to Supabase Dashboard
2. Navigate to Edge Functions → `send-sms`
3. Check function logs for errors

### Common Issues

#### Issue: "SMS Gateway credentials not configured"
**Solution:**
```bash
supabase secrets set SMS_GATEWAY_USERNAME=7ONAGO
supabase secrets set SMS_GATEWAY_PASSWORD=25mmhgtotnjptk
supabase secrets set SMS_GATEWAY_DEVICE_ID=JOfKfT_s1aT-kOYRNVFjy
```

#### Issue: "Failed to connect to SMS Gateway"
**Solution:**
- Check if Android device is online
- Verify SMS Gateway app is running
- Check internet connection on Android device
- Verify API credentials in SMS Gateway app

#### Issue: "No phone number found"
**Solution:**
- Ensure jobseeker profile has `phone` field populated
- Ensure employer profile has `mobile_number` field populated
- Phone numbers should be in `+639XXXXXXXXX` format

#### Issue: SMS not received
**Solution:**
- Check Android device has active SIM card
- Verify SMS Gateway app has proper permissions
- Check device's SMS balance/credits
- Verify recipient phone number is correct

---

## 📱 Testing with Real Phone Numbers

### Important Notes:
- **Sender Number**: Messages will come from the SIM card number in your Android device
- **Recipient**: Use real phone numbers for testing (your own or test numbers)
- **Format**: Phone numbers must be in `+639XXXXXXXXX` format
- **Cost**: SMS Gateway uses your Android device's SMS, so standard SMS rates apply

### Test Phone Number Format:
- ✅ Correct: `+639123456789`
- ✅ Correct: `09123456789` (will auto-convert)
- ❌ Wrong: `9123456789` (missing country code)
- ❌ Wrong: `639123456789` (missing +)

---

## ✅ Success Indicators

When SMS is working correctly, you should see:

1. **Console Logs:**
   ```
   ✅ SMS notification sent to [jobseeker/employer]
   ```

2. **No Errors:**
   - No `⚠️ Failed to send SMS notification` messages
   - No network errors in console

3. **SMS Received:**
   - Recipient receives SMS on their phone
   - Message format matches templates
   - Sender number is your Android device's SIM number

---

## 🎯 Next Steps After Testing

1. **Monitor Success Rate**: Check console logs for SMS delivery
2. **Optimize Messages**: Adjust message templates if needed
3. **Add More Notifications**: Implement welcome SMS, etc.
4. **Error Handling**: Add retry logic if needed
5. **Logging**: Consider adding SMS logs to database

---

## 📝 Notes

- **Non-Blocking**: SMS failures won't prevent main actions (approval, status change, etc.)
- **Graceful Degradation**: If SMS fails, the app continues normally
- **Error Logging**: All SMS errors are logged to console for debugging
- **Phone Format**: All phone numbers are auto-formatted to `+639XXXXXXXXX`

---

## 🆘 Need Help?

If SMS is not working:
1. Check Supabase Edge Function logs
2. Verify Android device is online and SMS Gateway app is running
3. Test Edge Function directly via Supabase dashboard
4. Check phone number format in database
5. Verify SMS Gateway credentials are correct

