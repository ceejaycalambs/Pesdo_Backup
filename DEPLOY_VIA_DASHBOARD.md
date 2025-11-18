# How to Deploy TextBee - Step by Step

## ✅ Your Credentials
- **API Key:** `816400d2-40fb-4914-94fd-6931a852e615`
- **Device ID:** `691cace882033f1609466984`

---

## Step 1: Set Secrets in Dashboard

### Option A: Via Project Settings
1. In Supabase Dashboard, go to **Settings** (gear icon in left sidebar)
2. Click on **"Edge Functions"** or **"Secrets"**
3. Look for **"Secrets"** or **"Environment Variables"** section
4. Click **"Add Secret"** or **"New Secret"**
5. Add these two:

   **Secret 1:**
   - Key: `TEXTBEE_API_KEY`
   - Value: `816400d2-40fb-4914-94fd-6931a852e615`
   - Click **"Save"**

   **Secret 2:**
   - Key: `TEXTBEE_DEVICE_ID`
   - Value: `691cace882033f1609466984`
   - Click **"Save"**

### Option B: Via Edge Functions Section
1. In **Edge Functions** page, look for a **"Secrets"** tab at the top
2. Or click on **"Settings"** icon near the Edge Functions title
3. Add the secrets as above

---

## Step 2: Deploy via CLI (Required)

Supabase Edge Functions **must be deployed via CLI**. The dashboard only shows them.

### Install Supabase CLI (if not installed)

**Windows (PowerShell as Administrator):**
```powershell
# Option 1: Using npm (if you have Node.js)
npm install -g supabase

# Option 2: Using Scoop
scoop install supabase

# Option 3: Download from GitHub
# Visit: https://github.com/supabase/cli/releases
# Download supabase_windows_amd64.zip
# Extract and add to PATH
```

### Login and Link Project

```powershell
# Login to Supabase
supabase login

# Link your project (get project ref from dashboard URL)
# Your project ref is: qslbiuijmwhirnbyghrh
supabase link --project-ref qslbiuijmwhirnbyghrh
```

### Deploy the Function

```powershell
# Make sure you're in the project directory
cd C:\Users\User\Desktop\pesdo-web-app

# Deploy the send-sms function
supabase functions deploy send-sms
```

---

## Alternative: Use Supabase CLI via npx (No Installation)

If you don't want to install CLI globally:

```powershell
# Login
npx supabase login

# Link project
npx supabase link --project-ref qslbiuijmwhirnbyghrh

# Set secrets
npx supabase secrets set TEXTBEE_API_KEY=816400d2-40fb-4914-94fd-6931a852e615
npx supabase secrets set TEXTBEE_DEVICE_ID=691cace882033f1609466984

# Deploy
npx supabase functions deploy send-sms
```

---

## Step 3: Verify Deployment

1. Go back to **Edge Functions** dashboard
2. Check `send-sms` function
3. "Last Updated" should show current time
4. "Deployments" count should increase

---

## Step 4: Test SMS

1. Click on `send-sms` function in dashboard
2. Look for **"Invoke"** or **"Test"** button
3. Use this payload:
```json
{
  "to": "+639123456789",
  "message": "Test from TextBee!"
}
```
4. Replace phone number with a real one
5. Click **"Invoke"**
6. Check if SMS is received

---

## Troubleshooting

### "supabase command not found"
- Install Supabase CLI (see Step 2)
- Or use `npx supabase` instead

### "Project not linked"
- Run: `supabase link --project-ref qslbiuijmwhirnbyghrh`

### "Secrets not found"
- Make sure you set secrets BEFORE deploying
- Check in Settings → Edge Functions → Secrets

---

## Quick Command Summary

```powershell
# Set secrets
npx supabase secrets set TEXTBEE_API_KEY=816400d2-40fb-4914-94fd-6931a852e615
npx supabase secrets set TEXTBEE_DEVICE_ID=691cace882033f1609466984

# Deploy
npx supabase functions deploy send-sms
```

---

**Ready?** Try the `npx` method first - it doesn't require installation! 🚀

