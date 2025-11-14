import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import Pesdo_Office from '../assets/Pesdo_Office.png';
import Logo_pesdo from '../assets/Logo_pesdo.png';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { supabase } from '../supabase';

const LandingPage = () => {
    const [showScroll, setShowScroll] = useState(false);
    const [footerVisible, setFooterVisible] = useState(false);
    const [headerScrolled, setHeaderScrolled] = useState(false);
    const [stats, setStats] = useState({ jobseekers: 0, employers: 0, openJobs: 0 });
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            // Update footer visibility hint (kept for fade effect if needed)
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
                setFooterVisible(true);
            } else {
                setFooterVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch data from Supabase
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Get stats and recent jobs
                const { data: users } = await supabase.from('jobseeker_profiles').select('id');
                const { data: jobs } = await supabase.from('jobs').select('id');
                const { data: jobsData } = await supabase
                  .from('jobs')
                  .select('*')
                  .order('created_at', { ascending: false })
                  .limit(3);
                
                const statsData = {
                  jobseekers: users?.length || 0,
                  employers: 0,
                  openJobs: jobs?.length || 0
                };
                
                setStats(statsData);
                setRecentJobs(jobsData);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load data. Please try again later.');
                // Fallback to static data
                setStats({ jobseekers: 8500, employers: 120, openJobs: 300 });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="landing-page">
            <a href="#main" className="skip-link">Skip to main content</a>
            {/* Fixed Navigation */}
            <header className={`header ${headerScrolled ? 'scrolled' : ''}`} role="banner" aria-label="Primary header">
                <div className="header-brand">
                    <img src={Logo_pesdo} alt="PESDO Logo" className="header-logo" />
                    <h1>PESDO Web Portal</h1>
                </div>
                <nav aria-label="Primary navigation">
                    <Link className="btn" to="/register">Register</Link>
                    <div className="login-dropdown">
                        <button className="btn btn-outline login-dropdown-btn">Login</button>
                        <div className="login-dropdown-content">
                            <Link to="/login/jobseeker" className="login-option">
                                <span className="login-icon">👤</span>
                                <span className="login-text">
                                    <strong>Jobseeker Login</strong>
                                    <small>Find your dream job</small>
                                </span>
                            </Link>
                            <Link to="/login/employer" className="login-option">
                                <span className="login-icon">🏢</span>
                                <span className="login-text">
                                    <strong>Employer Login</strong>
                                    <small>Manage your business</small>
                                </span>
                            </Link>
                            <Link to="/admin" className="login-option admin-option">
                                <span className="login-icon">⚙️</span>
                                <span className="login-text">
                                    <strong>Admin Login</strong>
                                    <small>System administration</small>
                                </span>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main id="main">
                {/* Hero Section - Full Width with Background */}
                <section
                    className="hero"
                    style={{
                        backgroundImage: `url(${Pesdo_Office})`
                    }}
                    aria-label="Hero"
                >
                    <div className="hero-overlay"></div>
                    <div className="hero-container">
                        <div className="hero-content" data-aos="fade-up">
                            <h2>Your Gateway to Employment in Surigao City</h2>
                            <p>Connecting job seekers with the right opportunities. Join thousands who have found their dream jobs through PESDO.</p>
                            <div className="hero-cta">
                                <Link className="btn btn-accent" to="/register" aria-label="Register as a new user">Get Started</Link>
                                <div className="login-options">
                                    <Link className="btn btn-light" to="/login/jobseeker" aria-label="Login as jobseeker">
                                        <span className="btn-icon">👤</span>
                                        <span className="btn-text">Jobseeker Login</span>
                                    </Link>
                                    <Link className="btn btn-light" to="/login/employer" aria-label="Login as employer">
                                        <span className="btn-icon">🏢</span>
                                        <span className="btn-text">Employer Login</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a className="scroll-down" href="#features" aria-label="Scroll to features">↓</a>
                </section>

                {/* Stats Section - First after hero */}
                <section className="stats-section" aria-label="Key statistics" data-aos="fade-up">
                    <div className="stats-container">
                        {loading ? (
                            <div className="stats-loading">Loading statistics...</div>
                        ) : error ? (
                            <div className="stats-error">{error}</div>
                        ) : (
                            <>
                                <div className="stat-card" aria-label="Registered jobseekers">
                                    <div className="stat-number">{stats.jobseekers.toLocaleString()}+</div>
                                    <div className="stat-label">Jobseekers</div>
                                </div>
                                <div className="stat-card" aria-label="Active employers">
                                    <div className="stat-number">{stats.employers.toLocaleString()}+</div>
                                    <div className="stat-label">Employers</div>
                                </div>
                                <div className="stat-card" aria-label="Open job postings">
                                    <div className="stat-number">{stats.openJobs.toLocaleString()}+</div>
                                    <div className="stat-label">Open Jobs</div>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="features-section" aria-label="Services" data-aos="fade-up">
                    <div className="section-container">
                        <h2 className="section-title">Our Services</h2>
                        <p className="section-subtitle">Everything you need to find the perfect job or the perfect candidate</p>
                        <div className="features-grid">
                            <div className="feature-card" data-aos="fade-up">
                                <div className="feature-icon">📝</div>
                                <h3 className="feature-title">Jobseekers Registration</h3>
                                <p className="feature-desc">Sign up and create your profile to start applying for jobs.</p>
                            </div>
                            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
                                <div className="feature-icon">🔎</div>
                                <h3 className="feature-title">Job Vacancies Listing</h3>
                                <p className="feature-desc">Browse verified, up-to-date postings tailored to your skills.</p>
                            </div>
                            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
                                <div className="feature-icon">🤝</div>
                                <h3 className="feature-title">Referrals & Matching</h3>
                                <p className="feature-desc">Get matched with roles and referred by our PESDO network.</p>
                            </div>
                            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
                                <div className="feature-icon">📊</div>
                                <h3 className="feature-title">Employment Reports</h3>
                                <p className="feature-desc">Access employment trends and reports for informed decisions.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="how-it-works-section" aria-label="How it works" data-aos="fade-up">
                    <div className="section-container">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">Simple steps to get you started on your employment journey</p>
                        <div className="steps-grid">
                            <div className="step-card" data-aos="fade-up">
                                <div className="step-number">1</div>
                                <h3 className="step-title">Create your profile</h3>
                                <p className="step-desc">Register and complete your details to be visible to employers.</p>
                            </div>
                            <div className="step-card" data-aos="fade-up" data-aos-delay="100">
                                <div className="step-number">2</div>
                                <h3 className="step-title">Explore job listings</h3>
                                <p className="step-desc">Browse curated vacancies matched to your skills and interests.</p>
                            </div>
                            <div className="step-card" data-aos="fade-up" data-aos-delay="200">
                                <div className="step-number">3</div>
                                <h3 className="step-title">Get referred and hired</h3>
                                <p className="step-desc">We facilitate referrals and job matching to accelerate hiring.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Jobs Preview */}
                {recentJobs.length > 0 && (
                    <section className="jobs-section" aria-label="Recent job opportunities" data-aos="fade-up">
                        <div className="section-container">
                            <h2 className="section-title">Latest Opportunities</h2>
                            <p className="section-subtitle">Discover the newest job openings in Surigao City</p>
                            <div className="jobs-grid">
                                {recentJobs.map((job) => (
                                    <div key={job.id} className="job-card" data-aos="fade-up">
                                        <h3 className="job-title">{job.position_title || job.title}</h3>
                                        <p className="job-company">{job.company_name || 'Company'}</p>
                                        <p className="job-location">{job.place_of_work || job.location || 'Location TBD'}</p>
                                        <p className="job-salary">{job.salary_range || 'Salary negotiable'}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="jobs-cta">
                                <Link to="/jobseeker" className="btn btn-primary">View All Jobs</Link>
                            </div>
                        </div>
                    </section>
                )}

                {/* Partners */}
                <section className="partners-section" aria-label="Partner organizations" data-aos="fade-up">
                    <div className="partners-container">
                        <span className="partners-label">Trusted by</span>
                        <div className="partners-list">
                            <span className="partner-badge">PESDO</span>
                            <span className="partner-badge">LGU Surigao</span>
                            <span className="partner-badge">DOLE</span>
                            <span className="partner-badge">TESDA</span>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="cta-section" aria-label="Get started" data-aos="fade-up">
                    <div className="cta-container">
                        <h2 className="cta-title">Ready to take the next step?</h2>
                        <p className="cta-subtitle">Create your account or log in to continue your employment journey</p>
                        <div className="cta-actions">
                            <Link className="btn btn-accent-large" to="/register">Create free account</Link>
                            <div className="cta-login-options">
                                <Link className="btn btn-outline-light" to="/login/jobseeker">
                                    <span className="btn-icon">👤</span>
                                    <span>Jobseeker Login</span>
                                </Link>
                                <Link className="btn btn-outline-light" to="/login/employer">
                                    <span className="btn-icon">🏢</span>
                                    <span>Employer Login</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer
                className={`footer ${footerVisible ? 'fade-in' : 'fade-out'}`}
                data-aos="fade-up"
            >
                <p>© 2025 PESDO Surigao City | Contact: peso_surigao@yahoo.com</p>
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

export default LandingPage;
