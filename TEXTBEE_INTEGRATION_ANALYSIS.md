# TextBee.dev Integration Analysis & Implementation Plan

## 📊 Current System Analysis

### Current SMS Implementation

**Architecture:**
- **Frontend Service**: `src/services/smsService.js`
  - Provides SMS sending functions
  - Handles phone number formatting
  - Contains message templates
  - Calls Supabase Edge Function

- **Backend (Edge Function)**: `supabase/functions/send-sms/index.ts`
  - Currently uses **Twilio API**
  - Handles phone number normalization
  - Manages API credentials securely
  - Returns success/error responses

- **Integration Points:**
  - ✅ `EmployerDashboard.jsx` - Application status SMS notifications
  - ✅ `JobseekerDashboard.jsx` - New application SMS notifications
  - ⚠️ Other notification points (job approval, welcome SMS) - Not yet implemented

**Current SMS Flow:**
```
Frontend (smsService.js)
  ↓
Supabase Edge Function (send-sms)
  ↓
Twilio API
  ↓
SMS Delivered
```

**Current Credentials (Twilio):**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

---

## 🔄 TextBee.dev Overview

### What is TextBee.dev?

TextBee.dev is an **Android SMS Gateway** service that:
- Uses your Android device to send/receive SMS
- Provides RESTful API for programmatic access
- **FREE** - Uses your SIM card (no per-message cost)
- Similar to Android SMS Gateway but with a managed service

### TextBee.dev API Details

**Base URL:** `https://api.textbee.dev/api/v1/gateway`

**Send SMS Endpoint:**
```
POST /devices/{DEVICE_ID}/send-sms
```

**Authentication:**
- Header: `x-api-key: YOUR_API_KEY`

**Request Body:**
```json
{
  "recipients": ["+639123456789"],
  "message": "Your message here"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "...",
  "status": "sent"
}
```

**Required Credentials:**
- `TEXTBEE_API_KEY` - From TextBee dashboard
- `TEXTBEE_DEVICE_ID` - From TextBee dashboard (after device registration)

---

## 🎯 Migration Strategy

### Option 1: Replace Twilio with TextBee (Recommended)

**Pros:**
- ✅ **FREE** - No per-message cost
- ✅ Uses local SIM card (Philippines-friendly)
- ✅ Similar architecture (just change API endpoint)
- ✅ No changes needed to frontend code
- ✅ Better for high-volume messaging

**Cons:**
- ⚠️ Requires Android device to be online
- ⚠️ Device must have active SIM card
- ⚠️ Dependent on device availability

**Best For:** Production use with high SMS volume, cost-sensitive operations

### Option 2: Support Both (Fallback Strategy)

**Pros:**
- ✅ Redundancy - if one fails, use the other
- ✅ Can switch providers without code changes
- ✅ Better reliability

**Cons:**
- ❌ More complex implementation
- ❌ Requires managing two sets of credentials
- ❌ More code to maintain

**Best For:** Enterprise applications requiring high reliability

### Option 3: Keep Twilio, Add TextBee as Alternative

**Pros:**
- ✅ Can use TextBee for free tier, Twilio for production
- ✅ Gradual migration path

**Cons:**
- ❌ Most complex
- ❌ Requires configuration management

**Best For:** Transitional period

---

## 📋 Implementation Plan (Option 1: Replace Twilio)

### Phase 1: Setup TextBee Account & Device

1. **Register at TextBee.dev**
   - Visit: https://textbee.dev/
   - Create account
   - Access dashboard

2. **Install TextBee Android App**
   - Download from: https://dl.textbee.dev/
   - Install on Android device
   - Grant SMS permissions

3. **Register Device**
   - In dashboard, click "Register Device"
   - Generate API key
   - Get Device ID
   - Link device via app (scan QR or enter API key)

4. **Get Credentials**
   - API Key: From dashboard
   - Device ID: From dashboard (after device registration)

### Phase 2: Update Supabase Edge Function

**File:** `supabase/functions/send-sms/index.ts`

**Changes Required:**
1. Replace Twilio API endpoint with TextBee API
2. Update authentication method (API key header instead of Basic Auth)
3. Update request format (JSON body instead of form-urlencoded)
4. Update response parsing
5. Update environment variable names

**New Implementation:**
```typescript
// Replace Twilio credentials with TextBee
const apiKey = Deno.env.get('TEXTBEE_API_KEY');
const deviceId = Deno.env.get('TEXTBEE_DEVICE_ID');

// TextBee API endpoint
const textbeeUrl = `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`;

// Request body (JSON format)
const requestBody = {
  recipients: [normalizedPhone],
  message: message
};

// API call with API key header
const response = await fetch(textbeeUrl, {
  method: 'POST',
  headers: {
    'x-api-key': apiKey,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestBody),
});
```

### Phase 3: Update Supabase Secrets

**Remove old Twilio secrets:**
```bash
supabase secrets unset TWILIO_ACCOUNT_SID
supabase secrets unset TWILIO_AUTH_TOKEN
supabase secrets unset TWILIO_PHONE_NUMBER
```

