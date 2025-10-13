import { createContext } from "react";

export const PlanContext = createContext({
  plan: null,
  dialogOpen: false,
  openPlanDialog: () => {},
  closePlanDialog: () => {},
});