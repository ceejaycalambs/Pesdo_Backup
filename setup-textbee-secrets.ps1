# PowerShell script to set TextBee.dev secrets in Supabase
# Run this after deploying the updated Edge Function

Write-Host "🔐 Setting TextBee.dev secrets in Supabase..." -ForegroundColor Cyan
Write-Host ""

# Set TextBee API Key
Write-Host "Setting TEXTBEE_API_KEY..." -ForegroundColor Yellow
supabase secrets set TEXTBEE_API_KEY=816400d2-40fb-4914-94fd-6931a852e615

# Set TextBee Device ID
Write-Host "Setting TEXTBEE_DEVICE_ID..." -ForegroundColor Yellow
supabase secrets set TEXTBEE_DEVICE_ID=691cace882033f1609466984

Write-Host ""
Write-Host "✅ Secrets set successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy the Edge Function: supabase functions deploy send-sms"
Write-Host "2. Test SMS sending from your application"
Write-Host "3. Check Edge Function logs in Supabase Dashboard"
Write-Host ""

