import { useState } from "react";
import "./ManageBilling.css";

export default function ManageBilling() {
  const [plan, setPlan] = useState("Pro Plan");

  return (
    <>
      <br />
      <br />
      <br />

      <div className="billing-settings">
        <h2>Manage Plan & Billing</h2>
        <p className="intro">
          View your subscription details, invoices, and payment methods
        </p>

        <div className="billing-grid">
          {/* Current Plan */}
          <section className="card">
            <h3>Current Plan</h3>
            <div className="plan-info">
              <p className="plan-name">{plan}</p>
              <p className="plan-price">$29 / month</p>
              <button className="btn-primary">Change Plan</button>
            </div>
          </section>

          {/* Payment Method */}
          <section className="card">
            <h3>Payment Method</h3>
            <div className="payment-method">
              <img
                src="https://img.icons8.com/color/48/visa.png"
                alt="Visa"
                className="payment-icon"
              />
              <div>
                <p><strong>Visa ending in 4242</strong></p>
                <small>Expires 06/27</small>
              </div>
            </div>
            <button className="btn-outline full">Update Payment Method</button>
          </section>
        </div>

        {/* Billing History */}
        <section className="card">
          <h3>Billing History</h3>
          <div className="table-wrapper">
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Invoice</th>
                  <th>Child / Package</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sep 01, 2025</td>
                  <td>#INV-1001</td>
                  <td>Luna – Scratch Coding (3/5 sessions)</td>
                  <td>$49.00</td>
                  <td><span className="status paid">Paid</span></td>
                  <td><button className="btn-outline small">Download</button></td>
                </tr>
                <tr>
                  <td>Aug 01, 2025</td>
                  <td>#INV-0999</td>
                  <td>Max – Python Basics (5/10 sessions)</td>
                  <td>$79.00</td>
                  <td><span className="status paid">Paid</span></td>
                  <td><button className="btn-outline small">Download</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
