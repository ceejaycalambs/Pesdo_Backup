import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase.js';
import './AdminDashboard.css';
import './AdminAnalytics.css';

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState('jobseekers');
  const [analyticsData, setAnalyticsData] = useState({
    jobseekers: [],
    employers: [],
    vacancies: [],
    referrals: [],
    placements: []
  });
  const [jobseekerDateRange, setJobseekerDateRange] = useState({ from: '', to: '' });
  const [employerDateRange, setEmployerDateRange] = useState({ from: '', to: '' });

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (adminEmail && currentUser) {
      fetchAnalyticsData();
    }
  }, [adminEmail, currentUser]);

  const checkAdminAuth = async () => {
    const authenticated = localStorage.getItem('admin_authenticated');
    const loginTime = localStorage.getItem('admin_login_time');
    const email = localStorage.getItem('admin_email');

    if (authenticated === 'true' && loginTime && email) {
      const now = Date.now();
      const loginTimestamp = Number.parseInt(loginTime);
      const hoursSinceLogin = (now - loginTimestamp) / (1000 * 60 * 60);

      if (hoursSinceLogin < 24) {
        setAdminEmail(email);

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@pesdo.com',
            password: 'admin123'
          });

          if (error) {
            console.error('Admin Supabase auth error:', error);
            console.log('Please run the create_admin_user.sql script in Supabase SQL Editor first');
          } else {
            setCurrentUser(data.user);
          }
        } catch (authError) {
          console.error('Admin auth error:', authError);
        }

        setLoading(false);
      } else {
        handleLogout();
      }
    } else {
      navigate('/admin');
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      setIsDataLoaded(false);

      const { data: jobseekerProfiles, error: jobseekerError } = await supabase
        .from('jobseeker_profiles')
        .select('id, first_name, last_name, suffix, email, phone, address, gender, civil_status, education, status, created_at');

      if (jobseekerError) {
        console.error('Error fetching jobseeker profiles:', jobseekerError);
      }

      const { data: employerProfiles, error: employerError } = await supabase
        .from('employer_profiles')
        .select('*');

      if (employerError) {
        console.error('Error fetching employer profiles:', employerError);
      }

      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select(`
          *,
          employer_profiles ( business_name, acronym, full_address )
        `)
        .eq('status', 'approved');

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
      }

      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select('id, status, job_id, jobseeker_id, applied_at, created_at');

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
      }

      const formatJobseekerName = (profile) => {
        const parts = [];
        if (profile.first_name) parts.push(profile.first_name);
        if (profile.last_name) parts.push(profile.last_name);
        let name = parts.join(' ');
        const suffixValue = profile.suffix ? profile.suffix.trim() : '';
        if (suffixValue) {
          name = name ? `${name}, ${suffixValue}` : suffixValue;
        }
        return name;
      };

      const jobseekerList = (jobseekerProfiles || []).map(profile => ({
        id: profile.id,
        name: formatJobseekerName(profile) || profile.email || 'Jobseeker',
        email: profile.email || '—',
        phone: profile.phone || '—',
        address: profile.address || '—',
        gender: profile.gender || '—',
        civilStatus: profile.civil_status || '—',
        education: profile.education || '—',
        employmentStatus: profile.status === true ? 'Currently Employed' : 'Looking for Work',
        registeredAt: profile.created_at
      }));

      const employerList = (employerProfiles || []).map(profile => ({
        id: profile.id,
        businessName: profile.business_name || '—',
        acronym: profile.acronym || '—',
        establishmentType: profile.establishment_type || '—',
        tin: profile.tin || '—',
        employerType: profile.employer_type || '—',
        totalWorkforce: profile.total_workforce || '—',
        lineOfBusiness: profile.line_of_business || '—',
        fullAddress: profile.full_address || '—',
        ownerName: profile.owner_president_name || '—',
        contactPerson: profile.contact_person_name || '—',
        contactPosition: profile.contact_position || '—',
        telephone: profile.telephone_number || '—',
        mobile: profile.mobile_number || '—',
        fax: profile.fax_number || '—',
        contactEmail: profile.contact_email || profile.email || '—',
        registeredAt: profile.created_at,
        updatedAt: profile.updated_at || null
      }));

      const vacancyList = (jobs || []).map(job => ({
        id: job.id,
        jobPosition: job.position_title || job.title || job.job_title || 'Untitled Vacancy',
        employerName: job.employer_profiles?.business_name || '—',
        employerAcronym: job.employer_profiles?.acronym || '—',
        employerAddress: job.employer_profiles?.full_address || '—',
        jobLocation: job.job_location || job.work_location || job.place_of_work || '—',
        employmentType: job.employment_type || job.employment_type_text || job.nature_of_work || '—',
        vacancyCount: job.vacancy_count || job.total_positions || '—',
        salaryRange: job.salary_range || job.salary || '—',
        description: job.job_description || job.description || '—',
        qualifications: job.other_qualifications || job.qualifications || '—',
        education: job.educational_level || '—',
        experience: job.work_experience_months || job.required_experience || '—',
        acceptsPwd: job.accepts_pwd ? 'Yes' : 'No',
        acceptsOfw: job.accepts_ofw ? 'Yes' : 'No',
        license: job.license || '—',
        eligibility: job.eligibility || '—',
        certification: job.certification || '—',
        languages: job.language_dialect || '—',
        postedAt: job.created_at,
        validUntil: job.valid_until || '—',
        status: job.status || 'approved'
      }));

      const jobMap = new Map(vacancyList.map(job => [job.id, job]));
      const jobseekerMap = new Map((jobseekerProfiles || []).map(profile => [profile.id, profile]));

      const referralStatuses = new Set(['referred']);
      const placementStatuses = new Set(['accepted', 'hired', 'placed']);

      const referralList = (applications || [])
        .filter(app => referralStatuses.has((app.status || '').toLowerCase()))
        .map(app => {
          const job = jobMap.get(app.job_id) || {};
          const seeker = jobseekerMap.get(app.jobseeker_id) || {};
          const seekerName = formatJobseekerName(seeker) || seeker.email || 'Jobseeker';

          return {
            id: app.id,
            jobTitle: job.title || job.job_title || 'Job Vacancy',
            jobseeker: seekerName,
            appliedAt: app.applied_at || app.created_at
          };
        });

      const placementList = (applications || [])
        .filter(app => placementStatuses.has((app.status || '').toLowerCase()))
        .map(app => {
          const job = jobMap.get(app.job_id) || {};
          const seeker = jobseekerMap.get(app.jobseeker_id) || {};
          const seekerName = formatJobseekerName(seeker) || seeker.email || 'Jobseeker';

          return {
            id: app.id,
            jobTitle: job.title || job.job_title || 'Job Vacancy',
            jobseeker: seekerName,
            status: app.status || 'Completed',
            appliedAt: app.applied_at || app.created_at
          };
        });

      setAnalyticsData({
        jobseekers: jobseekerList,
        employers: employerList,
        vacancies: vacancyList,
        referrals: referralList,
        placements: placementList
      });

      setError('');
      setIsDataLoaded(true);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError(`Failed to load analytics: ${err.message}`);
      setIsDataLoaded(false);
    }
  };

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('admin_authenticated');
      localStorage.removeItem('admin_login_time');
      localStorage.removeItem('admin_email');
      await supabase.auth.signOut();
      setCurrentUser(null);
      setAdminEmail('');
      navigate('/admin');
    } catch (err) {
      console.error('Error during admin logout:', err);
      navigate('/admin');
    }
  };

  const analyticsCounts = {
    jobseekers: analyticsData.jobseekers.length,
    employers: analyticsData.employers.length,
    vacancies: analyticsData.vacancies.length,
    referrals: analyticsData.referrals.length,
    placements: analyticsData.placements.length
  };

  const analyticsConfig = {
    jobseekers: {
      label: 'Registered Jobseekers',
      description: 'List of jobseekers who have created their accounts.',
      columns: [
        { header: 'Name', accessor: item => item.name, csvAccessor: item => item.name || '' },
        { header: 'Email', accessor: item => item.email, csvAccessor: item => item.email || '' },
        { header: 'Phone', accessor: item => item.phone || '—', csvAccessor: item => item.phone || '' },
        { header: 'Address', accessor: item => item.address || '—', csvAccessor: item => item.address || '' },
        { header: 'Gender', accessor: item => item.gender || '—', csvAccessor: item => item.gender || '' },
        { header: 'Civil Status', accessor: item => item.civilStatus || '—', csvAccessor: item => item.civilStatus || '' },
        { header: 'Education', accessor: item => item.education || '—', csvAccessor: item => item.education || '' },
        { header: 'Employment Status', accessor: item => item.employmentStatus || '—', csvAccessor: item => item.employmentStatus || '' },
        { header: 'Registered On', accessor: item => item.registeredAt ? new Date(item.registeredAt).toLocaleDateString('en-CA') : '—', csvAccessor: item => item.registeredAt ? new Date(item.registeredAt).toISOString().split('T')[0] : '' }
      ],
      empty: 'No jobseekers registered yet.'
    },
    employers: {
      label: 'Registered Employers',
      description: 'Businesses and organizations registered in the system.',
      columns: [
        { header: 'Business Name', accessor: item => item.businessName, csvAccessor: item => item.businessName || '' },
        { header: 'Acronym', accessor: item => item.acronym || '—', csvAccessor: item => item.acronym || '' },
        { header: 'Establishment Type', accessor: item => item.establishmentType || '—', csvAccessor: item => item.establishmentType || '' },
        { header: 'TIN', accessor: item => item.tin || '—', csvAccessor: item => item.tin || '' },
        { header: 'Employer Type', accessor: item => item.employerType || '—', csvAccessor: item => item.employerType || '' },
        { header: 'Total Workforce', accessor: item => item.totalWorkforce || '—', csvAccessor: item => item.totalWorkforce || '' },
        { header: 'Line of Business', accessor: item => item.lineOfBusiness || '—', csvAccessor: item => item.lineOfBusiness || '' },
        { header: 'Full Address', accessor: item => item.fullAddress || '—', csvAccessor: item => item.fullAddress || '' },
        { header: 'Owner/President', accessor: item => item.ownerName || '—', csvAccessor: item => item.ownerName || '' },
        { header: 'Contact Person', accessor: item => item.contactPerson || '—', csvAccessor: item => item.contactPerson || '' },
        { header: 'Contact Position', accessor: item => item.contactPosition || '—', csvAccessor: item => item.contactPosition || '' },
        { header: 'Telephone Number', accessor: item => item.telephone || '—', csvAccessor: item => item.telephone || '' },
        { header: 'Mobile Number', accessor: item => item.mobile || '—', csvAccessor: item => item.mobile || '' },
        { header: 'Fax Number', accessor: item => item.fax || '—', csvAccessor: item => item.fax || '' },
        { header: 'Contact Email', accessor: item => item.contactEmail || '—', csvAccessor: item => item.contactEmail || '' },
        { header: 'Registered On', accessor: item => item.registeredAt ? new Date(item.registeredAt).toLocaleDateString('en-CA') : '—', csvAccessor: item => item.registeredAt ? new Date(item.registeredAt).toISOString().split('T')[0] : '' },
        { header: 'Last Updated', accessor: item => item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-CA') : '—', csvAccessor: item => item.updatedAt ? new Date(item.updatedAt).toISOString().split('T')[0] : '' }
      ],
      empty: 'No employers registered yet.'
    },
    vacancies: {
      label: 'Vacancies Solicited',
      description: 'Approved job vacancies submitted by employers.',
      columns: [
        { header: 'Job Position', accessor: item => item.jobPosition, csvAccessor: item => item.jobPosition || '' },
        { header: 'Employer', accessor: item => item.employerName || '—', csvAccessor: item => item.employerName || '' },
        { header: 'Acronym', accessor: item => item.employerAcronym || '—', csvAccessor: item => item.employerAcronym || '' },
        { header: 'Employer Address', accessor: item => item.employerAddress || '—', csvAccessor: item => item.employerAddress || '' },
        { header: 'Job Location', accessor: item => item.jobLocation || '—', csvAccessor: item => item.jobLocation || '' },
        { header: 'Nature of Work', accessor: item => item.employmentType || '—', csvAccessor: item => item.employmentType || '' },
        { header: 'Vacancies', accessor: item => item.vacancyCount || '—', csvAccessor: item => item.vacancyCount || '' },
        { header: 'Salary Range', accessor: item => item.salaryRange || '—', csvAccessor: item => item.salaryRange || '' },
        { header: 'Education', accessor: item => item.education || '—', csvAccessor: item => item.education || '' },
        { header: 'Experience (months)', accessor: item => item.experience || '—', csvAccessor: item => item.experience || '' },
        { header: 'Accepts PWD', accessor: item => item.acceptsPwd || '—', csvAccessor: item => item.acceptsPwd || '' },
        { header: 'Accepts OFW', accessor: item => item.acceptsOfw || '—', csvAccessor: item => item.acceptsOfw || '' },
        { header: 'License', accessor: item => item.license || '—', csvAccessor: item => item.license || '' },
        { header: 'Eligibility', accessor: item => item.eligibility || '—', csvAccessor: item => item.eligibility || '' },
        { header: 'Certification', accessor: item => item.certification || '—', csvAccessor: item => item.certification || '' },
        { header: 'Languages', accessor: item => item.languages || '—', csvAccessor: item => item.languages || '' },
        { header: 'Qualifications', accessor: item => item.qualifications || '—', csvAccessor: item => item.qualifications || '' },
        { header: 'Description', accessor: item => item.description || '—', csvAccessor: item => item.description || '' },
        { header: 'Posted On', accessor: item => item.postedAt ? new Date(item.postedAt).toLocaleDateString('en-CA') : '—', csvAccessor: item => item.postedAt ? new Date(item.postedAt).toISOString().split('T')[0] : '' },
        { header: 'Valid Until', accessor: item => item.validUntil && item.validUntil !== '—' ? new Date(item.validUntil).toLocaleDateString('en-CA') : '—', csvAccessor: item => item.validUntil && item.validUntil !== '—' ? new Date(item.validUntil).toISOString().split('T')[0] : '' }
      ],
      empty: 'No approved job vacancies found.'
    },
    referrals: {
      label: 'Referrals',
      description: 'Applications referred by the admin team.',
      columns: [
        { header: 'Job Position', accessor: item => item.jobPosition },
        { header: 'Jobseeker', accessor: item => item.jobseeker },
        { header: 'Referral Date', accessor: item => item.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : '—' }
      ],
      empty: 'No referrals recorded yet.'
    },
    placements: {
      label: 'Job Placements',
      description: 'Successful job placements recorded within the system.',
      columns: [
        { header: 'Job Position', accessor: item => item.jobPosition },
        { header: 'Jobseeker', accessor: item => item.jobseeker },
        { header: 'Status', accessor: item => (item.status || 'Completed').toUpperCase() },
        { header: 'Date', accessor: item => item.appliedAt ? new Date(item.appliedAt).toLocaleDateString() : '—' }
      ],
      empty: 'No job placements recorded yet.'
    }
  };

  const getFilteredRows = () => {
    let rows = analyticsData[analyticsTab] || [];
    if (analyticsTab === 'jobseekers') {
      const fromTime = jobseekerDateRange.from ? new Date(`${jobseekerDateRange.from}T00:00:00`).getTime() : null;
      const toTime = jobseekerDateRange.to ? new Date(`${jobseekerDateRange.to}T23:59:59`).getTime() : null;
      rows = rows.filter(item => {
        if (!item.registeredAt) return false;
        const itemTime = new Date(item.registeredAt).getTime();
        if (Number.isNaN(itemTime)) return false;
        if (fromTime && itemTime < fromTime) return false;
        if (toTime && itemTime > toTime) return false;
        return true;
      });
    } else if (analyticsTab === 'employers') {
      const fromTime = employerDateRange.from ? new Date(`${employerDateRange.from}T00:00:00`).getTime() : null;
      const toTime = employerDateRange.to ? new Date(`${employerDateRange.to}T23:59:59`).getTime() : null;
      rows = rows.filter(item => {
        if (!item.registeredAt) return false;
        const itemTime = new Date(item.registeredAt).getTime();
        if (Number.isNaN(itemTime)) return false;
        if (fromTime && itemTime < fromTime) return false;
        if (toTime && itemTime > toTime) return false;
        return true;
      });
    } else if (analyticsTab === 'vacancies') {
      const fromTime = employerDateRange.from ? new Date(`${employerDateRange.from}T00:00:00`).getTime() : null;
      const toTime = employerDateRange.to ? new Date(`${employerDateRange.to}T23:59:59`).getTime() : null;
      rows = rows.filter(item => {
        if (!item.postedAt) return false;
        const itemTime = new Date(item.postedAt).getTime();
        if (Number.isNaN(itemTime)) return false;
        if (fromTime && itemTime < fromTime) return false;
        if (toTime && itemTime > toTime) return false;
        return true;
      });
    }
    return rows;
  };

  const handleExportCsv = () => {
    const activeConfig = analyticsConfig[analyticsTab];
    if (!activeConfig) return;
    const rows = getFilteredRows();
    if (!rows.length) return;

    const headers = activeConfig.columns.map(col => col.header);
    const csvLines = [headers.join(',')];

    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      let stringValue = String(value).trim();
      stringValue = stringValue
        .replaceAll('\r\n', ' ')
        .replaceAll('\n', ' ')
        .replaceAll('\r', ' ');

      if (stringValue.includes(',') || stringValue.includes('"')) {
        return `"${stringValue.replaceAll('"', '""')}"`;
      }
      return stringValue;
    };

    for (const row of rows) {
    const line = activeConfig.columns
        .map(col => escapeCsv(col.csvAccessor ? col.csvAccessor(row) : col.accessor(row)))
        .join(',');
      csvLines.push(line);
    }

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analyticsTab}-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const renderAnalyticsTable = () => {
    if (!isDataLoaded) {
      return (
        <div className="analytics-loading">
          <p>Loading analytics data...</p>
        </div>
      );
    }

    const activeConfig = analyticsConfig[analyticsTab];
    const rows = getFilteredRows();

    if (!rows.length) {
      return <div className="analytics-empty">{activeConfig.empty}</div>;
    }

    return (
      <table className="analytics-table">
        <thead>
          <tr>
            {activeConfig.columns.map(col => (
              <th key={col.header}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(item => (
            <tr key={item.id || JSON.stringify(item)}>
              {activeConfig.columns.map(col => (
                <td key={col.header}>{col.accessor(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard admin-analytics-page">
      <header className="admin-dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Analytics &amp; Reports</h1>
            <p>Welcome back, {adminEmail}</p>
          </div>
          <div className="header-right">
            <button onClick={handleRefresh} className="refresh-btn">
              🔄 Refresh
            </button>
            <button onClick={() => navigate('/admin/dashboard')} className="analytics-back-btn">
              ← Back to Dashboard
            </button>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <main className="admin-dashboard-main analytics-main">
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
            <button onClick={handleRefresh} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        <section className="analytics-section">
          <h2>System Analytics</h2>
          <div className="analytics-tabs">
            {Object.keys(analyticsConfig).map(key => (
              <button
                key={key}
                type="button"
                className={`analytics-tab ${analyticsTab === key ? 'active' : ''}`}
                onClick={() => setAnalyticsTab(key)}
              >
                {analyticsConfig[key].label}
                <span className="analytics-tab-count">{analyticsCounts[key]}</span>
              </button>
            ))}
          </div>
          <div className="analytics-tab-description">
            {analyticsConfig[analyticsTab].description}
          </div>
          {(analyticsTab === 'jobseekers' || analyticsTab === 'employers' || analyticsTab === 'vacancies') && (
            <div className="analytics-filters">
              <div className="date-filter-group">
                <label htmlFor="jobseeker-from">From</label>
                <input
                  id="jobseeker-from"
                  type="date"
                  value={analyticsTab === 'jobseekers' ? jobseekerDateRange.from : employerDateRange.from}
                  onChange={(e) => {
                    if (analyticsTab === 'jobseekers') {
                      setJobseekerDateRange(prev => ({ ...prev, from: e.target.value }));
                    } else {
                      setEmployerDateRange(prev => ({ ...prev, from: e.target.value }));
                    }
                  }}
                />
              </div>
              <div className="date-filter-group">
                <label htmlFor="jobseeker-to">To</label>
                <input
                  id="jobseeker-to"
                  type="date"
                  value={analyticsTab === 'jobseekers' ? jobseekerDateRange.to : employerDateRange.to}
                  onChange={(e) => {
                    if (analyticsTab === 'jobseekers') {
                      setJobseekerDateRange(prev => ({ ...prev, to: e.target.value }));
                    } else {
                      setEmployerDateRange(prev => ({ ...prev, to: e.target.value }));
                    }
                  }}
                  min={(analyticsTab === 'jobseekers' ? jobseekerDateRange.from : employerDateRange.from) || undefined}
                />
              </div>
              <button
                type="button"
                className="analytics-export-btn"
                onClick={handleExportCsv}
              >
                ⬇️ Download CSV
              </button>
              <button
                type="button"
                className="analytics-reset-btn"
                onClick={() => {
                  if (analyticsTab === 'jobseekers') {
                    setJobseekerDateRange({ from: '', to: '' });
                  } else {
                    setEmployerDateRange({ from: '', to: '' });
                  }
                }}
                disabled={analyticsTab === 'jobseekers'
                  ? !jobseekerDateRange.from && !jobseekerDateRange.to
                  : !employerDateRange.from && !employerDateRange.to}
              >
                Reset
              </button>
            </div>
          )}
          <div className="analytics-table-wrapper">
            <div className="analytics-table-container">
              {renderAnalyticsTable()}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminAnalytics;

