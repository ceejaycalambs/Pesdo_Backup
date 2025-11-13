# Fix: "Error sending confirmation email"

This error occurs when Supabase email confirmation is enabled but email service isn't configured.

## 🔧 Quick Fix (2 Options)

### Option 1: Disable Email Confirmation (Fastest - For Development)

**Best for**: Development, testing, capstone demos

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Email Auth** section
4. Find **"Enable Email Confirmations"**
5. **Turn it OFF** (toggle switch)
6. Click **Save**

**Result**: Users can register immediately without email confirmation.

**Pros**:
- ✅ Instant fix
- ✅ No configuration needed
- ✅ Perfect for development/demos

**Cons**:
- ⚠️ Users don't verify emails
- ⚠️ Less secure (but fine for capstone)

---

### Option 2: Configure Supabase Email Service (For Production)

**Best for**: Production, when you need email verification

1. Go to **Supabase Dashboard** → Your Project
2. Navigate to **Authentication** → **Settings**
3. Scroll to **SMTP Settings** section
4. You have two options:

#### Option A: Use Supabase Default SMTP (Easiest)
- Supabase provides default SMTP
- Should work automatically
- If it doesn't, see Option B

#### Option B: Configure Custom SMTP
- Click **"Enable Custom SMTP"**
- Add SMTP settings:
  - **Host**: smtp.sendgrid.net (if using SendGrid)
  - **Port**: 587
  - **Username**: apikey
  - **Password**: Your SendGrid API key
  - **Sender email**: Your verified email
  - **Sender name**: PESDO

5. Click **Save**
6. Test by registering a user

---

## 🎯 Recommended for Capstone

**Use Option 1** (Disable Email Confirmation):
- ✅ Fastest solution
- ✅ No additional setup
- ✅ Perfect for demos
- ✅ Can enable later if needed

---

## 📝 Step-by-Step: Disable Email Confirmation

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Auth Settings**
   - Click **Authentication** in left sidebar
   - Click **Settings** tab

3. **Disable Email Confirmation**
   - Scroll to **Email Auth** section
   - Find **"Enable Email Confirmations"**
   - **Toggle OFF**
   - Click **Save** button

4. **Test Registration**
   - Try registering a new user
   - Should work immediately now!

---

## ✅ After Fixing

Your registration should work:
- ✅ Users can register immediately
- ✅ No email confirmation needed
- ✅ Can login right away
- ✅ Perfect for capstone demo

---

## 🔄 If You Want Email Confirmation Later

When ready for production:

1. **Set up SMTP** (Option 2 above)
2. **Enable Email Confirmations** again
3. **Test** with a real email

For now, **Option 1 is perfect for your capstone!**

