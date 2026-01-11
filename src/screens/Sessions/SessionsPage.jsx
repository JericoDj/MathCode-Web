import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import { useSessions } from "../../context/SessionsContext.jsx";
import QuickJoinCardSession from "../../components/QuickJoinSessionCard/QuickJoinCardSession.jsx";
import SessionDetailsDialog from "../../components/SessionDetailsDialog/SessionDetailsDialog.jsx";
import "./SessionsPage.css";

export default function SessionsPage() {
  const { user } = useContext(UserContext);
  const { sessions, loading, error, loadUserSessions } = useSessions();
  const [filter, setFilter] = useState("all");
  const [details, setDetails] = useState(null);

  const statusColor = {
    scheduled: "var(--primary)",
    completed: "var(--success)",
    cancelled: "var(--danger)",
    "no-show": "var(--danger)"
  };

  const formatDateTime = (date, time) => {
    const d = new Date(date);
    const formattedDate = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    if (!time) return formattedDate;
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hh = h % 12 || 12;
    return `${formattedDate} • ${hh}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const filtered = sessions.filter((s) => {
    if (filter === "all") return true;
    const st = s.status?.toLowerCase();
    if (filter === "cancelled") return st === "cancelled" || st === "no-show";
    return st === filter;
  });

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
  );

  const count = (st) => {
    if (st === "all") return sessions.length;
    if (st === "cancelled") {
      return (
        sessions.filter((s) => s.status === "cancelled").length +
        sessions.filter((s) => s.status === "no-show").length
      );
    }
    return sessions.filter((s) => s.status === st).length;
  };

  const quickJoin = sessions.filter(
    (s) => s.status === "scheduled" && s.meetingLink
  );

  return (
    <div className="sessions-page">
      <div className="sessions-header">
        {quickJoin.length > 0 && (
          <div className="quick-join-section">
            <div>
              <h2>🎯 Quick Join</h2>
              <p>Your upcoming tutoring sessions</p>
            </div>
            <div className="quick-join-cards">
              {quickJoin.slice(0, 3).map((s, i) => (
                <QuickJoinCardSession key={s._id || i} session={s} />
              ))}
            </div>
          </div>
        )}

        <h1>Session Management</h1>
        <p>View and manage all your tutoring sessions</p>
      </div>

      <div className="session-stats">
        <div className="stat-card">
          <div className="stat-icon scheduled">🎯</div>
          <div className="stat-info">
            <h3>{count("scheduled")}</h3>
            <p>Scheduled</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">✔</div>
          <div className="stat-info">
            <h3>{count("completed")}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cancelled">❌</div>
          <div className="stat-info">
            <h3>{count("cancelled")}</h3>
            <p>Cancelled / No-show</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon total">📊</div>
          <div className="stat-info">
            <h3>{sessions.length}</h3>
            <p>Total</p>
          </div>
        </div>
      </div>

      <div className="sessions-tabs">
        {["all", "scheduled", "completed", "cancelled"].map((t) => (
          <button
            key={t}
            className={`tab ${filter === t ? "active" : ""}`}
            onClick={() => setFilter(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} ({count(t)})
          </button>
        ))}
      </div>

      <div className="sessions-list">
  {sorted.length === 0 ? (
    <div className="empty-state">
      <div className="empty-icon">📅</div>
      <h3>No sessions found</h3>
      <p>Try switching filters or refreshing.</p>
    </div>
  ) : (
    sorted.map((s, i) => (
      <div className="session-row-card" key={s._id || i}>
        
        {/* LEFT SIDE */}
        <div className="sr-left">
          <div className="sr-title">
            {s.subject || "Tutoring Session"}
          </div>

          <div className="sr-row">
            {formatDateTime(s.date, s.time)}
          </div>

          <div className="sr-row">
            Duration: {s.duration || 60} mins
          </div>

          <div className="sr-row">
            Package: {s.packageType || "N/A"}
          </div>

          {s.creditsUsed != null && (
            <div className="sr-row credits-badge">
              {s.creditsUsed} credits
            </div>
          )}

          <div className="sr-gray">
            Tutor: {s.tutorName || "N/A"}
          </div>

          <div className="sr-gray">
            Student: {s.studentName || "N/A"}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="sr-right">
          
           {s.status === "scheduled" && s.meetingLink && (
            <button
              className="Join-btn"
              onClick={() => window.open(s.meetingLink, "_blank")}
            >
              🚀 Join
            </button>
          )}

          
          <span
            className={`sr-status ${s.status?.toLowerCase()}`}
          >
            {s.status?.toUpperCase()}
          </span>

         
          <button
            className="details-btn"
            onClick={() => setDetails(s)}
          >
            View Details →
          </button>
        </div>
      </div>
    ))
  )}
</div>

      {details && (
        <SessionDetailsDialog session={details} onClose={() => setDetails(null)} />
      )}
    </div>
  );
}
