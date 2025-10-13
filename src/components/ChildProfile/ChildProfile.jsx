import React, { useContext, useEffect } from "react";
import "./ChildProfile.css";
import { SessionContext } from "../../context/SessionContext.jsx";
import { StudentContext } from "../../context/StudentContext.jsx";
import { PlanContext } from "../../context/PlanContext.jsx";

export default function ChildProfile({ childName, programName, completedSessions }) {
  const { openDialog,fetchAllSessions, allSessions} = useContext(SessionContext);
    const { openProgressDialog } = useContext(StudentContext);
  const { openPlanDialog } = useContext(PlanContext);
 
  useEffect(() => {
  fetchAllSessions();
}, []);

  // // Example session data (replace with backend data later)
  // const sessionData = [
  //   {
  //     _id: "68e751cffa9ba51b9c3a9e7c",
  //     requestedBy: "John Doe",
  //     program: "Scratch Coding",
  //     service: "One-on-One Tutoring",
  //     mode: "Online",
  //     tutor: "Ms. Smith",
  //     notes: "Focused on loops and conditionals",
  //     status: "pending",
  //     dateRequested: "2025-10-09",
  //     createdAt: "2025-10-09T06:10:23.313Z",
  //     updatedAt: "2025-10-09T06:10:23.313Z",
  //   },
  //    {
  //     _id: "68e75212fa9ba51b9c3a9e8d",
  //     requestedBy: "John Doe",
  //     program: "Singapore Math",
  //     service: "Group Lesson",
  //     mode: "Offline",
  //     tutor: "Mr. Tan",
  //     notes: "Covered word problems and logic puzzles",
  //     status: "cancelled",
  //     dateRequested: "2025-10-05",
  //     createdAt: "2025-10-05T10:15:00.000Z",
  //     updatedAt: "2025-10-06T12:30:00.000Z",
  //   },
  //   {
  //     _id: "68e75212fa9ba51b9c3a9e8d",
  //     requestedBy: "John Doe",
  //     program: "Singapore Math",
  //     service: "Group Lesson",
  //     mode: "Offline",
  //     tutor: "Mr. Tan",
  //     notes: "Covered word problems and logic puzzles",
  //     status: "approved",
  //     dateRequested: "2025-10-05",
  //     createdAt: "2025-10-05T10:15:00.000Z",
  //     updatedAt: "2025-10-06T12:30:00.000Z",
  //   },
  //    {
  //     _id: "68e75212fa9ba51b9c3a9e8d",
  //     requestedBy: "John Doe",
  //     program: "Singapore Math",
  //     service: "Group Lesson",
  //     mode: "Offline",
  //     tutor: "Mr. Tan",
  //     notes: "Covered word problems and logic puzzles",
  //     status: "approved",
  //     dateRequested: "2025-10-05",
  //     createdAt: "2025-10-05T10:15:00.000Z",
  //     updatedAt: "2025-10-06T12:30:00.000Z",
  //   },
  //    {
  //     _id: "68e75212fa9ba51b9c3a9e8d",
  //     requestedBy: "John Doe",
  //     program: "Singapore Math",
  //     service: "Group Lesson",
  //     mode: "Offline",
  //     tutor: "Mr. Tan",
  //     notes: "Covered word problems and logic puzzles",
  //     status: "approved",
  //     dateRequested: "2025-10-05",
  //     createdAt: "2025-10-05T10:15:00.000Z",
  //     updatedAt: "2025-10-06T12:30:00.000Z",
  //   },
  // ];

  // Example learning stats
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

  const handleViewSessions = () => {
    // ✅ Fix: pass the actual array, not nested
    // openDialog(sessionData);
        openDialog(allSessions);
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
    status: "Active", // or "Paused", "Cancelled"
    nextBilling: "2025-11-01",
    cardLast4: "4242", // example last 4 digits
    totalSessions: 20,
    remainingSessions: 17,
    transactions: [
      { date: "2025-10-01", amount: 49.99, status: "Paid" },
      { date: "2025-09-01", amount: 49.99, status: "Failed" },
      { date: "2025-08-01", amount: 49.99, status: "Pending" },
      { date: "2025-07-01", amount: 49.99, status: "Paid" },
      { date: "2025-06-01", amount: 49.99, status: "Paid" },
      { date: "2025-05-01", amount: 49.99, status: "Failed" },
      { date: "2025-04-01", amount: 49.99, status: "Paid" },
      { date: "2025-03-01", amount: 49.99, status: "Pending" },
      { date: "2025-02-01", amount: 49.99, status: "Paid" },
      { date: "2025-01-01", amount: 49.99, status: "Paid" },
      { date: "2024-12-01", amount: 49.99, status: "Paid" },
      { date: "2024-11-01", amount: 49.99, status: "Failed" },
    ],
  });
};



  return (
    <section className="card child-profile">
      <h3>My Child</h3>

      <div className="child-grid half-half">
        {/* Left Column */}
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

          <div className="child-actions">
            <button className="btn small" onClick={handleCheckProgress}>
    📊 Check Progress
  </button>
            {/* ✅ Use openDialog from context */}
            <button className="btn small" onClick={handleViewSessions}>
              📅 View All Sessions
            </button>
           <button className="btn small" onClick={handleManagePlan}>
  ⚙️ Manage Plan
</button>
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
