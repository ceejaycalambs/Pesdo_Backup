// deno-lint-ignore-file no-explicit-any
// Supabase Edge Function: Send SMS via TextBee.dev API
// 
// Deploy this function:
// 1. Install Supabase CLI: npm install -g supabase
// 2. Login: supabase login
// 3. Link project: supabase link --project-ref your-project-ref
// 4. Deploy: supabase functions deploy send-sms
// 
// Set secrets:
// supabase secrets set TEXTBEE_API_KEY=your_api_key
// supabase secrets set TEXTBEE_DEVICE_ID=your_device_id
//
// Get credentials from: https://textbee.dev/dashboard
// Free service - uses your Android device's SIM card
//
// Note: We declare Deno for local linting; Supabase Edge provides it at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // Handle CORS preflight requests - MUST return 200 status
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
  // Handles: 09123456789, +639123456789, 639123456789, 9123456789
  let cleaned = to.replace(/[\s-]/g, '');
  
  // Remove leading + if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // Handle Philippine numbers (country code 63)
  if (cleaned.startsWith('63')) {
    // Already has country code: 639123456789 -> +639123456789
    cleaned = '+' + cleaned;
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    // Local format: 09123456789 -> +639123456789
    cleaned = '+63' + cleaned.substring(1);
  } else if (cleaned.startsWith('9') && cleaned.length === 10) {
    // Without leading 0: 9123456789 -> +639123456789
    cleaned = '+63' + cleaned;
  } else {
    // Default: add + if not present
    cleaned = cleaned.startsWith('+') ? cleaned : '+' + cleaned;
  }
  
  const normalizedPhone = cleaned;

  // TextBee API endpoint
  const textbeeUrl = `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`;

  // Log request details (without sensitive data)
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
      messageId: data.messageId || data.id || null,
      phone: normalizedPhone,
      status: data.status || 'sent'
    });

    return ok({ 
      success: true, 
      messageId: data.messageId || data.id || null, 
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

