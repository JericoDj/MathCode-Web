import React, { useState, useContext, useEffect } from "react";
import { PackageContext } from "../../context/PackageContext.jsx";
import QuickJoinCard from "../../components/QuickJoinCard/QuickJoinCard.jsx";
import PackageCard from "../../components/PackageCard/PackageCard.jsx";
import BookingDialog from "../../components/BookingDialog/BookingDialog.jsx";
import "./PackagePage.css";

export default function PackagesPage() {
  const { packages: allPackages, bookPackage } = useContext(PackageContext);
  const [activeTab, setActiveTab] = useState("all");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 10;

  const packageArray = Array.isArray(allPackages)
    ? allPackages
    : Object.values(allPackages || {});

  // Filter packages by status
  const requestAssessmentPackages = packageArray.filter(
    pkg => pkg.status?.toLowerCase() === "requested_assessment"
  );

  const pendingPackages = packageArray.filter(
    pkg => pkg.status?.toLowerCase() === "pending_payment"
  );

  const approvedPackages = packageArray.filter(
    pkg => pkg.status?.toLowerCase() === "approved"
  );

  const scheduledPackages = packageArray.filter(
    pkg => pkg.status?.toLowerCase() === "scheduled"
  );

  const completedPackages = packageArray.filter(
    pkg => pkg.status?.toLowerCase() === "completed"
  );

  const cancelledPackages = packageArray.filter(
    pkg => pkg.status?.toLowerCase() === "cancelled" || 
           pkg.status?.toLowerCase() === "declined"
  );

  const noShowPackages = packageArray.filter(
    pkg => pkg.status?.toLowerCase() === "no-show"
  );

  const getPackagesByTab = () => {
    switch (activeTab) {
      case "all": return packageArray;
      case "requested_assessment": return requestAssessmentPackages;
      case "pending_payment": return pendingPackages;
      case "approved": return approvedPackages;
      case "scheduled": return scheduledPackages;
      case "completed": return completedPackages;
      case "no-show": return noShowPackages;
      case "cancelled": return cancelledPackages;
      default: return packageArray;
    }
  };

  const packagesToShow = getPackagesByTab();

  // Sort packages by creation date (newest first)
  const sortedPackages = [...packagesToShow].sort((a, b) => {
    return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
  });

  // Pagination
  const totalPages = Math.ceil(sortedPackages.length / packagesPerPage);
  const startIndex = (currentPage - 1) * packagesPerPage;
  const currentPackages = sortedPackages.slice(startIndex, startIndex + packagesPerPage);

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
      <div className="packages-page">
        {/* Quick Join Section - Only show for scheduled packages */}
        {scheduledPackages.length > 0 && (
          <div className="quick-join-section">
            <div className="quick-join-header">
              <h2>🎯 Quick Join</h2>
              <p>Your scheduled sessions ready to join</p>
            </div>
            <div className="quick-join-cards">
              {scheduledPackages
                .filter(pkg => pkg.meetingLink)
                .slice(0, 3)
                .map((pkg, index) => (
                  <QuickJoinCard key={pkg._id || index} package={pkg} />
                ))
              }
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="packages-header">
          <div className="header-content">
            <h1>Package Management</h1>
            <p>View and manage all your tutoring packages</p>
          </div>
          <button 
            className="btn-primary book-package-btn"
            onClick={() => setShowBookingDialog(true)}
          >
            📦 Book New Package
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-info">
              <h3>{requestAssessmentPackages.length}</h3>
              <p>Requested Assessment</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-info">
              <h3>{pendingPackages.length}</h3>
              <p>Pending Payment</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon approved">✅</div>
            <div className="stat-info">
              <h3>{approvedPackages.length}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon scheduled">🎯</div>
            <div className="stat-info">
              <h3>{scheduledPackages.length}</h3>
              <p>Scheduled</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">📦</div>
            <div className="stat-info">
              <h3>{completedPackages.length}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="packages-tabs">
          <button
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            <h5>All ({packageArray.length})</h5>
          </button>

          <button
            className={`tab ${activeTab === "requested_assessment" ? "active" : ""}`}
            onClick={() => setActiveTab("requested_assessment")}
          >
            <h5>Requested ({requestAssessmentPackages.length})</h5>
          </button>

          <button
            className={`tab ${activeTab === "pending_payment" ? "active" : ""}`}
            onClick={() => setActiveTab("pending_payment")}
          >
            <h5>Pending Payment ({pendingPackages.length})</h5>
          </button>

          <button
            className={`tab ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => setActiveTab("approved")}
          >
            <h5>Approved ({approvedPackages.length})</h5>
          </button>

          <button
            className={`tab ${activeTab === "scheduled" ? "active" : ""}`}
            onClick={() => setActiveTab("scheduled")}
          >
            <h5>Scheduled ({scheduledPackages.length})</h5>
          </button>

          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            <h5>Completed ({completedPackages.length})</h5>
          </button>

          <button
            className={`tab ${activeTab === "no-show" ? "active" : ""}`}
            onClick={() => setActiveTab("no-show")}
          >
            <h5>No-Show ({noShowPackages.length})</h5>
          </button>

          <button
            className={`tab ${activeTab === "cancelled" ? "active" : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            <h5>Cancelled ({cancelledPackages.length})</h5>
          </button>
        </div>

        {/* Packages List */}
        <div className="packages-list">
          {currentPackages.length > 0 ? (
            currentPackages.map((pkg, index) => (
              <PackageCard
                key={pkg._id || index}
                package={pkg}
                index={startIndex + index + 1}
                activeTab={activeTab}
              />
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No packages found</h3>
              <p>
                {activeTab === "pending_payment" 
                  ? "You don't have any pending payment packages."
                  : `No ${activeTab} packages found.`
                }
              </p>
              {activeTab === "pending_payment" && (
                <button 
                  className="btn-primary"
                  onClick={() => setShowBookingDialog(true)}
                >
                  Book New Package
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