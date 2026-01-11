import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubscribe = (e) => {
    e.preventDefault();
    setOk(true);
    e.currentTarget.reset();
  };

  /**
   * Scroll logic w/ offset (accounts for navbar)
   */
  const scrollToSection = (id) => {
    const offset = 105; // tweak based on navbar (100–140 usually best)

    const doScroll = () => {
      const el = document.getElementById(id);
      if (!el) return;

      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    };

    // If already on homepage, just scroll
    if (location.pathname === "/") {
      doScroll();
    } else {
      // Navigate first, then scroll after mount
      navigate("/");
      setTimeout(doScroll, 250);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">

          {/* Brand */}
          <div className="col brand">
            <button
              className="brand-row"
              onClick={() => scrollToSection("hero")}
            >
              <span className="logo-mark">MC</span>
              <span className="brand-name">MathCode</span>
            </button>

            <p className="brand-blurb">
              Singapore Math, supercharged by code. Practice bar models,
              heuristics, and problem-solving — with instant feedback.
            </p>

           <div className="socials">
  <a className="icon" aria-label="Facebook">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5 3.66 9.15 8.44 9.93v-7.02H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.78 8.44-4.93 8.44-9.93z"/>
    </svg>
  </a>

  <a className="icon" aria-label="Twitter/X">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 3L10 10.65 4.7 21h3.2l3.8-7.3 4.8 7.3H21l-6.1-8.8L20.7 3h-3.3l-3.4 6.5L9.9 3H4.5z"/>
    </svg>
  </a>

  <a className="icon" aria-label="YouTube">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.6 7.2c-.2-.9-.9-1.6-1.7-1.8C18 5 12 5 12 5s-6 0-7.9.4c-.8.2-1.5.9-1.7 1.8C2 9.2 2 12 2 12s0 2.8.4 4.8c.2.9.9 1.6 1.7 1.8C6 19 12 19 12 19s6 0 7.9-.4c.8-.2 1.5-.9 1.7-1.8.4-2 .4-4.8.4-4.8s0-2.8-.4-4.8zM10 15.3V8.7L15.5 12 10 15.3z"/>
    </svg>
  </a>
</div>

          </div>

          {/* Product Links */}
          <nav className="col links">
            <h4>Product</h4>
            <ul>
              <li>
                <button
                  className="link-btn"
                  onClick={() => scrollToSection("singapore-maths")}
                >
                  Singapore Maths
                </button>
              </li>

              <li>
                <button
                  className="link-btn"
                  onClick={() => scrollToSection("kids-coding")}
                >
                  Kids Coding
                </button>
              </li>

              <li>
                <Link to="/pricing">Pricing</Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav className="col links">
            <h4>Company</h4>
            <ul>
              {/* <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li> */}
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/terms">Terms</Link></li>
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="col newsletter">
            <h4>Get updates</h4>
            <p className="small">Tips, new problems, and Kids Coding — no spam.</p>
            <form onSubmit={onSubscribe} className="newsletter-form">
              <input type="email" required placeholder="you@domain.com" />
              <button className="btn-subscribe" type="submit">Subscribe</button>
            </form>
            {ok && <p className="note">Thanks! Check your inbox.</p>}
          </div>
        </div>

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
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
