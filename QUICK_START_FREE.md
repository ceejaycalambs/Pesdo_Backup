# Quick Start: Free Setup (30 Minutes)

Perfect for capstone projects - completely free, no credit card required!

## 🚀 5-Minute Setup

### Step 1: Get SendGrid API Key (FREE)

1. Go to https://sendgrid.com → "Start for Free"
2. Sign up with your email (school email works)
3. Verify your email
4. Go to Settings → API Keys → "Create API Key"
5. Name it "PESDO Capstone" → "Full Access"
6. **Copy the API key** (starts with `SG.`)

**Time**: 5 minutes | **Cost**: $0

### Step 2: Get Twilio Credentials (FREE Trial)

1. Go to https://www.twilio.com → "Sign up"
2. Sign up (use school email)
3. **Select "I'm just exploring"** (no credit card!)
4. Verify your phone number
5. Go to Console Dashboard
6. Copy:
   - Account SID
   - Auth Token
   - Get a phone number (click "Get a number")

**Time**: 10 minutes | **Cost**: $0 (trial credits included)

### Step 3: Install & Configure

```bash
# Install packages
npm install @sendgrid/mail twilio

# Create .env file (if not exists)
# Add these:
REACT_APP_EMAIL_SERVICE=sendgrid
REACT_APP_SENDGRID_API_KEY=SG.your_key_here
REACT_APP_FROM_EMAIL=your-email@gmail.com  # Your verified email
REACT_APP_FROM_NAME=PESDO Surigao City
REACT_APP_BASE_URL=http://localhost:5173
```

### Step 4: Deploy SMS Function

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Set secrets
supabase secrets set TWILIO_ACCOUNT_SID=your_account_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token
supabase secrets set TWILIO_PHONE_NUMBER=+1234567890

# Deploy
supabase functions deploy send-sms
```

### Step 5: Test It!

```javascript
// Test email (in browser console or create test file)
import { sendWelcomeEmail } from './src/services/emailService';
await sendWelcomeEmail('your-email@gmail.com', 'Test User', 'jobseeker');

// Test SMS (after Edge Function is deployed)
import { sendSMS } from './src/services/smsService';
await sendSMS({ 
  to: '+639123456789', 
  message: 'Test SMS from PESDO!' 
});
```

## ✅ You're Done!

- ✅ Email: 100/day free (SendGrid)
- ✅ SMS: $15.50 trial credit (~310 SMS)
- ✅ Total Cost: **$0.00**
- ✅ No credit card needed
- ✅ Perfect for capstone!

## 📊 Free Tier Limits

| Service | Free Limit | For Capstone |
|---------|-----------|--------------|
| SendGrid | 100 emails/day | ✅ More than enough |
| Twilio | $15.50 credit | ✅ ~310 SMS messages |

**For capstone demo**: These limits are perfect! You can test multiple times.

## 🎓 For Your Presentation

**Show these**:
1. User registers → Welcome email received ✅
2. Application submitted → Email notification ✅
3. Status updated → Email + SMS ✅

**Mention**:
- "Using free tier services"
- "Scalable to paid when needed"
- "Production-ready architecture"

## 🆘 Troubleshooting

**Email not sending?**
- Check API key is correct
- Verify sender email in SendGrid
- Check spam folder

**SMS not sending?**
- Verify Edge Function is deployed
- Check Twilio credentials
- Verify phone number format (+639123456789)

**Need help?** See `FREE_TIER_SETUP.md` for detailed guide.

---

**Total Setup Time**: 30 minutes  
**Total Cost**: $0.00  
**Perfect for Capstone**: ✅ Yes!

