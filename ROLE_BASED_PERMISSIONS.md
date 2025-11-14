# Role-Based Permissions Implementation

## Overview
The system now supports two admin roles:
- **Admin**: Can refer jobseekers and approve job vacancies
- **Super Admin**: Can only manage admin accounts (add/edit/delete admin users)

## Database Changes
1. Run `database/add_role_to_admin_profiles.sql` to add the `role` column to `admin_profiles` table
2. Set at least one super_admin account by updating the email in the SQL script

## Implementation Details

### Files Modified:
1. **src/pages/Admin/AdminDashboard.jsx**
   - Added `adminRole` state
   - Fetches admin role on authentication
   - Stores role in localStorage

2. **src/pages/Admin/JobManagementSimplified.jsx**
   - Added role checking for approve and refer actions
   - Disables approve/refer buttons for super_admin
   - Shows error messages when super_admin tries restricted actions

### Restrictions:
- **Super Admin** cannot:
  - Approve job vacancies
  - Refer jobseekers to jobs
  - Access "Refer Jobseeker" tab (shows error message)

- **Admin** can:
  - Approve job vacancies
  - Refer jobseekers to jobs
  - All normal admin functions

### Next Steps:
1. Create AdminManagement component for super_admin to manage admin accounts
2. Add route protection to ensure only super_admin can access admin management
3. Update AdminDashboard to show "Manage Admins" option only for super_admin

