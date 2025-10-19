import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../context/SessionContext";
import QuickJoinCard from "../../components/QuickJoinCard/QuickJoinCard.jsx";
import SessionCard from "../../components/SessionCard/SessionCard.jsx";
import BookingDialog from "../../components/BookingDialog/BookingDialog.jsx";
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

  // Filter sessions by status
    const requestAssessmentSessions = sessionArray.filter(
    session => session.status?.toLowerCase() === "requested_assessment"
  );

  const pendingSessions = sessionArray.filter(
    session => session.status?.toLowerCase() === "pending_payment"
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
      case "requested": return requestAssessmentSessions;
      case "pending": return pendingSessions;
      case "approved": return approvedSessions;
      case "scheduled": return scheduledSessions;
      case "completed": return completedSessions;
      case "no-show": return noShowSessions;
      case "cancelled": return cancelledSessions;
      default: return requestAssessmentSessions;
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
              <h3>{requestAssessmentSessions.length}</h3>
              <p>Requested Assessment</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-info">
              <h3>{pendingSessions.length}</h3>
              <p>Pending Payment</p>
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