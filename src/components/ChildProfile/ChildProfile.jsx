import React, { useContext, useEffect } from "react";
import "./ChildProfile.css";
import { PackageContext } from "../../context/PackageContext.jsx";
import { StudentContext } from "../../context/StudentContext.jsx";
import { PlanContext } from "../../context/PlanContext.jsx";

export default function ChildProfile({ childName, programName, completedSessions }) {
  const { openDialog, fetchAllPackages, allPackages } = useContext(PackageContext);
  const { openProgressDialog } = useContext(StudentContext);
  const { openPlanDialog } = useContext(PlanContext);
 
  useEffect(() => {
    fetchAllPackages();
  }, []);

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

  const handleViewPackages = () => {
    openDialog(allPackages);
  };

  const handleCheckProgress = () => {
    openProgressDialog({
      name: childName,
      program: programName,
      completedSessions,
      avatar: "https://picsum.photos/seed/child/100/100",
      progress: {
        Logic: 85,
        Computation: 70,
        Creativity: 65,
        "Problem Solving": 80,
      },
    });
  };

  const handleManagePlan = () => {
    openPlanDialog({
      name: `${childName} - ${programName} Plan`,
      status: "Active",
      nextBilling: "2025-11-01",
      cardLast4: "4242",
      totalSessions: 20,
      remainingSessions: 17,
      transactions: [
        { date: "2025-10-01", amount: 49.99, status: "Paid" },
        { date: "2025-09-01", amount: 49.99, status: "Failed" },
      ],
    });
  };

  return (
    <section className="child-profile-card">
      <div className="card-header">
        <h3>My Child's Profile</h3>
      </div>
      
      <div className="child-profile-content">
        <div className="child-info-section">
          <div className="child-avatar-container">
            <img
              src="https://picsum.photos/seed/child/120/120"
              alt={childName}
              className="child-avatar"
            />
            <div className="child-status">
              <span className="status-dot"></span>
              Active Learner
            </div>
          </div>
          
          <div className="child-details">
            <h4>{childName}</h4>
            <div className="detail-item">
              <span className="label">Grade Level:</span>
              <span className="value">Grade 3</span>
            </div>
            <div className="detail-item">
              <span className="label">Current Program:</span>
              <span className="value program">{programName}</span>
            </div>
            
            
            <div className="skill-tags">
              <span className="skill-tag">Loops</span>
              <span className="skill-tag">Conditionals</span>
              <span className="skill-tag">Scratch</span>
              <span className="skill-tag">Logic</span>
            </div>
          </div>
        </div>

        <div className="child-stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <h5>Math Skills</h5>
              </div>
              <div className="spacer p-1 p-md-5 p-lg-0"></div>
              <BarChart stats={mathStats} />
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <h5>Coding Skills</h5>
              </div>
              <div className="spacer p-1 p-md-5 p-lg-0"></div>
              <BarChart stats={codingStats} />
            </div>
          </div>
        </div>

        <div className="child-actions-section">
          <button className="action-btn progress-btn" onClick={handleCheckProgress}>
            <span className="btn-icon">📊</span>
            Check Progress
          </button>
          <button className="action-btn packages-btn" onClick={handleViewPackages}>
            <span className="btn-icon">📦</span>
            View Packages
          </button>
          <button className="action-btn plan-btn" onClick={handleManagePlan}>
            <span className="btn-icon">⚙️</span>
            Manage Plan
          </button>
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
            <div 
              className="bar-fill" 
              style={{ width: `${value}%` }}
              data-value={value}
            ></div>
          </div>
          <span className="bar-value pe-3">{value}%</span>
        </div>
      ))}
    </div>
  );
}