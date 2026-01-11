// src/contexts/BillingProvider.jsx
import React, { useState, useEffect } from "react";
import { BillingContext } from "./BillingContext";
import { billingController } from "../controllers/BillingController.jsx";

export default function BillingProvider({ children }) {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBillings = async () => {
    try {
      setLoading(true);
      const data = await billingController.getMyBillings();
      setBillings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load billing:", err);
    } finally {
      setLoading(false);
    }
  };

  const payBilling = async (id, payload) => {
    const result = await billingController.payBilling(id, payload);
    fetchBillings(); // refresh
    return result;
  };

  useEffect(() => {
    fetchBillings();
  }, []);

  return (
    <BillingContext.Provider value={{ billings, loading, fetchBillings, payBilling }}>
      {children}
    </BillingContext.Provider>
  );
}
