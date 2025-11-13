# Email & SMS Integration Guide

This guide explains how to integrate email and SMS notifications for your PESDO web application.

## 📧 Email Integration

### Option 1: Supabase Built-in Email (Recommended for Start)
- **Pros**: Free tier, easy setup, built-in templates
- **Cons**: Limited customization, rate limits
- **Best for**: Development and small-scale production

### Option 2: External Email Services (Recommended for Production)
- **SendGrid**: 100 emails/day free, reliable
- **Resend**: Modern API, great developer experience
- **AWS SES**: Very cost-effective at scale
- **Postmark**: Excellent deliverability

### Setup Steps:

#### 1. Configure Supabase SMTP (For Built-in Email)
1. Go to Supabase Dashboard → Settings → Auth
2. Scroll to "SMTP Settings"
3. Configure your SMTP provider OR use Supabase's default

#### 2. For External Services (SendGrid Example)
1. Sign up at [SendGrid](https://sendgrid.com)
2. Get your API key
3. Add to `.env` file:
   ```
   SENDGRID_API_KEY=your_api_key_here
   SENDGRID_FROM_EMAIL=noreply@pesdo.gov.ph
   ```

## 📱 SMS Integration

### Recommended Providers:
- **Twilio**: Most popular, reliable, good documentation
- **MessageBird**: Good international coverage
- **Vonage (Nexmo)**: Alternative option

### Setup Steps:

#### 1. Twilio Setup
1. Sign up at [Twilio](https://www.twilio.com)
2. Get your Account SID and Auth Token
3. Get a phone number (trial account available)
4. Add to `.env` file:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

## 🎯 Use Cases

### Registration Emails:
- Welcome email after signup
- Email verification (if enabled)
- Account activation confirmation

### Notification Emails/SMS:
- Job application status updates (accepted/rejected)
- New job applications (for employers)
- Job vacancy approvals (for employers)
- Admin referrals (for jobseekers)
- Password reset requests

## 📦 Installation

```bash
npm install @sendgrid/mail twilio
# OR
npm install resend twilio
```

## 🔧 Implementation

See the following files:
- `src/services/emailService.js` - Email sending service
- `src/services/smsService.js` - SMS sending service
- `src/hooks/useEmailNotifications.js` - Email notification hook
- `src/hooks/useSMSNotifications.js` - SMS notification hook

## 💰 Cost Estimates

### Email (SendGrid):
- Free: 100 emails/day
- Essentials: $19.95/month for 50,000 emails

### SMS (Twilio):
- Philippines: ~$0.05 per SMS
- Trial: $15.50 credit (good for testing)

## ⚠️ Important Notes

1. **Environment Variables**: Never commit API keys to git
2. **Rate Limiting**: Implement rate limiting for SMS to avoid costs
3. **User Consent**: Get user consent for SMS notifications
4. **Error Handling**: Always handle email/SMS failures gracefully
5. **Testing**: Use test mode during development

