// src/screens/Sessions/SessionsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import './SessionsPage.css';

export default function SessionsPage() {
  const { user } = useContext(UserContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'scheduled', 'completed', 'cancelled'
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchUserSessions();
  }, []);

  const fetchUserSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = JSON.parse(localStorage.getItem('token'));
      const authDetails = JSON.parse(localStorage.getItem('auth'));
      const userId = authDetails?.id;

      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      // Use the user/:userId endpoint
      const response = await fetch(`${API_BASE_URL}/api/sessions/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch sessions: ${response.status}`);
      }

      const data = await response.json();

      
      // Handle the response format from /api/sessions/user/:userId
      if (data.sessions && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err.message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#3B82F6';
      case 'in-progress': return '#F59E0B';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'no-show': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    return status.replace('-', ' ').toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'TBD';
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  // Sort sessions by date (most recent first)
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const getSessionStudentName = (session) => {
    // If session has populated studentId with name, use that
    if (session.studentId && typeof session.studentId === 'object') {
      return `${session.studentId.firstName} ${session.studentId.lastName}`;
    }
    // Otherwise use the studentName field
    return session.studentName || 'Student';
  };

  const getSessionParentName = (session) => {
    // If session has populated parentId with name, use that
    if (session.parentId && typeof session.parentId === 'object') {
      return `${session.parentId.firstName} ${session.parentId.lastName}`;
    }
    // Otherwise use the parentName field
    return session.parentName || 'Parent';
  };

  const getStudentGradeLevel = (session) => {
    // If session has populated studentId with gradeLevel, use that
    if (session.studentId && typeof session.studentId === 'object' && session.studentId.gradeLevel) {
      return `Grade ${session.studentId.gradeLevel}`;
    }
    return 'Grade not specified';
  };

  const canJoinSession = (session) => {
    if (!session.meetingLink || session.status !== 'scheduled') {
      return false;
    }

    const now = new Date();
    const sessionDateTime = new Date(session.date);
    const [hours, minutes] = session.time.split(':').map(Number);
    sessionDateTime.setHours(hours, minutes, 0, 0);
    
    // Allow joining 15 minutes before and up to 2 hours after scheduled time
    const fifteenMinutesBefore = new Date(sessionDateTime.getTime() - 15 * 60000);
    const twoHoursAfter = new Date(sessionDateTime.getTime() + 2 * 60 * 60000);
    
    return now >= fifteenMinutesBefore && now <= twoHoursAfter;
  };

  const getJoinButtonText = (session) => {
    if (!session.meetingLink) return 'No Meeting Link';
    
    const now = new Date();
    const sessionDateTime = new Date(session.date);
    const [hours, minutes] = session.time.split(':').map(Number);
    sessionDateTime.setHours(hours, minutes, 0, 0);
    
    const fifteenMinutesBefore = new Date(sessionDateTime.getTime() - 15 * 60000);
    
    if (now < fifteenMinutesBefore) {
      const timeUntil = Math.ceil((fifteenMinutesBefore - now) / (1000 * 60)); // minutes until available
      if (timeUntil > 60) {
        const hoursUntil = Math.floor(timeUntil / 60);
        return `Join Meeting`;
      }
      return `Join Meeting`;
    }
    
    return 'Join Meeting';
  };

  const handleJoinSession = (session) => {
    if (session.meetingLink && session.status === 'scheduled') {
      window.open(session.meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  const copyMeetingLink = (session) => {
    if (session.meetingLink) {
      navigator.clipboard.writeText(session.meetingLink);
      // You could add a toast notification here
      alert('Meeting link copied to clipboard!');
    }
  };

  // Get session count for filter tabs
  const getSessionCount = (status) => {
    if (status === 'all') return sessions.length;
    return sessions.filter(session => session.status === status).length;
  };

  if (loading) {
    return (
      <div className="sessions-page">
        <div className="sessions-header">
          <h1>My Sessions</h1>
          <p>Loading your sessions...</p>
        </div>
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <div className="sessions-page">
        <div className="sessions-header">
          <h1>My Sessions</h1>
          <p>Error loading sessions</p>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchUserSessions} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sessions-page">
      <div className="sessions-header">
        <h1>My Sessions</h1>
        <p>Manage and view all your tutoring sessions</p>
        {error && (
          <div className="warning-banner">
            <span>⚠️ {error}</span>
            <button onClick={fetchUserSessions} className="btn btn-text btn-sm">
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Session Stats */}
      <div className="session-stats">
        <div className="stat-card">
          <span className="stat-number">{getSessionCount('scheduled')}</span>
          <span className="stat-label">Scheduled</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{getSessionCount('completed')}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{getSessionCount('cancelled') + getSessionCount('no-show')}</span>
          <span className="stat-label">Cancelled/No Show</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{sessions.length}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="sessions-controls">
        <div className="filter-tabs">
          {['all', 'scheduled', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="tab-count">
                {getSessionCount(tab)}
              </span>
            </button>
          ))}
        </div>
        
        <button 
          onClick={fetchUserSessions}
          className="btn btn-secondary btn-sm"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Sessions List */}
      <div className="sessions-list">
        {sortedSessions.length === 0 ? (
          <div className="empty-state">
            <h3>No sessions found</h3>
            <p>
              {filter === 'all' 
                ? "You don't have any sessions yet." 
                : `No ${filter} sessions found.`}
            </p>
            {filter !== 'all' && (
              <button 
                className="btn btn-text"
                onClick={() => setFilter('all')}
              >
                View all sessions
              </button>
            )}
          </div>
        ) : (
          sortedSessions.map(session => (
            <div key={session._id} className="session-card">
              <div className="session-header">
                <div className="session-title">
                  <h3>{session.subject}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(session.status) }}
                  >
                    {getStatusText(session.status)}
                  </span>
                </div>
                <div className="session-credits">
                  {session.creditsUsed || 0} credit{(session.creditsUsed || 0) !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="session-info">
                {/* Always show student name and grade level */}
                <div className="info-row">
                  <span className="info-label">Student:</span>
                  <span className="info-value">
                    {getSessionStudentName(session)} • {getStudentGradeLevel(session)}
                  </span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Tutor:</span>
                  <span className="info-value">{session.tutorName}</span>
                </div>
                
                {/* Show parent name for students */}
                {user?.role === 'student' && (
                  <div className="info-row">
                    <span className="info-label">Parent:</span>
                    <span className="info-value">{getSessionParentName(session)}</span>
                  </div>
                )}
                
                <div className="info-row">
                  <span className="info-label">Date & Time:</span>
                  <span className="info-value">
                    {formatDate(session.date)} at {formatTime(session.time)}
                  </span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Duration:</span>
                  <span className="info-value">{session.duration} minutes</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Package:</span>
                  <span className="info-value">{session.packageType}</span>
                </div>

                {/* Show meeting link if available */}
                {session.meetingLink && (
                  <div className="info-row">
                    <span className="info-label">Meeting Link:</span>
                    <span className="info-value meeting-link">
                      <a 
                        href={session.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="meeting-url"
                      >
                        {session.meetingLink}
                      </a>
                      <button 
                        onClick={() => copyMeetingLink(session)}
                        className="btn-copy-link"
                        title="Copy meeting link"
                      >
                        📋
                      </button>
                    </span>
                  </div>
                )}
              </div>

              {/* Session Actions */}
              <div className="session-actions">
                {session.status === 'scheduled' && (
                  <>
                    {session.meetingLink ? (
                      <button
                        onClick={() => handleJoinSession(session)}
                        className={`join-meeting-btn ${canJoinSession(session) ? 'active' : 'upcoming'}`}
                      >
                
                        {getJoinButtonText(session)}
                      </button>
                    ) : (
                      <div className="no-meeting-link">
                        <span className="no-link-icon">🔗</span>
                        Meeting link not available
                      </div>
                    )}
                    
                    {/* <div className="action-buttons">
                      <button className="btn btn-secondary btn-sm">
                        Reschedule
                      </button>
                      <button className="btn btn-danger btn-sm">
                        Cancel
                      </button>
                    </div> */}
                  </>
                )}

                {session.status === 'completed' && session.rating && (
                  <div className="session-rating">
                    <span>Rating: </span>
                    <div className="stars">
                      {'★'.repeat(session.rating)}{'☆'.repeat(5 - session.rating)}
                    </div>
                  </div>
                )}
              </div>

              {/* Session Details */}
              <div className="session-details">
                {session.notes && (
                  <div className="session-notes">
                    <strong>Notes:</strong> {session.notes}
                  </div>
                )}

                {session.sessionNotes && (
                  <div className="session-notes">
                    <strong>Tutor Notes:</strong> {session.sessionNotes}
                  </div>
                )}

                {session.feedback && (
                  <div className="session-notes">
                    <strong>Feedback:</strong> {session.feedback}
                  </div>
                )}

                {/* Show actual times if available */}
                {(session.actualStartTime || session.actualEndTime) && (
                  <div className="session-timing">
                    {session.actualStartTime && (
                      <div className="timing-info">
                        <strong>Started:</strong> {new Date(session.actualStartTime).toLocaleString()}
                      </div>
                    )}
                    {session.actualEndTime && (
                      <div className="timing-info">
                        <strong>Ended:</strong> {new Date(session.actualEndTime).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}