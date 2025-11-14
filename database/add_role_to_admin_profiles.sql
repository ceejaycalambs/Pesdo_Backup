-- Add role column to admin_profiles table
-- Roles: 'admin' (can refer and approve) or 'super_admin' (can only manage admin accounts)

ALTER TABLE public.admin_profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin'));

-- Update existing admins to 'admin' role (if they don't have one)
UPDATE public.admin_profiles
SET role = 'admin'
WHERE role IS NULL;

-- Set at least one super_admin (you can change the email to your super admin email)
-- Uncomment and update the email below to set a super admin:
-- UPDATE public.admin_profiles
-- SET role = 'super_admin'
-- WHERE email = 'your-super-admin@email.com';

-- Add comment to the column
COMMENT ON COLUMN public.admin_profiles.role IS 'Admin role: admin (can refer and approve), super_admin (can only manage admin accounts)';

