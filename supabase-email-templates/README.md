# Supabase Email Templates

This folder contains email templates for PESDO Surigao that should be configured in your Supabase project.

## Password Reset Email Template

### How to Set Up in Supabase:

1. **Go to Supabase Dashboard**
   - Navigate to: **Authentication** → **Email Templates**

2. **Select "Reset Password" Template**
   - Click on the "Reset Password" template

3. **Configure the Template**

   **Subject Line:**
   ```
   Reset Your Password - PESDO Surigao
   ```

   **HTML Body:**
   - Copy the contents of `password-reset-template.html`
   - Paste it into the HTML body field
   - Make sure `{{ .ConfirmationURL }}` is included (this is the reset link)

   **Plain Text Body (Optional but Recommended):**
   - Copy the contents of `password-reset-template-plain.txt`
   - Paste it into the Plain text body field
   - This ensures emails work even if HTML is disabled

4. **Save the Template**
   - Click "Save" to apply the changes

### Important Variables:

- `{{ .ConfirmationURL }}` - The password reset link (REQUIRED - do not remove)
- `{{ .Email }}` - User's email address (optional)
- `{{ .Token }}` - Reset token (optional, usually not needed)
- `{{ .TokenHash }}` - Hashed token (optional, usually not needed)
- `{{ .SiteURL }}` - Your site URL (optional)
- `{{ .Year }}` - Current year (optional)

### Testing:

1. Use the "Send test email" feature in Supabase to preview the template
2. Test with a real account to ensure the reset link works
3. Check that the email appears correctly in different email clients

### Notes:

- The template uses PESDO branding colors (#005177, #0079a1)
- The reset link expires in 1 hour (configured in Supabase settings)
- Make sure your redirect URL is added to Supabase allowed redirect URLs:
  - `https://pesdosurigao.online/reset-password`
  - `http://localhost:5173/reset-password` (for local development)

