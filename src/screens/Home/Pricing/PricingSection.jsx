import { Link } from "react-router-dom";
import { useState } from "react";
import "./PricingSection.css";

const pricingData = {
  "1-2": {
    name: "1:2 Small Group",
    description: "Interactive learning with 1 teacher and 2 students",
    plans: {
      "2": [
        {
          duration: "MONTHLY",
          price: "₱5,200",
          sessions: "8 sessions",
          perSession: "₱650/session",
          features: ["1:2 teacher ratio", "8 sessions per month", "Interactive group learning", "Progress tracking"]
        },
        {
          duration: "QUARTERLY",
          price: "₱14,400",
          sessions: "26 sessions (24+2 free)",
          perSession: "₱600/session",
          features: ["1:2 teacher ratio", "26 sessions total", "2 FREE sessions", "Priority scheduling"],
          popular: true
        },
        {
          duration: "SEMI-ANNUAL",
          price: "₱26,400",
          sessions: "51 sessions (48+3 free)",
          perSession: "₱550/session",
          features: ["1:2 teacher ratio", "51 sessions total", "3 FREE sessions", "Extended support"]
        },
        {
          duration: "ANNUAL",
          price: "₱48,000",
          sessions: "101 sessions (96+5 free)",
          perSession: "₱500/session",
          features: ["1:2 teacher ratio", "101 sessions total", "5 FREE sessions", "Best value"]
        }
      ],
      "3": [
        {
          duration: "MONTHLY",
          price: "₱7,800",
          sessions: "12 sessions",
          perSession: "₱650/session",
          features: ["1:2 teacher ratio", "12 sessions per month", "Interactive group learning", "Progress tracking"]
        },
        {
          duration: "QUARTERLY",
          price: "₱21,600",
          sessions: "38 sessions (36+2 free)",
          perSession: "₱600/session",
          features: ["1:2 teacher ratio", "38 sessions total", "2 FREE sessions", "Priority scheduling"],
          popular: true
        },
        {
          duration: "SEMI-ANNUAL",
          price: "₱39,600",
          sessions: "75 sessions (72+3 free)",
          perSession: "₱550/session",
          features: ["1:2 teacher ratio", "75 sessions total", "3 FREE sessions", "Extended support"]
        },
        {
          duration: "ANNUAL",
          price: "₱72,000",
          sessions: "149 sessions (144+5 free)",
          perSession: "₱500/session",
          features: ["1:2 teacher ratio", "149 sessions total", "5 FREE sessions", "Best value"]
        }
      ],
      "5": [
        {
          duration: "MONTHLY",
          price: "₱13,000",
          sessions: "20 sessions",
          perSession: "₱650/session",
          features: ["1:2 teacher ratio", "20 sessions per month", "Interactive group learning", "Progress tracking"]
        },
        {
          duration: "QUARTERLY",
          price: "₱36,000",
          sessions: "62 sessions (60+2 free)",
          perSession: "₱600/session",
          features: ["1:2 teacher ratio", "62 sessions total", "2 FREE sessions", "Priority scheduling"],
          popular: true
        },
        {
          duration: "SEMI-ANNUAL",
          price: "₱66,000",
          sessions: "123 sessions (120+3 free)",
          perSession: "₱550/session",
          features: ["1:2 teacher ratio", "123 sessions total", "3 FREE sessions", "Extended support"]
        },
        {
          duration: "ANNUAL",
          price: "₱120,000",
          sessions: "245 sessions (240+5 free)",
          perSession: "₱500/session",
          features: ["1:2 teacher ratio", "245 sessions total", "5 FREE sessions", "Best value"]
        }
      ]
    }
  },
  "1-1": {
    name: "1:1 Private",
    description: "Personalized one-on-one tutoring sessions",
    plans: {
      "2": [
        {
          duration: "MONTHLY",
          price: "₱9,600",
          sessions: "8 sessions",
          perSession: "₱1,200/session",
          features: ["1:1 teacher ratio", "8 sessions per month", "Personalized curriculum", "Flexible scheduling"]
        },
        {
          duration: "QUARTERLY",
          price: "₱27,600",
          sessions: "26 sessions (24+2 free)",
          perSession: "₱1,150/session",
          features: ["1:1 teacher ratio", "26 sessions total", "2 FREE sessions", "Dedicated tutor"],
          popular: true
        },
        {
          duration: "SEMI-ANNUAL",
          price: "₱52,320",
          sessions: "51 sessions (48+3 free)",
          perSession: "₱1,090/session",
          features: ["1:1 teacher ratio", "51 sessions total", "3 FREE sessions", "Curriculum customization"]
        },
        {
          duration: "ANNUAL",
          price: "₱93,120",
          sessions: "101 sessions (96+5 free)",
          perSession: "₱970/session",
          features: ["1:1 teacher ratio", "101 sessions total", "5 FREE sessions", "Best value"]
        }
      ],
      "3": [
        {
          duration: "MONTHLY",
          price: "₱14,400",
          sessions: "12 sessions",
          perSession: "₱1,200/session",
          features: ["1:1 teacher ratio", "12 sessions per month", "Personalized curriculum", "Flexible scheduling"]
        },
        {
          duration: "QUARTERLY",
          price: "₱41,400",
          sessions: "38 sessions (36+2 free)",
          perSession: "₱1,150/session",
          features: ["1:1 teacher ratio", "38 sessions total", "2 FREE sessions", "Dedicated tutor"],
          popular: true
        },
        {
          duration: "SEMI-ANNUAL",
          price: "₱78,480",
          sessions: "75 sessions (72+3 free)",
          perSession: "₱1,090/session",
          features: ["1:1 teacher ratio", "75 sessions total", "3 FREE sessions", "Curriculum customization"]
        },
        {
          duration: "ANNUAL",
          price: "₱139,680",
          sessions: "149 sessions (144+5 free)",
          perSession: "₱970/session",
          features: ["1:1 teacher ratio", "149 sessions total", "5 FREE sessions", "Best value"]
        }
      ],
      "5": [
        {
          duration: "MONTHLY",
          price: "₱24,000",
          sessions: "20 sessions",
          perSession: "₱1,200/session",
          features: ["1:1 teacher ratio", "20 sessions per month", "Personalized curriculum", "Flexible scheduling"]
        },
        {
          duration: "QUARTERLY",
          price: "₱69,000",
          sessions: "62 sessions (60+2 free)",
          perSession: "₱1,150/session",
          features: ["1:1 teacher ratio", "62 sessions total", "2 FREE sessions", "Dedicated tutor"],
          popular: true
        },
        {
          duration: "SEMI-ANNUAL",
          price: "₱130,800",
          sessions: "123 sessions (120+3 free)",
          perSession: "₱1,090/session",
          features: ["1:1 teacher ratio", "123 sessions total", "3 FREE sessions", "Curriculum customization"]
        },
        {
          duration: "ANNUAL",
          price: "₱232,800",
          sessions: "245 sessions (240+5 free)",
          perSession: "₱970/session",
          features: ["1:1 teacher ratio", "245 sessions total", "5 FREE sessions", "Best value"]
        }
      ]
    }
  }
};

