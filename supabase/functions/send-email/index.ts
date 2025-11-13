/**
 * Supabase Edge Function: Send Custom Emails
 * 
 * This function sends custom emails using Resend (free tier: 3,000 emails/month)
 * 
 * Deploy:
 * supabase functions deploy send-email
 * 
 * Set secrets:
 * supabase secrets set RESEND_API_KEY=your_resend_api_key
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { to, subject, html, text } = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Option 1: Use Resend (Free tier: 3,000 emails/month)
    if (RESEND_API_KEY) {
      const resendUrl = 'https://api.resend.com/emails';
      
      const response = await fetch(resendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'PESDO <noreply@resend.dev>', // Free tier uses resend.dev domain
          to,
          subject,
          html,
          text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Resend error:', data);
        return new Response(
          JSON.stringify({ error: data.message || 'Failed to send email' }),
          {
            status: response.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, id: data.id }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Option 2: Fallback - Log email (for development)
    console.log('Email would be sent:', { to, subject, html });
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email service not configured. Email logged to console.',
        to,
        subject 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});

