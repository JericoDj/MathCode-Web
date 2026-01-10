// src/components/AppNavBar/AppNavBar.jsx
import { HiMenu } from "react-icons/hi"; // hamburger icon
import { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';
import { PackageContext } from '../../context/PackageContext.jsx';
import SideDrawer from '../SideDrawer/SideDrawer.jsx';
import BookingDialog from "../Booking/BookingDialog.jsx";
import FreeAssessmentDialog from "../FreeAssessmentDialog/FreeaAssessmentDialog.jsx";
import AuthModal from "../AuthModal/AuthModal.jsx"; // Import AuthModal
import MathCodeLogo from '../../assets/MathCodeNoBGcropped.png';
import './AppNavBar.css';

// ✅ Scroll spy hook
function useScrollSpy(ids, { offset = 80, enabled = true } = {}) {
  const [activeId, setActiveId] = useState(ids[0] || '');
  
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0.1 }
    );

    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [ids, offset, enabled]);

  return activeId;
}

export default function AppNavBar() {
  const { user, setUser, getCurrentUser, logout, openAuthModal } = useContext(UserContext);
const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const acctRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { requestPackage } = useContext(PackageContext);



  // ✅ Fetch user once on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getCurrentUser();
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [setUser]);

  // ✅ Close dropdown on click outside or ESC
  useEffect(() => {
    const onDocClick = (e) => {
      if (acctOpen && acctRef.current && !acctRef.current.contains(e.target)) {
        setAcctOpen(false);
      }
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

  // ✅ Close dropdown and drawer on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (acctOpen) setAcctOpen(false);
      if (drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [acctOpen, drawerOpen]);

  const onHome = location.pathname === '/';
  const activeId = useScrollSpy(['home', 'singapore-maths', 'kids-coding', 'contact'], {
    offset: 80,
    enabled: onHome,
  });

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'singapore-maths', label: 'Singapore Maths' },
    { id: 'kids-coding', label: 'Kids Coding' },
    { id: 'contact', label: 'Contact' },
    // { id: 'faq', label: 'FAQ' },
  ];

  const handleNavLinkClick = (id, e) => {
    e.preventDefault();
    setDrawerOpen(false);
    setAcctOpen(false);

    const scrollToSection = () => {
  if (id === 'faq') {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  } else {
    const el = document.getElementById(id);
    if (!el) return;

    const offset = 120; // adjust 80 → 120 if navbar is bigger
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};


    if (location.pathname !== '/' || location.hash !== `#${id}`) {
      navigate(`/#${id}`, { replace: false });
      setTimeout(scrollToSection, 50);
    } else {
      scrollToSection();
    }
  };

  const navigateAndScrollTop = (to) => {
    navigate(to);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setDrawerOpen(false);
      setAcctOpen(false);
    }
  };



  // ✅ Handle assessment button click
  const handleAssessmentClick = () => {
  console.log('🎯 Book Free Assessment button clicked');

  if (!user) {
    openAuthModal('login');
    return;
  }

  setAssessmentDialogOpen(true);
};


  // ✅ Handle login/join button click
  const handleLoginJoinClick = () => {
    console.log('🔐 Login/Join button clicked');
    setAcctOpen(false);
    openAuthModal('login');
  };

  const userInitial = (user?.name || user?.email || 'U')[0]?.toUpperCase?.() || 'U';

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container container d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Link
            className="navbar-logo d-flex align-items-center"
            to="/"
            onClick={() => navigateAndScrollTop('/')}
          >
            <img src={MathCodeLogo} alt="MathCode Logo" />
          </Link>

          {/* Menu */}
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

          {/* Right Side */}
          <div className="navbar-cta d-flex align-items-center gap-2 ms-3">
            {/* Book Free Assessment button */}
            <button
              type="button"
              className="btn-cta d-none d-lg-inline"
              onClick={handleAssessmentClick}
            >
              Book Free Assessment
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
                            <div className="account-name">{user.firstName || 'User'} {user.lastName || ''}</div>
                            <div className="account-email">{user.email || ''}</div>
                          </div>
                        </div>

                        {/* <button className="acct-item acct-primary" onClick={() => navigateAndScrollTop('/dashboard')}>Dashboard</button> */}
                        <button className="acct-item" onClick={() => navigateAndScrollTop('/packages')}>My Packages</button>
                        <button className="acct-item" onClick={() => navigateAndScrollTop('/sessions')}>My Sessions</button>
                        <button className="acct-item" onClick={() => navigateAndScrollTop('/profile-settings')}>Profile & Settings</button>
                        <button className="acct-item" onClick={() => navigateAndScrollTop('/manage-billing')}>Manage Plan / Billing</button>
                        <button className="acct-item" onClick={() => navigateAndScrollTop('/help-center')}>Help Center</button>
                        <div className="acct-sep" />
                        <button className="acct-item danger" onClick={handleLogout}>Logout</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
  className="btn-login"
  onClick={handleLoginJoinClick}
>
  Login / Sign Up
</button>
                )}
              </>
            )}

            {/* Burger menu */}
            <button
              className="navbar-toggle d-lg-none border-0 bg-transparent ms-auto"
              aria-label="Toggle menu"
              aria-expanded={drawerOpen}
              onClick={() => {
              
                setDrawerOpen(prev => !prev);
              }}
            >
              <HiMenu className={`menu-button`} size={30} />
            </button>
          </div>
        </div>

        {/* Drawer */}
        <SideDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onPackage={() => setDialogOpen(true)}
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

      {/* Free Assessment Dialog */}
      <FreeAssessmentDialog
  user={user}
  open={assessmentDialogOpen}
  onClose={() => setAssessmentDialogOpen(false)}
  onSuccess={() => {
    setAssessmentDialogOpen(false);
    fetchAllPackages(); // ← refresh packages
  }}
/>


      {/* Booking Dialog */}
      <BookingDialog
        open={dialogOpen}
        onClose={() => {
          console.log('Closing booking dialog');
          setDialogOpen(false);
        }}
        onSubmit={(data) => {
          console.log("Booking submitted:", data);
          setDialogOpen(false);
        }}
      />

      {/* Auth Modal */}
      <AuthModal />

      {/* Debug overlay to show dialog state */}
      \
    </>
  );
}