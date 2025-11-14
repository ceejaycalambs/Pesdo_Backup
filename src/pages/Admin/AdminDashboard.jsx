import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase.js';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser: authUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    jobseekers: 0,
    employers: 0,
    totalJobs: 0,
    totalApplications: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [error, setError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [adminRole, setAdminRole] = useState(null); // 'admin' or 'super_admin'

  useEffect(() => {
    checkAdminAuth();
  }, [authUser, userData]);

  // Fetch dashboard data only when admin is authenticated
  useEffect(() => {
    if (adminEmail && authUser) {
      fetchDashboardData();
    }
  }, [adminEmail, authUser]);

  // Prevent trackpad gesture scrolling
  useEffect(() => {
    const preventTrackpadGestures = (e) => {
      // Prevent wheel events with ctrl/meta key (trackpad pinch/zoom gestures)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        return false;
      }
      // Prevent horizontal scrolling from trackpad gestures
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        return false;
      }
    };

    const container = document.querySelector('.admin-dashboard');
    if (container) {
      container.addEventListener('wheel', preventTrackpadGestures, { passive: false });
      container.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
      container.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', preventTrackpadGestures);
      }
    };
  }, []);

  const checkAdminAuth = async () => {
    // Check if user is authenticated via AuthContext
    if (!authUser) {
      // Fallback to localStorage check for backward compatibility
      const authenticated = localStorage.getItem('admin_authenticated');
      const loginTime = localStorage.getItem('admin_login_time');
      const email = localStorage.getItem('admin_email');
      
      if (authenticated === 'true' && loginTime && email) {
        const now = Date.now();
        const loginTimestamp = Number.parseInt(loginTime);
        const hoursSinceLogin = (now - loginTimestamp) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) {
          setAdminEmail(email);
          setLoading(false);
          return;
        } else {
          handleLogout();
          return;
        }
      } else {
        navigate('/admin');
        return;
      }
    }

    // User is authenticated via AuthContext
    if (authUser && userData) {
      // Check if user is an admin
      const userType = userData.usertype || userData.userType;
      if (userType !== 'admin') {
        // Not an admin, redirect to login
        navigate('/admin');
        return;
      }

      setAdminEmail(authUser.email || '');
      
      // Always fetch role from database to ensure it's correct for the current user
      // Don't trust localStorage as it might be stale or from a different user
      try {
        const { data: adminProfile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();
        
        if (!profileError && adminProfile) {
          const role = adminProfile.role || 'admin';
          setAdminRole(role);
          // Only update localStorage if it matches the current user's actual role
          localStorage.setItem('admin_role', role);
        } else {
          // Fallback to userData.role if database fetch fails
          const role = userData.role || 'admin';
          setAdminRole(role);
          localStorage.setItem('admin_role', role);
        }
      } catch (error) {
        console.error('Error fetching admin role:', error);
        // Fallback to userData.role
        const role = userData.role || 'admin';
        setAdminRole(role);
        localStorage.setItem('admin_role', role);
      }
      
      setLoading(false);
    } else {
      // Wait for auth to load
      setLoading(true);
    }
  };

  const fetchDashboardData = async () => {
    try {
      console.log('🔍 Fetching dashboard data...');
      setIsDataLoaded(false);
      
      // Check current user session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('👤 Current user:', user);
      console.log('❌ User error:', userError);

      // Fetch user statistics with names - try to get all available fields
      console.log('📊 Fetching jobseeker profiles...');
      const { data: jobseekerProfiles, error: jobseekerError } = await supabase
        .from('jobseeker_profiles')
        .select('id, first_name, last_name, suffix, email, created_at');

      console.log('👤 Jobseeker profiles:', jobseekerProfiles);
      console.log('❌ Jobseeker error:', jobseekerError);

      console.log('🏢 Fetching employer profiles...');
      const { data: employerProfiles, error: employerError } = await supabase
        .from('employer_profiles')
        .select('id, email, business_name, contact_person_name, created_at');

      console.log('🏢 Employer profiles:', employerProfiles);
      console.log('❌ Employer error:', employerError);

      console.log('👑 Fetching admin profiles...');
      const { data: adminProfiles, error: adminError } = await supabase
        .from('admin_profiles')
        .select('id, first_name, last_name, username, email, created_at');

      console.log('👑 Admin profiles:', adminProfiles);
      console.log('❌ Admin error:', adminError);

      console.log('💼 Fetching jobs...');
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id');

      console.log('💼 Jobs:', jobs);
      console.log('❌ Jobs error:', jobsError);

      console.log('📝 Fetching applications...');
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('id');

      console.log('📝 Applications:', applications);
      console.log('❌ Applications error:', applicationsError);

      // Get recent users (last 5) - exclude admin users
      const allUsers = [
        ...(jobseekerProfiles || [])
          .filter(user => user.first_name || user.last_name)
          .map(user => {
            const parts = [];
            if (user.first_name) parts.push(user.first_name);
            if (user.last_name) parts.push(user.last_name);
            let name = parts.join(' ');
            const suffixValue = user.suffix ? user.suffix.trim() : '';
            if (suffixValue) {
              name = name ? `${name}, ${suffixValue}` : suffixValue;
            }
            return {
              ...user,
              type: 'jobseeker',
              displayName: name || user.email || 'Jobseeker'
            };
          }),
        ...(employerProfiles || [])
          .filter(user => user.business_name || user.contact_person_name)
          .map(user => ({ 
            ...user, 
            type: 'employer',
            displayName: user.business_name || user.contact_person_name || user.email || 'Employer'
          }))
        // Exclude admin profiles from Recent Users display
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      console.log('👥 All users:', allUsers);
      console.log('📊 Setting stats with totalUsers:', allUsers.length);
      console.log('👥 Setting recent users:', allUsers.slice(0, 5));

      setStats({
        totalUsers: allUsers.length, // Use the actual displayed users count
        jobseekers: jobseekerProfiles?.length || 0,
        employers: employerProfiles?.length || 0,
        totalJobs: jobs?.length || 0,
        totalApplications: applications?.length || 0
      });

      setRecentUsers(allUsers.slice(0, 5));
      setError(''); // Clear any previous errors
      setIsDataLoaded(true);
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError(`Failed to load data: ${error.message}`);
      setIsDataLoaded(false);
    }
  };

  const renderRecentUsers = () => {
    if (!isDataLoaded) {
      return (
        <div className="loading-message">
          <p>🔄 Loading users...</p>
        </div>
      );
    }

    if (recentUsers.length > 0) {
      return (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>
                    <span className={`user-type-badge ${user.type}`}>
                      {user.type}
                    </span>
                  </td>
                  <td>{user.displayName}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="no-users-message">
        <p>📝 No users have completed their profiles yet. Users will appear here once they add their basic information.</p>
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      // Clear admin-specific localStorage
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_login_time');
      localStorage.removeItem('admin_email');
      localStorage.removeItem('admin_role');
      
      // Clear Supabase session to prevent authentication conflicts
      await supabase.auth.signOut();
      
      // Clear state
      setAdminEmail('');
      setAdminRole(null);
      
      console.log('Admin logout completed - Supabase session cleared');
      navigate('/admin');
    } catch (error) {
      console.error('Error during admin logout:', error);
      // Still navigate even if there's an error
      navigate('/admin');
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {adminEmail}</p>
          </div>
          <div className="header-right">
            <button onClick={fetchDashboardData} className="refresh-btn">
              🔄 Refresh
            </button>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="admin-dashboard-main">
        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
            <button onClick={fetchDashboardData} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="stats-section">
          <h2>System Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👤</div>
              <div className="stat-content">
                <h3>{stats.jobseekers}</h3>
                <p>Jobseekers</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-content">
                <h3>{stats.employers}</h3>
                <p>Employers</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💼</div>
              <div className="stat-content">
                <h3>{stats.totalJobs}</h3>
                <p>Total Jobs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <h3>{stats.totalApplications}</h3>
                <p>Applications</p>
              </div>
          </div>
          </div>
          </div>

                {/* Recent Users */}
                <div className="recent-users-section">
                  <h2>Recent Users</h2>
                  {renderRecentUsers()}
          </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
                    <button className="action-card" onClick={() => navigate('/admin/users')}>
                      <div className="action-icon">👥</div>
                      <h3>Manage Users</h3>
                      <p>View and manage all user accounts</p>
                    </button>
            <button className="action-card" onClick={() => navigate('/admin/users?tab=employers')}>
              <div className="action-icon">🏢</div>
              <h3>Manage Employers</h3>
              <p>View and manage employer accounts</p>
            </button>
            <button className="action-card" onClick={() => navigate('/admin/jobs')}>
              <div className="action-icon">💼</div>
              <h3>Manage Jobs</h3>
              <p>View and manage job postings</p>
            </button>
            <button className="action-card" onClick={() => navigate('/admin/verification')}>
              <div className="action-icon">🔍</div>
              <h3>Employer Verification</h3>
              <p>Review and verify employer documents</p>
            </button>
            <button className="action-card" onClick={() => navigate('/admin/analytics')}>
              <div className="action-icon">📊</div>
              <h3>Analytics</h3>
              <p>View system analytics and reports</p>
            </button>
            {adminRole === 'super_admin' && (
              <button className="action-card" onClick={() => navigate('/admin/logs')}>
                <div className="action-icon">📋</div>
                <h3>System Logs</h3>
                <p>View activity and login logs</p>
              </button>
            )}
            {adminRole === 'super_admin' && (
              <button className="action-card" onClick={() => navigate('/admin/settings')}>
                <div className="action-icon">⚙️</div>
                <h3>Admin Management</h3>
                <p>Manage admin accounts</p>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

