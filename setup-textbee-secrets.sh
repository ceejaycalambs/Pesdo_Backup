#!/bin/bash
# Script to set TextBee.dev secrets in Supabase
# Run this after deploying the updated Edge Function

echo "🔐 Setting TextBee.dev secrets in Supabase..."
echo ""

# Set TextBee API Key
echo "Setting TEXTBEE_API_KEY..."
supabase secrets set TEXTBEE_API_KEY=816400d2-40fb-4914-94fd-6931a852e615

# Set TextBee Device ID
echo "Setting TEXTBEE_DEVICE_ID..."
supabase secrets set TEXTBEE_DEVICE_ID=691cace882033f1609466984

echo ""
echo "✅ Secrets set successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Deploy the Edge Function: supabase functions deploy send-sms"
echo "2. Test SMS sending from your application"
echo "3. Check Edge Function logs in Supabase Dashboard"
echo ""

