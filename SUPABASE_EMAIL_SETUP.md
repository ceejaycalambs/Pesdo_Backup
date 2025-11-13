# Supabase Built-in Email Setup Guide

This guide shows you how to set up and use Supabase's built-in email service for your PESDO application.

## ✅ Why Supabase Built-in Email?

- **100% FREE** - No additional service needed
- **Already integrated** - Works with your existing Supabase project
- **Easy setup** - Configure in Supabase Dashboard
- **Reliable** - Powered by Supabase infrastructure
- **Perfect for capstone** - No external dependencies

## 📋 Step 1: Configure Email Settings in Supabase

### 1.1 Enable Email Auth

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Email Auth** section
4. Make sure **Enable Email Signup** is ON
5. Configure these settings:
   - **Enable Email Confirmations**: ON (optional, for email verification)
   - **Secure Email Change**: ON (recommended)
   - **Double Confirm Email Changes**: ON (recommended)

### 1.2 Configure SMTP (Optional - For Custom Emails)

Supabase uses their default SMTP, but you can customize:

1. Go to **Authentication** → **Email Templates**
2. You'll see templates for:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password
   - Invite user

3. **For custom emails** (welcome, notifications), we'll use Edge Functions (see Step 3)

### 1.3 Email Rate Limits

- **Free Tier**: 4 emails per hour per user
- **Pro Tier**: Higher limits
- **For capstone**: Free tier is sufficient

## 📧 Step 2: Using Supabase Auth Emails

### 2.1 Email Confirmation (Built-in)

When users sign up, Supabase automatically sends confirmation emails:

```javascript
// In your signup function (already in AuthContext.jsx)
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
});
```

**What happens**:
- User receives confirmation email automatically
- Email contains verification link
- User clicks link → email verified

### 2.2 Password Reset (Built-in)

```javascript
// Reset password
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`
});
```

**What happens**:
- User receives password reset email
- Email contains reset link
- User clicks link → can set new password

## 🎨 Step 3: Custom Emails (Welcome, Notifications)

For custom emails (welcome emails, application notifications), we'll use **Supabase Edge Functions**.

### 3.1 Create Email Edge Function

We'll create an Edge Function that uses Supabase's email service or a free email API.

### 3.2 Option A: Use Supabase + Resend (Recommended for Free)

Resend offers 3,000 emails/month free, and we can call it from Edge Functions.

### 3.3 Option B: Use Supabase Database Functions

Create a PostgreSQL function that triggers emails via webhooks.

## 🚀 Quick Setup (Choose Your Approach)

### Approach 1: Supabase Auth Emails Only (Simplest)

**Use for**:
- Email confirmation
- Password reset
- Magic links

**Pros**:
- ✅ Already works
- ✅ No setup needed
- ✅ 100% free

**Cons**:
- ❌ Limited customization
- ❌ No welcome emails
- ❌ No custom notification emails

### Approach 2: Supabase + Edge Function + Resend (Recommended)

**Use for**:
- Welcome emails
- Custom notifications
- Application status updates

**Pros**:
- ✅ 3,000 emails/month free
- ✅ Full customization
- ✅ Professional templates
- ✅ Easy to set up

**Cons**:
- ⚠️ Requires Edge Function setup

### Approach 3: Supabase + Database Triggers

**Use for**:
- Automated emails on database changes
- Notification emails

**Pros**:
- ✅ Fully integrated
- ✅ Automatic triggers

**Cons**:
- ⚠️ More complex setup
- ⚠️ Requires webhook service

## 📝 Recommended Setup for Capstone

**Use Both**:
1. **Supabase Auth Emails** (built-in) → For signup confirmation, password reset
2. **Edge Function + Resend** (free) → For welcome emails, notifications

This gives you:
- ✅ Email confirmation (Supabase)
- ✅ Welcome emails (Resend via Edge Function)
- ✅ Notification emails (Resend via Edge Function)
- ✅ 100% free setup

## 🎯 Next Steps

1. **Configure Supabase Auth** (Step 1 above)
2. **Test email confirmation** (register a user)
3. **Set up Edge Function for custom emails** (if needed)
4. **Integrate with your app**

Let's start with Step 1 - configuring Supabase Auth emails!

