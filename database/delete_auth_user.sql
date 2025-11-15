-- Function to delete a user from auth.users
-- This function uses SECURITY DEFINER to run with elevated privileges
-- It can delete users from the auth schema when called by admins
-- 
-- IMPORTANT: This function must be run with proper permissions.
-- Supabase may restrict direct access to auth.users, so this may need
-- to be run as a service role or through an Edge Function.

CREATE OR REPLACE FUNCTION public.delete_auth_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Check if user exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
    RAISE NOTICE 'User % does not exist in auth.users', user_id;
    RETURN false;
  END IF;

  -- Delete from auth.users
  -- Note: This requires the function to have proper permissions
  -- If this fails, you may need to use Supabase Admin API or Edge Function
  DELETE FROM auth.users WHERE id = user_id;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  IF deleted_count > 0 THEN
    RAISE NOTICE 'Successfully deleted auth user %', user_id;
    RETURN true;
  ELSE
    RAISE WARNING 'Failed to delete auth user % - no rows affected', user_id;
    RETURN false;
  END IF;
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE EXCEPTION 'Insufficient privileges to delete from auth.users. This function may need to be run with service role privileges or through a Supabase Edge Function.';
  WHEN OTHERS THEN
    -- Log the error
    RAISE WARNING 'Error deleting auth user %: %', user_id, SQLERRM;
    RETURN false;
END;
$$;

-- Grant execute permission to authenticated users (admins will use this)
GRANT EXECUTE ON FUNCTION public.delete_auth_user(UUID) TO authenticated;

-- Also create a trigger function that automatically deletes auth user when profile is deleted
CREATE OR REPLACE FUNCTION public.delete_auth_user_on_profile_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Delete the auth user when profile is deleted
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the profile deletion
    RAISE WARNING 'Error deleting auth user for profile %: %', OLD.id, SQLERRM;
    RETURN OLD;
END;
$$;

-- Create triggers for jobseeker_profiles
-- This trigger automatically deletes the auth user when a jobseeker profile is deleted
DROP TRIGGER IF EXISTS trigger_delete_auth_user_jobseeker ON public.jobseeker_profiles;
CREATE TRIGGER trigger_delete_auth_user_jobseeker
  AFTER DELETE ON public.jobseeker_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_auth_user_on_profile_delete();

-- Create triggers for employer_profiles
-- This trigger automatically deletes the auth user when an employer profile is deleted
DROP TRIGGER IF EXISTS trigger_delete_auth_user_employer ON public.employer_profiles;
CREATE TRIGGER trigger_delete_auth_user_employer
  AFTER DELETE ON public.employer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_auth_user_on_profile_delete();
