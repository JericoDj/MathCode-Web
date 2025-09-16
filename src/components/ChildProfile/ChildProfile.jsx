import React from "react";
import "./ChildProfile.css";

export default function ChildProfile({ childName, programName, completedSessions }) {
  const codingStats = {
    Logic: 80,
    Creativity: 65,
    "Problem Solving": 70,
  };

  const mathStats = {
    Computation: 75,
    "Word Problems": 60,
    Logic: 85,
  };

  return (
    <section className="card child-profile">
      <h3>My Child</h3>

      <div className="child-grid half-half">
        {/* Left Column: Avatar + Details + Buttons */}
        <div className="child-left">
          <div className="child-info">
            <img
              src="https://picsum.photos/seed/child/100/100"
              alt={childName}
              className="child-avatar"
            />
            <div className="child-details">
              <p><strong>{childName}</strong> – Grade 3</p>
              <p>Enrolled in: <strong>{programName}</strong></p>
              <p>Progress: <strong>{completedSessions}/20 lessons</strong></p>
              <div className="skill-tags">
                <span className="tag">Loops</span>
                <span className="tag">Conditionals</span>
                <span className="tag">Scratch</span>
              </div>
            </div>
          </div>

          {/* Buttons below child details */}
          <div className="child-actions">
            <button className="btn small">📊 Check Progress</button>
            <button className="btn small">📅 View Sessions</button>
            <button className="btn small">⚙️ Manage Plan</button>
          </div>
        </div>

        {/* Right Column: Stats */}
        <div className="child-stats">

          <div className="stat-card">
            <h4>🔢 Singapore Math Stats</h4>
            <BarChart stats={mathStats} />
          </div>
          
          <div className="stat-card">
            <h4>⚡ Coding Stats</h4>
            <BarChart stats={codingStats} />
          </div>
          
        </div>
      </div>
    </section>
  );
}

function BarChart({ stats }) {
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
