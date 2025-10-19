    import React, { useContext } from "react";
    import "./StudentProgressDialog.css";
    import { StudentContext } from "../../context/StudentContext.jsx";
    import StudentProgressChart from "./StudentProgressChart.jsx";

    export default function StudentProgressDialog() {
    const { dialogOpen, student, progress, closeProgressDialog } =
        useContext(StudentContext);

    if (!dialogOpen || !student) return null;

    return (
        <div className="dialog-backdrop">
        <div className="dialog-box medium">
            <header className="dialog-header">
            <h2>📊 {student.name}'s Progress</h2>
            <button className="btn-close" onClick={closeProgressDialog}>
                ✕
            </button>
            </header>

            <div className="progress-body">
            <div className="student-summary">
                <img
                src={student.avatar || "https://picsum.photos/seed/student/100/100"}
                alt={student.name}
                className="student-avatar"
                />
                <div>
                <p><strong>{student.name}</strong></p>
                <p>Program: <strong>{student.program}</strong></p>
                <p>Completed: {student.completedPackages}/20 lessons</p>
                </div>
            </div>

            <h4>Performance Breakdown</h4>
            <StudentProgressChart stats={progress} />
            </div>

            <footer className="dialog-actions">
            <button className="btn-secondary" onClick={closeProgressDialog}>
                Close
            </button>
            </footer>
        </div>
        </div>
    );
    }
