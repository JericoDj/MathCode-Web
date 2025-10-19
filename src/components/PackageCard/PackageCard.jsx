import React, { useState } from "react";
import PackageDialog from "../PackageDialog/PackageDialog.jsx";
import "./PackageCard.css";

export default function PackageCard({ package: pkg, index, activeTab }) {
  const [showPackageDialog, setShowPackageDialog] = useState(false);

  // Add safety check for package
  if (!pkg) {
    console.log("No Package");
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
    setShowPackageDialog(true);
  };

  const handleJoinClick = (e) => {
    e.stopPropagation(); // Prevent card click
    if (pkg.meetingLink) {
      window.open(pkg.meetingLink, '_blank');
    }
  };

  return (
    <>
      <div className={`package-card ${pkg.status?.toLowerCase() || 'unknown'}`}>
        <div className="package-card-header" onClick={handleCardClick}>
          <div className="package-main-info">
            <div className="package-index">{index}</div>
            <div className="package-details">
              <h4>{pkg.subject || "Tutoring Package"}</h4>
              <div className="package-meta">
                <span className="parent">Requested by: {pkg.requestedBy || 'Unknown'}</span>
                
                {pkg.studentName && (
                  <span className="student">Student: {pkg.studentName}</span>
                )}
                
                {pkg.date && (
                  <span className="date">
                    {formatDateTime(pkg.date, pkg.time)}
                  </span>
                )}
                
                {pkg.tutorName && <span className="tutor">with {pkg.tutorName}</span>}
                {pkg.grade && <span className="grade">Grade {pkg.grade}</span>}
                
                {pkg.childId && <span className="child-id">Child ID: {pkg.childId}</span>}
                
                {/* Package-specific fields */}
                {pkg.packageType && (
                  <span className="package-type">Package: {pkg.packageType}</span>
                )}
                {pkg.totalSessions && (
                  <span className="sessions-count">
                    Sessions: {pkg.usedSessions || 0}/{pkg.totalSessions}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="package-actions">
            {pkg.status === 'scheduled' && pkg.meetingLink && (
              <button className="btn-join-sm" onClick={handleJoinClick}>
                🚀 Join
              </button>
            )}
            <span className={`status-tag ${pkg.status?.toLowerCase() || 'unknown'}`}>
              {pkg.status || 'Unknown'}
            </span>
            <button className="expand-btn">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Package Details Dialog - Only render when showPackageDialog is true */}
      {showPackageDialog && (
        <PackageDialog 
          package={pkg} 
          onClose={() => setShowPackageDialog(false)} 
        />
      )}
    </>
  );
}