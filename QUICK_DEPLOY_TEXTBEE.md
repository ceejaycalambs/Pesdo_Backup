# Quick Deploy TextBee.dev - Step by Step

## ✅ Your Credentials
- **API Key:** `816400d2-40fb-4914-94fd-6931a852e615`
- **Device ID:** `691cace882033f1609466984`

---

## 🚀 Method 1: Using Supabase Dashboard (Easiest)

### Step 1: Set Secrets via Dashboard

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Edge Functions:**
   - Click on **"Edge Functions"** in the left sidebar
   - Or go to: **Settings** → **Edge Functions**

3. **Set Secrets:**
   - Click on **"Secrets"** or **"Environment Variables"**
   - Add these two secrets:

   **Secret 1:**
   - Name: `TEXTBEE_API_KEY`
   - Value: `816400d2-40fb-4914-94fd-6931a852e615`
   - Click **"Add"** or **"Save"**

   **Secret 2:**
   - Name: `TEXTBEE_DEVICE_ID`
   - Value: `691cace882033f1609466984`
   - Click **"Add"** or **"Save"**

### Step 2: Deploy Edge Function

**Option A: Via Dashboard**
1. Go to **Edge Functions** → **send-sms**
2. Click **"Deploy"** or **"Update"**
3. The function code is already updated in `supabase/functions/send-sms/index.ts`

**Option B: Via CLI (if you install it)**
```bash
supabase functions deploy send-sms
```

### Step 3: Test SMS

1. **Go to Edge Functions** → **send-sms** → **"Invoke"** or **"Test"**
2. **Use this test payload:**
```json
{
  "to": "+639123456789",
  "message": "Test message from TextBee integration"
}
```
3. **Replace** `+639123456789` with a real phone number
4. **Click "Invoke"** or **"Run"**
5. **Check** if SMS is received on the phone

---

## 🚀 Method 2: Install Supabase CLI

### Step 1: Install Supabase CLI

**Windows (PowerShell):**
```powershell
# Using Scoop (recommended)
scoop install supabase

# Or using npm
npm install -g supabase
```

**Or download from:**
- https://github.com/supabase/cli/releases

### Step 2: Login to Supabase
```bash
supabase login
```

### Step 3: Link Your Project
```bash
supabase link --project-ref your-project-ref
```
*(Get your project ref from Supabase Dashboard URL)*

### Step 4: Set Secrets
```bash
supabase secrets set TEXTBEE_API_KEY=816400d2-40fb-4914-94fd-6931a852e615
supabase secrets set TEXTBEE_DEVICE_ID=691cace882033f1609466984
```

### Step 5: Deploy
```bash
supabase functions deploy send-sms
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Secrets are set in Supabase Dashboard
- [ ] Edge Function is deployed
- [ ] Test SMS sent successfully
- [ ] SMS received on phone
- [ ] No errors in Edge Function logs
- [ ] TextBee dashboard shows device as "Online"

---

## 🧪 Test from Your Application

Once deployed, test from your app:

1. **Employer Dashboard:**
   - Change an application status (accept/reject/refer)
   - SMS should be sent to jobseeker

2. **Jobseeker Dashboard:**
   - Apply to a job
   - SMS should be sent to employer

3. **Admin Dashboard:**
   - Approve a job vacancy
   - SMS should be sent to employer

---

## 🔍 Check Logs

**Supabase Dashboard:**
- Edge Functions → send-sms → Logs
- Look for success/error messages

**TextBee Dashboard:**
- https://textbee.dev/dashboard
- Check device status and sent messages

---

## ⚠️ Troubleshooting

### "TextBee credentials not configured"
- Verify secrets are set in Supabase Dashboard
- Check secret names are exactly: `TEXTBEE_API_KEY` and `TEXTBEE_DEVICE_ID`

### "Failed to send SMS"
- Check TextBee dashboard - device should be "Online"
- Verify Android device is connected to internet
- Check SIM card has active service

### SMS not received
- Verify phone number format: `+639123456789`
- Check device is online in TextBee dashboard
- Verify SIM card has SMS capability

---

## 🎉 Success!

Once deployed, all SMS notifications will be sent via TextBee.dev for **FREE**! 💰

---

**Ready?** Follow Method 1 (Dashboard) - it's the easiest! 🚀

