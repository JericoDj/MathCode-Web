import { createContext } from "react";

export const StudentContext = createContext({
  // Student data
  students: [],
  currentStudent: null,
  
  // Progress data
  progress: null,
  
  // Dialog state
  dialogOpen: false,
  
  // Student management functions
  loadStudents: () => {},
  getStudentById: () => {},
  setCurrentStudent: () => {},
  updateStudentProgress: () => {},
  refreshStudentData: () => {},
  
  // Dialog functions
  openProgressDialog: () => {},
  closeProgressDialog: () => {},
  
  // Loading states
  loading: false,
  error: null,
});