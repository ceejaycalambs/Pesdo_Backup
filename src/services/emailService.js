/**
 * Email Service
 * Handles sending emails via SendGrid, Resend, or Supabase Edge Functions
 */

// Option 1: Using SendGrid (Recommended for production)
import sgMail from '@sendgrid/mail';

// Option 2: Using Resend (Alternative)
// import { Resend } from 'resend';

// Option 3: Using Supabase Edge Functions (Recommended for free/capstone)
import { supabase } from '../supabase';

const EMAIL_SERVICE = process.env.REACT_APP_EMAIL_SERVICE || 'supabase'; // 'sendgrid', 'resend', or 'supabase'

// Initialize SendGrid
if (EMAIL_SERVICE === 'sendgrid' && process.env.REACT_APP_SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.REACT_APP_SENDGRID_API_KEY);
}

// Initialize Resend (if using)
// const resend = process.env.REACT_APP_RESEND_API_KEY 
//   ? new Resend(process.env.REACT_APP_RESEND_API_KEY) 
//   : null;

/**
 * Send email using configured service
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML email body
 * @param {string} options.text - Plain text email body (optional)
 * @returns {Promise<Object>} - Result object
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const fromEmail = process.env.REACT_APP_FROM_EMAIL || 'noreply@pesdo.gov.ph';
    const fromName = process.env.REACT_APP_FROM_NAME || 'PESDO';

    switch (EMAIL_SERVICE) {
      case 'sendgrid':
        return await sendViaSendGrid({ to, from: fromEmail, fromName, subject, html, text });
      
      case 'resend':
        return await sendViaResend({ to, from: fromEmail, fromName, subject, html, text });
      
      case 'supabase':
        // Use Supabase Edge Function for custom emails
        return await sendViaSupabaseEdgeFunction({ to, subject, html, text });
      
      default:
        console.warn('No email service configured. Email not sent.');
        return { success: false, error: 'Email service not configured' };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email via SendGrid
 */
const sendViaSendGrid = async ({ to, from, fromName, subject, html, text }) => {
  if (!process.env.REACT_APP_SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured');
    return { success: false, error: 'SendGrid not configured' };
  }

  const msg = {
    to,
    from: {
      email: from,
      name: fromName
    },
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent via SendGrid to:', to);
    return { success: true };
  } catch (error) {
    console.error('❌ SendGrid error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send email via Resend
 */
const sendViaResend = async ({ to, from, fromName, subject, html, text }) => {
  // Uncomment when Resend is configured
  /*
  if (!resend) {
    console.warn('Resend API key not configured');
    return { success: false, error: 'Resend not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${from}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent via Resend to:', to);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Resend error:', error);
    return { success: false, error: error.message };
  }
  */
  return { success: false, error: 'Resend not implemented' };
};

/**
 * Send email via Supabase Edge Function
 * This calls the 'send-email' Edge Function which uses Resend (free tier)
 */
const sendViaSupabaseEdgeFunction = async ({ to, subject, html, text }) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html, text },
    });

    if (error) {
      console.error('❌ Supabase Edge Function error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent via Supabase Edge Function to:', to);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error calling Supabase Edge Function:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email Templates
 */

// Welcome email template
export const sendWelcomeEmail = async (userEmail, userName, userType) => {
  const subject = `Welcome to PESDO, ${userName}!`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #005177, #0079a1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #005177; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to PESDO!</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>Thank you for registering with the Public Employment Service Office (PESDO) of Surigao City!</p>
          <p>Your ${userType} account has been successfully created. You can now:</p>
          <ul>
            ${userType === 'jobseeker' 
              ? '<li>Browse and apply for job vacancies</li><li>Upload your resume</li><li>Complete your profile</li>'
              : '<li>Post job vacancies</li><li>Manage applications</li><li>Find qualified candidates</li>'
            }
          </ul>
          <a href="${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/${userType}" class="button">Go to Dashboard</a>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The PESDO Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} PESDO Surigao City. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({ to: userEmail, subject, html });
};

// Application status update email
export const sendApplicationStatusEmail = async (userEmail, userName, jobTitle, status, companyName) => {
  const statusMessages = {
    accepted: {
      subject: `Congratulations! Your application for ${jobTitle} has been accepted`,
      message: `Great news! Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been accepted.`,
      action: 'Next steps will be communicated to you shortly.'
    },
    rejected: {
      subject: `Update on your application for ${jobTitle}`,
      message: `Thank you for your interest. We regret to inform you that your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> was not selected at this time.`,
      action: 'We encourage you to continue applying for other positions that match your skills.'
    },
    referred: {
      subject: `You've been referred for ${jobTitle}`,
      message: `Good news! You have been referred by an admin for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.`,
      action: 'The employer will review your profile and may contact you soon.'
    }
  };

  const statusInfo = statusMessages[status] || statusMessages.rejected;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${status === 'accepted' ? 'linear-gradient(135deg, #28a745, #20c997)' : status === 'referred' ? 'linear-gradient(135deg, #005177, #0079a1)' : 'linear-gradient(135deg, #6c757d, #495057)'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-badge { display: inline-block; padding: 8px 16px; background: ${status === 'accepted' ? '#28a745' : status === 'referred' ? '#005177' : '#6c757d'}; color: white; border-radius: 5px; font-weight: bold; margin: 10px 0; }
        .button { display: inline-block; padding: 12px 30px; background: #005177; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Application Status Update</h1>
        </div>
        <div class="content">
          <h2>Hello ${userName},</h2>
          <p>${statusInfo.message}</p>
          <div class="status-badge">Status: ${status.toUpperCase()}</div>
          <p>${statusInfo.action}</p>
          <a href="${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/jobseeker" class="button">View Dashboard</a>
          <p>Best regards,<br>The PESDO Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} PESDO Surigao City. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({ to: userEmail, subject: statusInfo.subject, html });
};

// New application notification (for employers)
export const sendNewApplicationEmail = async (employerEmail, employerName, jobseekerName, jobTitle) => {
  const subject = `New Application Received for ${jobTitle}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #005177, #0079a1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #005177; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Application Received</h1>
        </div>
        <div class="content">
          <h2>Hello ${employerName},</h2>
          <p>You have received a new application for the position of <strong>${jobTitle}</strong>.</p>
          <p><strong>Applicant:</strong> ${jobseekerName}</p>
          <a href="${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/employer" class="button">Review Application</a>
          <p>Best regards,<br>The PESDO Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} PESDO Surigao City. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({ to: employerEmail, subject, html });
};

// Job approval notification (for employers)
export const sendJobApprovalEmail = async (employerEmail, employerName, jobTitle, status) => {
  const subject = status === 'approved' 
    ? `Your Job Vacancy "${jobTitle}" has been Approved`
    : `Update on Your Job Vacancy "${jobTitle}"`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${status === 'approved' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #dc3545, #c82333)'}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #005177; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Job Vacancy ${status === 'approved' ? 'Approved' : 'Update'}</h1>
        </div>
        <div class="content">
          <h2>Hello ${employerName},</h2>
          <p>Your job vacancy for <strong>${jobTitle}</strong> has been <strong>${status}</strong>.</p>
          ${status === 'approved' 
            ? '<p>Your job posting is now live and visible to jobseekers. You will start receiving applications soon.</p>'
            : '<p>If you have any questions about this decision, please contact the PESDO office.</p>'
          }
          <a href="${process.env.REACT_APP_BASE_URL || 'http://localhost:5173'}/employer" class="button">View Dashboard</a>
          <p>Best regards,<br>The PESDO Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} PESDO Surigao City. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({ to: employerEmail, subject, html });
};

