import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLanding.css';
import Logo_pesdo from '../../assets/Logo_pesdo.png';
import Pesdo_Office from '../../assets/Pesdo_Office.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminLanding = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    AOS.init({
      duration: prefersReducedMotion ? 0 : 1000,
      once: false,
      mirror: true,
      disable: prefersReducedMotion
    });

    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
      setHeaderScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Admin credentials (in production, use proper authentication)
  const ADMIN_CREDENTIALS = {
    email: 'admin@pesdo.com',
    password: 'admin123'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Store admin session
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_login_time', Date.now().toString());
      localStorage.setItem('admin_email', email);
      
      // Navigate to admin dashboard
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Please check your email and password.');
    }

    setLoading(false);
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-landing">
      <a href="#main" className="skip-link">Skip to main content</a>
      {/* Fixed Navigation */}
      <header className={`admin-header ${headerScrolled ? 'scrolled' : ''}`} role="banner" aria-label="Admin header">
        <div className="admin-header-content">
          <div className="admin-header-brand">
            <img src={Logo_pesdo} alt="PESDO Logo" className="admin-header-logo" />
            <h1>PESDO Admin Portal</h1>
          </div>
          <nav aria-label="Admin navigation">
            <button 
              onClick={() => navigate('/')}
              className="btn btn-outline"
            >
              ← Back to Main Site
            </button>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero Section */}
        <section
          className="admin-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${Pesdo_Office})`
          }}
          aria-label="Admin Hero"
        >
          <div className="admin-hero-content" data-aos="fade-up">
            <h2>Administrative Access Portal</h2>
            <p>Secure access to system administration and management tools.</p>
          </div>
          <a className="scroll-down" href="#admin-login" aria-label="Scroll to login form">↓</a>
        </section>

        {/* Admin Login Section */}
        <section id="admin-login" className="admin-login-section" aria-label="Admin login" data-aos="fade-up">
          <div className="admin-login-container">
            <div className="admin-login-card">
              <div className="login-header">
                <h3>🔐 Admin Login</h3>
                <p>Enter your administrative credentials to access the admin dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="admin-login-form">
                <div className="form-group">
                  <label htmlFor="admin-email">Admin Email</label>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@pesdo.com"
                    required
                    disabled={loading}
                    className="admin-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="admin-password">Password</label>
                  <div className="password-input-container">
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                      className="admin-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                      disabled={loading}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading || !email.trim() || !password.trim()}
                  className="admin-login-btn"
                >
                  {loading ? (
                    <div className="loading-content">
                      <div className="loading-spinner"></div>
                      Authenticating...
                    </div>
                  ) : (
                    'Access Admin Dashboard'
                  )}
                </button>
              </form>

              <div className="login-footer">
                <div className="demo-credentials">
                  <h4>Demo Credentials:</h4>
                  <p><strong>Email:</strong> admin@pesdo.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Admin Features Section */}
        <section className="admin-features" aria-label="Admin features" data-aos="fade-up">
          <h3>Admin Dashboard Features</h3>
          <ul className="admin-feature-cards">
            <li className="admin-card" data-aos="fade-up">
              <div className="admin-card-icon" aria-hidden="true">👥</div>
              <h4 className="admin-card-title">User Management</h4>
              <p className="admin-card-desc">View, manage, and delete user accounts</p>
            </li>
            <li className="admin-card" data-aos="fade-up" data-aos-delay="100">
              <div className="admin-card-icon" aria-hidden="true">📊</div>
              <h4 className="admin-card-title">Analytics</h4>
              <p className="admin-card-desc">Monitor system usage and statistics</p>
            </li>
            <li className="admin-card" data-aos="fade-up" data-aos-delay="200">
              <div className="admin-card-icon" aria-hidden="true">⚙️</div>
              <h4 className="admin-card-title">System Settings</h4>
              <p className="admin-card-desc">Configure application settings</p>
            </li>
            <li className="admin-card" data-aos="fade-up" data-aos-delay="300">
              <div className="admin-card-icon" aria-hidden="true">🔒</div>
              <h4 className="admin-card-title">Security</h4>
              <p className="admin-card-desc">Manage security and access controls</p>
            </li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="admin-footer" data-aos="fade-up">
        <p>© 2025 PESDO Surigao City | Administrative Access Only</p>
      </footer>

      {/* Scroll-to-Top Button */}
      {showScroll && (
        <button className="scroll-top" onClick={scrollTop} aria-label="Scroll back to top">
          ↑
        </button>
      )}
    </div>
  );
};

export default AdminLanding;