export default function PricingSection() {
  const [selectedType, setSelectedType] = useState("1-2");
  const [selectedSessions, setSelectedSessions] = useState("2");

  const currentData = pricingData[selectedType];
  const currentPlans = currentData.plans[selectedSessions];

  return (
    <section
      className="pricing"
      aria-labelledby="pricing-heading"
      style={{ "--pricing-pt": "2rem", "--pricing-pb": "3rem" }}
    >
      <div className="pricing-inner">
        <header className="pricing-header">
          <h2 id="pricing-heading" className="pricing-title">Singapore Math Packages</h2>
          <p className="pricing-subtitle">
            Choose the perfect learning plan for your child. Better value with longer commitments.
          </p>
        </header>

        {/* Class Type Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            <div className="tabs">
              <button
                className={`tab ${selectedType === "1-2" ? "tab-active" : ""}`}
                onClick={() => setSelectedType("1-2")}
              >
                <span className="tab-icon">👥</span>
                1:2 Small Group
              </button>
              <button
                className={`tab ${selectedType === "1-1" ? "tab-active" : ""}`}
                onClick={() => setSelectedType("1-1")}
              >
                <span className="tab-icon">🎯</span>
                1:1 Private
              </button>
            </div>
          </div>

          <div className="tab-content">
            <div className="sessions-selector">
              <h3 className="sessions-title">Sessions per Week</h3>
              <div className="sessions-buttons">
                {["2", "3", "5"].map((sessions) => (
                  <button
                    key={sessions}
                    className={`session-btn ${selectedSessions === sessions ? "session-btn-active" : ""}`}
                    onClick={() => setSelectedSessions(sessions)}
                  >
                    {sessions} Sessions
                  </button>
                ))}
              </div>
            </div>

            <div className="pricing-grid">
              {currentPlans.map((plan, index) => (
                <article
                  key={plan.duration}
                  className={`plan-card ${plan.popular ? "plan-card-popular" : ""}`}
                >
                  {plan.popular && (
                    <div className="badge badge-popular" aria-label="Most popular">
                      Most Popular
                    </div>
                  )}

                  <header className="plan-header">
                    <h3 className="plan-duration">{plan.duration}</h3>
                    <div className="plan-sessions">{plan.sessions}</div>
                  </header>

                  <div className="plan-pricing">
                    <div className="plan-price">{plan.price}</div>
                    <div className="price-per-session">{plan.perSession}</div>
                  </div>

                  <ul className="features" aria-label={`${plan.duration} features`}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>

                  <Link 
                    to={`/packages?type=${selectedType}&sessions=${selectedSessions}&duration=${plan.duration.toLowerCase()}`}
                    className={`btn-plan ${plan.popular ? "btn-primary" : "btn-outline"}`}
                  >
                    Select Plan
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="pricing-comparison">
          <h3>Package Comparison - {currentData.name}</h3>
          <div className="comparison-table">
            <div className="comparison-header">
              <span>Duration</span>
              <span>2 Sessions/Week</span>
              <span>3 Sessions/Week</span>
              <span>5 Sessions/Week</span>
            </div>
            
            {["MONTHLY", "QUARTERLY", "SEMI-ANNUAL", "ANNUAL"].map((duration) => (
              <div key={duration} className="comparison-row">
                <span className="duration-label">{duration}</span>
                <span className="price-cell">
                  {selectedType === "1-2" 
                    ? `₱${getPrice("1-2", "2", duration)}`
                    : `₱${getPrice("1-1", "2", duration)}`
                  }
                </span>
                <span className="price-cell">
                  {selectedType === "1-2" 
                    ? `₱${getPrice("1-2", "3", duration)}`
                    : `₱${getPrice("1-1", "3", duration)}`
                  }
                </span>
                <span className="price-cell">
                  {selectedType === "1-2" 
                    ? `₱${getPrice("1-2", "5", duration)}`
                    : `₱${getPrice("1-1", "5", duration)}`
                  }
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="microcopy">
          No long-term contracts. Cancel anytime. All packages include progress tracking and parent reports.
        </p>
        
        <div className="pricing-footer" role="region" aria-label="Need help choosing?">
          <div className="footer-text">
            <h4>Unsure which package is right?</h4>
            <p>Schedule a free consultation to discuss your child's learning needs and goals.</p>
            <p className="payments">We accept Visa · Mastercard · GCash · PayPal</p>
          </div>
          <div className="footer-actions">
            <Link to="/consultation" className="btn btn-primary">
              Schedule Free Consultation
            </Link>
            <Link to="/faq" className="btn btn-outline">
              View FAQs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper function to get prices for comparison table
function getPrice(type, sessions, duration) {
  const prices = {
    "1-2": {
      "2": { "MONTHLY": "5,200", "QUARTERLY": "14,400", "SEMI-ANNUAL": "26,400", "ANNUAL": "48,000" },
      "3": { "MONTHLY": "7,800", "QUARTERLY": "21,600", "SEMI-ANNUAL": "39,600", "ANNUAL": "72,000" },
      "5": { "MONTHLY": "13,000", "QUARTERLY": "36,000", "SEMI-ANNUAL": "66,000", "ANNUAL": "120,000" }
    },
    "1-1": {
      "2": { "MONTHLY": "9,600", "QUARTERLY": "27,600", "SEMI-ANNUAL": "52,320", "ANNUAL": "93,120" },
      "3": { "MONTHLY": "14,400", "QUARTERLY": "41,400", "SEMI-ANNUAL": "78,480", "ANNUAL": "139,680" },
      "5": { "MONTHLY": "24,000", "QUARTERLY": "69,000", "SEMI-ANNUAL": "130,800", "ANNUAL": "232,800" }
    }
  };
  
  return prices[type][sessions][duration];
}