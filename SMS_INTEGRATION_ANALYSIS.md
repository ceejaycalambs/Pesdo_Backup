# Android SMS Gateway Integration Analysis

## Current System Architecture

### Backend Infrastructure
- **Supabase**: PostgreSQL database, authentication, real-time subscriptions
- **Supabase Edge Functions**: Serverless functions for secure API calls
- **SMS Gateway**: sms-gate.app API (already configured in `supabase/functions/send-sms/index.ts`)
- **Frontend**: React with Vite, React Router

### Current Notification System
- **In-App Notifications**: Stored in `notifications` table, displayed via real-time subscriptions
- **Email Notifications**: Via Brevo API (`supabase/functions/send-email/index.ts`)
- **Activity Logging**: All actions logged to `activity_logs` table

### Phone Number Format
- **Storage Format**: `+639XXXXXXXXX` (E.164 format)
- **Display Format**: `9XXXXXXXXX` (user-friendly)
- **Input Validation**: Only accepts 10 digits starting with 9
- **Auto-formatting**: Converts to `+639XXXXXXXXX` before saving

---

## Key Events for SMS Notifications

### 1. **Jobseeker Events**

#### 1.1 Application Status Changes
**Location**: `src/pages/Employer/EmployerDashboard.jsx` (line 787-833)
- **Event**: Employer accepts/rejects/refers application
- **Trigger**: `handleApplicationDecision()` function
- **Recipient**: Jobseeker (from `jobseeker_profiles.phone`)
- **Message Types**:
  - `accepted`: "Hi [Name]! Your application for [Job] at [Company] has been ACCEPTED. Check dashboard. - PESDO"
  - `rejected`: "Hi [Name]! Your application for [Job] at [Company] was not selected. Keep applying! - PESDO"
  - `referred`: "Hi [Name]! You've been REFERRED for [Job] at [Company]. Employer will review. - PESDO"

#### 1.2 New Job Application
**Location**: `src/pages/Jobseeker/JobseekerDashboard.jsx` (line 1241-1299)
- **Event**: Jobseeker applies to a job
- **Trigger**: `handleApplyToJob()` function
- **Recipient**: Employer (from `employer_profiles.mobile_number`)
- **Message**: "Hi [Employer]! New application for [Job] from [Jobseeker]. Check dashboard. - PESDO"

---

### 2. **Employer Events**

#### 2.1 Job Vacancy Approval
**Location**: `src/pages/Admin/JobManagementSimplified.jsx` (line 817-932)
- **Event**: Admin approves a job vacancy
- **Trigger**: `handleApproveJob()` function
- **Recipient**: Employer (from `employer_profiles.mobile_number`)
- **Message**: "Hi [Employer]! Your job vacancy '[Job Title]' has been APPROVED and is now live. - PESDO"

#### 2.2 Employer Verification Status
**Location**: `src/pages/Admin/EmployerVerificationSimple.jsx` (line 130-195)
- **Event**: Admin approves/rejects employer verification
- **Trigger**: `handleUpdateVerification()` function
- **Recipient**: Employer (from `employer_profiles.mobile_number`)
- **Message Types**:
  - `approved`: "Hi [Employer]! Your employer account has been APPROVED. You can now post jobs. - PESDO"
  - `rejected`: "Hi [Employer]! Your verification was REJECTED. Check dashboard for details. - PESDO"

---

### 3. **Registration Events**

#### 3.1 Welcome SMS (Jobseeker)
**Location**: Registration flow (to be implemented)
- **Event**: New jobseeker account created
- **Recipient**: Jobseeker (from `jobseeker_profiles.phone`)
- **Message**: "Welcome to PESDO, [Name]! Your jobseeker account is ready. Visit pesdosurigao.online - PESDO"

#### 3.2 Welcome SMS (Employer)
**Location**: Registration flow (to be implemented)
- **Event**: New employer account created
- **Recipient**: Employer (from `employer_profiles.mobile_number`)
- **Message**: "Welcome to PESDO, [Name]! Your employer account is pending verification. - PESDO"

---

## Integration Points

### Existing SMS Service
**File**: `src/services/smsService.js`
- ✅ `sendSMS()` - Base function (calls Supabase Edge Function)
- ✅ `formatPhoneNumber()` - Phone number formatter
- ✅ `sendApplicationStatusSMS()` - Template for application status
- ✅ `sendNewApplicationSMS()` - Template for new applications
- ✅ `sendJobApprovalSMS()` - Template for job approvals
- ✅ `sendWelcomeSMS()` - Template for welcome messages

