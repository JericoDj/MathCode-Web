// src/components/PlanDialog/PlanDialog.jsx
import React, { useContext, useState, useEffect } from "react";
import { PlanContext } from "../../context/PlanContext.jsx";
import { detectCardType } from "../../utils/CardUtils.jsx";
import "./PlanDialog.css";

export default function PlanDialog() {
  const {
    dialogOpen,
    closePlanDialog,
    plan,
    updateCard,
    deleteCard,
    cancelPlan,
  } = useContext(PlanContext);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [editingCard, setEditingCard] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    number: "",
    expiry: "",
    cvc: "",
    brand: "",
  });

  // transactions pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // reset local form when plan changes / dialog opens
  useEffect(() => {
    setEditingCard(false);
    setCardInfo({ number: "", expiry: "", cvc: "", brand: "" });
    setCurrentPage(1);
  }, [dialogOpen, plan]);

  if (!dialogOpen) return null;

  // derive stored last4, brand (support multiple shapes of plan.card)
  const storedCard =
    plan?.card ||
    (plan?.cardLast4 ? { last4: plan.cardLast4, brand: plan.cardBrand } : null);
  const storedLast4 =
    storedCard?.last4 ||
    (storedCard?.number ? String(storedCard.number).slice(-4) : null);

  // transactions sorted newest-first
  const transactions = Array.isArray(plan?.transactions) ? [...plan.transactions] : [];
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
  const paginatedTx = transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const paymentOptions = [
    { id: "card", label: "💳 Credit / Debit Card" },
    { id: "ewallet", label: "📱 E-Wallet" },
    { id: "qr", label: "🔲 QR Deposit" },
    { id: "bank", label: "🏦 Bank Transfer" },
  ];

  function handleCardInputChange(e) {
    const { name, value } = e.target;
    // allow formatting but keep brand detection based on digits
    const updated = { ...cardInfo, [name]: value };
    if (name === "number") {
      updated.brand = detectCardType(value);
    }
    setCardInfo(updated);
  }

  function validateCardInfo({ number, expiry, cvc }) {
    const clean = (number || "").replace(/\D/g, "");
    if (clean.length < 13 || clean.length > 19) return "Card number looks invalid";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Expiry must be MM/YY";
    if (!/^\d{3,4}$/.test(cvc)) return "CVC must be 3 or 4 digits";
    return null;
  }

  function handleSaveCard() {
    const err = validateCardInfo(cardInfo);
    if (err) return alert(err);

    const clean = cardInfo.number.replace(/\D/g, "");
    const last4 = clean.slice(-4);
    const cardPayload = {
      last4,
      brand: cardInfo.brand || detectCardType(cardInfo.number),
      expiry: cardInfo.expiry,
      // DO NOT store full number in production — use tokenization with Stripe/etc.
    };

    updateCard(cardPayload);
    setEditingCard(false);
    setCardInfo({ number: "", expiry: "", cvc: "", brand: "" });
  }

  function handleDeleteCard() {
    if (!storedLast4) return;
    if (window.confirm("Remove saved card ending with " + storedLast4 + "?")) {
      deleteCard();
    }
  }

  function handleCancelPlan() {
    if (!plan) return;
    if (window.confirm("Are you sure you want to cancel this subscription?")) {
      cancelPlan();
      // optionally close dialog after cancellation
      // closePlanDialog();
    }
  }

  return (
    <>
    <br/>
    <div className="dialog-backdrop">
      <div className="dialog-box">
        <header className="dialog-header">
          <h2>Manage Plan</h2>
          <button className="btn-close" onClick={closePlanDialog}>✕</button>
        </header>

        <div className="dialog-content">
          <h3>{plan?.name ?? "No Plan Selected"}</h3>
          <p><strong>Status:</strong> {plan?.status ?? "N/A"}</p>
          <p><strong>Next Billing:</strong> {plan?.nextBilling ?? "N/A"}</p>

          <hr />

          {/* Payment method selector */}
          <div className="payment-methods">
            <h4>Select Payment Method</h4>
            <div className="payment-buttons">
              {paymentOptions.map((opt) => (
                <button
                  key={opt.id}
                  className={`payment-btn ${paymentMethod === opt.id ? "active" : ""}`}
                  onClick={() => { setPaymentMethod(opt.id); setEditingCard(false); }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card UI: either show stored card or editing form */}
          {paymentMethod === "card" && (
            <div className="card-section">
              {!editingCard && storedLast4 ? (
                <div className="stored-card">
                  <p><strong>Saved Card:</strong> **** **** **** {storedLast4} {storedCard?.brand ? `(${storedCard.brand})` : ""}</p>
                  <div className="card-actions">
                    <button className="btn-small" onClick={() => { setEditingCard(true); setCardInfo({ number: "", expiry: "", cvc: "", brand: storedCard?.brand || "" }); }}>
                      Change
                    </button>
                    <button className="btn-small danger" onClick={handleDeleteCard}>Delete</button>
                  </div>
                </div>
              ) : (
                <div className="card-form">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="number"
                    maxLength="23"
                    placeholder="1234 5678 9012 3456"
                    value={cardInfo.number}
                    onChange={handleCardInputChange}
                  />
                  {cardInfo.brand && <div className="card-brand">Detected: {cardInfo.brand}</div>}

                  <div className="card-details">
                    <div className="field">
                      <label>Expiry (MM/YY)</label>
                      <input type="text" name="expiry" maxLength="5" placeholder="MM/YY" value={cardInfo.expiry} onChange={handleCardInputChange} />
                    </div>

                    <div className="field">
                      <label>CVC</label>
                      <input type="text" name="cvc" maxLength="4" placeholder="CVC" value={cardInfo.cvc} onChange={handleCardInputChange} />
                    </div>
                  </div>

                  <div className="card-form-actions">
                    <button className="btn-primary" onClick={handleSaveCard}>Save Card</button>
                    <button className="btn-small danger" onClick={() => { setEditingCard(false); setCardInfo({ number: "", expiry: "", cvc: "", brand: "" }); }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* E-wallet / QR / Bank placeholders */}
          {paymentMethod === "ewallet" && (
            <div className="ewallet-section">
              <p>Supported wallets: GCash, Maya, GrabPay</p>
              <p><small>Click Connect to authorize wallet (integration required)</small></p>
              <div className="card-form-actions">
                <button className="btn-primary">Connect E-Wallet</button>
              </div>
            </div>
          )}

          {paymentMethod === "qr" && (
            <div className="qr-section">
              <p>QR Deposit (upload or show QR to be provided later)</p>
              <div className="qr-placeholder">[QR IMAGE / CODE]</div>
            </div>
          )}

          {paymentMethod === "bank" && (
            <div className="bank-section">
              <p>Bank transfer instructions:</p>
              <p>Account: 1234-5678-9012 (My Company)</p>
              <p>Send receipt to support@yourapp.com</p>
            </div>
          )}

          <hr />

          {/* Transactions */}
          <section className="transactions-section">
            <h4>Recent Transactions</h4>

            {transactions.length === 0 ? (
              <p className="empty">No transactions yet.</p>
            ) : (
              <>
                <div className="transactions-scroll">
                  <ul>
                    {paginatedTx.map((tx, i) => (
                      <li key={i} className="tx-row">
                        <div className="tx-left">
                          <div className="tx-date">{tx.date}</div>
                          <div className="tx-desc">{tx.description ?? plan?.name ?? "Subscription"}</div>
                        </div>
                        <div className="tx-right">
                          <div className="tx-amount">${Number(tx.amount).toFixed(2)}</div>
                          <div className={`tx-status ${String(tx.status || "").toLowerCase()}`}>{tx.status}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>{'<'}</button>
                    {Array.from({ length: totalPages }, (_, idx) => (
                      <button
                        key={idx}
                        className={currentPage === idx + 1 ? "active" : ""}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>{'>'}</button>
                  </div>
                )}
              </>
            )}
          </section>

        </div>

        <footer className="dialog-actions">
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-small warning" onClick={handleCancelPlan}>Cancel Subscription</button>
          </div>
          <div>
            <button className="btn-secondary" onClick={closePlanDialog}>Close</button>
          </div>
        </footer>
      </div>
    </div>

    </>
  );
}
