import React, { useState } from "react";
import SessionDialog from "../SessionDialog/SessionDialog.jsx";
import "./SessionCard.css";

export default function SessionCard({ session, index, activeTab }) {
  const [showSessionDialog, setShowSessionDialog] = useState(false);

  // Add safety check for session
  if (!session) {
    console.log("No Session");
    return null;
  }

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Not scheduled';
    
    try {
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
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleCardClick = () => {
    setShowSessionDialog(true);
  };

  const handleJoinClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    }
  };

  return (
    <>
      <div className={`session-card ${session.status?.toLowerCase() || 'unknown'}`}>
        <div className="session-card-header" onClick={handleCardClick}>
          <div className="session-main-info">
            <div className="session-index">{index}</div>
            <div className="session-details">
              <h4>{session.subject || "Tutoring Session"}</h4>
              <div className="session-meta">
                <span className="parent">Requested by: {session.requestedBy || 'Unknown'}</span>
                
                {session.studentName && (
                  <span className="student">Student: {session.studentName}</span>
                )}
                
                {session.date && (
                  <span className="date">
                    {formatDateTime(session.date, session.time)}
                  </span>
                )}
                
                {session.tutorName && <span className="tutor">with {session.tutorName}</span>}
                {session.grade && <span className="grade">Grade {session.grade}</span>}
                
                {session.childId && <span className="child-id">Child ID: {session.childId}</span>}
              </div>
            </div>
          </div>
          <div className="session-actions">
            {session.status === 'scheduled' && session.meetingLink && (
              <button className="btn-join-sm" onClick={handleJoinClick}>
                🚀 Join
              </button>
            )}
            <span className={`status-tag ${session.status?.toLowerCase() || 'unknown'}`}>
              {session.status || 'Unknown'}
            </span>
            <button className="expand-btn">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Session Details Dialog - Only render when showSessionDialog is true */}
      {showSessionDialog && (
        <SessionDialog 
          session={session} 
          onClose={() => setShowSessionDialog(false)} 
        />
      )}
    </>
  );
}