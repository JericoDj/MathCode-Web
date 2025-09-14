import { Link } from "react-router-dom";
import "./HighlightSection.css";

const items = [
  {
    title: "Practice",
    text: "Solve curated math + coding challenges from basics to advanced.",
    to: "/practice",
    linkText: "Browse Problems →",
  },
  {
    title: "Progress",
    text: "Track your streaks, badges, and proficiency across topics.",
    to: "/dashboard",
    linkText: "View Dashboard →",
  },
  {
    title: "Explain",
    text: "See step-by-step breakdowns and hints when you get stuck.",
    to: "/about",
    linkText: "How It Works →",
  },
];

export default function Highlights() {
  return (
    <section className="highlights" aria-labelledby="highlights-heading mt-5 pt-5">
      <div className="highlights-inner">
        <header className="highlights-header">
          <h2 id="highlights-heading" className="highlights-title">What you’ll get</h2>
          <p className="highlights-subtitle">
            Singapore Math foundations, modern feedback, and kid-friendly coding soon.
          </p>
        </header>

        {/* Feature cards */}
        <div className="grid">
          {items.map(({ title, text, to, linkText }) => (
            <article className="card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link to={to} className="link">{linkText}</Link>
            </article>
          ))}
        </div>

        {/* Stats strip */}
        <ul className="stats" aria-label="Program statistics">
          <li className="stat">
            <span className="stat-num">900+</span>
            <span className="stat-label">Problems</span>
          </li>
          <li className="stat">
            <span className="stat-num">16</span>
            <span className="stat-label">Topics</span>
          </li>
          <li className="stat">
            <span className="stat-num">5–12</span>
            <span className="stat-label">Ages</span>
          </li>
          <li className="stat">
            <span className="stat-num">∞</span>
            <span className="stat-label">Retries</span>
          </li>
        </ul>

        {/* Mid-page CTA band */}
        <div className="cta-band" role="region" aria-label="Get started">
          <div className="cta-text">
            <h3>Start strong today</h3>
            <p>Try a sample challenge or book a package for guided sessions.</p>
          </div>
          <div className="cta-actions">
            <Link to="/practice/sample" className="btn btn-primary">Try a Sample</Link>
            <Link to="/packages" className="btn btn-outline">Book a Package</Link>
          </div>
        </div>

        {/* Testimonial */}
        <figure className="testimonial">
          <blockquote>
            “The bar models finally clicked. My child actually looks forward to the challenges!”
          </blockquote>
          <figcaption>
            <span className="avatar" aria-hidden="true">👩‍🏫</span>
            <span>
              <strong>Elaine T.</strong> — Parent, Primary 4
            </span>
          </figcaption>
        </figure>
        <br />
        <figure className="testimonial">
          <blockquote>
            “The bar models finally clicked. My child actually looks forward to the challenges!”
          </blockquote>
          <figcaption>
            <span className="avatar" aria-hidden="true">👩‍🏫</span>
            <span>
              <strong>Elaine T.</strong> — Parent, Primary 4
            </span>
          </figcaption>
        </figure>
          <br />
       
      </div>
    </section>
  );
}
