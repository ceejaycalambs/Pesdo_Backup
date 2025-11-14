-- Fix RLS Policies for admin_profiles table
-- The issue is circular dependency - we need to allow admins to read their own profile first
-- before checking if they're super_admin

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can view their own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins can update their own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins can view all admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins can insert admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins can update all admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins can delete admin profiles" ON public.admin_profiles;

-- Create a function to check if user is super_admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_super_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = check_user_id AND role = 'super_admin'
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;

-- Policy 1: Admins can view their own profile (must come first to avoid circular dependency)
CREATE POLICY "Admins can view their own profile"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Super admins can view all admin profiles (uses function to avoid circular dependency)
CREATE POLICY "Super admins can view all admin profiles"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (public.is_super_admin(auth.uid()));

-- Policy 3: Admins can update their own profile
CREATE POLICY "Admins can update their own profile"
ON public.admin_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 4: Super admins can update all admin profiles
CREATE POLICY "Super admins can update all admin profiles"
ON public.admin_profiles
FOR UPDATE
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- Policy 5: Super admins can insert admin profiles
CREATE POLICY "Super admins can insert admin profiles"
ON public.admin_profiles
FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin(auth.uid()));

-- Policy 6: Super admins can delete admin profiles
CREATE POLICY "Super admins can delete admin profiles"
ON public.admin_profiles
FOR DELETE
TO authenticated
USING (public.is_super_admin(auth.uid()));

-- Add comment
COMMENT ON FUNCTION public.is_super_admin(UUID) IS 'Checks if a user is a super_admin. Uses SECURITY DEFINER to bypass RLS and avoid circular dependencies.';

