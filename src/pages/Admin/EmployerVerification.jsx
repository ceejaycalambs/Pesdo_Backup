import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { supabase } from '../../supabase.js';
import './EmployerVerification.css';

const EmployerVerification = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    under_review: 0
  });

  // Fetch employers needing verification
  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employer_verification_queue')
        .select('*')
        .order('profile_created_at', { ascending: true });

      if (error) throw error;
      setEmployers(data || []);
    } catch (error) {
      console.error('Error fetching employers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch verification statistics
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_verification_stats');
      if (error) throw error;
      setStats(data[0] || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Handle verification
  const handleVerification = async () => {
    try {
      const { error } = await supabase
        .from('employer_profiles')
        .update({
          verification_status: verificationStatus,
          verification_notes: verificationNotes,
          verified_by: currentUser?.id,
          verified_at: verificationStatus === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', selectedEmployer.id);

      if (error) throw error;

      // Refresh data
      await fetchEmployers();
      await fetchStats();
      
      // Close modal
      setShowVerificationModal(false);
      setSelectedEmployer(null);
      setVerificationNotes('');
      setVerificationStatus('pending');
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  // Open verification modal
  const openVerificationModal = (employer) => {
    setSelectedEmployer(employer);
    setVerificationNotes(employer.verification_notes || '');
    setVerificationStatus(employer.verification_status);
    setShowVerificationModal(true);
  };

  useEffect(() => {
    fetchEmployers();
    fetchStats();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: '⏳ Pending', color: '#f59e0b' },
      under_review: { class: 'status-under-review', text: '🔍 Under Review', color: '#3b82f6' },
      approved: { class: 'status-approved', text: '✅ Approved', color: '#10b981' },
      rejected: { class: 'status-rejected', text: '❌ Rejected', color: '#ef4444' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`status-badge ${config.class}`} style={{ backgroundColor: config.color }}>
        {config.text}
      </span>
    );
  };

  const getDocumentStatus = (employer) => {
    const hasBIR = employer.bir_document_url;
    const hasBusinessPermit = employer.business_permit_url;
    
    if (hasBIR && hasBusinessPermit) {
      return <span className="document-status complete">📄 Complete</span>;
    } else {
      return <span className="document-status incomplete">⚠️ Incomplete</span>;
    }
  };

  if (loading) {
    return <div className="loading">Loading employer verification...</div>;
  }

  return (
    <div className="employer-verification">
      <div className="verification-header">
        <h1>🏢 Employer Verification</h1>
        <p>Review and verify employer documents before they can post job vacancies.</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Employers</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="stat-card pending">
          <h3>Pending Review</h3>
          <div className="stat-number">{stats.pending}</div>
        </div>
        <div className="stat-card approved">
          <h3>Approved</h3>
          <div className="stat-number">{stats.approved}</div>
        </div>
        <div className="stat-card rejected">
          <h3>Rejected</h3>
          <div className="stat-number">{stats.rejected}</div>
        </div>
      </div>

      {/* Employers List */}
      <div className="employers-list">
        <h2>Employers Awaiting Verification</h2>
        
        {employers.length === 0 ? (
          <div className="no-employers">
            <div className="no-employers-icon">🎉</div>
            <h3>All caught up!</h3>
            <p>No employers are currently awaiting verification.</p>
          </div>
        ) : (
          <div className="employers-grid">
            {employers.map((employer) => (
              <div key={employer.id} className="employer-card">
                <div className="employer-header">
                  <h3>{employer.business_name}</h3>
                  {getStatusBadge(employer.verification_status)}
                </div>
                
                <div className="employer-details">
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{employer.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Establishment Type:</label>
                    <span>{employer.establishment_type || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Employer Type:</label>
                    <span>{employer.employer_type || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Documents:</label>
                    {getDocumentStatus(employer)}
                  </div>
                  {employer.verification_notes && (
                    <div className="detail-item">
                      <label>Notes:</label>
                      <span className="verification-notes">{employer.verification_notes}</span>
                    </div>
                  )}
                </div>

                <div className="employer-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => openVerificationModal(employer)}
                  >
                    {employer.verification_status === 'pending' ? 'Review Documents' : 'Update Status'}
                  </button>
                  
                  {employer.bir_document_url && (
                    <button 
                      className="btn-secondary"
                      onClick={() => window.open(employer.bir_document_url, '_blank')}
                    >
                      📄 View BIR
                    </button>
                  )}
                  
                  {employer.business_permit_url && (
                    <button 
                      className="btn-secondary"
                      onClick={() => window.open(employer.business_permit_url, '_blank')}
                    >
                      🏢 View Business Permit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {showVerificationModal && selectedEmployer && (
        <div className="modal-overlay" onClick={() => setShowVerificationModal(false)}>
          <div className="modal-content verification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Documents - {selectedEmployer.business_name}</h2>
            </div>
            
            <div className="modal-body">
              <div className="verification-form">
                <div className="form-group">
                  <label>Verification Status</label>
                  <select 
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                    className="form-select"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="under_review">🔍 Under Review</option>
                    <option value="approved">✅ Approved</option>
                    <option value="rejected">❌ Rejected</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Verification Notes</label>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    className="form-textarea"
                    rows="4"
                    placeholder="Add notes about the verification decision..."
                  />
                </div>

                <div className="document-links">
                  <h4>Review Documents:</h4>
                  <div className="document-buttons">
                    {selectedEmployer.bir_document_url && (
                      <button 
                        className="btn-secondary"
                        onClick={() => window.open(selectedEmployer.bir_document_url, '_blank')}
                      >
                        📄 View BIR Document
                      </button>
                    )}
                    {selectedEmployer.business_permit_url && (
                      <button 
                        className="btn-secondary"
                        onClick={() => window.open(selectedEmployer.business_permit_url, '_blank')}
                      >
                        🏢 View Business Permit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowVerificationModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleVerification}
              >
                Update Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerVerification;
