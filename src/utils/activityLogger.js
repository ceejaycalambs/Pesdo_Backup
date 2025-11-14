import { supabase } from '../supabase.js';

/**
 * Log an activity to the activity_log table
 * @param {Object} params
 * @param {string} params.userId - User ID performing the action
 * @param {string} params.userType - Type of user: 'jobseeker', 'employer', 'admin', 'super_admin'
 * @param {string} params.actionType - Type of action: 'job_approved', 'jobseeker_referred', etc.
 * @param {string} params.actionDescription - Human-readable description
 * @param {string} params.entityType - Type of entity affected: 'job', 'application', 'profile', etc.
 * @param {string} params.entityId - ID of the entity affected
 * @param {Object} params.metadata - Additional data about the action
 */
export const logActivity = async ({
  userId,
  userType,
  actionType,
  actionDescription,
  entityType = null,
  entityId = null,
  metadata = {}
}) => {
  try {
    // Get IP address and user agent if available
    const ipAddress = metadata.ipAddress || null;
    const userAgent = metadata.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : null);

    const { error } = await supabase
      .from('activity_log')
      .insert({
        user_id: userId,
        user_type: userType,
        action_type: actionType,
        action_description: actionDescription,
        entity_type: entityType,
        entity_id: entityId,
        metadata: metadata,
        ip_address: ipAddress,
        user_agent: userAgent
      });

    if (error) {
      console.error('Error logging activity:', error);
      // Don't throw error - logging should not break the main functionality
    }
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error - logging should not break the main functionality
  }
};

/**
 * Log a login attempt to the login_log table
 * @param {Object} params
 * @param {string} params.userId - User ID (null if login failed)
 * @param {string} params.userType - Type of user: 'jobseeker', 'employer', 'admin', 'super_admin'
 * @param {string} params.email - Email used for login
 * @param {string} params.status - 'success', 'failed', 'blocked'
 * @param {string} params.failureReason - Reason for failed login
 * @param {string} params.ipAddress - IP address
 * @param {string} params.userAgent - User agent string
 */
export const logLogin = async ({
  userId = null,
  userType,
  email,
  status,
  failureReason = null,
  ipAddress = null,
  userAgent = null
}) => {
  try {
    const { error } = await supabase
      .from('login_log')
      .insert({
        user_id: userId,
        user_type: userType,
        email: email,
        login_status: status,
        failure_reason: failureReason,
        ip_address: ipAddress,
        user_agent: userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : null)
      });

    if (error) {
      console.error('Error logging login:', error);
      // Don't throw error - logging should not break the main functionality
    }
  } catch (error) {
    console.error('Error logging login:', error);
    // Don't throw error - logging should not break the main functionality
  }
};

