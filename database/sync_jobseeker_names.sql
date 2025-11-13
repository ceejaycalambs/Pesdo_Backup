-- Sync jobseeker profile names with metadata captured during signup
-- Run this in Supabase SQL editor after deploying the code changes

ALTER TABLE public.jobseeker_profiles
ADD COLUMN IF NOT EXISTS suffix text;

ALTER TABLE public.jobseeker_profiles
DROP COLUMN IF EXISTS username;

ALTER TABLE public.employer_profiles
DROP COLUMN IF EXISTS username;

UPDATE public.jobseeker_profiles jp
SET
    first_name = NULLIF(TRIM(COALESCE(jp.first_name, au.raw_user_meta_data ->> 'first_name')), ''),
    last_name  = NULLIF(TRIM(COALESCE(jp.last_name,  au.raw_user_meta_data ->> 'last_name')), ''),
    suffix     = NULLIF(TRIM(COALESCE(jp.suffix, au.raw_user_meta_data ->> 'suffix')), '')
FROM auth.users au
WHERE au.id = jp.id
  AND (
    COALESCE(jp.first_name, '') <> COALESCE(au.raw_user_meta_data ->> 'first_name', '') OR
    COALESCE(jp.last_name,  '') <> COALESCE(au.raw_user_meta_data ->> 'last_name', '') OR
    COALESCE(jp.suffix,     '') <> COALESCE(au.raw_user_meta_data ->> 'suffix', '')
  );

