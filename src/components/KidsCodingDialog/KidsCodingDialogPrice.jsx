import React, { useState } from "react";
import { codingPricingData } from "./KidsCodingData";
import "./KidsCodingDialogPricing.css";

export default function KidsCodingPricingDialog({ open, onClose }) {
  if (!open) return null;

  const types = Object.keys(codingPricingData);

  const [selectedType, setSelectedType] = useState(types[0]);
  const [selectedSessions, setSelectedSessions] = useState(
    Object.keys(codingPricingData[types[0]].plans)[0]
  );

  const currentType = codingPricingData[selectedType];
  const sessionKeys = Object.keys(currentType.plans);
  const durationPlans = currentType.plans[selectedSessions];

  return (
    <div className="pricing-overlay" onClick={onClose}>
      <div className="pricing-dialog" onClick={(e) => e.stopPropagation()}>

        {/* Top Bar */}
        <div className="pricing-topbar">
          <h2 className="pricing-title">Kids Coding Pricing Plans</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <p className="pricing-sub">Choose the plan that fits your learning journey.</p>

        {/* Type Selector */}
        <div className="pricing-select-group">
          {types.map((t) => (
            <button
              key={t}
              className={`pricing-chip ${selectedType === t ? "active" : ""}`}
              onClick={() => {
                setSelectedType(t);
                setSelectedSessions(Object.keys(codingPricingData[t].plans)[0]);
              }}
            >
              {codingPricingData[t].name}
            </button>
          ))}
        </div>

        {/* Sessions Selector */}
        <div className="pricing-select-sub">
          {sessionKeys.map((sk) => (
            <button
              key={sk}
              className={`pricing-chip small ${
                selectedSessions === sk ? "active" : ""
              }`}
              onClick={() => setSelectedSessions(sk)}
            >
              {sk}x/week
            </button>
          ))}
        </div>

        {/* Cards */}
        <section className="pricing-cards">
          {durationPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`pricing-card ${plan.duration === "QUARTERLY" ? "quarterly" : ""}`}
            >
              <h2>{plan.duration}</h2>
              <p className="price">{plan.price}</p>
              <p className="sub">{plan.sessions} • {plan.perSession}</p>

              <ul className="features">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>

              <button className="btn-select">Select Plan</button>

              {plan.duration === "QUARTERLY" && (
                <span className="badge-popular">Most Popular</span>
              )}
            </div>
          ))}
        </section>

        <p className="pricing-custom-note">
          Want Robotics, AI, Game Dev, Scratch, or Python tracks?<br /> Contact us for custom programs.
        </p>
      </div>
    </div>
  );
}
