import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';
import './AuthCallback.css';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash from URL (Supabase adds #access_token=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        // Handle errors
        if (error) {
          console.error('Auth callback error:', error, errorDescription);
          setStatus('error');
          setMessage(errorDescription || 'An error occurred during email verification.');
          setTimeout(() => {
            navigate('/register');
          }, 3000);
          return;
        }

        // Handle email confirmation
        if (type === 'signup' && accessToken) {
          // Set the session
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            throw sessionError;
          }

          // Email confirmed successfully
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to login...');

          // Get user type from metadata
          const userType = sessionData?.user?.user_metadata?.userType || 'jobseeker';

          // Redirect to appropriate login page after 2 seconds
          setTimeout(() => {
            navigate(`/login/${userType}`, {
              state: {
                message: 'Email verified successfully! Please log in with your credentials.',
                email: sessionData?.user?.email,
              },
            });
          }, 2000);
        } else if (type === 'recovery') {
          // Password reset
          setStatus('success');
          setMessage('Password reset link verified! Redirecting...');
          setTimeout(() => {
            navigate('/reset-password', {
              state: { accessToken, refreshToken },
            });
          }, 2000);
        } else {
          // Unknown type
          setStatus('error');
          setMessage('Invalid verification link.');
          setTimeout(() => {
            navigate('/register');
          }, 3000);
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        setStatus('error');
        setMessage(error.message || 'An error occurred during verification.');
        setTimeout(() => {
          navigate('/register');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="auth-callback-container">
      <div className="auth-callback-card">
        {status === 'verifying' && (
          <>
            <div className="loading-spinner"></div>
            <h2>Verifying Email</h2>
            <p>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✅</div>
            <h2>Email Verified!</h2>
            <p>{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">❌</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <button onClick={() => navigate('/register')} className="retry-button">
              Go to Registration
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

