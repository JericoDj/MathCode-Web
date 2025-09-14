import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import { useFreeSession } from '../context/FreeSessionContext.jsx';
import UserController from '../controllers/UserController.jsx';
import './AppNavBar.css';

function useScrollSpy(ids, { offset = 80, enabled = true } = {}) {
  const [activeId, setActiveId] = useState(ids[0] || '');
  useEffect(() => {
    if (!enabled) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveId(entry.target.id)),
      { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0.1 }
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
  const [open, setOpen] = useState(false);         // mobile nav
  const [acctOpen, setAcctOpen] = useState(false); // account dropdown (only when logged in)
  const acctRef = useRef(null);

  const location = useLocation();
  const { requestFreeSession } = useFreeSession();

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

  // Close account dropdown on outside click / ESC
  useEffect(() => {
    function onDocClick(e) {
      if (acctOpen && acctRef.current && !acctRef.current.contains(e.target)) setAcctOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setAcctOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [acctOpen]);

  const onHome = location.pathname === '/' || location.pathname === '/home';
  const homeBase = location.pathname === '/home' ? '/home' : '/';

  const activeId = useScrollSpy(['home', 'pricing', 'program', 'contact', 'faq'], {
    offset: 80, enabled: onHome,
  });

  const navLinks = [
    { to: `${homeBase}#home`, id: 'home', label: 'Home' },
    { to: `${homeBase}#pricing`, id: 'pricing', label: 'Pricing' },
    { to: `${homeBase}#program`, id: 'program', label: 'Program' },
    { to: `${homeBase}#contact`, id: 'contact', label: 'Contact' },
    { to: `${homeBase}#faq`, id: 'faq', label: 'FAQ' },
  ];

  const handleFreeSessionClick = useCallback((e) => {
    e?.preventDefault?.();
    requestFreeSession({ source: 'navbar' });
    setOpen(false);
    setAcctOpen(false);
  }, [requestFreeSession]);

  const userInitial = (user?.name || user?.email || 'U')[0]?.toUpperCase?.() || 'U';

  // Build an auth href that brings users back after login/register
  const authHref = `/login?next=${encodeURIComponent(location.pathname + location.hash)}`;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={homeBase} className="navbar-logo" onClick={() => { setOpen(false); setAcctOpen(false); }}>
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

        {/* Main nav */}
        <ul className={`navbar-menu ${open ? 'open' : ''}`}>
          {navLinks.map(({ to, id, label }) => (
            <li className="navbar-item" key={id}>
              <Link
                to={to}
                className={`navbar-link ${onHome && activeId === id ? 'active' : ''}`}
                aria-current={onHome && activeId === id ? 'page' : undefined}
                onClick={() => { setOpen(false); setAcctOpen(false); }}
              >
                {label}
              </Link>
            </li>
          ))}

          {/* Mobile CTAs inside drawer */}
          <li className="menu-cta-mobile">
            <button type="button" className="btn-cta" onClick={handleFreeSessionClick}>
              Book a Free Session
            </button>

            {!isLoading && !user && (
              <div className="stacked-auth">
                <Link to={authHref} className="btn-outline" onClick={() => setOpen(false)}>Sign in</Link>
                <Link to={`/register?next=${encodeURIComponent(location.pathname + location.hash)}`} className="btn-outline" onClick={() => setOpen(false)}>Join</Link>
              </div>
            )}

            {!isLoading && user && (
              <div className="stacked-auth">
                <Link to="/dashboard" className="btn-outline" onClick={() => setOpen(false)}>Dashboard</Link>
                <Link to="/sessions" className="btn-outline" onClick={() => setOpen(false)}>My Sessions</Link>
                <Link to="/logout" className="btn-outline" onClick={() => setOpen(false)}>Logout</Link>
              </div>
            )}
          </li>
        </ul>

        {/* Right side (desktop): TWO CTAs */}
        <div className="navbar-cta">
          {/* CTA 1: Book free session */}
          <button type="button" className="btn-cta" onClick={handleFreeSessionClick}>
            Book a Free Session
          </button>

          {/* CTA 2: Guests go straight to auth, users get Account dropdown */}
          {!isLoading && !user && (
            <Link to={authHref} className="btn-outline" onClick={() => setAcctOpen(false)}>
              Sign in / Join
            </Link>
          )}

          {!isLoading && user && (
            <div className="acct-dropdown" ref={acctRef}>
              <button
                type="button"
                className="acct-trigger"
                aria-haspopup="menu"
                aria-expanded={acctOpen}
                onClick={() => setAcctOpen(v => !v)}
              >
                <span className="acct-avatar" aria-hidden="true">{userInitial}</span>
                <span className="acct-label">Account</span>
                <svg className={`caret ${acctOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {acctOpen && (
                <div className="acct-menu" role="menu">
                  <Link role="menuitem" to="/dashboard" className="acct-item" onClick={() => setAcctOpen(false)}>
                    Dashboard
                  </Link>
                  <Link role="menuitem" to="/sessions" className="acct-item" onClick={() => setAcctOpen(false)}>
                    My Sessions
                  </Link>
                  <Link role="menuitem" to="/profile" className="acct-item" onClick={() => setAcctOpen(false)}>
                    Profile & Settings
                  </Link>
                  <Link role="menuitem" to="/packages" className="acct-item" onClick={() => setAcctOpen(false)}>
                    Manage Plan / Billing
                  </Link>
                  <div className="acct-sep" />
                  <Link role="menuitem" to="/logout" className="acct-item danger" onClick={() => setAcctOpen(false)}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
