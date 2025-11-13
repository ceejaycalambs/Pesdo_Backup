-- Function to allow admins to create/update referred applications
-- This function bypasses RLS using SECURITY DEFINER

CREATE OR REPLACE FUNCTION create_referred_application(
  p_jobseeker_id UUID,
  p_job_id UUID,
  p_status TEXT DEFAULT 'referred'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_id UUID;
  v_existing_app_id UUID;
  v_result JSONB;
BEGIN
  -- Check if current user is an admin
  SELECT id INTO v_admin_id
  FROM admin_profiles
  WHERE id = auth.uid();
  
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Only admins can create referred applications';
  END IF;
  
  -- Check if application already exists
  SELECT id INTO v_existing_app_id
  FROM applications
  WHERE job_id = p_job_id
    AND jobseeker_id = p_jobseeker_id
  LIMIT 1;
  
  IF v_existing_app_id IS NOT NULL THEN
    -- Update existing application
    UPDATE applications
    SET status = p_status,
        updated_at = NOW()
    WHERE id = v_existing_app_id;
    
    v_result := jsonb_build_object(
      'success', true,
      'action', 'updated',
      'application_id', v_existing_app_id
    );
  ELSE
    -- Create new application
    INSERT INTO applications (
      jobseeker_id,
      job_id,
      status,
      applied_at,
      created_at
    )
    VALUES (
      p_jobseeker_id,
      p_job_id,
      p_status,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_existing_app_id;
    
    v_result := jsonb_build_object(
      'success', true,
      'action', 'created',
      'application_id', v_existing_app_id
    );
  END IF;
  
  RETURN v_result;
END;
$$;

-- Grant execute permission to authenticated users (admins will be checked inside the function)
GRANT EXECUTE ON FUNCTION create_referred_application TO authenticated;

-- Add comment
COMMENT ON FUNCTION create_referred_application IS 'Allows admins to create or update referred applications, bypassing RLS';

