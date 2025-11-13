# Email & SMS Integration Steps

Follow these steps to integrate email and SMS notifications into your PESDO application.

> 💡 **For Capstone Projects**: See `FREE_TIER_SETUP.md` for a completely free setup guide (no credit card required, $0 cost).

## Step 1: Install Dependencies

```bash
npm install @sendgrid/mail twilio
# OR for Resend
npm install resend twilio
```

## Step 2: Set Up Environment Variables

Create or update your `.env` file:

```env
# Email Service (Choose one)
REACT_APP_EMAIL_SERVICE=sendgrid
REACT_APP_SENDGRID_API_KEY=your_sendgrid_api_key
# OR
REACT_APP_RESEND_API_KEY=your_resend_api_key

# Email Settings
REACT_APP_FROM_EMAIL=noreply@pesdo.gov.ph
REACT_APP_FROM_NAME=PESDO Surigao City
REACT_APP_BASE_URL=https://your-domain.com

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Step 3: Get API Keys

### SendGrid:
1. Sign up at https://sendgrid.com
2. Go to Settings → API Keys
3. Create a new API key with "Full Access"
4. Copy the key to `.env`

### Twilio:
1. Sign up at https://www.twilio.com
2. Get your Account SID and Auth Token from the dashboard
3. Get a phone number (trial account includes $15.50 credit)
4. Add credentials to `.env`

## Step 4: Deploy Supabase Edge Function (for SMS)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Set secrets
supabase secrets set TWILIO_ACCOUNT_SID=your_account_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890

# Deploy function
supabase functions deploy send-sms
```

## Step 5: Integrate with Registration

Update `src/contexts/AuthContext.jsx`:

```javascript
import { sendWelcomeEmail, sendWelcomeSMS } from '../services/emailService';
import { sendWelcomeSMS } from '../services/smsService';

// In the signup function, after profile creation:
if (data.user) {
  // ... existing profile creation code ...
  
  // Send welcome email
  try {
    await sendWelcomeEmail(
      data.user.email,
      additionalData.username || additionalData.first_name || 'User',
      userType
    );
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't fail registration if email fails
  }
  
  // Send welcome SMS (if phone number provided)
  if (additionalData.phone_number) {
    try {
      await sendWelcomeSMS(
        additionalData.phone_number,
        additionalData.username || additionalData.first_name || 'User',
        userType
      );
    } catch (error) {
      console.error('Failed to send welcome SMS:', error);
      // Don't fail registration if SMS fails
    }
  }
}
```

## Step 6: Integrate with Notifications

Update `src/hooks/useRealtimeNotifications.js`:

```javascript
import { sendApplicationStatusEmail, sendApplicationStatusSMS } from '../services/emailService';
import { sendApplicationStatusSMS } from '../services/smsService';

// In handleRealtimeUpdate, after creating notification:
if (userType === 'jobseeker' && payload.new.status) {
  // Send email notification
  try {
    const jobseekerData = payload.new.jobseeker_profiles || {};
    const jobData = payload.new.jobs || {};
    
    await sendApplicationStatusEmail(
      jobseekerData.email,
      jobseekerData.first_name || jobseekerData.username,
      jobData.job_title || 'Job',
      payload.new.status,
      jobData.company_name || 'Company'
    );
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
  
  // Send SMS notification (if phone number available)
  if (jobseekerData.phone_number) {
    try {
      await sendApplicationStatusSMS(
        jobseekerData.phone_number,
        jobseekerData.first_name || jobseekerData.username,
        jobData.job_title || 'Job',
        payload.new.status,
        jobData.company_name || 'Company'
      );
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
    }
  }
}
```

## Step 7: Update Employer Dashboard

In `src/pages/Employer/EmployerDashboard.jsx`, add email/SMS when accepting/rejecting:

```javascript
import { sendNewApplicationEmail, sendNewApplicationSMS } from '../../services/emailService';
import { sendNewApplicationSMS } from '../../services/smsService';

// In handleAcceptApplicant or handleRejectApplicant:
try {
  // ... existing code to update application status ...
  
  // Send email notification to jobseeker
  await sendApplicationStatusEmail(
    applicant.jobseeker_profiles.email,
    applicant.jobseeker_profiles.first_name || applicant.jobseeker_profiles.username,
    job.job_title,
    'accepted', // or 'rejected'
    userData.business_name
  );
  
  // Send SMS notification (if phone available)
  if (applicant.jobseeker_profiles.phone_number) {
    await sendApplicationStatusSMS(
      applicant.jobseeker_profiles.phone_number,
      applicant.jobseeker_profiles.first_name || applicant.jobseeker_profiles.username,
      job.job_title,
      'accepted',
      userData.business_name
    );
  }
} catch (error) {
  console.error('Error sending notification:', error);
  // Don't fail the operation if notification fails
}
```

## Step 8: Test the Integration

1. **Test Email:**
   - Register a new user
   - Check email inbox for welcome email
   - Update application status and check for notification email

2. **Test SMS:**
   - Register with a phone number
   - Check phone for welcome SMS
   - Update application status and check for SMS

## Step 9: Add Phone Number Field to Registration

Update registration forms to collect phone numbers (optional for SMS):

```javascript
// In Register.jsx or SignUp.jsx
const [formData, setFormData] = useState({
  // ... existing fields ...
  phone_number: '', // Add this
});
```

## Troubleshooting

### Email not sending:
- Check API key is correct
- Verify email service is enabled in `.env`
- Check SendGrid/Resend dashboard for delivery status
- Check spam folder

### SMS not sending:
- Verify Edge Function is deployed
- Check Twilio credentials are set as secrets
- Verify phone number format (E.164: +639123456789)
- Check Twilio console for errors
- Ensure you have Twilio credits

### Rate Limiting:
- Implement rate limiting for SMS to avoid costs
- Use email as primary, SMS as optional
- Consider user preferences for notifications

## Cost Optimization Tips

1. **Email**: Use free tier (100/day) for development
2. **SMS**: Only send critical notifications via SMS
3. **User Preferences**: Let users choose email vs SMS
4. **Batching**: Batch notifications when possible
5. **Caching**: Cache user preferences to avoid unnecessary sends

