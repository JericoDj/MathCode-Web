import React from "react";
import "./QuickJoinCardSession.css";

export default function QuickJoinCardSession({ session }) {

  const formatDateTime = (date, time) => {
    if (!date) return { date: "TBD", time: "TBD" };

    const d = new Date(date);

    const formattedDate = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });

    if (!time) {
      return { date: formattedDate, time: "TBD" };
    }

    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hours12 = h % 12 || 12;
    const formattedTime = `${hours12}:${m.toString().padStart(2, "0")} ${period}`;

    return { date: formattedDate, time: formattedTime };
  };

  const { date, time } = formatDateTime(session.date, session.time);

  const handleJoin = () => {
    if (session.meetingLink) {
      window.open(session.meetingLink, "_blank", "noopener,noreferrer");
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
          <span className="label">Tutor:</span>
          <span className="value">{session.tutorName || session.tutor || "Tutor"}</span>
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

        {session.packageType && (
          <div className="join-detail">
            <span className="label">Package:</span>
            <span className="value">{session.packageType}</span>
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
