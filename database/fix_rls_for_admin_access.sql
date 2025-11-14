-- Fix RLS policies for admin access to employer_profiles, jobs, and applications
-- Admins should be able to read all data from these tables

-- Create a function to check if user is an admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = check_user_id
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- ============================================
-- EMPLOYER_PROFILES
-- ============================================
-- Check if RLS is enabled
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'employer_profiles'
  ) THEN
    -- Enable RLS if not already enabled
    ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing admin policies if they exist
    DROP POLICY IF EXISTS "Admins can view all employer profiles" ON public.employer_profiles;
    DROP POLICY IF EXISTS "Admins can update employer profiles" ON public.employer_profiles;
    
    -- Create policy for admins to view all employer profiles
    CREATE POLICY "Admins can view all employer profiles"
    ON public.employer_profiles
    FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));
    
    -- Create policy for admins to update employer profiles
    CREATE POLICY "Admins can update employer profiles"
    ON public.employer_profiles
    FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
  END IF;
END $$;

-- ============================================
-- JOBS
-- ============================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs'
  ) THEN
    -- Enable RLS if not already enabled
    ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing admin policies if they exist
    DROP POLICY IF EXISTS "Admins can view all jobs" ON public.jobs;
    DROP POLICY IF EXISTS "Admins can update jobs" ON public.jobs;
    DROP POLICY IF EXISTS "Admins can insert jobs" ON public.jobs;
    DROP POLICY IF EXISTS "Admins can delete jobs" ON public.jobs;
    
    -- Create policy for admins to view all jobs
    CREATE POLICY "Admins can view all jobs"
    ON public.jobs
    FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));
    
    -- Create policy for admins to update jobs
    CREATE POLICY "Admins can update jobs"
    ON public.jobs
    FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
    
    -- Create policy for admins to insert jobs
    CREATE POLICY "Admins can insert jobs"
    ON public.jobs
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));
    
    -- Create policy for admins to delete jobs
    CREATE POLICY "Admins can delete jobs"
    ON public.jobs
    FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- ============================================
-- APPLICATIONS
-- ============================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'applications'
  ) THEN
    -- Enable RLS if not already enabled
    ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing admin policies if they exist
    DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
    DROP POLICY IF EXISTS "Admins can update applications" ON public.applications;
    DROP POLICY IF EXISTS "Admins can insert applications" ON public.applications;
    DROP POLICY IF EXISTS "Admins can delete applications" ON public.applications;
    
    -- Create policy for admins to view all applications
    CREATE POLICY "Admins can view all applications"
    ON public.applications
    FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));
    
    -- Create policy for admins to update applications
    CREATE POLICY "Admins can update applications"
    ON public.applications
    FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
    
    -- Create policy for admins to insert applications
    CREATE POLICY "Admins can insert applications"
    ON public.applications
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));
    
    -- Create policy for admins to delete applications
    CREATE POLICY "Admins can delete applications"
    ON public.applications
    FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));
  END IF;
END $$;

-- ============================================
-- JOBVACANCYPENDING (if exists)
-- ============================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'jobvacancypending'
  ) THEN
    -- Enable RLS if not already enabled
    ALTER TABLE public.jobvacancypending ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing admin policies if they exist
    DROP POLICY IF EXISTS "Admins can view all pending jobs" ON public.jobvacancypending;
    DROP POLICY IF EXISTS "Admins can update pending jobs" ON public.jobvacancypending;
    DROP POLICY IF EXISTS "Admins can insert pending jobs" ON public.jobvacancypending;
    DROP POLICY IF EXISTS "Admins can delete pending jobs" ON public.jobvacancypending;
    
    -- Create policy for admins to view all pending jobs
    CREATE POLICY "Admins can view all pending jobs"
    ON public.jobvacancypending
    FOR SELECT
    TO authenticated
    USING (public.is_admin(auth.uid()));
    
    -- Create policy for admins to update pending jobs
    CREATE POLICY "Admins can update pending jobs"
    ON public.jobvacancypending
    FOR UPDATE
    TO authenticated
    USING (public.is_admin(auth.uid()))
    WITH CHECK (public.is_admin(auth.uid()));
    
    -- Create policy for admins to insert pending jobs
    CREATE POLICY "Admins can insert pending jobs"
    ON public.jobvacancypending
    FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin(auth.uid()));
    
    -- Create policy for admins to delete pending jobs
    CREATE POLICY "Admins can delete pending jobs"
    ON public.jobvacancypending
    FOR DELETE
    TO authenticated
    USING (public.is_admin(auth.uid()));
  END IF;
END $$;

