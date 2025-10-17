import React from "react";
import "./QuickJoinCard.css";

export default function QuickJoinCard({ session }) {
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