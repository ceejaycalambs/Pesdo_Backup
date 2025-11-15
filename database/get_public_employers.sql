-- Create a public function to get approved employers for landing page
-- This allows public access to approved employer information including logos

CREATE OR REPLACE FUNCTION public.get_public_employers()
RETURNS TABLE (
    id UUID,
    business_name TEXT,
    company_logo_url TEXT,
    acronym TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ep.id,
        ep.business_name,
        ep.company_logo_url,
        ep.acronym
    FROM public.employer_profiles ep
    WHERE ep.verification_status = 'approved'
    ORDER BY ep.business_name ASC
    LIMIT 50;
END;
$$;

-- Grant execute permission to anon (public) and authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_employers() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_employers() TO authenticated;

