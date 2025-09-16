import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import { useFreeSession } from '../context/FreeSessionContext.jsx';
import UserController from '../controllers/UserController.jsx';
import './AppNavBar.css';

// Scroll spy hook
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
  const [open, setOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const acctRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { requestFreeSession } = useFreeSession();

  // Fetch current user
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

  // Close account dropdown on outside click or ESC
  useEffect(() => {
    const onDocClick = (e) => {
      if (acctOpen && acctRef.current && !acctRef.current.contains(e.target)) setAcctOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setAcctOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [acctOpen]);

  const onHome = location.pathname === '/';
  const activeId = useScrollSpy(['home', 'pricing', 'program', 'contact', 'faq'], {
    offset: 80,
    enabled: onHome,
  });

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'program', label: 'Program' },
    { id: 'contact', label: 'Contact' },
    { id: 'faq', label: 'FAQ' },
  ];

  // Scroll to section on home page
  const handleNavLinkClick = (id, e) => {
    e.preventDefault();
    setOpen(false);
    setAcctOpen(false);

    const scrollToSection = () => {
      if (id === 'faq') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (location.pathname !== '/' || location.hash !== `#${id}`) {
      navigate(`/#${id}`, { replace: false });
      // scroll after navigation
      setTimeout(scrollToSection, 50);
    } else {
      scrollToSection();
    }
  };

  // Navigate first, then scroll top on new page
  const navigateAndScrollTop = (to) => {
    setOpen(false);
    setAcctOpen(false);
    navigate(to);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleFreeSessionClick = useCallback((e) => {
    e?.preventDefault?.();
    requestFreeSession({ source: 'navbar' });
    setOpen(false);
    setAcctOpen(false);
  }, [requestFreeSession]);

  const userInitial = (user?.name || user?.email || 'U')[0]?.toUpperCase?.() || 'U';
  const authHref = `/login?next=${encodeURIComponent(location.pathname + location.hash)}`;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-logo" to="/" onClick={() => navigateAndScrollTop('/')}>
          <span className="logo-mark">MC</span>
          <span className="logo-word">MathCode</span>
        </Link>

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
          {navLinks.map(({ id, label }) => (
            <li className="navbar-item" key={id}>
              <Link
                to={`/#${id}`}
                className={`navbar-link ${onHome && activeId === id ? 'active' : ''}`}
                aria-current={onHome && activeId === id ? 'page' : undefined}
                onClick={(e) => handleNavLinkClick(id, e)}
              >
                {label}
              </Link>
            </li>
          ))}

          <li className="menu-cta-mobile">
            <button type="button" className="btn-cta" onClick={handleFreeSessionClick}>
              Book a Free Session
            </button>

            {!isLoading && !user && (
              <div className="stacked-auth">
                <button className="btn-outline" onClick={() => navigateAndScrollTop(authHref)}>Sign in</button>
                <button className="btn-outline" onClick={() => navigateAndScrollTop(`/register?next=${encodeURIComponent(location.pathname + location.hash)}`)}>Join</button>
              </div>
            )}

            {!isLoading && user && (
              <div className="stacked-auth">
                <button className="btn-outline" onClick={() => navigateAndScrollTop('/dashboard')}>Dashboard</button>
                <button className="btn-outline" onClick={() => navigateAndScrollTop('/sessions')}>My Sessions</button>
                <button className="btn-outline" onClick={() => navigateAndScrollTop('/logout')}>Logout</button>
              </div>
            )}
          </li>
        </ul>

        <div className="navbar-cta">
          <button type="button" className="btn-cta" onClick={handleFreeSessionClick}>
            Book a Free Session
          </button>

          {!isLoading && !user && (
            <button className="btn-outline" onClick={() => navigateAndScrollTop(authHref)}>Sign in / Join</button>
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
                  <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              {acctOpen && (
                <div className="acct-menu" role="menu">
                  <button role="menuitem" className="acct-item" onClick={() => navigateAndScrollTop('/dashboard')}>Dashboard</button>
                  <button role="menuitem" className="acct-item" onClick={() => navigateAndScrollTop('/sessions')}>My Sessions</button>
                  <button role="menuitem" className="acct-item" onClick={() => navigateAndScrollTop('/profile')}>Profile & Settings</button>
                  <button role="menuitem" className="acct-item" onClick={() => navigateAndScrollTop('/packages')}>Manage Plan / Billing</button>
                  <div className="acct-sep" />
                  <button role="menuitem" className="acct-item danger" onClick={() => navigateAndScrollTop('/logout')}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
