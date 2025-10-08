import React from "react";
import "./PricingPage.css";

export default function PricingPage({
  plans = [
    {
      name: "Basic",
      price: "$29/month",
      features: ["Access to 5 lessons", "Basic support", "Community access"],
      highlight: false,
    },
    {
      name: "Pro",
      price: "$59/month",
      features: ["Access to 20 lessons", "Priority support", "Project feedback"],
      highlight: true,
    },
    {
      name: "Premium",
      price: "$99/month",
      features: ["Unlimited lessons", "1-on-1 mentoring", "Certificates & badges"],
      highlight: false,
    },
  ],
}) {
  return (
    <>
        <br/>
        <br/>
        <br/>
        <br/>
         <main className="pricing-page">
      <header className="pricing-header">
        <h1>Our Pricing Plans</h1>
        <p>Choose the plan that best fits your learning journey.</p>
      </header>

      <section className="pricing-cards col-6 mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`pricing-card p-5  ${plan.highlight ? "highlight" : ""}`}
          >
            <h2>{plan.name}</h2>
            <p className="price">{plan.price}</p>
            <ul className="features p-3">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button className="btn-select">Select Plan</button>
          </div>
        ))}
      </section>
    </main>
    
    </>
    
  );
}
