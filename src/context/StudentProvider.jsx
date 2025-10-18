import React, { useState, useContext, useEffect } from "react";
import { StudentContext } from "./StudentContext.jsx";
import { UserContext } from "./UserContext.jsx";
import StudentProgressDialog from "../components/StudentProgress/StudentProgressDialog.jsx";

export function StudentProvider({ children }) {
  const { user } = useContext(UserContext);
  
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudentState] = useState(null);
  const [progress, setProgress] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch user data (and guardiansOf list) when user changes
  useEffect(() => {
    if (user) {
      fetchStudentsFromAPI();
    }
  }, [user]);

  // ✅ Function to call your backend endpoint `/api/users/me`
  const fetchStudentsFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = JSON.parse(localStorage.getItem("token")); // ensure your app stores the JWT here

      const res = await fetch("http://localhost:4000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch user data (${res.status})`);
      }

      const data = await res.json();

      const guardianOf = data.guardianOf || [];

      // ✅ Format students list from guardianOf
      const formattedStudents = guardianOf.map((child) => ({
        id: child._id,
        firstName: child.firstName,
        lastName: child.lastName,
        fullName: `${child.firstName} ${child.lastName}`.trim(),
        email: child.email || "",
        phone: child.phone || "",
        gradeLevel: child.gradeLevel || "",
        address: child.address || "",
        school: child.school || "",
        avatar: `https://picsum.photos/seed/${child.firstName?.toLowerCase() || "student"}/80`,
        progress: {
          overallScore: Math.floor(Math.random() * 30) + 70,
          completedSessions: Math.floor(Math.random() * 20) + 5,
          attendanceRate: Math.floor(Math.random() * 30) + 70,
          skills: [
            { name: "Mathematics", level: Math.floor(Math.random() * 5) + 1 },
            { name: "Reading", level: Math.floor(Math.random() * 5) + 1 },
            { name: "Writing", level: Math.floor(Math.random() * 5) + 1 },
            { name: "Science", level: Math.floor(Math.random() * 5) + 1 },
          ],
          recentActivities: [
            { date: "2024-01-15", activity: "Completed Algebra Quiz", score: 85 },
            { date: "2024-01-12", activity: "Attended Math Session", status: "Completed" },
            { date: "2024-01-10", activity: "Submitted Homework", score: 92 },
          ],
        },
        createdAt: child.createdAt || new Date().toISOString(),
      }));

  

      setStudents(formattedStudents);
    } catch (err) {
      console.error("❌ Failed to fetch students:", err);
      setError("Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };


  const updateStudent = async (studentId, studentData) => {
  setLoading(true);
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    console.log(studentId);

    const res = await fetch(`http://localhost:4000/api/students/${studentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(studentData),
    });
        console.log(res);

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to update student");
    }

    const data = await res.json();
    

    console.log(data);
    // ✅ Update local state
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...data.student } : s))
    );

    return data.student;
  } catch (err) {
    console.error("❌ Failed to update student:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

  // ✅ Get student by ID
  const getStudentById = (studentId) => students.find((s) => s.id === studentId);

  const setCurrentStudent = (studentId, openDialog = false) => {
    const student = getStudentById(studentId);
    if (student) {
      setCurrentStudentState(student);
      setProgress(student.progress);
      if (openDialog) setDialogOpen(true);
    }
  };

  const updateStudentProgress = async (studentId, progressData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, progress: { ...s.progress, ...progressData } } : s
        )
      );

      if (currentStudent?.id === studentId) {
        setCurrentStudentState((prev) => ({
          ...prev,
          progress: { ...prev.progress, ...progressData },
        }));
        setProgress((prev) => ({ ...prev, ...progressData }));
      }
      return true;
    } catch (err) {
      setError("Failed to update progress");
      console.error("Progress update failed:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshStudentData = () => fetchStudentsFromAPI();

  const openProgressDialog = (studentData = null) => {
    if (studentData) {
      setCurrentStudentState(studentData);
      setProgress(studentData.progress || {});
    }
    setDialogOpen(true);
  };

  const closeProgressDialog = () => setDialogOpen(false);
  const clearError = () => setError(null);

  const contextValue = {
    students,
    currentStudent,
    progress,
    dialogOpen,
    loading,
    error,
    getStudentById,
    setCurrentStudent,
    updateStudentProgress,
    refreshStudentData,
    openProgressDialog,
    closeProgressDialog,
    clearError,
    updateStudent,
  };

  return (
    <StudentContext.Provider value={contextValue}>
      {children}

      <StudentProgressDialog
        open={dialogOpen}
        onClose={closeProgressDialog}
        student={currentStudent}
        progress={progress}
        onUpdateProgress={updateStudentProgress}
        loading={loading}
      />
    </StudentContext.Provider>
  );
}
