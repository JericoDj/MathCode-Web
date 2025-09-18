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
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && setActiveId(entry.target.id)),
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

  const handleFreeSessionClick = useCallback(
    (e) => {
      e?.preventDefault?.();
      requestFreeSession({ source: 'navbar' });
      setOpen(false);
      setAcctOpen(false);
    },
    [requestFreeSession]
  );

  const userInitial =
    (user?.name || user?.email || 'U')[0]?.toUpperCase?.() || 'U';
  const authHref = `/login?next=${encodeURIComponent(
    location.pathname + location.hash
  )}`;

  return (
    <nav className="navbar">
      <div className="navbar-container container d-flex justify-content-between align-items-center px-3 px-md-4">
        {/* Logo */}
        <Link
          className="navbar-logo d-flex align-items-center gap-2 me-4"
          to="/"
          onClick={() => navigateAndScrollTop('/')}
        >
          <span className="logo-mark">MC</span>
          <span className="logo-word">MathCode</span>
        </Link>

        {/* Nav menu (desktop + mobile expanded) */}
        {/* Nav menu (desktop + mobile expanded) */}
<ul className={`navbar-menu list-unstyled mb-0 ${open ? 'open' : ''}`}>
  {navLinks.map(({ id, label }) => (
    <li className="navbar-item" key={id}>
      <Link
        to={`/#${id}`}
        className={`navbar-link ${
          onHome && activeId === id ? 'active' : ''
        }`}
        aria-current={onHome && activeId === id ? 'page' : undefined}
        onClick={(e) => handleNavLinkClick(id, e)}
      >
        {label}
      </Link>
    </li>
  ))}

  {/* Mobile-only CTA */}
  <li className="menu-cta-mobile d-lg-none">
    <button
      type="button"
      className="btn-cta w-100"
      onClick={handleFreeSessionClick}
    >
      Book a Free Session
    </button>
  </li>
</ul>

{/* Right side CTA + account */}
<div className="navbar-cta d-flex align-items-center gap-2 ms-3">
  {/* Desktop-only CTA */}
  <button
    type="button"
    className="btn-cta d-none d-lg-inline"
    onClick={handleFreeSessionClick}
  >
    Book a Free Session
  </button>

  {/* Account dropdown (desktop = icon + text, mobile = icon only) */}
  {!isLoading && (
    <div className="acct-dropdown" ref={acctRef}>
      <button
        type="button"
        className="acct-trigger d-flex align-items-center justify-content-center"
        aria-haspopup="menu"
        aria-expanded={acctOpen}
        onClick={() => {
          if (user) setAcctOpen((v) => !v);
          else navigateAndScrollTop(authHref);
        }}
      >
        <span className="acct-avatar" aria-hidden="true">
          {user ? userInitial : "👤"}
        </span>
        {/* Show text only on desktop */}
        <span className="d-none d-lg-inline ms-1">Account</span>
      </button>

      {user && acctOpen && (
        <div className="acct-menu" role="menu">
          <div className="acct-header">
            <img
              src={
                user?.photoURL ||
                `https://picsum.photos/seed/${user?.id || 'u'}/60`
              }
              alt="User Avatar"
              className="acct-header-avatar"
            />
            <div className="acct-header-name">
              {user?.name || user?.email}
            </div>
          </div>
          <div className="acct-sep" />
          <button
            role="menuitem"
            className="acct-item"
            onClick={() => navigateAndScrollTop('/dashboard')}
          >
            Dashboard
          </button>
          <button
            role="menuitem"
            className="acct-item"
            onClick={() => navigateAndScrollTop('/profile-settings')}
          >
            Profile & Settings
          </button>
          <button
            role="menuitem"
            className="acct-item"
            onClick={() => navigateAndScrollTop('/manage-billing')}
          >
            Manage Plan / Billing
          </button>
          <button
            role="menuitem"
            className="acct-item"
            onClick={() => navigateAndScrollTop('/help-center')}
          >
            Help Center
          </button>
          <div className="acct-sep" />
          <button
            role="menuitem"
            className="acct-item danger"
            onClick={() => navigateAndScrollTop('/logout')}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )}

  {/* Burger toggle (mobile only) */}
  <button
    className={`navbar-toggle d-lg-none ${open ? 'is-open' : ''}`}
    aria-label="Toggle menu"
    aria-expanded={open}
    onClick={() => setOpen(!open)}
  >
    <span />
    <span />
    <span />
  </button>
</div>


      </div>
    </nav>
  );
}
