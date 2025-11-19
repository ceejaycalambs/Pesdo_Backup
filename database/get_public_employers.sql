-- Create a public function to get approved employers for landing page
-- This allows public access to approved employer information including logos

DROP FUNCTION IF EXISTS public.get_public_employers();

CREATE FUNCTION public.get_public_employers()
RETURNS TABLE (
    id UUID,
    business_name TEXT,
    company_logo_url TEXT,
    acronym TEXT,
    verification_status TEXT
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
        ep.acronym,
        ep.verification_status::text
    FROM public.employer_profiles ep
    ORDER BY 
        CASE 
            WHEN lower(COALESCE(ep.verification_status::text, 'pending')) = 'approved' THEN 1
            WHEN lower(COALESCE(ep.verification_status::text, 'pending')) = 'verified' THEN 2
            WHEN lower(COALESCE(ep.verification_status::text, 'pending')) = 'pending' THEN 3
            ELSE 4
        END,
        ep.business_name ASC
    LIMIT 50;
END;
$$;

-- Grant execute permission to anon (public) and authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_employers() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_employers() TO authenticated;

