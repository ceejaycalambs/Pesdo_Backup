-- RLS Policies for admin_profiles table
-- These policies ensure admins can read their own profiles and super_admins can manage all admin accounts

-- Enable RLS on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view their own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins can update their own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins can view all admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins can insert admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins can update all admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins can delete admin profiles" ON public.admin_profiles;

-- Policy 1: Admins can view their own profile
CREATE POLICY "Admins can view their own profile"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Admins can update their own profile (except role)
CREATE POLICY "Admins can update their own profile"
ON public.admin_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Prevent admins from changing their own role
  (role = (SELECT role FROM public.admin_profiles WHERE id = auth.uid()) OR role IS NULL)
);

-- Policy 3: Super admins can view all admin profiles
CREATE POLICY "Super admins can view all admin profiles"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Policy 4: Super admins can insert admin profiles (for creating new admin accounts)
CREATE POLICY "Super admins can insert admin profiles"
ON public.admin_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Policy 5: Super admins can update all admin profiles
CREATE POLICY "Super admins can update all admin profiles"
ON public.admin_profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Policy 6: Super admins can delete admin profiles
CREATE POLICY "Super admins can delete admin profiles"
ON public.admin_profiles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Add comment
COMMENT ON TABLE public.admin_profiles IS 'Admin user profiles with role-based access control. Admins can view/update their own profiles. Super admins can manage all admin accounts.';

