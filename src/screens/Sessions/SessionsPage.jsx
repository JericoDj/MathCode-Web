// src/screens/Sessions/SessionsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext.jsx';
import './SessionsPage.css';

export default function SessionsPage() {
  const { user } = useContext(UserContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed', 'cancelled'

  useEffect(() => {
    fetchUserSessions();
  }, []);

  const fetchUserSessions = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem('token'));
      
      const authDetails = JSON.parse(localStorage.getItem('auth'));
        const userId = authDetails.id
    console.log(userId);

      if (!token || !userId) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:4000/api/sessions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      

      if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
      }

      const data = await response.json();
      
      setSessions(data.sessions || data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err.message);
      // For demo purposes, using mock data
      setSessions(getMockSessions());
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
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

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

  if (error) {
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
              {tab !== 'all' && (
                <span className="tab-count">
                  {sessions.filter(s => tab === 'all' || s.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="sessions-list">
        {filteredSessions.length === 0 ? (
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
          filteredSessions.map(session => (
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
                  {session.creditsUsed} credit{session.creditsUsed !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="session-info">
                <div className="info-row">
                  <span className="info-label">Tutor:</span>
                  <span className="info-value">{session.tutorName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Student:</span>
                  <span className="info-value">{session.studentName}</span>
                </div>
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
              </div>

              {/* Session Actions */}
              <div className="session-actions">
                {session.meetingLink && session.status === 'scheduled' && (
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Join Session
                  </a>
                )}
                
                {session.status === 'scheduled' && (
                  <button className="btn btn-secondary btn-sm">
                    Reschedule
                  </button>
                )}
                
                {session.status === 'scheduled' && (
                  <button className="btn btn-danger btn-sm">
                    Cancel
                  </button>
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

              {/* Session Notes */}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Mock data for demo purposes
function getMockSessions() {
  return [
    {
      _id: '1',
      studentName: 'Cardo De Jesus',
      tutorName: 'Teacher Viv',
      subject: 'Singapore Math',
      date: '2025-10-30T00:00:00.000Z',
      time: '08:30',
      duration: 90,
      status: 'scheduled',
      packageType: '1:1 Private Tutoring',
      creditsUsed: 1.5,
      notes: 'Please come prepared with homework',
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      rating: null
    },
    {
      _id: '2',
      studentName: 'Luna De Jesus',
      tutorName: 'Teacher Viv',
      subject: 'Singapore Math',
      date: '2025-10-29T00:00:00.000Z',
      time: '09:30',
      duration: 90,
      status: 'completed',
      packageType: '1:1 Private Tutoring',
      creditsUsed: 1.5,
      notes: 'Great progress today!',
      meetingLink: 'https://meet.google.com/ztz-iyef-rtv',
      rating: 5,
      sessionNotes: 'Student showed excellent understanding of fractions'
    },
    {
      _id: '3',
      studentName: 'Cardo De Jesus',
      tutorName: 'Dr. Johnson',
      subject: 'Advanced Mathematics',
      date: '2024-12-25T00:00:00.000Z',
      time: '15:00',
      duration: 90,
      status: 'completed',
      packageType: '1:1 Private Tutoring',
      creditsUsed: 1.5,
      notes: 'Focus on calculus',
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      rating: 4,
      feedback: 'Excellent session!'
    }
  ];
}