import React, { useState } from "react";
import "./SideDrawer.css";

export default function SideDrawer({
  isOpen,
  onClose,
  onFreeSession,
  onDashboard,
  onProfileSettings,
  onBilling,
  onHelpCenter,
  onLogout,
  userName,
  userEmail,
  userAvatarUrl,
}) {
  const [accountOpen, setAccountOpen] = useState(false);
  const userInitial = (userName || "U")[0]?.toUpperCase();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className={`side-drawer ${isOpen ? "open" : ""}`}>
        {/* Navigation links */}
        <div className="drawer-section">
          <div className="drawer-section-title">Navigation</div>
          <ul className="drawer-links">
            <li onClick={onClose}>Home</li>
            <li onClick={onClose}>Pricing</li>
            <li onClick={onClose}>Program</li>
            <li onClick={onClose}>Contact</li>
            <li onClick={onClose}>FAQ</li>
          </ul>

          {/* Free session button just below nav links */}
          <div className="drawer-cta">
            <button className="btn-cta" onClick={onFreeSession}>
              Book a Free Session
            </button>
          </div>
        </div>

        {/* Dashboard + account header grouped */}
        {userName || userEmail ? (
          <div className="drawer-account-group">
            <button className="btn-dashboard" onClick={onDashboard}>
              Dashboard
            </button>

            <div
              className="drawer-account"
              onClick={() => setAccountOpen((prev) => !prev)}
            >
              <div className="account-header">
                <img
                  src={
                    userAvatarUrl ||
                    `https://picsum.photos/seed/${userName || "u"}/60`
                  }
                  alt="Avatar"
                  className="account-avatar"
                />
                <div className="account-info">
                  <div className="account-name">{userName || "User"}</div>
                  <div className="account-email">{userEmail || ""}</div>
                </div>
                <div className="account-toggle-indicator">
                  {accountOpen ? "▲" : "▼"}
                </div>
              </div>

              {/* Account links hidden initially */}
              {accountOpen && (
                <div className="account-links">
                  <button onClick={onProfileSettings}>Profile & Settings</button>
                  <button onClick={onBilling}>Manage Plan / Billing</button>
                  <button onClick={onHelpCenter}>Help Center</button>
                  <button className="danger" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