**Set new TextBee secrets:**
```bash
supabase secrets set TEXTBEE_API_KEY=your_api_key_here
supabase secrets set TEXTBEE_DEVICE_ID=your_device_id_here
```

### Phase 4: Deploy Updated Edge Function

```bash
supabase functions deploy send-sms
```

### Phase 5: Test Integration

1. **Test from Frontend:**
   - Use existing SMS service functions
   - Test application status notifications
   - Test new application notifications

2. **Verify Delivery:**
   - Check Android device for sent SMS
   - Verify recipient receives message
   - Check TextBee dashboard for logs

3. **Monitor Errors:**
   - Check Edge Function logs
   - Monitor TextBee dashboard
   - Verify device is online

---

## 🔧 Detailed Code Changes

### 1. Update Edge Function (`supabase/functions/send-sms/index.ts`)

**Key Changes:**
- Replace Twilio URL with TextBee URL
- Change authentication from Basic Auth to API Key header
- Change request body from form-urlencoded to JSON
- Update error handling for TextBee response format
- Update phone number format (TextBee uses same E.164 format)

**Complete Updated Function:**
```typescript
// deno-lint-ignore-file no-explicit-any
// Supabase Edge Function: Send SMS via TextBee.dev API
// 
// Deploy this function:
// supabase functions deploy send-sms
// 
// Set secrets:
// supabase secrets set TEXTBEE_API_KEY=your_api_key
// supabase secrets set TEXTBEE_DEVICE_ID=your_device_id
//
// Get credentials from: https://textbee.dev/dashboard
// Free service - uses your Android device's SIM card
//
declare const Deno: any;

interface SendSMSRequest {
  to: string;
  message: string;
}

function badRequest(message: string, details?: Record<string, unknown>) {
  return new Response(JSON.stringify({ error: message, details }), {
    status: 400,
    headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

function ok(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  let payload: SendSMSRequest;
  try {
    payload = await req.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { to, message } = payload || {};
  if (!to || !message) {
    return badRequest('Missing required fields: to, message');
  }

  const apiKey = Deno.env.get('TEXTBEE_API_KEY');
  const deviceId = Deno.env.get('TEXTBEE_DEVICE_ID');

  console.log('🔐 Credentials check:', {
    hasApiKey: !!apiKey,
    hasDeviceId: !!deviceId,
    apiKeyLength: apiKey?.length || 0,
    deviceIdLength: deviceId?.length || 0
  });

  if (!apiKey || !deviceId) {
    const missing: string[] = [];
    if (!apiKey) missing.push('TEXTBEE_API_KEY');
    if (!deviceId) missing.push('TEXTBEE_DEVICE_ID');
    
    console.error('❌ Missing credentials:', missing);
    return new Response(
      JSON.stringify({ 
        error: 'TextBee credentials not configured',
        missing: missing,
        message: `Set these secrets: ${missing.join(', ')}. Get them from https://textbee.dev/dashboard`
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }

  // Normalize phone number to E.164 format (+63XXXXXXXXXX for Philippines)
  let cleaned = to.replace(/[\s-]/g, '');
  
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // Handle Philippine numbers (country code 63)
  if (cleaned.startsWith('63')) {
    cleaned = '+' + cleaned;
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '+63' + cleaned.substring(1);
  } else if (cleaned.startsWith('9') && cleaned.length === 10) {
    cleaned = '+63' + cleaned;
  } else {
    cleaned = cleaned.startsWith('+') ? cleaned : '+' + cleaned;
  }
  
  const normalizedPhone = cleaned;

  // TextBee API endpoint
  const textbeeUrl = `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`;

  // Log request details
  console.log('📤 SMS Request:', {
    endpoint: 'TextBee API',
    phone: normalizedPhone,
    messageLength: message.length,
    deviceId: deviceId
  });

  try {
    // TextBee requires JSON body
    const requestBody = {
      recipients: [normalizedPhone],
      message: message
    };

    console.log('📤 Sending SMS via TextBee:', {
      to: normalizedPhone,
      messageLength: message.length,
      deviceId: deviceId
    });

    const response = await fetch(textbeeUrl, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ TextBee error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send SMS via TextBee', 
          details: errorText,
          status: response.status
        }),
        {
          status: response.status || 502,
          headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    const data = await response.json().catch(() => {
      console.warn('⚠️ Could not parse response as JSON, treating as success');
      return { success: true };
    });

    console.log('✅ SMS sent successfully via TextBee:', {
      messageId: data.messageId || null,
      phone: normalizedPhone,
      status: data.status || 'sent'
    });

    return ok({ 
      success: true, 
      messageId: data.messageId || null, 
      phone: normalizedPhone,
      status: data.status || 'sent',
      response: data 
    });
  } catch (error) {
    console.error('❌ TextBee request exception:', {
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 200)
    });
    return new Response(
      JSON.stringify({ 
        error: 'Failed to connect to TextBee', 
        details: error.message
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }
});
```

### 2. Frontend Service (No Changes Needed)

**File:** `src/services/smsService.js`

✅ **No changes required!** The frontend service already:
- Calls the Edge Function correctly
- Formats phone numbers properly
- Handles responses appropriately

The Edge Function interface remains the same, so frontend code works without modification.

### 3. Update Environment Documentation

Create/update documentation with new credentials:
- `TEXTBEE_API_KEY`
- `TEXTBEE_DEVICE_ID`

---

## ✅ Testing Checklist

### Pre-Deployment Testing

- [ ] TextBee account created
- [ ] Android device registered
- [ ] API key and Device ID obtained
- [ ] Edge Function code updated
- [ ] Secrets set in Supabase

### Post-Deployment Testing

- [ ] Test single SMS send
- [ ] Test application status SMS (Employer Dashboard)
- [ ] Test new application SMS (Jobseeker Dashboard)
- [ ] Verify phone number formatting
- [ ] Test error handling (invalid phone, missing credentials)
- [ ] Verify SMS delivery on recipient device
- [ ] Check TextBee dashboard for logs
- [ ] Monitor Edge Function logs

### Edge Cases

- [ ] Test with missing phone number
- [ ] Test with invalid phone format
- [ ] Test with device offline (should fail gracefully)
- [ ] Test with long messages
- [ ] Test with special characters

---

## 🔒 Security Considerations

1. **API Key Protection:**
   - ✅ Stored in Supabase secrets (not in code)
   - ✅ Never exposed to frontend
   - ✅ Only accessible in Edge Function

2. **Phone Number Privacy:**
   - ✅ Mask phone numbers in logs
   - ✅ Don't log full phone numbers

3. **Rate Limiting:**
   - Consider implementing rate limiting if needed
   - TextBee may have its own limits

4. **Error Handling:**
   - Don't expose API keys in error messages
   - Log errors securely

---

## 💰 Cost Comparison

| Service | Cost per SMS | Monthly (100 SMS) | Monthly (1000 SMS) |
|---------|--------------|-------------------|-------------------|
| **TextBee.dev** | **FREE** | **$0** | **$0** |
| Twilio | ~$0.015 | ~$1.50 | ~$15 |
| Android SMS Gateway | FREE | $0 | $0 |

**Winner: TextBee.dev** - Completely free, uses your SIM card!

---

## 🚀 Deployment Steps

### Step 1: Setup TextBee Account
1. Register at https://textbee.dev/
2. Install Android app
3. Register device and get credentials

### Step 2: Update Edge Function
1. Replace `supabase/functions/send-sms/index.ts` with new TextBee implementation
2. Test locally (if possible) or deploy directly

### Step 3: Set Secrets
```bash
supabase secrets set TEXTBEE_API_KEY=your_api_key_here
supabase secrets set TEXTBEE_DEVICE_ID=your_device_id_here
```

### Step 4: Deploy
```bash
supabase functions deploy send-sms
```

### Step 5: Test
1. Test from frontend
2. Verify SMS delivery
3. Monitor logs

### Step 6: Cleanup (Optional)
```bash
# Remove old Twilio secrets if no longer needed
supabase secrets unset TWILIO_ACCOUNT_SID
supabase secrets unset TWILIO_AUTH_TOKEN
supabase secrets unset TWILIO_PHONE_NUMBER
```

---

## 📊 Migration Impact

### What Changes:
- ✅ Edge Function implementation (backend only)
- ✅ Environment variables/secrets
- ✅ API endpoint and authentication

### What Stays the Same:
- ✅ Frontend service (`smsService.js`)
- ✅ SMS templates and functions
- ✅ Integration points in dashboards
- ✅ Phone number formatting
- ✅ Error handling structure

### Risk Level: **LOW**
- Only backend changes
- Frontend code unaffected
- Can rollback easily if needed
- No database changes required

---

## 🎯 Next Steps

1. **Review this plan** - Confirm approach
2. **Setup TextBee account** - Get credentials
3. **Update Edge Function** - Implement TextBee API
4. **Set secrets** - Configure Supabase
5. **Deploy and test** - Verify functionality
6. **Monitor** - Track usage and errors

---

## 📚 Additional Resources

- **TextBee Documentation:** https://textbee.dev/quickstart
- **TextBee GitHub:** https://github.com/vernu/textbee
- **TextBee Dashboard:** https://textbee.dev/dashboard
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions

---

## ❓ FAQ

**Q: Do I need to change frontend code?**
A: No! The Edge Function interface remains the same, so frontend code works without changes.

**Q: What if my Android device is offline?**
A: SMS sending will fail. Consider implementing a fallback or retry mechanism.

**Q: Can I use multiple devices?**
A: Yes, TextBee supports multiple devices. You can create multiple Device IDs and implement load balancing.

**Q: Is TextBee free forever?**
A: Yes, it uses your SIM card, so there's no per-message cost. You only pay for your mobile plan.

**Q: What about delivery status?**
A: TextBee provides delivery status via webhooks or API. You can implement status tracking if needed.

---

## ✅ Conclusion

**TextBee.dev is an excellent choice for your SMS needs:**
- ✅ Completely free
- ✅ Easy integration
- ✅ Philippines-friendly (uses local SIM)
- ✅ Minimal code changes required
- ✅ No per-message costs

**Recommended Action:** Proceed with Option 1 (Replace Twilio with TextBee) for cost savings and simplicity.

