-- Add valid_from column to jobs and jobvacancypending tables

-- Add valid_from to jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS valid_from DATE NULL;

-- Add valid_from to jobvacancypending table
ALTER TABLE public.jobvacancypending
ADD COLUMN IF NOT EXISTS valid_from DATE NULL;

-- Add comment
COMMENT ON COLUMN public.jobs.valid_from IS 'Date from which the job vacancy is valid and open for applications. If NULL, the job is immediately available.';
COMMENT ON COLUMN public.jobvacancypending.valid_from IS 'Date from which the job vacancy is valid and open for applications. If NULL, the job is immediately available.';

