import React, { useState, useEffect } from "react";
import "./SessionDialog.css";

export default function SessionDialog({ session, onClose }) {
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  // Add safe session data with defaults
  const safeSession = session || {};
  
  // Close dialog when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Not scheduled';
    
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      const formattedTime = timeString || date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return `${formattedDate} at ${formattedTime}`;
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleJoin = () => {
    if (safeSession.meetingLink) {
      window.open(safeSession.meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePaymentUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPaymentProof(file);
      setPaymentStatus('processing');
    }
  };

  const handleSubmitPayment = () => {
    setPaymentStatus('completed');
    setShowPaymentOptions(false);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'bank-transfer') {
      setShowPaymentOptions(false);
    } else {
      handleOnlinePayment(method);
    }
  };

  const handleOnlinePayment = (method) => {
    console.log(`Redirecting to ${method} payment gateway`);
    alert(`Redirecting to ${method} payment gateway...`);
  };

  const copySessionId = () => {
    if (safeSession._id) {
      navigator.clipboard.writeText(safeSession._id);
      alert('Session ID copied to clipboard!');
    } else {
      alert('No session ID available');
    }
  };

  // Safe status check with default
  const sessionStatus = safeSession.status?.toLowerCase() || 'unknown';
  
  const canJoin = sessionStatus === 'scheduled' && safeSession.meetingLink;
  const canUploadPayment = sessionStatus === 'approved';
  const canChat = sessionStatus === 'approved' || sessionStatus === 'scheduled';
  const canReschedule = sessionStatus === 'scheduled';

  // Handle backdrop click to close dialog
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render if no session
  if (!session) {
    return null; // Return null instead of rendering empty dialog
  }

  return (
    <div className="dialog-backdrop" onClick={handleBackdropClick}>
      <div className="dialog-box session-dialog">
        <div className="dialog-header">
          <h2>Session Details</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="dialog-content">
          {/* Session ID with copy button */}
          <div className="session-id-section">
            <label>Session ID</label>
            <div className="session-id-copy">
              <code>{safeSession._id || 'No ID available'}</code>
              {safeSession._id && (
                <button className="btn-copy" onClick={copySessionId}>
                  📋 Copy
                </button>
              )}
            </div>
          </div>

          <div className="details-list">
            <div className="detail-row">
              <span className="detail-label">Student Name</span>
              <span className="detail-value">{safeSession.studentName || safeSession.requestedBy || 'Not specified'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Subject</span>
              <span className="detail-value">{safeSession.subject || "Not specified"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Grade Level</span>
              <span className="detail-value">{safeSession.grade || 'Not specified'}</span>
            </div>
            {safeSession.tutorName && (
              <div className="detail-row">
                <span className="detail-label">Tutor</span>
                <span className="detail-value">{safeSession.tutorName}</span>
              </div>
            )}
            {safeSession.tutorId && (
              <div className="detail-row">
                <span className="detail-label">Tutor ID</span>
                <span className="detail-value">{safeSession.tutorId}</span>
              </div>
            )}
            {safeSession.childId && (
              <div className="detail-row">
                <span className="detail-label">Child ID</span>
                <span className="detail-value">{safeSession.childId}</span>
              </div>
            )}
            {safeSession.date && (
              <div className="detail-row">
                <span className="detail-label">Date & Time</span>
                <span className="detail-value">{formatDateTime(safeSession.date, safeSession.time)}</span>
              </div>
            )}
            {safeSession.duration && (
              <div className="detail-row">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{safeSession.duration} minutes</span>
              </div>
            )}
            {safeSession.price && (
              <div className="detail-row">
                <span className="detail-label">Price</span>
                <span className="detail-value">${safeSession.price}</span>
              </div>
            )}
            {safeSession.meetingLink && sessionStatus !== 'completed' && (
              <div className="detail-row">
                <span className="detail-label">Meeting Link</span>
                <span className="detail-value">
                  <a href={safeSession.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                    🔗 Click to join meeting
                  </a>
                </span>
              </div>
            )}
            {safeSession.notes && (
              <div className="detail-row">
                <span className="detail-label">Notes</span>
                <span className="detail-value">{safeSession.notes}</span>
              </div>
            )}
          </div>

          {/* Payment Options Section for Approved Sessions */}
          {canUploadPayment && (
            <div className="payment-section">
              <div className="payment-header">
                <h4>Payment Options</h4>
                <p>Choose your preferred payment method</p>
              </div>
              
              {!showPaymentOptions && !paymentProof ? (
                <div className="payment-methods">
                  <div className="payment-method-card" onClick={() => handlePaymentMethodSelect('card')}>
                    <div className="payment-method-icon">💳</div>
                    <div className="payment-method-info">
                      <h5>Credit/Debit Card</h5>
                      <p>Pay securely with your card</p>
                    </div>
                    <div className="payment-arrow">→</div>
                  </div>
                  
                  <div className="payment-method-card" onClick={() => handlePaymentMethodSelect('paypal')}>
                    <div className="payment-method-icon">💰</div>
                    <div className="payment-method-info">
                      <h5>PayPal</h5>
                      <p>Pay with your PayPal account</p>
                    </div>
                    <div className="payment-arrow">→</div>
                  </div>
                  
                  <div className="payment-method-card" onClick={() => setShowPaymentOptions(true)}>
                    <div className="payment-method-icon">🏦</div>
                    <div className="payment-method-info">
                      <h5>Bank Transfer</h5>
                      <p>Upload proof of bank transfer</p>
                    </div>
                    <div className="payment-arrow">→</div>
                  </div>
                </div>
              ) : showPaymentOptions ? (
                <div className="bank-transfer-section">
                  <div className="bank-transfer-info">
                    <h5>Bank Transfer Instructions</h5>
                    <div className="bank-details">
                      <div className="bank-detail">
                        <span className="bank-label">Bank Name:</span>
                        <span className="bank-value">Citi Bank</span>
                      </div>
                      <div className="bank-detail">
                        <span className="bank-label">Account Name:</span>
                        <span className="bank-value">Genevieve Baldevarona</span>
                      </div>
                      <div className="bank-detail">
                        <span className="bank-label">Account Number:</span>
                        <span className="bank-value">1234 5678 9012 3456</span>
                      </div>
                      <div className="bank-detail">
                        <span className="bank-label">Reference:</span>
                        <span className="bank-value">Session-{safeSession._id ? safeSession._id.slice(-8) : 'N/A'}</span>
                      </div>
                      <div className="bank-detail">
                        <span className="bank-label">Amount:</span>
                        <span className="bank-value">${safeSession.price || '0'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="payment-upload">
                    <label>Upload Proof of Transfer</label>
                    <input
                      type="file"
                      id="payment-proof"
                      accept="image/*,.pdf"
                      onChange={handlePaymentUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="payment-proof" className="btn-outline upload-btn">
                      📎 Choose File
                    </label>
                    <p className="upload-hint">Upload screenshot or PDF of your bank transfer receipt</p>
                  </div>

                  <div className="payment-actions">
                    <button className="btn-secondary" onClick={() => setShowPaymentOptions(false)}>
                      ← Back to Payment Methods
                    </button>
                  </div>
                </div>
              ) : paymentProof && (
                <div className="payment-status">
                  <div className={`payment-file ${paymentStatus}`}>
                    <span>📄 {paymentProof.name}</span>
                    <span className={`status-badge ${paymentStatus}`}>
                      {paymentStatus === 'processing' ? '🔄 Processing' : '✅ Completed'}
                    </span>
                  </div>
                  {paymentStatus === 'processing' && (
                    <div className="payment-actions">
                      <button className="btn-primary" onClick={handleSubmitPayment}>
                        Submit Payment Proof
                      </button>
                      <button className="btn-secondary" onClick={() => setPaymentProof(null)}>
                        Cancel
                      </button>
                    </div>
                  )}
                  {paymentStatus === 'completed' && (
                    <p className="processing-text">Payment verification in progress. We'll notify you once confirmed.</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="session-actions-footer">
            {canJoin && (
              <button className="btn-primary" onClick={handleJoin}>
                🚀 Join Session
              </button>
            )}
            {canChat && (
              <button className="btn-outline">
                💬 Chat with Tutor
              </button>
            )}
            {canReschedule && (
              <button className="btn-outline">
                📅 Reschedule
              </button>
            )}
            {(sessionStatus === 'pending' || sessionStatus === 'approved') && (
              <button className="btn-danger">Cancel Request</button>
            )}
            <button className="btn-secondary ms-auto" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}