### Supabase Edge Function
**File**: `supabase/functions/send-sms/index.ts`
- ✅ Configured for sms-gate.app API
- ✅ Uses Basic Auth with username/password
- ✅ Handles phone number normalization
- ✅ Error handling and logging

---

## Implementation Plan

### Phase 1: Application Status Notifications (Priority: HIGH)

#### 1.1 Update Employer Dashboard
**File**: `src/pages/Employer/EmployerDashboard.jsx`

**Location**: `handleApplicationDecision()` function (line 787)

**Implementation**:
```javascript
import { sendApplicationStatusSMS } from '../../services/smsService';

// After updating application status (line 800)
// Fetch jobseeker profile to get phone number
const { data: jobseekerProfile } = await supabase
  .from('jobseeker_profiles')
  .select('phone, first_name, last_name')
  .eq('id', application.jobseeker_id)
  .single();

// Fetch job details
const { data: jobData } = await supabase
  .from('jobs')
  .select('position_title, employer_id')
  .eq('id', application.job_id)
  .single();

// Fetch employer profile for company name
const { data: employerProfile } = await supabase
  .from('employer_profiles')
  .select('business_name')
  .eq('id', jobData.employer_id)
  .single();

if (jobseekerProfile?.phone) {
  const jobseekerName = `${jobseekerProfile.first_name || ''} ${jobseekerProfile.last_name || ''}`.trim();
  await sendApplicationStatusSMS(
    jobseekerProfile.phone,
    jobseekerName,
    jobData.position_title,
    nextStatus,
    employerProfile?.business_name || 'Company'
  );
}
```

---

### Phase 2: Job Approval Notifications (Priority: HIGH)

#### 2.1 Update Admin Job Management
**File**: `src/pages/Admin/JobManagementSimplified.jsx`

**Location**: `handleApproveJob()` function (line 817)

**Implementation**:
```javascript
import { sendJobApprovalSMS } from '../../services/smsService';

// After job approval (after line 896)
// Fetch employer profile
const { data: employerProfile } = await supabase
  .from('employer_profiles')
  .select('mobile_number, business_name, contact_person_name')
  .eq('id', job.employer_id)
  .single();

if (employerProfile?.mobile_number) {
  const employerName = employerProfile.contact_person_name || employerProfile.business_name || 'Employer';
  await sendJobApprovalSMS(
    employerProfile.mobile_number,
    employerName,
    job.position_title,
    'approved'
  );
}
```

---

### Phase 3: Employer Verification Notifications (Priority: MEDIUM)

#### 3.1 Update Admin Verification
**File**: `src/pages/Admin/EmployerVerificationSimple.jsx`

**Location**: `handleUpdateVerification()` function (line 130)

**Implementation**:
```javascript
import { sendSMS } from '../../services/smsService';

// After verification update (after line 156)
if (verificationStatus === 'approved' || verificationStatus === 'rejected') {
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('mobile_number, business_name, contact_person_name')
    .eq('id', selectedEmployer.id)
    .single();

  if (employerProfile?.mobile_number) {
    const employerName = employerProfile.contact_person_name || employerProfile.business_name || 'Employer';
    const message = verificationStatus === 'approved'
      ? `Hi ${employerName}! Your employer account has been APPROVED. You can now post job vacancies. - PESDO`
      : `Hi ${employerName}! Your verification was REJECTED. Check dashboard for details. - PESDO`;

    await sendSMS({
      to: employerProfile.mobile_number,
      message: message
    });
  }
}
```

---

### Phase 4: New Application Notifications (Priority: MEDIUM)

#### 4.1 Update Jobseeker Dashboard
**File**: `src/pages/Jobseeker/JobseekerDashboard.jsx`

**Location**: `handleApplyToJob()` function (line 1241)

**Implementation**:
```javascript
import { sendNewApplicationSMS } from '../../services/smsService';

// After successful application (after line 1278)
// Fetch employer profile
const { data: employerProfile } = await supabase
  .from('employer_profiles')
  .select('mobile_number, business_name, contact_person_name')
  .eq('id', selectedJob.employer_id)
  .single();

if (employerProfile?.mobile_number && profile) {
  const employerName = employerProfile.contact_person_name || employerProfile.business_name || 'Employer';
  const jobseekerName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Jobseeker';
  const jobTitle = selectedJob.title || selectedJob.position_title || 'Job Vacancy';

  await sendNewApplicationSMS(
    employerProfile.mobile_number,
    employerName,
    jobseekerName,
    jobTitle
  );
}
```

---

### Phase 5: Welcome SMS (Priority: LOW)

