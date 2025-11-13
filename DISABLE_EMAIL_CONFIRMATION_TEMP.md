# Temporarily Disable Email Confirmation (For Testing)

If SMTP keeps failing, you can temporarily disable email confirmation to test registration:

## Steps:

1. **Go to Supabase Dashboard** → **Authentication** → **Settings**
2. **Scroll to "Email Auth" section**
3. **Find "Enable Email Confirmations"**
4. **Toggle it OFF**
5. **Click "Save"**
6. **Try registering** - should work now without email
7. **After testing, re-enable** email confirmation and fix SMTP

## Why This Helps:

- Tests if registration works without email
- Confirms the issue is SMTP, not registration logic
- Lets you test the app while fixing SMTP

## After Disabling:

- Users can register and login immediately
- No email confirmation needed
- Good for development/testing
- Re-enable for production

