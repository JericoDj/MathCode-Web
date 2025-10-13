// src/components/StudentProgress/StudentProgressChart.jsx
import React from "react";

export default function StudentProgressChart({ stats = {} }) {
  if (!stats || Object.keys(stats).length === 0) {
    return <p className="empty">No progress data yet.</p>;
  }

  return (
    <div className="bar-chart">
      {Object.entries(stats).map(([label, value]) => (
        <div key={label} className="bar-row">
          <span className="bar-label">{label}</span>
          <div className="bar-container">
            <div className="bar-fill" style={{ width: `${value}%` }} />
          </div>
          <span className="bar-value">{value}%</span>
        </div>
      ))}
    </div>
  );
}
