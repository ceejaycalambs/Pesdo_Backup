import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../supabase';
import { logLogin } from '../utils/activityLogger';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [accountTypeMismatch, setAccountTypeMismatch] = useState(false);

  // Sign up function
  async function signup(email, password, userType, additionalData = {}) {
    try {
      console.log('🔧 AuthContext: Starting signup for:', email);
      const sanitizedData = Object.fromEntries(
        Object.entries(additionalData)
          .filter(([key]) => key !== 'username')
          .map(([key, value]) => {
            if (typeof value === 'string') {
              const trimmed = value.trim();
              return [key, trimmed.length > 0 ? trimmed : null];
            }
            return [key, value];
          })
      );
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            userType: userType,
            ...sanitizedData
          }
        }
      });
      
      // Check if user was created even if email failed
      if (error) {
        console.error('❌ Signup error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
          name: error.name
        });
        
        // Sometimes user is created but email fails - check if user exists
        if (data?.user) {
          console.log('⚠️ User was created but email failed. User ID:', data.user.id);
          console.log('⚠️ Email confirmed:', data.user.email_confirmed_at);
          // Continue with profile creation even if email failed
        } else {
          throw error;
        }
      }
      
      console.log('🔧 AuthContext: Signup successful for:', email);
      
      // Create user profile in Supabase using RPC function (bypasses RLS)
      if (data.user) {
        const userProfile = {
          id: data.user.id,
          email: data.user.email,
          usertype: userType, // Use lowercase to match database column
          ...sanitizedData
        };
        
        console.log('🔧 Creating profile using RPC function for user type:', userType);
        console.log('🔧 Profile data:', userProfile);
        
        // Use RPC function to create profile (bypasses RLS)
        let profileResult;
        if (userType === 'employer') {
          const { data: rpcData, error: rpcError } = await supabase.rpc('create_employer_profile', {
            p_user_id: data.user.id,
            p_email: data.user.email,
            p_business_name: sanitizedData.business_name || null
          });
          profileResult = { data: rpcData, error: rpcError };
        } else if (userType === 'admin') {
          // Admin profiles might need different handling
          const { data: insertData, error: profileError } = await supabase
            .from('admin_profiles')
            .insert([userProfile])
            .select();
          profileResult = { data: insertData, error: profileError };
        } else {
          // Jobseeker profile
          const { data: rpcData, error: rpcError } = await supabase.rpc('create_jobseeker_profile', {
            p_user_id: data.user.id,
            p_email: data.user.email,
            p_first_name: sanitizedData.first_name || null,
            p_last_name: sanitizedData.last_name || null,
            p_suffix: sanitizedData.suffix || null
          });
          profileResult = { data: rpcData, error: rpcError };
        }
        
        if (profileResult.error) {
          console.error('❌ Profile creation failed:', profileResult.error);
          console.error('❌ Error details:', {
            message: profileResult.error.message,
            details: profileResult.error.details,
            hint: profileResult.error.hint,
            code: profileResult.error.code
          });
          // Don't throw error - user account is created, profile can be created later
        } else {
          console.log('✅ Profile created successfully');
          console.log('✅ Profile result:', profileResult.data);
        }
        
        // Update local state
        setUserData(userProfile);
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Check account type after authentication but before setting user state
  async function checkAccountTypeAfterAuth(userId, expectedUserType) {
    if (!expectedUserType) {
      console.log('⚠️ No expected user type provided, skipping validation');
      return true; // No validation needed if no expected type
    }
    
    console.log('🔍 Checking account type for user ID:', userId, 'Expected:', expectedUserType);
    
    // Check the appropriate table first based on expected user type
    if (expectedUserType === 'admin') {
      const adminResult = await supabase
        .from('admin_profiles')
        .select('usertype')
        .eq('id', userId)
        .single();

      if (!adminResult.error && adminResult.data) {
        const actualUserType = adminResult.data.usertype || 'admin';
        console.log('📋 Found in admin_profiles:', actualUserType);
        
        if (expectedUserType !== actualUserType) {
          console.log('❌ Account type mismatch! Expected:', expectedUserType, 'Found:', actualUserType);
          throw new Error(`This account is registered as an ${actualUserType}. Please use the ${actualUserType} login instead.`);
        }
        console.log('✅ Account type matches, proceeding with login');
        return true;
      }
    } else if (expectedUserType === 'employer') {
      const employerResult = await supabase
        .from('employer_profiles')
        .select('usertype')
        .eq('id', userId)
        .single();

      if (!employerResult.error && employerResult.data) {
        const actualUserType = employerResult.data.usertype || 'employer';
        console.log('📋 Found in employer_profiles:', actualUserType);
        
        if (expectedUserType !== actualUserType) {
          console.log('❌ Account type mismatch! Expected:', expectedUserType, 'Found:', actualUserType);
          throw new Error(`This account is registered as an ${actualUserType}. Please use the ${actualUserType} login instead.`);
        }
        console.log('✅ Account type matches, proceeding with login');
        return true;
      }
    } else if (expectedUserType === 'jobseeker') {
      const jobseekerResult = await supabase
        .from('jobseeker_profiles')
        .select('usertype')
        .eq('id', userId)
        .single();

      if (!jobseekerResult.error && jobseekerResult.data) {
        const actualUserType = jobseekerResult.data.usertype || 'jobseeker';
        console.log('📋 Found in jobseeker_profiles:', actualUserType);
        
        if (expectedUserType !== actualUserType) {
          console.log('❌ Account type mismatch! Expected:', expectedUserType, 'Found:', actualUserType);
          throw new Error(`This account is registered as an ${actualUserType}. Please use the ${actualUserType} login instead.`);
        }
        console.log('✅ Account type matches, proceeding with login');
        return true;
      }
    }

    // If not found in the expected table, check other tables for mismatch
    if (expectedUserType !== 'admin') {
      const adminResult = await supabase
        .from('admin_profiles')
        .select('userType')
        .eq('id', userId)
        .single();

      if (!adminResult.error && adminResult.data) {
        const actualUserType = adminResult.data.userType || 'admin';
        console.log('❌ Account type mismatch! Expected:', expectedUserType, 'Found:', actualUserType);
        throw new Error(`This account is registered as an ${actualUserType}. Please use the ${actualUserType} login instead.`);
      }
    }

    // If not found in admin_profiles, try employer_profiles
    const employerResult = await supabase
      .from('employer_profiles')
      .select('usertype')
      .eq('id', userId)
      .single();

    console.log('🔍 Employer profile check result:', {
      error: employerResult.error?.message,
      data: employerResult.data,
      hasData: !!employerResult.data
    });

    if (!employerResult.error && employerResult.data) {
      const actualUserType = employerResult.data.usertype || 'employer';
      console.log('📋 Found in employer_profiles:', actualUserType);
      
      if (expectedUserType !== actualUserType) {
        console.log('❌ Account type mismatch! Expected:', expectedUserType, 'Found:', actualUserType);
        throw new Error(`This account is registered as an ${actualUserType}. Please use the ${actualUserType} login instead.`);
      }
      console.log('✅ Account type matches, proceeding with login');
      return true;
    }

    // If not found in employer_profiles, try jobseeker_profiles
    const jobseekerResult = await supabase
      .from('jobseeker_profiles')
      .select('usertype')
      .eq('id', userId)
      .single();

    console.log('🔍 Jobseeker profile check result:', {
      error: jobseekerResult.error?.message,
      data: jobseekerResult.data,
      hasData: !!jobseekerResult.data
    });

    if (!jobseekerResult.error && jobseekerResult.data) {
      const actualUserType = jobseekerResult.data.usertype || 'jobseeker';
      console.log('📋 Found in jobseeker_profiles:', actualUserType);
      
      if (expectedUserType !== actualUserType) {
        console.log('❌ Account type mismatch! Expected:', expectedUserType, 'Found:', actualUserType);
        throw new Error(`This account is registered as a ${actualUserType}. Please use the ${actualUserType} login instead.`);
      }
      console.log('✅ Account type matches, proceeding with login');
      return true;
    }

    // If not found in either table, allow login (new user or legacy account)
    console.log('📋 Account not found in profile tables, allowing login');
    return true;
  }

  // Login function
  async function login(email, password, expectedUserType = null) {
    try {
      console.log('Starting login process for email:', email);
      console.log('Supabase URL:', supabase.supabaseUrl);
      
      // Clear any existing session first to prevent conflicts
      console.log('Clearing any existing session...');
      await supabase.auth.signOut();
      
      // Clear any admin localStorage items to prevent conflicts
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_login_time');
      localStorage.removeItem('admin_email');
      
      // Set flags to prevent onAuthStateChange from interfering
      setIsLoggingIn(true);
      setAccountTypeMismatch(false);
      
      
      // Skip account type check before authentication - we'll do it after
      
      // Try direct auth call without timeout first
      console.log('Calling Supabase auth...');
      
      // Use Supabase client for proper email confirmation checking
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        // Log failed login attempt
        await logLogin({
          userId: null,
          userType: expectedUserType || 'unknown',
          email: email,
          status: 'failed',
          failureReason: authError.message || 'Authentication failed'
        });
        
        // Check if error is about email confirmation
        if (authError.message?.includes('Email not confirmed') || 
            authError.message?.includes('email_not_confirmed') ||
            authError.message?.includes('Email address not confirmed') ||
            authError.message?.includes('email_not_verified')) {
          throw new Error('Email not confirmed. Please check your email and click the confirmation link before logging in.');
        }
        throw authError;
      }
      
      // Additional check: Verify email is confirmed (double-check)
      if (authData.user && !authData.user.email_confirmed_at && !authData.user.confirmed_at) {
        // Sign out the user if email is not confirmed
        await supabase.auth.signOut();
        console.warn('⚠️ Login attempt with unconfirmed email:', email);
        throw new Error('Email not confirmed. Please check your email and click the confirmation link before logging in.');
      }
      
      // Create user object from response
      const user = {
        id: authData.user.id,
        email: authData.user.email,
        user_metadata: authData.user.user_metadata,
        email_confirmed_at: authData.user.email_confirmed_at || authData.user.confirmed_at
      };
      
      const data = { user, session: authData.session };
      
      console.log('Supabase auth response received:', { 
        hasData: !!data, 
        userEmail: data?.user?.email,
        userId: data?.user?.id,
        emailConfirmed: !!(authData.user.email_confirmed_at || authData.user.confirmed_at)
      });

      console.log('Auth successful, setting session for account type validation...');
      
      // Session is already set by signInWithPassword, no need to set again
      
      // Check account type AFTER setting session but BEFORE setting user state
      if (expectedUserType) {
        console.log('🔍 About to check account type for user ID:', data.user.id, 'Expected:', expectedUserType);
        await checkAccountTypeAfterAuth(data.user.id, expectedUserType);
        console.log('✅ Account type check passed, proceeding with login');
      } else {
        console.log('⚠️ No expected user type, skipping account type validation');
      }
      
      console.log('Setting user state...');
      setCurrentUser(data.user);
      
      console.log('Supabase auth successful, fetching user profile...');
      
      // Set basic user data immediately (profile can be fetched later)
      if (data.user) {
        console.log('Setting basic user data for:', data.user.email);
        
        // Try admin first, then employer, then jobseeker
        const adminResult = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!adminResult.error && adminResult.data) {
          console.log('✅ Admin profile fetched:', adminResult.data);
          const userType = adminResult.data.usertype || 'admin';
          const adminRole = adminResult.data.role || 'admin';
          setUserData({...adminResult.data, userType: userType});
          setProfileLoaded(true);
          
          // Log successful login
          await logLogin({
            userId: data.user.id,
            userType: adminRole === 'super_admin' ? 'super_admin' : 'admin',
            email: email,
            status: 'success'
          });
        } else {
          // If not admin, try employer
          const employerResult = await supabase
            .from('employer_profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (!employerResult.error && employerResult.data) {
            console.log('✅ Employer profile fetched:', employerResult.data);
            const userType = employerResult.data.usertype || 'employer';
            setUserData({...employerResult.data, userType});
            setProfileLoaded(true);
            
            // Log successful login
            await logLogin({
              userId: data.user.id,
              userType: 'employer',
              email: email,
              status: 'success'
            });
          } else {
            // If not employer, try jobseeker
            const jobseekerResult = await supabase
              .from('jobseeker_profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (!jobseekerResult.error && jobseekerResult.data) {
              console.log('✅ Jobseeker profile fetched:', jobseekerResult.data);
              const userType = jobseekerResult.data.usertype || 'jobseeker';
              setUserData({...jobseekerResult.data, userType});
              setProfileLoaded(true);
              
              // Log successful login
              await logLogin({
                userId: data.user.id,
                userType: 'jobseeker',
                email: email,
                status: 'success'
              });
            } else {
              console.log('❌ No profile found in any table');
              // Set basic user data with default userType
              setUserData({
                id: data.user.id,
                email: data.user.email,
                userType: 'jobseeker' // Default to jobseeker if no profile found
              });
              setProfileLoaded(true);
            }
          }
        }
      }
      
      console.log('Login process completed successfully');
      return data;
    } catch (error) {
      console.error('Login error details:', error);
      
      // If account type validation failed, clear the session and user state
      if (error.message?.includes('This account is registered as')) {
        console.log('🧹 Clearing session and user state due to account type mismatch');
        setAccountTypeMismatch(true);
        
        // Clear user state immediately to prevent any redirects
        setCurrentUser(null);
        setUserData(null);
        setProfileLoaded(false);
        
        // Sign out from Supabase to completely clear the session
        await supabase.auth.signOut();
        
        // Clear the accountTypeMismatch flag after a delay to allow normal auth state changes later
        setTimeout(() => {
          console.log('🔄 Clearing accountTypeMismatch flag after delay');
          setAccountTypeMismatch(false);
        }, 5000); // Increased delay to 5 seconds to ensure complete cleanup
      }
      
      throw error;
    } finally {
      // Always clear the login flag
      setIsLoggingIn(false);
    }
  }

  // Logout function
  async function logout(skipRedirect = false) {
    try {
      console.log('Starting logout process...', { skipRedirect });
      
      // Clear user data immediately
      setCurrentUser(null);
      setUserData(null);
      setProfileLoaded(false);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase logout error:', error);
      }
      
      // Clear any remaining session data
      await supabase.auth.setSession({
        access_token: null,
        refresh_token: null
      });
      
      console.log('Logout completed successfully');
      
      if (!skipRedirect) {
        window.location.href = '/';
      }
      
    } catch (error) {
      console.error('Logout error:', error);
      if (!skipRedirect) {
        window.location.href = '/';
      }
    }
  }

  // Update user profile
  async function updateUserProfile(updates) {
    try {
      console.log('🔧 AuthContext: Updating user profile:', updates);
      console.log('🔧 AuthContext: Current user ID:', currentUser?.id);
      
      if (currentUser) {
        const { data, error } = await supabase
          .from('jobseeker_profiles')
          .update(updates)
          .eq('id', currentUser.id)
          .select();
        
        if (error) {
          console.error('❌ AuthContext: Database update error:', error);
          throw error;
        }
        
        console.log('✅ AuthContext: Database update successful:', data);
        
        // Update local state
        setUserData(prev => {
          const updated = { ...prev, ...updates };
          console.log('🔄 AuthContext: Local state updated:', updated);
          return updated;
        });
      } else {
        console.error('❌ AuthContext: No current user found');
        throw new Error('No authenticated user');
      }
    } catch (error) {
      console.error('❌ AuthContext: Profile update failed:', error);
      throw error;
    }
  }

  // Update user profile picture
  async function updateProfilePicture(photoURL) {
    try {
      if (currentUser) {
        console.log('🖼️ Updating profile picture in database:', photoURL);
        
        const { data, error } = await supabase
          .from('jobseeker_profiles')
          .update({ profile_picture_url: photoURL })
          .eq('id', currentUser.id)
          .select();
        
        if (error) {
          console.error('❌ Database update error:', error);
          throw error;
        }
        
        console.log('✅ Database update successful:', data);
        
        // Update local state
        console.log('🔄 Updating local userData state with new profile picture URL');
        setUserData(prev => {
          const updated = { ...prev, profile_picture_url: photoURL };
          console.log('📊 Local state updated:', { 
            old: prev.profile_picture_url, 
            new: updated.profile_picture_url 
          });
          return updated;
        });
      }
    } catch (error) {
      console.error('❌ updateProfilePicture error:', error);
      throw error;
    }
  }

  // Refresh user profile data with retry
  async function refreshUserProfile(retryCount = 0) {
    try {
      if (currentUser && userData) {
        console.log(`🔄 Refreshing user profile (attempt ${retryCount + 1})`);
        
        // Determine the correct table based on user type
        const tableName = userData.usertype === 'admin' ? 'admin_profiles' : 
                         userData.usertype === 'employer' ? 'employer_profiles' : 'jobseeker_profiles';
        
        console.log(`📋 Fetching from table: ${tableName} for user type: ${userData.usertype}`);
        
        const { data: profile, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        if (error) {
          if (retryCount < 2) {
            console.log(`⚠️ Profile fetch failed, retrying in 1 second... (${retryCount + 1}/3)`);
            setTimeout(() => refreshUserProfile(retryCount + 1), 1000);
            return;
          }
          throw error;
        }
        
        console.log('📊 Fresh profile data from database:', {
          profile_picture_url: profile.profile_picture_url,
          company_logo_url: profile.company_logo_url,
          resume_url: profile.resume_url
        });
        
        // Update local state with fresh data
        setUserData(prev => {
          const updated = { ...prev, ...profile };
          console.log('🔄 Local state updated with fresh data:', {
            old_profile_picture: prev.profile_picture_url,
            new_profile_picture: updated.profile_picture_url,
            old_company_logo: prev.company_logo_url,
            new_company_logo: updated.company_logo_url
          });
          return updated;
        });
        console.log('✅ User profile refreshed successfully');
      }
    } catch (error) {
      console.error('❌ Error refreshing user profile after retries:', error);
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', { event, hasUser: !!session?.user, isLoggingIn, accountTypeMismatch });
      
      // Skip processing if we're in the middle of a login process or had account type mismatch
      if (isLoggingIn || accountTypeMismatch) {
        console.log('⏸️ Skipping auth state change processing - login in progress or account type mismatch');
        return;
      }
      
      // If this is a SIGNED_OUT event after a mismatch, don't process it
      if (event === 'SIGNED_OUT' && accountTypeMismatch) {
        console.log('⏸️ Skipping SIGNED_OUT processing due to account type mismatch');
        return;
      }
      
      // Handle logout events
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing state');
        setCurrentUser(null);
        setUserData(null);
        setProfileLoaded(false);
        setLoading(false);
        return;
      }
      
      setCurrentUser(session?.user || null);
      
      if (session?.user) {
        // Double-check that we're not in a mismatch state before fetching profile
        if (accountTypeMismatch) {
          console.log('⏸️ Skipping profile fetch due to account type mismatch');
          setLoading(false);
          return;
        }
        
        try {
          console.log('Fetching user profile for:', session.user.email);
          
          // Try to find user profile in all tables (admin, employer, jobseeker)
          // Check all tables in parallel for better performance
          Promise.allSettled([
            supabase.from('admin_profiles').select('*').eq('id', session.user.id).single(),
            supabase.from('employer_profiles').select('*').eq('id', session.user.id).single(),
            supabase.from('jobseeker_profiles').select('*').eq('id', session.user.id).single()
          ]).then((results) => {
            // Check admin first
            if (results[0].status === 'fulfilled' && !results[0].value.error && results[0].value.data) {
              console.log('✅ Auth state change - Admin profile fetched:', results[0].value.data);
              setUserData({...results[0].value.data, userType: results[0].value.data.userType || 'admin'});
              setProfileLoaded(true);
              return;
            }
            
            // Check employer
            if (results[1].status === 'fulfilled' && !results[1].value.error && results[1].value.data) {
              console.log('✅ Auth state change - Employer profile fetched:', results[1].value.data);
              setUserData({...results[1].value.data, userType: results[1].value.data.usertype || 'employer'});
              setProfileLoaded(true);
              return;
            }
            
            // Check jobseeker
            if (results[2].status === 'fulfilled' && !results[2].value.error && results[2].value.data) {
              console.log('✅ Auth state change - Jobseeker profile fetched:', results[2].value.data);
              setUserData({...results[2].value.data, userType: results[2].value.data.usertype || 'jobseeker'});
              setProfileLoaded(true);
              return;
            }
            
            // No profile found in any table
            console.log('⚠️ Auth state change - No profile found in any table, using default');
            setUserData({
              id: session.user.id,
              email: session.user.email,
              userType: 'jobseeker' // Default to jobseeker if no profile found
            });
            setProfileLoaded(true);
          }).catch(err => {
            console.log('❌ Auth state change - Profile fetch error:', err.message);
            // Set basic user data as fallback
            setUserData({
              id: session.user.id,
              email: session.user.email,
              userType: 'jobseeker' // Default to jobseeker if fetch fails
            });
            setProfileLoaded(true);
          });
        } catch (error) {
          console.error('Error in auth state handler:', error);
          // Keep basic user data, don't reset
        }
      } else {
        setUserData(null);
      }
      
      // Always set loading to false after handling auth state
      console.log('🔄 Setting loading to false after auth state change');
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, [isLoggingIn, accountTypeMismatch]);

  const value = useMemo(() => ({
    currentUser,
    userData,
    loading,
    profileLoaded,
    signup,
    register: signup, // Alias for compatibility
    login,
    logout,
    updateUserProfile,
    updateProfilePicture,
    refreshUserProfile
  }), [currentUser, userData, loading, profileLoaded]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
