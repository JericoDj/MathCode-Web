// src/controllers/billing.controller.js

const BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/billing`;


export const billingController = {
  
  async getMyBillings() {
    const token = JSON.parse(localStorage.getItem("token"));

    console.log("Fetched token for billing:", token);
    const auth = JSON.parse(localStorage.getItem("auth"));
    console.log("Auth object:", auth.id);
    


    try {
      const res = await fetch(`${BASE_URL}/${auth.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("billingController.getMyBillings error:", err);
      return [];
    }
  },


  async payBilling(id, payload) {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/${id}/pay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Billing payment failed: ${res.status}`);

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("billingController.payBilling error:", err);
      throw err;
    }
  },
};
