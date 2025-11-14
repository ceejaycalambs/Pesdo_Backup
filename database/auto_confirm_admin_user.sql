-- RPC Function to auto-confirm admin user email
-- This function can be called from the frontend to confirm admin users
CREATE OR REPLACE FUNCTION public.auto_confirm_admin_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the auth.users table to confirm the email
  UPDATE auth.users
  SET 
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    confirmed_at = COALESCE(confirmed_at, NOW())
  WHERE id = user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.auto_confirm_admin_user(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.auto_confirm_admin_user(UUID) IS 'Auto-confirms admin user email without requiring email verification. Can be called by authenticated super_admin users.';
