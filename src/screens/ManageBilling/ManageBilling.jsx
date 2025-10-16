import { useState, useContext } from "react";
import { PlanContext } from "../../context/PlanContext.jsx";
import "./ManageBilling.css";

export default function ManageBilling() {
  const { openPlanDialog } = useContext(PlanContext);
  const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  // Mock data - replace with actual data from context/API
  const children = [
    {
      id: 1,
      name: "Luna",
      grade: "Grade 3",
      program: "Beginner Scratch Coding",
      progress: "3/5 sessions completed",
      avatar: "https://picsum.photos/seed/luna/80/80",
      paymentMethod: {
        type: "visa",
        last4: "4242",
        expiry: "06/27",
        isDefault: true
      }
    },
    {
      id: 2,
      name: "Max",
      grade: "Grade 5",
      program: "Python Basics",
      progress: "5/10 sessions completed",
      avatar: "https://picsum.photos/seed/max/80/80",
      paymentMethod: {
        type: "mastercard",
        last4: "8888",
        expiry: "12/26",
        isDefault: false
      }
    },
    {
      id: 3,
      name: "Sophia",
      grade: "Grade 2",
      program: "Singapore Math",
      progress: "2/8 sessions completed",
      avatar: "https://picsum.photos/seed/sophia/80/80",
      paymentMethod: null // No payment method set
    }
  ];

  const availablePaymentMethods = [
    {
      id: "card_visa_4242",
      type: "visa",
      last4: "4242",
      expiry: "06/27",
      name: "Visa ending in 4242",
      gradient: "linear-gradient(135deg, #1a1f71 0%, #f7b600 100%)",
      bank: "Chase Bank",
      holder: "John Doe"
    },
    {
      id: "card_mc_8888",
      type: "mastercard",
      last4: "8888",
      expiry: "12/26",
      name: "Mastercard ending in 8888",
      gradient: "linear-gradient(135deg, #eb001b 0%, #f79e1b 50%, #ff5f00 100%)",
      bank: "Bank of America",
      holder: "John Doe"
    },
    {
      id: "paypal_1",
      type: "paypal",
      email: "parent@example.com",
      name: "PayPal (parent@example.com)",
      gradient: "linear-gradient(135deg, #003087 0%, #009cde 50%, #012169 100%)",
      bank: "PayPal Account",
      holder: "parent@example.com"
    },
    {
      id: "card_amex_1234",
      type: "amex",
      last4: "1234",
      expiry: "09/28",
      name: "American Express ending in 1234",
      gradient: "linear-gradient(135deg, #2e77bb 0%, #4d4d4d 100%)",
      bank: "American Express",
      holder: "John Doe"
    }
  ];

  const handleManagePayment = (child) => {
    setSelectedChild(child);
    setShowPaymentMethodDialog(true);
  };

  const handleUpdatePayment = () => {
    openPlanDialog({
      name: "Pro Plan",
      status: "Active",
      nextBilling: "2025-11-01",
      totalSessions: 10,
      remainingSessions: 7,
      transactions: [
        { date: "2025-10-01", amount: 29.99, status: "Paid" },
        { date: "2025-09-01", amount: 29.99, status: "Paid" },
        { date: "2025-08-01", amount: 29.99, status: "Failed" },
        { date: "2025-07-01", amount: 29.99, status: "Pending" },
      ],
    });
  };

  const getCardLogo = (type) => {
    const logos = {
      visa: "💳",
      mastercard: "💳", 
      amex: "💳",
      paypal: "🔵"
    };
    return logos[type] || "💳";
  };

  return (
    <>
      <br />
    

      <div className="billing-settings">
        <h2>Manage Payment Methods</h2>
        <p className="me-auto">
          Set up and manage payment methods for each child's tutoring sessions.
        </p>

        {/* Available Payment Methods Section - WHITE BACKGROUND WITH REAL CARDS */}
        <section className="card payment-methods-section full-width white-bg">
          <div className="section-header">
            <h3>Available Payment Methods</h3>
            <button 
              className="btn-primary"
              onClick={() => setShowPaymentMethodDialog(true)}
            >
              + Add New Payment Method
            </button>
          </div>
          
          <div className="payment-methods-grid">
            {availablePaymentMethods.map(payment => (
              <div 
                key={payment.id} 
                className="payment-method-card real-card"
                style={{ background: payment.gradient }}
              >
                <div className="card-chip"></div>
                <div className="card-logo">{getCardLogo(payment.type)}</div>
                
                <div className="card-number">
                  <span className="card-number-masked">•••• •••• •••• {payment.last4}</span>
                </div>
                
                <div className="card-details">
                  <div className="card-holder">
                    <span className="card-label">Card Holder</span>
                    <span className="card-value">{payment.holder}</span>
                  </div>
                  <div className="card-expiry">
                    <span className="card-label">Expires</span>
                    <span className="card-value">{payment.expiry}</span>
                  </div>
                </div>
                
                <div className="card-bank">{payment.bank}</div>
                
                <div className="payment-method-actions-overlay">
                  <button className="btn-card-edit">Edit</button>
                  <button className="btn-card-delete">Delete</button>
                </div>
                
                <div className="card-usage">
                  <span className="usage-badge">
                    Used by {children.filter(c => c.paymentMethod?.type === payment.type).length} child{children.filter(c => c.paymentMethod?.type === payment.type).length !== 1 ? 'ren' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="payment-methods-summary">
            <div className="summary-stats">
              <div className="stat">
                <span className="stat-number">{availablePaymentMethods.length}</span>
                <span className="stat-label">Total Methods</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {children.filter(c => c.paymentMethod !== null).length}
                </span>
                <span className="stat-label">Active Assignments</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {children.filter(c => c.paymentMethod === null).length}
                </span>
                <span className="stat-label">Need Setup</span>
              </div>
            </div>
          </div>
        </section>

        {/* Children Payment Methods Section - FULL WIDTH MIDDLE */}
        <section className="card children-payment-section full-width">
          <div className="section-header">
            <h3>Children Payment Assignments</h3>
            <button 
              className="btn-outline"
              onClick={handleUpdatePayment}
            >
              View Billing History
            </button>
          </div>
          <div className="children-payment-grid">
            {children.map(child => (
              <div key={child.id} className="child-payment-card">
                <div className="child-info">
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className="child-avatar"
                  />
                  <div className="child-details">
                    <h4>{child.name}</h4>
                    <p className="child-grade">{child.grade}</p>
                    <p className="child-program">{child.program}</p>
                    <p className="child-progress">{child.progress}</p>
                  </div>
                </div>
                
                <div className="payment-assignment">
                  <h5>Assigned Payment Method</h5>
                  {child.paymentMethod ? (
                    <div className="current-payment-method real-card-preview">
                      <div 
                        className="card-preview"
                        style={{ 
                          background: availablePaymentMethods.find(p => p.type === child.paymentMethod.type)?.gradient || 'linear-gradient(135deg, #666 0%, #999 100%)'
                        }}
                      >
                        <div className="card-chip-small"></div>
                        <div className="card-type">{child.paymentMethod.type.toUpperCase()}</div>
                        <div className="card-number-preview">•••• {child.paymentMethod.last4}</div>
                        <div className="card-expiry-preview">Exp {child.paymentMethod.expiry}</div>
                        {child.paymentMethod.isDefault && (
                          <div className="default-badge-card">Default</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="no-payment-method">
                      <div className="no-payment-icon">💳</div>
                      <p>No payment method assigned</p>
                      <small>Click manage to add a payment method</small>
                    </div>
                  )}
                  
                  <button 
                    className="btn-outline full"
                    onClick={() => handleManagePayment(child)}
                  >
                    {child.paymentMethod ? 'Change Payment' : 'Assign Payment'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Billing History Section - FULL WIDTH BOTTOM */}
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
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sep 01, 2025</td>
                  <td>#INV-1001</td>
                  <td>
                    <div className="invoice-details">
                      <strong>Luna</strong>
                      <span>Scratch Coding (3/5 sessions)</span>
                    </div>
                  </td>
                  <td>Visa •••• 4242</td>
                  <td>$49.00</td>
                  <td><span className="status paid">Paid</span></td>
                  <td>
                    <button className="btn-outline small">Download</button>
                  </td>
                </tr>
                <tr>
                  <td>Aug 01, 2025</td>
                  <td>#INV-0999</td>
                  <td>
                    <div className="invoice-details">
                      <strong>Max</strong>
                      <span>Python Basics (5/10 sessions)</span>
                    </div>
                  </td>
                  <td>Mastercard •••• 8888</td>
                  <td>$79.00</td>
                  <td><span className="status paid">Paid</span></td>
                  <td>
                    <button className="btn-outline small">Download</button>
                  </td>
                </tr>
                <tr>
                  <td>Jul 15, 2025</td>
                  <td>#INV-0998</td>
                  <td>
                    <div className="invoice-details">
                      <strong>Sophia</strong>
                      <span>Singapore Math (2/8 sessions)</span>
                    </div>
                  </td>
                  <td>-</td>
                  <td>$65.00</td>
                  <td><span className="status pending">Pending</span></td>
                  <td>
                    <button className="btn-outline small">Download</button>
                  </td>
                </tr>
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
    </>
  );
}

// Payment Method Dialog Component (unchanged)
function PaymentMethodDialog({ child, availablePaymentMethods, onClose }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    child?.paymentMethod?.type ? 
    availablePaymentMethods.find(p => p.type === child.paymentMethod.type)?.id : 
    null
  );
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    email: ''
  });

  const handleAssignPayment = () => {
    if (child && selectedPaymentMethod) {
      // Handle assign payment method to child logic
      console.log(`Assigning payment method ${selectedPaymentMethod} to child ${child.name}`);
      onClose();
    }
  };

  const handleRemovePayment = () => {
    if (child) {
      // Handle remove payment method from child logic
      console.log(`Removing payment method from child ${child.name}`);
      onClose();
    }
  };

  const handleAddPaymentMethod = (e) => {
    e.preventDefault();
    // Handle add new payment method logic
    console.log('Adding new payment method:', newPaymentMethod);
    setShowAddPaymentForm(false);
    setNewPaymentMethod({
      type: 'card',
      cardNumber: '',
      expiry: '',
      cvv: '',
      name: '',
      email: ''
    });
  };

  const handleDeletePaymentMethod = (paymentId) => {
    // Handle delete payment method logic
    console.log('Deleting payment method:', paymentId);
  };

  const getCardLogo = (type) => {
    const logos = {
      visa: "💳",
      mastercard: "💳", 
      amex: "💳",
      paypal: "🔵"
    };
    return logos[type] || "💳";
  };

  return (
    <div className="dialog-backdrop">
      <div className="dialog-box payment-method-dialog">
        <div className="dialog-header">
          <h2>
            {child ? `Payment Method for ${child.name}` : 'Manage Payment Methods'}
          </h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="dialog-content">
          {child && (
            <div className="child-summary">
              <img src={child.avatar} alt={child.name} className="child-avatar" />
              <div>
                <h4>{child.name}</h4>
                <p>{child.grade} • {child.program}</p>
              </div>
            </div>
          )}

          {!showAddPaymentForm ? (
            <>
              <div className="payment-methods-selection">
                <h4>Select Payment Method</h4>
                <div className="payment-options">
                  {availablePaymentMethods.map(payment => (
                    <div key={payment.id} className="payment-option">
                      <label className="payment-option-label">
                        <input
                          type="radio"
                          name="payment-method"
                          value={payment.id}
                          checked={selectedPaymentMethod === payment.id}
                          onChange={() => setSelectedPaymentMethod(payment.id)}
                        />
                        <div 
                          className="payment-option-card"
                          style={{ background: payment.gradient }}
                        >
                          <div className="card-chip-small"></div>
                          <div className="card-logo-small">{getCardLogo(payment.type)}</div>
                          <div className="card-number-small">•••• {payment.last4}</div>
                          <div className="card-expiry-small">Exp {payment.expiry}</div>
                        </div>
                      </label>
                      <button 
                        className="btn-danger small"
                        onClick={() => handleDeletePaymentMethod(payment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dialog-actions">
                <div className="action-buttons-left">
                  <button 
                    className="btn-outline"
                    onClick={() => setShowAddPaymentForm(true)}
                  >
                    + Add New Payment Method
                  </button>
                </div>
                <div className="action-buttons-right">
                  {child?.paymentMethod && (
                    <button 
                      className="btn-danger"
                      onClick={handleRemovePayment}
                    >
                      Remove Payment Method
                    </button>
                  )}
                  <button 
                    className="btn-secondary" 
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleAssignPayment}
                    disabled={!selectedPaymentMethod}
                  >
                    {child ? 'Assign Payment Method' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleAddPaymentMethod} className="add-payment-form">
              <h4>Add New Payment Method</h4>
              
              <div className="form-group">
                <label>Payment Type</label>
                <select 
                  value={newPaymentMethod.type}
                  onChange={(e) => setNewPaymentMethod({...newPaymentMethod, type: e.target.value})}
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {newPaymentMethod.type === 'card' ? (
                <>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={newPaymentMethod.cardNumber}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardNumber: e.target.value})}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={newPaymentMethod.expiry}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiry: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={newPaymentMethod.cvv}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cvv: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Name on Card</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={newPaymentMethod.name}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})}
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>PayPal Email</label>
                  <input
                    type="email"
                    placeholder="your-email@example.com"
                    value={newPaymentMethod.email}
                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, email: e.target.value})}
                  />
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowAddPaymentForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Payment Method
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}