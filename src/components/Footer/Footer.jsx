import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const [ok, setOk] = useState(false);

  const onSubscribe = (e) => {
    e.preventDefault();
    setOk(true);        // hook this to your backend later
    e.currentTarget.reset();
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        {/* Top grid */}
        <div className="footer-grid">
          {/* Brand / blurb */}
          <div className="col brand">
            <Link to="/" className="brand-row">
              <span className="logo-mark">MC</span>
              <span className="brand-name">MathCode</span>
            </Link>
            <p className="brand-blurb">
              Singapore Math, supercharged by code. Practice bar models, heuristics,
              and problem-solving — with instant feedback.
            </p>
            <div className="socials" aria-label="Social links">
              <a href="#" aria-label="Facebook" className="icon">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.15 8.44 9.93v-7.02H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.93 8.44-9.93z" fill="currentColor"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="icon">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M22 5.8c-.7.3-1.5.6-2.2.6.8-.5 1.4-1.3 1.7-2.2-.8.5-1.7.9-2.6 1.1A3.7 3.7 0 0 0 12 7.9c0 .3 0 .6.1.9-3-.1-5.7-1.6-7.5-3.8-.3.6-.4 1.3-.4 2 0 1.3.7 2.5 1.7 3.2-.6 0-1.2-.2-1.7-.5v.1c0 1.8 1.3 3.3 3 3.7-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.6 2.6A7.5 7.5 0 0 1 2 18.6a10.5 10.5 0 0 0 5.7 1.7c6.8 0 10.6-5.7 10.6-10.6v-.5c.8-.5 1.4-1.2 1.9-1.9z" fill="currentColor"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="icon">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.5v-7L16 12l-6.4 3.5z" fill="currentColor"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <nav className="col links">
            <h4>Product</h4>
            <ul>
              <li><Link to="/practice">Practice</Link></li>
              <li><Link to="/dashboard">Progress</Link></li>
              <li><Link to="/about">Method</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </nav>

          <nav className="col links">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/terms">Terms</Link></li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="col newsletter">
            <h4>Get updates</h4>
            <p className="small">Tips, new problems, and Kids Coding — no spam.</p>
            <form onSubmit={onSubscribe} className="newsletter-form">
              <input type="email" required placeholder="you@domain.com" aria-label="Email address" />
              <button className="btn-subscribe" type="submit">Subscribe</button>
            </form>
            {ok && <p className="note">Thanks! Check your inbox.</p>}
          </div>
        </div>

        {/* Bottom row */}
        <div className="footer-bottom">
          <p className="small">© {new Date().getFullYear()} MathCode. All rights reserved.</p>
          <div className="bottom-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Support</Link>
          </div>
          <button
            className="to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            title="Back to top"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
