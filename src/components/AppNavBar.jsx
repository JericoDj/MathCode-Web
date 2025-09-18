import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import { useFreeSession } from '../context/FreeSessionContext.jsx';
import UserController from '../controllers/UserController.jsx';
import SideDrawer from '../components/SideDrawer/SideDrawer.jsx';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const acctRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { requestFreeSession } = useFreeSession();

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UserController.getCurrentUser();
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

  // Close dropdown on outside click or ESC
  useEffect(() => {
    const onDocClick = (e) => {
      if (acctOpen && acctRef.current && !acctRef.current.contains(e.target))
        setAcctOpen(false);
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

  // Close dropdown and side drawer on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (acctOpen) setAcctOpen(false);
      if (drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [acctOpen, drawerOpen]);

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

  // Navigation handler for links (scrolls)
  const handleNavLinkClick = (id, e) => {
    e.preventDefault();
    setDrawerOpen(false);
    setAcctOpen(false);

    const scrollToSection = () => {
      if (id === 'faq') window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (location.pathname !== '/' || location.hash !== `#${id}`) {
      navigate(`/#${id}`, { replace: false });
      setTimeout(scrollToSection, 50);
    } else scrollToSection();
  };

  // Navigate without scrolling to top (for drawer close only)
  const navigateNoScroll = (to) => {
    navigate(to);
  };

  // Navigate and scroll to top (for main nav buttons)
  const navigateAndScrollTop = (to) => {
    navigate(to);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleFreeSessionClick = useCallback(
    (e) => {
      e?.preventDefault?.();
      requestFreeSession({ source: 'navbar' });
      setDrawerOpen(false);
      setAcctOpen(false);
    },
    [requestFreeSession]
  );

  const userInitial = (user?.name || user?.email || 'U')[0]?.toUpperCase?.() || 'U';

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

        {/* Desktop Menu */}
        <ul className="navbar-menu list-unstyled mb-0 d-none d-lg-flex">
          {navLinks.map(({ id, label }) => (
            <li key={id}>
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
        </ul>

        {/* Right CTA + Account */}
        <div className="navbar-cta d-flex align-items-center gap-2 ms-3">
          <button type="button" className="btn-cta d-none d-lg-inline" onClick={handleFreeSessionClick}>
            Book a Free Session
          </button>

          {!isLoading && (
            <>
              {user ? (
                <div
                  className="acct-dropdown d-none d-lg-block"
                  ref={acctRef}
                  onMouseEnter={() => setAcctOpen(true)}
                  onMouseLeave={() => setAcctOpen(false)}
                  style={{ position: 'relative' }}
                >
                  <button type="button" className="acct-trigger d-flex align-items-center justify-content-center">
                    <span className="acct-avatar">{userInitial}</span>
                    <span className="acct-label ms-1">Account</span>
                  </button>

                  {acctOpen && (
                    <div className="acct-menu" style={{ top: '100%', marginTop: 0, padding: '0.5rem' }}>
                      <div className="account-header">
                        <img
                          src={user.photoURL || `https://picsum.photos/seed/${user.firstName || 'u'}/60`}
                          alt="Avatar"
                          className="account-avatar"
                        />
                        <div className="account-info">
                          <div className="account-name">
                            {user.firstName || 'User'} {user.lastName || ''}
                          </div>
                          <div className="account-email">{user.email || ''}</div>
                        </div>
                      </div>

                      <button className="acct-item acct-primary" onClick={() => { navigateAndScrollTop('/dashboard'); setDrawerOpen(false); }}>Dashboard</button>
                      <button className="acct-item" onClick={() => { navigateAndScrollTop('/profile-settings'); setDrawerOpen(false); }}>Profile & Settings</button>
                      <button className="acct-item" onClick={() => { navigateAndScrollTop('/manage-billing'); setDrawerOpen(false); }}>Manage Plan / Billing</button>
                      <button className="acct-item" onClick={() => { navigateAndScrollTop('/help-center'); setDrawerOpen(false); }}>Help Center</button>
                      <div className="acct-sep" />
                      <button className="acct-item danger" onClick={() => { navigateAndScrollTop('/logout'); setDrawerOpen(false); }}>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="btn-outline d-none d-lg-inline"
                  onClick={() => navigateAndScrollTop('/login')}
                >
                  Login / Join
                </button>
              )}
            </>
          )}

          {/* Burger Toggle */}
          <button
            className={`navbar-toggle d-lg-none ${drawerOpen ? 'is-open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((prev) => !prev)} // ✅ Only toggle drawer, no scroll
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Side Drawer */}
      <SideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)} // ✅ Just close, no scroll
        onFreeSession={handleFreeSessionClick}
        onDashboard={() => navigateAndScrollTop('/dashboard')}
        onProfileSettings={() => navigateAndScrollTop('/profile-settings')}
        onBilling={() => navigateAndScrollTop('/manage-billing')}
        onHelpCenter={() => navigateAndScrollTop('/help-center')}
        onLogout={() => navigateAndScrollTop('/logout')}
        userName={user?.name}
        userEmail={user?.email}
        userAvatarUrl={user?.photoURL}
      />
    </nav>
  );
}
