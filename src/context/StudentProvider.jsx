import React, { useState } from "react";
import { StudentContext } from "../context/StudentContext.jsx";
import StudentProgressDialog from "../components/StudentProgress/StudentProgressDialog.jsx";

export function StudentProvider({ children }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState({});

  // ✅ Function to open dialog and set progress data
  const openProgressDialog = (studentData = {}) => {
    setStudent(studentData);
    setProgress(studentData?.progress || {});
    setDialogOpen(true);
  };

  // ✅ Function to close the dialog
  const closeProgressDialog = () => {
    setDialogOpen(false);
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        progress,
        dialogOpen,
        openProgressDialog,
        closeProgressDialog,
      }}
    >
      {children}

      {/* ✅ Dialog always rendered globally; visible when open */}
      <StudentProgressDialog
        open={dialogOpen}
        onClose={closeProgressDialog}
        student={student}
        progress={progress}
      />
    </StudentContext.Provider>
  );
}
