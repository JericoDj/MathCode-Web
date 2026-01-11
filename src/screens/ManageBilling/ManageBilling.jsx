import { useState, useContext } from "react";
import { PlanContext } from "../../context/PlanContext.jsx";
import { BillingContext } from "../../context/BillingContext.jsx";
import "./ManageBilling.css";

export default function ManageBilling() {
  const { openPlanDialog } = useContext(PlanContext);
  const { billings, loading, payBilling } = useContext(BillingContext);

  const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const children = [
    { id: 1, name: "Luna" },
    { id: 2, name: "Max" },
    { id: 3, name: "Sophia" },
  ];

  const availablePaymentMethods = [
    { id: "card_visa_4242", type: "visa", last4: "4242", expiry: "06/27", name: "Visa ending in 4242" },
    { id: "card_mc_8888", type: "mastercard", last4: "8888", expiry: "12/26", name: "Mastercard ending in 8888" },
    { id: "paypal_1", type: "paypal", email: "parent@example.com", name: "PayPal (parent@example.com)" },
  ];

  return (
    <>
      <br />

      <div className="billing-settings">
        <h2>Manage Payment Methods</h2>
        <p className="me-auto">
          Set up and manage payment methods for your children's tutoring sessions.
        </p>

<br />
        {/* Billing History */}
        <section className="card full-width">
          <div className="section-header">
            <h3>Billing History</h3>
            <div className="history-actions">
              <button className="btn-outline small">Export CSV</button>
              <button className="btn-outline small">Filter</button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Invoice</th>
                  <th>Child / Package</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="6">Loading billing history...</td>
                  </tr>
                )}

                {!loading && billings.length === 0 && (
                  <tr>
                    <td colSpan="6">No billing history yet.</td>
                  </tr>
                )}

                {!loading &&
                  billings.map((b) => (
                    <tr key={b._id}>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td>#{b.invoiceNumber}</td>
                      <td>
                        <div className="invoice-details">
                          <strong>{b.childName || "—"}</strong>
                          <span>{b.package}</span>
                        </div>
                      </td>
                      <td>{b.amount} {b.currency}</td>
                      <td>
                        <span className={`status ${b.status}`}>
                          {b.status}
                        </span>
                      </td>
                      <td>
                        <div className="billing-action-buttons">
                          <button
                            className="btn-view small"
                            onClick={() => {
                              setSelectedBill(b);
                              setShowBillingDialog(true);
                            }}
                          >
                            View
                          </button>

                          {/* {b.status === "pending" && (
                            <button
                              className="btn-pay small"
                              onClick={() => {
                                setSelectedBill(b);
                                setShowBillingDialog(true);
                              }}
                            >
                              Pay
                            </button>
                          )} */}

                          {b.status === "paid" && (
                            <button
                              className="btn-outline small"
                              onClick={() => console.log("Download invoice", b._id)}
                            >
                              Receipt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div className="pagination">
              <button className="btn-outline small">Previous</button>
              <span className="page-info">Page 1 of 1</span>
              <button className="btn-outline small">Next</button>
            </div>
          </div>
        </section>
      </div>

      {/* Payment Method Dialog */}
      {showPaymentMethodDialog && (
        <PaymentMethodDialog
          child={selectedChild}
          availablePaymentMethods={availablePaymentMethods}
          onClose={() => {
            setShowPaymentMethodDialog(false);
            setSelectedChild(null);
          }}
        />
      )}

      {/* Billing View Dialog */}
      {showBillingDialog && selectedBill && (
        <BillingDialog
          bill={selectedBill}
          onClose={() => {
            setShowBillingDialog(false);
            setSelectedBill(null);
          }}
          onPay={payBilling}
        />
      )}
    </>
  );
}


/* Billing Dialog */
function BillingDialog({ bill, onClose, onPay }) {
  return (
    <div className="dialog-backdrop">
      <div className="dialog-box invoice-dialog">
        <div className="dialog-header">
          <h2>Invoice #{bill.invoiceNumber}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="dialog-content invoice-body">
          <div className="invoice-row">
            <span className="invoice-label">Package:</span>
            <span className="invoice-value">{bill.package}</span>
          </div>

          <div className="invoice-row">
            <span className="invoice-label">Child:</span>
            <span className="invoice-value">{bill.childName || "—"}</span>
          </div>

          <div className="invoice-row">
            <span className="invoice-label">Amount:</span>
            <span className="invoice-value">{bill.amount} {bill.currency}</span>
          </div>

          <div className="invoice-row">
            <span className="invoice-label">Status:</span>
            <span className={`invoice-status invoice-${bill.status}`}>
              {bill.status}
            </span>
          </div>

          <div className="invoice-row">
            <span className="invoice-label">Due:</span>
            <span className="invoice-value">
              {bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : "—"}
            </span>
          </div>

          <div className="invoice-divider" />

          <div className="invoice-row">
            <span className="invoice-label">Created:</span>
            <span className="invoice-value">
              {new Date(bill.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="dialog-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>

          {bill.status === "pending" && (
            <button
              className="btn-primary"
              onClick={() => onPay(bill._id, { method: "manual" })}
            >
              Pay Now
            </button>
          )}

          {bill.status === "paid" && (
            <button className="btn-outline" onClick={() => console.log("Download receipt")}>
              Download Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


/* Payment Method Dialog */
function PaymentMethodDialog({ child, availablePaymentMethods, onClose }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  return (
    <div className="dialog-backdrop">
      <div className="dialog-box payment-method-dialog">
        <div className="dialog-header">
          <h2>{child ? `Payment Method for ${child.name}` : "Manage Payment Methods"}</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="dialog-content">
          <div className="payment-options">
            {availablePaymentMethods.map((pm) => (
              <label key={pm.id} className="payment-option">
                <input
                  type="radio"
                  name="payment-method"
                  value={pm.id}
                  checked={selectedPaymentMethod === pm.id}
                  onChange={() => setSelectedPaymentMethod(pm.id)}
                />
                <span>{pm.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="dialog-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!selectedPaymentMethod}>Save</button>
        </div>
      </div>
    </div>
  );
}
