-- Convert an existing admin account to super_admin
-- This is easier if you already have an admin account set up
--
-- Option 1: Convert by email (easiest)
-- Replace 'admin@pesdo.com' with your existing admin email

UPDATE public.admin_profiles
SET 
    role = 'super_admin',
    updated_at = NOW()
WHERE email = 'admin@pesdo.com';  -- Change this to your admin email

-- Verify the update
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    created_at
FROM public.admin_profiles
WHERE email = 'admin@pesdo.com';  -- Change this to your admin email

-- Option 2: Convert by user ID (if you know the UUID)
-- Uncomment and replace 'YOUR_USER_ID_HERE' with the actual UUID
-- UPDATE public.admin_profiles
-- SET 
--     role = 'super_admin',
--     updated_at = NOW()
-- WHERE id = 'YOUR_USER_ID_HERE';

