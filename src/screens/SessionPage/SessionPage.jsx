import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../context/SessionContext";
import "./SessionPage.css";

export default function SessionsPage() {
  const { sessions: allSessions, bookSession } = useContext(SessionContext);
  const [activeTab, setActiveTab] = useState("all");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 10;

  const sessionArray = Array.isArray(allSessions)
    ? allSessions
    : Object.values(allSessions || {});

  // Filter sessions by status according to your workflow
  const pendingSessions = sessionArray.filter(
    session => session.status?.toLowerCase() === "pending"
  );

  const approvedSessions = sessionArray.filter(
    session => session.status?.toLowerCase() === "approved"
  );

  const scheduledSessions = sessionArray.filter(
    session => session.status?.toLowerCase() === "scheduled"
  );

  const completedSessions = sessionArray.filter(
    session => session.status?.toLowerCase() === "completed"
  );

  const cancelledSessions = sessionArray.filter(
    session => session.status?.toLowerCase() === "cancelled" || 
               session.status?.toLowerCase() === "declined"
  );

  const noShowSessions = sessionArray.filter(
    session => session.status?.toLowerCase() === "no-show"
  );

  const getSessionsByTab = () => {
    switch (activeTab) {
      case "all": return sessionArray;
      case "pending": return pendingSessions;
      case "approved": return approvedSessions;
      case "scheduled": return scheduledSessions;
      case "completed": return completedSessions;
      case "no-show": return noShowSessions;
      case "cancelled": return cancelledSessions;
      default: return pendingSessions;
    }
  };

  const sessionsToShow = getSessionsByTab();

  // Sort sessions by creation date (newest first)
  const sortedSessions = [...sessionsToShow].sort((a, b) => {
    return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
  });

  // Pagination
  const totalPages = Math.ceil(sortedSessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const currentSessions = sortedSessions.slice(startIndex, startIndex + sessionsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <>
      <br />
      <div className="sessions-page">
        {/* Quick Join Section - Only show for scheduled sessions */}
        {scheduledSessions.length > 0 && (
          <div className="quick-join-section">
            <div className="quick-join-header">
              <h2>🎯 Quick Join</h2>
              <p>Your scheduled sessions ready to join</p>
            </div>
            <div className="quick-join-cards">
              {scheduledSessions
                .filter(session => session.meetingLink)
                .slice(0, 3)
                .map((session, index) => (
                  <QuickJoinCard key={session._id || index} session={session} />
                ))
              }
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="sessions-header">
          <div className="header-content">
            <h1>Session Management</h1>
            <p>View and manage all your tutoring sessions</p>
          </div>
          <button 
            className="btn-primary book-session-btn"
            onClick={() => setShowBookingDialog(true)}
          >
            📚 Book New Session
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-info">
              <h3>{pendingSessions.length}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon approved">✅</div>
            <div className="stat-info">
              <h3>{approvedSessions.length}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon scheduled">🎯</div>
            <div className="stat-info">
              <h3>{scheduledSessions.length}</h3>
              <p>Scheduled</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">📚</div>
            <div className="stat-info">
              <h3>{completedSessions.length}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sessions-tabs">
          <button
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All ({sessionArray.length})
          </button>
          <button
            className={`tab ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending ({pendingSessions.length})
          </button>
          <button
            className={`tab ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            Approved ({approvedSessions.length})
          </button>
          <button
            className={`tab ${activeTab === "scheduled" ? "active" : ""}`}
            onClick={() => setActiveTab("scheduled")}
          >
            Scheduled ({scheduledSessions.length})
          </button>
          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({completedSessions.length})
          </button>
          <button
            className={`tab ${activeTab === "no-show" ? "active" : ""}`}
            onClick={() => setActiveTab("no-show")}
          >
            No-Show ({noShowSessions.length})
          </button>
          <button
            className={`tab ${activeTab === "cancelled" ? "active" : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({cancelledSessions.length})
          </button>
        </div>

        {/* Sessions List */}
        <div className="sessions-list">
          {currentSessions.length > 0 ? (
            currentSessions.map((session, index) => (
              <SessionCard
                key={session._id || index}
                session={session}
                index={startIndex + index + 1}
                activeTab={activeTab}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No sessions found</h3>
              <p>
                {activeTab === "pending" 
                  ? "You don't have any pending session requests. Book one now!"
                  : `No ${activeTab} sessions found.`
                }
              </p>
              {activeTab === "pending" && (
                <button 
                  className="btn-primary"
                  onClick={() => setShowBookingDialog(true)}
                >
                  Book Your First Session
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ← Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next →
            </button>
          </div>
        )}

        {/* Booking Dialog */}
        {showBookingDialog && (
          <BookingDialog onClose={() => setShowBookingDialog(false)} />
        )}
      </div>
    </>
  );
}

// Quick Join Card for scheduled sessions
function QuickJoinCard({ session }) {
  const formatDateTime = (date, time) => {
    const sessionDate = new Date(date);
    return {
      date: sessionDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: time || sessionDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = formatDateTime(session.date, session.time);

  const handleJoin = () => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="quick-join-card">
      <div className="join-card-header">
        <h4>{session.subject || "Tutoring Session"}</h4>
        <span className="join-badge">Ready to Join</span>
      </div>
      <div className="join-card-details">
        <div className="join-detail">
          <span className="label">With:</span>
          <span className="value">{session.tutorName || 'Tutor'}</span>
        </div>
        <div className="join-detail">
          <span className="label">Date:</span>
          <span className="value">{date}</span>
        </div>
        <div className="join-detail">
          <span className="label">Time:</span>
          <span className="value">{time}</span>
        </div>
        {session.duration && (
          <div className="join-detail">
            <span className="label">Duration:</span>
            <span className="value">{session.duration} mins</span>
          </div>
        )}
      </div>
      <button 
        className="btn-join"
        onClick={handleJoin}
        disabled={!session.meetingLink}
      >
        🚀 Join Session
      </button>
    </div>
  );
}

function SessionCard({ session, index, activeTab }) {
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Not scheduled';
    
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const formattedTime = timeString || date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled': return '🎯';
      case 'approved': return '✅';
      case 'pending': return '⏳';
      case 'completed': return '🎓';
      case 'cancelled': return '❌';
      case 'declined': return '🚫';
      case 'no-show': return '😴';
      default: return '📝';
    }
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(session._id);
    // You could add a toast notification here
    alert('Session ID copied to clipboard!');
  };

  return (
    <>
      <div className={`session-card ${session.status?.toLowerCase()}`}>
        <div className="session-card-header" onClick={() => setShowSessionDialog(true)}>
          <div className="session-main-info">
            <div className="session-index">{index}</div>
            <div className="session-details">
              <h4>{session.subject || "Tutoring Session"}</h4>
              <div className="session-meta">
                <span className="student">{session.studentName || session.requestedBy}</span>
                {session.date && (
                  <span className="date">
                    {formatDateTime(session.date, session.time)}
                  </span>
                )}
                {session.tutorName && <span className="tutor">with {session.tutorName}</span>}
                {session.grade && <span className="grade">Grade {session.grade}</span>}
              </div>
            </div>
          </div>
          <div className="session-actions">
            {session.status === 'scheduled' && session.meetingLink && (
              <button className="btn-join-sm" onClick={(e) => { e.stopPropagation(); window.open(session.meetingLink, '_blank'); }}>
                🚀 Join
              </button>
            )}
            <span className={`status-tag ${session.status?.toLowerCase()}`}>
              {session.status}
              {/* {(session.status)} {session.status} */}
            </span>
            <button className="expand-btn">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Session Details Dialog */}
      {showSessionDialog && (
        <SessionDialog 
          session={session} 
          onClose={() => setShowSessionDialog(false)} 
        />
      )}
    </>
  );
}

function SessionDialog({ session, onClose }) {
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Not scheduled';
    
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
  };

  const handleJoin = () => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank', 'noopener,noreferrer');
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
    // Handle payment submission logic
    setPaymentStatus('completed');
    setShowPaymentOptions(false);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    if (method === 'bank-transfer') {
      // For bank transfer, we'll show the upload option
      setShowPaymentOptions(false);
    } else {
      // For card or PayPal, redirect to payment gateway
      handleOnlinePayment(method);
    }
  };

  const handleOnlinePayment = (method) => {
    // Redirect to payment gateway based on method
    console.log(`Redirecting to ${method} payment gateway`);
    // In a real app, you would redirect to Stripe, PayPal, etc.
    alert(`Redirecting to ${method} payment gateway...`);
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(session._id);
    alert('Session ID copied to clipboard!');
  };

  const canJoin = session.status === 'scheduled' && session.meetingLink;
  const canUploadPayment = session.status === 'approved';
  const canChat = session.status === 'approved' || session.status === 'scheduled';
  const canReschedule = session.status === 'scheduled';

  return (
    <div className="dialog-backdrop">
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
              <code>{session._id}</code>
              <button className="btn-copy" onClick={copySessionId}>
                📋 Copy
              </button>
            </div>
          </div>

          <div className="details-list">
            <div className="detail-row">
              <span className="detail-label">Student Name</span>
              <span className="detail-value">{session.studentName || session.requestedBy}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Subject</span>
              <span className="detail-value">{session.subject || "Not specified"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Grade Level</span>
              <span className="detail-value">{session.grade || 'Not specified'}</span>
            </div>
            {session.tutorName && (
              <div className="detail-row">
                <span className="detail-label">Tutor</span>
                <span className="detail-value">{session.tutorName}</span>
              </div>
            )}
            {session.tutorId && (
              <div className="detail-row">
                <span className="detail-label">Tutor ID</span>
                <span className="detail-value">{session.tutorId}</span>
              </div>
            )}
            {session.childId && (
              <div className="detail-row">
                <span className="detail-label">Child ID</span>
                <span className="detail-value">{session.childId}</span>
              </div>
            )}
            {session.date && (
              <div className="detail-row">
                <span className="detail-label">Date & Time</span>
                <span className="detail-value">{formatDateTime(session.date, session.time)}</span>
              </div>
            )}
            {session.duration && (
              <div className="detail-row">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{session.duration} minutes</span>
              </div>
            )}
            {session.price && (
              <div className="detail-row">
                <span className="detail-label">Price</span>
                <span className="detail-value">${session.price}</span>
              </div>
            )}
            {session.meetingLink && session.status !== 'completed' && (
              <div className="detail-row">
                <span className="detail-label">Meeting Link</span>
                <span className="detail-value">
                  <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="meeting-link">
                    🔗 Click to join meeting
                  </a>
                </span>
              </div>
            )}
            {session.notes && (
              <div className="detail-row">
                <span className="detail-label">Notes</span>
                <span className="detail-value">{session.notes}</span>
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
                        <span className="bank-value">Session-{session._id.slice(-8)}</span>
                      </div>
                      <div className="bank-detail">
                        <span className="bank-label">Amount:</span>
                        <span className="bank-value">${session.price}</span>
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
            {(session.status === 'pending' || session.status === 'approved') && (
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

// BookingDialog component remains the same as your original
function BookingDialog({ onClose }) {
  const [formData, setFormData] = useState({
    studentName: '',
    subject: '',
    grade: '',
    preferredDate: '',
    preferredTime: '',
    duration: '60',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking logic here
    console.log('Booking session:', formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog-box booking-dialog">
        <div className="dialog-header">
          <h2>📚 Book New Session</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Student Name *</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student's name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Subject *</label>
              <select 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange}
                required
              >
                <option value="">Select a subject</option>
                <option value="Singapore Math">Singapore Math</option>
                <option value="Scratch Coding">Scratch Coding</option>
                <option value="Python Basics">Python Basics</option>
                <option value="Python Advanced">Python Advanced</option>
                <option value="Robotics">Robotics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
              </select>
            </div>
            <div className="form-group">
              <label>Grade Level</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="e.g., Grade 3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Preferred Date *</label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>Preferred Time *</label>
              <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Duration</label>
            <select 
              name="duration" 
              value={formData.duration} 
              onChange={handleChange}
            >
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any specific topics, learning goals, or requirements..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Book Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}