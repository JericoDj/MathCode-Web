import React, { useState } from "react";
import { PlanContext } from "./PlanContext.jsx";
import PlanDialog from "../components/PlanDialog/PlanDialog.jsx";

export function PlanProvider({ children }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [plan, setPlan] = useState(null);

  const openPlanDialog = (planData = {}) => {
    setPlan(planData);
    setDialogOpen(true);
  };

  const closePlanDialog = () => setDialogOpen(false);

  const updateCard = (cardInfo) => {
    setPlan((prev) => ({ ...prev, card: cardInfo }));
  };

  const deleteCard = () => {
    setPlan((prev) => ({ ...prev, card: null }));
  };

  const cancelPlan = () => {
    setPlan((prev) => ({ ...prev, status: "Cancelled" }));
  };

  return (
    <PlanContext.Provider
      value={{
        plan,
        dialogOpen,
        openPlanDialog,
        closePlanDialog,
        updateCard,
        deleteCard,
        cancelPlan,
      }}
    >
      {children}
      <PlanDialog />
    </PlanContext.Provider>
  );
}
