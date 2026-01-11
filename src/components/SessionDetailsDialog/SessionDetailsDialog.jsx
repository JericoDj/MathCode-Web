import React from "react";
import "./SessionDetailsDialog.css";

export default function SessionDetailsDialog({ session, onClose }) {
  if (!session) return null;

  const statusColor = {
    scheduled: "var(--success)",
    completed: "var(--primary)",
    cancelled: "var(--danger)",
    "no-show": "var(--danger)",
  };

  const formatDateTime = (date, time) => {
    const d = new Date(date);
    const formattedDate = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    if (!time) return formattedDate;

    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hh = h % 12 || 12;

    return `${formattedDate} at ${hh}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const copy = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="sd-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sd-box">

        {/* HEADER */}
        <div className="sd-header">

          <div>

            <h2>{session.subject || "Tutoring Session"}</h2>

            <div className="space">
            
            </div>

            <div className="sd-header-right">
              {session.status && (
                <span
                  className="sd-status-badge"
                  style={{ background: statusColor[session.status?.toLowerCase()] }}
                >
                  {session.status.toUpperCase()}
                </span>
              )}
            </div>

          </div>


          <button className="btn-close" onClick={onClose}>✕</button>
        </div>


        <div className="sd-divider" />

        {/* ROWS LIKE PACKAGE */}
        <div className="detail-row">
          <span className="detail-label">Date & Time</span>
          <span className="detail-value">{formatDateTime(session.date, session.time)}</span>
        </div>

        <div className="sd-row">
          <span className="detail-label">Duration</span>
          <span className="detail-value">{session.duration || "N/A"} mins</span>
        </div>

        <div className="sd-row">
          <span className="sd-label">Package</span>
          <span className="sd-value">{session.packageType || "N/A"}</span>
        </div>

        {session.creditsUsed != null && (
          <div className="sd-row">
            <span className="sd-label">Credits</span>
            <span className="sd-value">{session.creditsUsed}</span>
          </div>
        )}

        <div className="sd-row">
          <span className="sd-label">Tutor</span>
          <span className="sd-value">{session.tutorName || "N/A"}</span>
        </div>

        <div className="sd-row">
          <span className="sd-label">Student</span>
          <span className="sd-value">{session.studentName || "N/A"}</span>
        </div>

        {session.meetingLink && (
          <div className="session-field">
  <span className="session-field-label">Meeting Link</span>
  <div className="session-field-content">
    <a
      href={session.meetingLink}
      target="_blank"
      rel="noopener noreferrer"
      className="session-join-link"
    >
      Click to join meeting
    </a>
    <span className="session-raw-link">
      {session.meetingLink}
    </span>
  </div>
</div>
        )}

        {/* NOTES COMBINED BLOCK */}
        {(session.notes || session.sessionNotes || session.feedback) && (
          <div className="sd-notes-block">
            {session.notes && <div><strong>Notes:</strong> {session.notes}</div>}
            {session.sessionNotes && <div><strong>Tutor Notes:</strong> {session.sessionNotes}</div>}
            {session.feedback && <div><strong>Feedback:</strong> {session.feedback}</div>}
          </div>
        )}

        {/* FOOTER BUTTONS */}
        <div className="sd-footer">
          {session.meetingLink && session.status === "scheduled" && (
            <button className="btn-primary" onClick={() => window.open(session.meetingLink, "_blank")}>
              🚀 Join Meeting
            </button>
          )}

          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
