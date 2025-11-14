-- Create Super Admin Account
-- This script creates a super_admin account in Supabase
-- 
-- IMPORTANT: You need to create the auth user first, then run this script
-- 
-- Step 1: Create the user in Supabase Auth (do this in Supabase Dashboard > Authentication > Users > Add User)
--   - Email: superadmin@pesdo.com (or your preferred email)
--   - Password: (set a secure password)
--   - Auto Confirm User: YES (check this box)
--
-- Step 2: After creating the auth user, note the User ID (UUID)
-- Step 3: Replace 'YOUR_USER_ID_HERE' below with the actual UUID from Step 2
-- Step 4: Run this script

-- First, ensure the role column exists
ALTER TABLE public.admin_profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin'));

-- Insert super admin profile
-- REPLACE 'YOUR_USER_ID_HERE' with the actual UUID from the auth.users table
INSERT INTO public.admin_profiles (
    id,
    email,
    userType,
    role,
    first_name,
    last_name,
    created_at,
    updated_at
)
VALUES (
    'YOUR_USER_ID_HERE',  -- Replace with the UUID from auth.users
    'superadmin@pesdo.com',  -- Change to your preferred email
    'admin',
    'super_admin',  -- This makes it a super admin
    'Super',
    'Admin',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
    role = 'super_admin',
    email = EXCLUDED.email,
    updated_at = NOW();

-- Verify the super admin was created
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    created_at
FROM public.admin_profiles
WHERE role = 'super_admin';

