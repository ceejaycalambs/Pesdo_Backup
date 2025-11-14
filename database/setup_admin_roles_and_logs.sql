-- Step 1: Add role column to admin_profiles table (MUST RUN FIRST)
-- Roles: 'admin' (can refer and approve) or 'super_admin' (can view logs and manage admin accounts)

ALTER TABLE public.admin_profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin'));

-- Update existing admins to 'admin' role (if they don't have one)
UPDATE public.admin_profiles
SET role = 'admin'
WHERE role IS NULL;

-- Set at least one super_admin (uncomment and update the email below to set a super admin)
-- UPDATE public.admin_profiles
-- SET role = 'super_admin'
-- WHERE email = 'your-super-admin@email.com';

-- Add comment to the column
COMMENT ON COLUMN public.admin_profiles.role IS 'Admin role: admin (can refer and approve), super_admin (can view logs and manage admin accounts)';

-- Step 2: Create activity_log table to track all actions by jobseekers, employers, and admins
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('jobseeker', 'employer', 'admin', 'super_admin')),
    action_type VARCHAR(50) NOT NULL, -- e.g., 'job_approved', 'jobseeker_referred', 'profile_updated', 'job_applied', etc.
    action_description TEXT,
    entity_type VARCHAR(50), -- e.g., 'job', 'application', 'profile', etc.
    entity_id UUID,
    metadata JSONB, -- Additional data about the action
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_type ON public.activity_log(user_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_action_type ON public.activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON public.activity_log(entity_type, entity_id);

-- Step 3: Create login_log table to track all login attempts
CREATE TABLE IF NOT EXISTS public.login_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('jobseeker', 'employer', 'admin', 'super_admin')),
    email VARCHAR(255) NOT NULL,
    login_status VARCHAR(20) NOT NULL CHECK (login_status IN ('success', 'failed', 'blocked')),
    failure_reason TEXT, -- Reason for failed login (wrong password, user not found, etc.)
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_login_log_user_id ON public.login_log(user_id);
CREATE INDEX IF NOT EXISTS idx_login_log_user_type ON public.login_log(user_type);
CREATE INDEX IF NOT EXISTS idx_login_log_email ON public.login_log(email);
CREATE INDEX IF NOT EXISTS idx_login_log_status ON public.login_log(login_status);
CREATE INDEX IF NOT EXISTS idx_login_log_created_at ON public.login_log(created_at DESC);

-- Step 4: Enable Row Level Security
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_log ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "super_admin_can_view_activity_logs" ON public.activity_log;
DROP POLICY IF EXISTS "users_can_insert_own_activity_logs" ON public.activity_log;
DROP POLICY IF EXISTS "super_admin_can_view_login_logs" ON public.login_log;
DROP POLICY IF EXISTS "system_can_insert_login_logs" ON public.login_log;

-- Step 6: Create RLS Policies (now that role column exists)
-- RLS Policy: Only super_admin can view activity logs
CREATE POLICY "super_admin_can_view_activity_logs" ON public.activity_log
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE admin_profiles.id = auth.uid()
            AND admin_profiles.role = 'super_admin'
        )
    );

-- RLS Policy: All authenticated users can insert their own activity logs
CREATE POLICY "users_can_insert_own_activity_logs" ON public.activity_log
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Only super_admin can view login logs
CREATE POLICY "super_admin_can_view_login_logs" ON public.login_log
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE admin_profiles.id = auth.uid()
            AND admin_profiles.role = 'super_admin'
        )
    );

-- RLS Policy: System can insert login logs (via service role or function)
CREATE POLICY "system_can_insert_login_logs" ON public.login_log
    FOR INSERT
    WITH CHECK (true);

-- Add comments
COMMENT ON TABLE public.activity_log IS 'Tracks all user actions across the system';
COMMENT ON TABLE public.login_log IS 'Tracks all login attempts for security and auditing';

