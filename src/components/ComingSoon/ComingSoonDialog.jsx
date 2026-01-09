import React from "react";
import "./ComingSoonDialog.css";

export default function ComingSoonDialog({ open, onClose, title = "Coming Soon", message }) {
  if (!open) return null;

  return (
    <div className="cs-overlay" onClick={onClose}>
      <div className="cs-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="cs-close" onClick={onClose}>✕</button>

        <h2 className="cs-title">{title}</h2>

        {message && <p className="cs-message">{message}</p>}

        <span className="cs-tag">Coming Soon 🚀</span>

        <button className="cs-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
