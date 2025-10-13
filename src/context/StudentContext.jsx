import { createContext } from "react";

export const StudentContext = createContext({
  student: null,
  progress: null,
  dialogOpen: false,
  openProgressDialog: () => {},
  closeProgressDialog: () => {},
});