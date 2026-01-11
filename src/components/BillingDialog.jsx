// src/components/Billing/BillingDialog.jsx
import React from "react";

export default function BillingDialog({ billing, onClose, onPay }) {
  if (!billing) return null;

  return (
    <div className="billing-dialog-overlay" onClick={onClose}>
      <div className="billing-dialog" onClick={(e) => e.stopPropagation()}>
        
        <div className="dialog-header">
          <h3>Invoice: {billing.invoiceNumber || "N/A"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="dialog-body">
          <p><strong>Package:</strong> {billing.package}</p>
          <p><strong>Amount:</strong> {billing.amount} {billing.currency}</p>
          {billing.childName && <p><strong>Child:</strong> {billing.childName}</p>}
          <p><strong>Status:</strong> {billing.status}</p>
          <p><strong>Due Date:</strong> {billing.dueDate ? new Date(billing.dueDate).toLocaleDateString() : "N/A"}</p>
          {billing.description && (<p><strong>Description:</strong> {billing.description}</p>)}
        </div>

        <div className="dialog-actions">
          {(billing.status === "pending") && (
            <button className="pay-btn" onClick={() => onPay(billing)}>Pay Now</button>
          )}

          <button className="close-outline-btn" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}
