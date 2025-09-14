import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import UserController from '../controllers/UserController.jsx';
import './AppNavBar.css';

function useScrollSpy(ids, { offset = 80, enabled = true } = {}) {
  const [activeId, setActiveId] = useState(ids[0] || '');
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      {
        rootMargin: `-${offset}px 0px -60% 0px`,
        threshold: 0.1,
      }
    );
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, offset, enabled]);
  return activeId;
}

export default function AppNavBar() {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userController = new UserController();
        const userData = await userController.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [setUser]);

  const accountHref = user ? '/dashboard' : '/login';

  // Treat both "/" and "/home" as the Home page
  const onHome = location.pathname === '/' || location.pathname === '/home';
  const homeBase = location.pathname === '/home' ? '/home' : '/';

  // Scroll spy only on the Home route
  const activeId = useScrollSpy(['home', 'pricing', 'program', 'contact', 'faq'], {
    offset: 80,
    enabled: onHome,
  });

  const navLinks = [
    { to: `${homeBase}#home`, id: 'home', label: 'Home' },
    { to: `${homeBase}#pricing`, id: 'pricing', label: 'Pricing' },
    { to: `${homeBase}#program`, id: 'program', label: 'Program' },
    { to: `${homeBase}#contact`, id: 'contact', label: 'Contact' },
    { to: `${homeBase}#faq`, id: 'faq', label: 'FAQ' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={homeBase} className="navbar-logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">MC</span>
          <span className="logo-word">MathCode</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className={`navbar-toggle ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar-menu ${open ? 'open' : ''}`}>
          {navLinks.map(({ to, id, label }) => (
            <li className="navbar-item" key={id}>
              <Link
                to={to}
                className={`navbar-link ${onHome && activeId === id ? 'active' : ''}`}
                aria-current={onHome && activeId === id ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* CTA duplicated for mobile drawer */}
          <li className="menu-cta-mobile">
            <Link to="/packages" className="btn-cta" onClick={() => setOpen(false)}>
              Book a Package
            </Link>
          </li>
        </ul>

        {/* Right-side CTAs (desktop) */}
        <div className="navbar-cta">
          <Link to="/packages" className="btn-cta" onClick={() => setOpen(false)}>
            Book a Package
          </Link>
          {!isLoading && (
            <Link to={accountHref} className="btn-outline" onClick={() => setOpen(false)}>
              My Account
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
