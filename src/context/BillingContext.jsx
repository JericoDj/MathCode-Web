// src/contexts/BillingContext.js
import { createContext, useContext } from "react";

export const BillingContext = createContext(null);

export function useBilling() {
  return useContext(BillingContext);
}
