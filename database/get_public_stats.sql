-- Create a public function to get statistics for landing page
-- This allows public access to aggregated counts without exposing individual records
-- Only counts jobs from existing (non-deleted) employers

CREATE OR REPLACE FUNCTION get_public_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'jobseekers', (SELECT COUNT(*) FROM jobseeker_profiles),
    'employers', (SELECT COUNT(*) FROM employer_profiles),
    'vacancies', (
      SELECT COUNT(*) 
      FROM jobs j
      INNER JOIN employer_profiles ep ON j.employer_id = ep.id
      WHERE j.status = 'approved'
    ),
    'referrals', (SELECT COUNT(*) FROM applications WHERE LOWER(status) = 'referred'),
    'placements', (SELECT COUNT(*) FROM applications WHERE LOWER(status) IN ('accepted', 'hired', 'placed'))
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permission to anon (public) users
GRANT EXECUTE ON FUNCTION get_public_stats() TO anon;
GRANT EXECUTE ON FUNCTION get_public_stats() TO authenticated;