#### 5.1 Registration Flow
**Files**: `src/pages/Register.jsx` or `src/signUp/SignUp.jsx`

**Implementation**:
```javascript
import { sendWelcomeSMS } from '../../services/smsService';

// After successful registration
if (userType === 'jobseeker' && profileData.phone) {
  const userName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
  await sendWelcomeSMS(profileData.phone, userName, 'jobseeker');
} else if (userType === 'employer' && profileData.mobile_number) {
  const userName = profileData.contact_person_name || profileData.business_name || 'Employer';
  await sendWelcomeSMS(profileData.mobile_number, userName, 'employer');
}
```

---

## Error Handling Strategy

### 1. Graceful Degradation
- SMS failures should NOT block the main action (approval, status change, etc.)
- Log errors but continue with the operation
- Use try-catch blocks around SMS calls

### 2. Logging
- Log all SMS attempts (success/failure) to activity logs
- Include phone number (masked), message type, and error details

### 3. Retry Logic (Optional)
- For critical notifications, implement retry mechanism
- Store failed SMS in a queue table for later retry

---

## Database Considerations

### Phone Number Availability
- Ensure `jobseeker_profiles.phone` is populated
- Ensure `employer_profiles.mobile_number` is populated
- Add validation to require phone numbers for SMS-enabled features

### SMS Logging Table (Optional)
Create a table to track SMS delivery:
```sql
CREATE TABLE sms_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT, -- 'application_status', 'job_approval', etc.
  status TEXT, -- 'sent', 'failed', 'pending'
  error_message TEXT,
  entity_type TEXT, -- 'application', 'job', 'employer'
  entity_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Testing Checklist

### Phase 1 Testing
- [ ] Test application acceptance SMS to jobseeker
- [ ] Test application rejection SMS to jobseeker
- [ ] Test application referral SMS to jobseeker
- [ ] Verify phone number formatting (+639XXXXXXXXX)
- [ ] Test with missing phone numbers (graceful failure)

### Phase 2 Testing
- [ ] Test job approval SMS to employer
- [ ] Verify employer receives SMS when job is approved
- [ ] Test with missing mobile_number (graceful failure)

### Phase 3 Testing
- [ ] Test employer verification approval SMS
- [ ] Test employer verification rejection SMS

### Phase 4 Testing
- [ ] Test new application notification to employer
- [ ] Verify employer receives SMS when jobseeker applies

### Phase 5 Testing
- [ ] Test welcome SMS for new jobseekers
- [ ] Test welcome SMS for new employers

---

## Deployment Steps

1. **Deploy Edge Function**:
   ```bash
   supabase functions deploy send-sms
   ```

2. **Set Environment Secrets**:
   ```bash
   supabase secrets set SMS_GATEWAY_USERNAME=7ONAGO
   supabase secrets set SMS_GATEWAY_PASSWORD=25mmhgtotnjptk
   supabase secrets set SMS_GATEWAY_DEVICE_ID=JOfKfT_s1aT-kOYRNVFjy
   ```

3. **Test Edge Function**:
   ```bash
   # Test via Supabase dashboard or curl
   curl -X POST https://[project-ref].supabase.co/functions/v1/send-sms \
     -H "Authorization: Bearer [anon-key]" \
     -H "Content-Type: application/json" \
     -d '{"to": "+639123456789", "message": "Test message"}'
   ```

4. **Implement Frontend Integration**:
   - Add SMS calls to identified integration points
   - Test each notification type
   - Monitor error logs

5. **Monitor and Optimize**:
   - Track SMS success rates
   - Monitor costs
   - Optimize message templates
   - Add retry logic if needed

---

## Cost Considerations

- **SMS Gateway**: Check sms-gate.app pricing
- **Message Length**: Keep messages under 160 characters when possible
- **Rate Limiting**: Implement throttling if needed
- **Error Handling**: Failed SMS should not incur costs

---

## Security Considerations

1. **Phone Number Privacy**: 
   - Never log full phone numbers in plain text
   - Mask phone numbers in logs (e.g., +639****56789)

2. **API Credentials**:
   - ✅ Already secured in Supabase Edge Function secrets
   - Never expose in frontend code

3. **Input Validation**:
   - Validate phone numbers before sending
   - Sanitize message content
   - Prevent SMS spam/abuse

---

## Next Steps

1. **Start with Phase 1** (Application Status) - Highest impact
2. **Test thoroughly** before moving to next phase
3. **Monitor SMS delivery rates** and adjust as needed
4. **Gather user feedback** on SMS notifications
5. **Iterate and improve** message templates based on feedback

