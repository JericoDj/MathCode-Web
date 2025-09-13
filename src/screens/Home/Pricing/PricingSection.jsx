import { Link } from "react-router-dom";
import "./PricingSection.css";

const plans = [
  {
    id: "starter",
    name: "Starter",
    blurb: "Independent practice",
    price: "Free",
    per: "forever",
    ctaText: "Try Free",
    ctaTo: "/register?plan=starter",
    features: [
      "Daily practice sets (limited)",
      "Step-by-step explanations",
      "Basic progress tracking",
      "Community challenges (weekly)",
    ],
    accent: "neutral",
  },
  {
    id: "standard",
    name: "Guided",
    blurb: "Most popular",
    price: "₱1,490",
    per: "per month",
    ctaText: "Book Guided Package",
    ctaTo: "/packages?plan=guided",
    features: [
      "Full problem library + bar models",
      "Weekly coach feedback (asynchronous)",
      "Skill mastery map & streaks",
      "Parent dashboard & email summaries",
    ],
    accent: "popular",
    popular: true,
  },
  {
    id: "premium",
    name: "Premier",
    blurb: "Live & tailored",
    price: "₱3,990",
    per: "per month",
    ctaText: "Talk to Us",
    ctaTo: "/contact?topic=premier",
    features: [
      "Everything in Guided",
      "Live small-group sessions (2×/mo)",
      "Advanced problem variants",
      "Kids Coding beta (early access)",
    ],
    accent: "dark",
  },
];

export default function PricingSection() {
  return (
    <section
      className="pricing"
      aria-labelledby="pricing-heading"
      // tweak these without editing CSS if you want tighter spacing:
      style={{ "--pricing-pt": "1rem", "--pricing-pb": "2.5rem" }}
    >
      <div className="pricing-inner">
        <header className="pricing-header">
          <h2 id="pricing-heading" className="pricing-title">Packages & Pricing</h2>
          <p className="pricing-subtitle">
            Singapore Math mastery with options for every learner. Upgrade anytime.
          </p>
        </header>

        <div className="pricing-grid">
          {plans.map((p) => (
            <article
              key={p.id}
              className={`plan-card plan-card--${p.accent} ${p.popular ? "plan-card--popular" : ""}`}
            >
              {p.popular && <div className="badge-popular" aria-label="Most popular">Most popular</div>}

              <header className="plan-header">
                <h3 className="plan-name">{p.name}</h3>
                <p className="plan-blurb">{p.blurb}</p>
              </header>

              <div className="plan-price">
                <span className="amount">{p.price}</span>
                <span className="per">/{p.per}</span>
              </div>

              <ul className="features" aria-label={`${p.name} features`}>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <Link to={p.ctaTo} className={`btn-plan ${p.popular ? "btn-primary" : "btn-outline"}`}>
                {p.ctaText}
              </Link>
            </article>
          ))}
        </div>

        <p className="microcopy">No long-term contracts. Cancel anytime.</p>
        <div className="pricing-footer" role="region" aria-label="Need help choosing?">
  <div className="footer-text">
    <h4>Need help choosing a plan?</h4>
    <p>Tell us your child’s goals and current level — we’ll recommend the best fit.</p>
    <p className="payments">We accept Visa · Mastercard · GCash</p>
  </div>
  <div className="footer-actions">
    <Link to="/contact?topic=pricing" className="btn btn-primary">Talk to Us</Link>
    <Link to="/faq" className="btn btn-outline">See FAQs</Link>
  </div>
</div>
      </div>
    </section>
  );
}
