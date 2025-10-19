import React from "react";
import "./QuickJoinCard.css";

export default function QuickJoinCard({ package: pkg }) {
  const formatDateTime = (date, time) => {
    const packageDate = new Date(date);
    return {
      date: packageDate.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: time || packageDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const { date, time } = formatDateTime(pkg.date, pkg.time);

  const handleJoin = () => {
    if (pkg.meetingLink) {
      window.open(pkg.meetingLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="quick-join-card">
      <div className="join-card-header">
        <h4>{pkg.subject || "Tutoring Package"}</h4>
        <span className="join-badge">Ready to Join</span>
      </div>
      <div className="join-card-details">
        <div className="join-detail">
          <span className="label">Package:</span>
          <span className="value">{pkg.packageName || pkg.packageType || 'Tutoring Package'}</span>
        </div>
        <div className="join-detail">
          <span className="label">With:</span>
          <span className="value">{pkg.tutorName || 'Tutor'}</span>
        </div>
        <div className="join-detail">
          <span className="label">Date:</span>
          <span className="value">{date}</span>
        </div>
        <div className="join-detail">
          <span className="label">Time:</span>
          <span className="value">{time}</span>
        </div>
        {pkg.duration && (
          <div className="join-detail">
            <span className="label">Duration:</span>
            <span className="value">{pkg.duration} mins</span>
          </div>
        )}
        {pkg.remainingSessions && (
          <div className="join-detail">
            <span className="label">Sessions Left:</span>
            <span className="value">{pkg.remainingSessions}/{pkg.totalSessions}</span>
          </div>
        )}
      </div>
      <button 
        className="btn-join"
        onClick={handleJoin}
        disabled={!pkg.meetingLink}
      >
        🚀 Join Session
      </button>
    </div>
  );
}