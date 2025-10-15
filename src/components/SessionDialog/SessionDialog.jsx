import React, { useState, useContext } from "react";
import "./SessionDialog.css";
import { SessionContext } from "../../context/SessionContext.jsx";

export default function SessionsDialog({ open: propOpen, onClose: propOnClose }) {
  const { sessions: allSessions, dialogOpen: contextOpen, closeDialog } =
    useContext(SessionContext);


  const open = propOpen ?? contextOpen;
  const onClose = propOnClose ?? closeDialog;

  if (!open) return null;

  const sessionArray = Array.isArray(allSessions)
    ? allSessions
    : Object.values(allSessions || {});

  // Group sessions by status
  const grouped = sessionArray.reduce((acc, s) => {
    const key = s.status?.toLowerCase() || "unknown";
    acc[key] = acc[key] || [];
    acc[key].push(s);
    return acc;
  }, {});

  const statuses = Object.keys(grouped);
  const [activeTab, setActiveTab] = useState(statuses[0] || "");

  return (
    <>

    <div className="dialog-backdrop">
      <div className="dialog-box wide">
        <header className="dialog-header">
          <h2>📚 All Session Details</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </header>

        {/* Scrollable Status Tabs */}
        <div className="tab-header scroll-x">
          {statuses.map((status) => (
            <button
              key={status}
              className={`tab-btn ${activeTab === status ? "active" : ""}`}
              onClick={() => setActiveTab(status)}
            >
              {status.toUpperCase()} ({grouped[status].length})
            </button>
          ))}
        </div>

        {/* Main Scroll Container (Vertical) */}
        <div className="tab-scroll-container scroll-y">
          {grouped[activeTab]?.length > 0 ? (
            grouped[activeTab].map((session, index) => (
              <SessionCard
                key={session._id || index}
                session={session}
                index={index + 1}
              />
            ))
          ) : (
            <p className="empty">No sessions found.</p>
          )}
        </div>

        <footer className="dialog-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
    </>
    
  );
}

function SessionCard({ session, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`session-card ${session.status?.toLowerCase()}`}
      onClick={() => setOpen(!open)}
    >
      <div className="session-header">
        <div className="session-index">{index}</div>
        <div className="session-main">
          <p>
            <strong>{session.requestedBy}</strong> – {session.program}
          </p>
          <small>{session.dateRequested}</small>
        </div>
        <span className={`status-tag ${session.status?.toLowerCase()}`}>
          {session.status}
        </span>
      </div>

      {open && (
        <div className="session-details">
          <DetailRow label="Service" value={session.service} />
          <DetailRow label="Mode" value={session.mode} />
          <DetailRow label="Tutor" value={session.tutor} />
          <DetailRow label="Notes" value={session.notes} />
          <DetailRow label="Created" value={session.createdAt} />
          <DetailRow label="Updated" value={session.updatedAt} />
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <strong>{label}:</strong> <span>{value || "—"}</span>
    </div>
  );
}
