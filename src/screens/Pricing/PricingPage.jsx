import React, { useState } from "react";
import "./PricingDialog.css"; // reuse same CSS
import { pricingData } from "./PricingData";

export default function PricingPage() {
  const types = Object.keys(pricingData);
  const [selectedType, setSelectedType] = useState(types[0]);
  const [selectedSessions, setSelectedSessions] = useState(
    Object.keys(pricingData[types[0]].plans)[0]
  );

  const currentType = pricingData[selectedType];
  const sessionKeys = Object.keys(currentType.plans);
  const durationPlans = currentType.plans[selectedSessions];

  return (
    <main className="pricing-page-container">
      <div className="pricing-page-content">
        <br />
            <br />
        <br />        <br />        <br />
        {/* Title */}
        <h1 className="pricing-title">Tuition Pricing Plans</h1>
        <p className="pricing-sub">
          Select the plan that best fits your child’s learning journey.
        </p>

        {/* Type Selector */}
        <div className="pricing-select-group">
          {types.map((t) => (
            <button
              key={t}
              className={`pricing-chip ${selectedType === t ? "active" : ""}`}
              onClick={() => {
                setSelectedType(t);
                setSelectedSessions(Object.keys(pricingData[t].plans)[0]);
              }}
            >
              {pricingData[t].name}
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
              className={`pricing-card p-5 ${
                plan.duration === "QUARTERLY" ? "quarterly" : ""
              }`}
            >
              <h2>{plan.duration}</h2>
              <p className="price">{plan.price}</p>
              <p className="sub">
                {plan.sessions} • {plan.perSession}
              </p>

              <ul className="features p-3">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>

              {plan.duration === "QUARTERLY" && (
                <span className="badge-popular">Most Popular</span>
              )}
            </div>
          ))}
        </section>

        <p className="pricing-custom-note">
          Singapore Math is mastery-based. If you're unsure which plan best fits your child, we can help recommend the right starting point.
        </p>
      </div>
    </main>
  );
}
