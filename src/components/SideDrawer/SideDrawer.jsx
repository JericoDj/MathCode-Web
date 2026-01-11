import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from '../../context/UserContext.jsx';
import FreeAssessmentDialog from "../../components/FreeAssessmentDialog/FreeaAssessmentDialog.jsx";
import AuthModal from "../../components/AuthModal/AuthModal.jsx";
import "./SideDrawer.css";

export default function SideDrawer({
  isOpen,
  onClose,
  onFreeSession,
  onDashboard,
  onProfileSettings,
  onBilling,
  onHelpCenter,
}) {
  const { user, logout, openAuthModal } = useContext(UserContext);
  const [accountOpen, setAccountOpen] = useState(false);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

 const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'singapore-maths', label: 'Singapore Maths' },
  { id: 'kids-coding', label: 'Kids Coding' },
  // { id: 'contact', label: 'Contact' },
];

  // Reset dropdown when user changes
  useEffect(() => {

    console.log(user);
    setAccountOpen(false);
  }, [user]);

  const handleCloseAccount = (delay = 0) => {
    if (delay > 0) {
      setTimeout(() => setAccountOpen(false), delay);
    } else {
      setAccountOpen(false);
    }
  };

  const handleCloseDrawer = () => {
    handleCloseAccount(500);
    onClose?.();
  };

  const scrollToTop = () => {
     onClose?.();
     window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleCloseAccountNavigationDrawer = () => {
    handleCloseAccount(500);
    window.scrollTo({ top: 0, behavior: "smooth" });
    onClose?.();
  };

  // Close account dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (accountOpen) setAccountOpen(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [accountOpen]);

  const handleNavLinkClick = (id) => {
  handleCloseDrawer();

  const scrollToSection = () => {
  

    const el = document.getElementById(id);
    if (!el) return;

    const offset = 120; // match navbar height
    const y = el.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // If not on home, navigate then scroll
  if (location.pathname !== '/' || location.hash !== `#${id}`) {
    navigate(`/#${id}`);
    setTimeout(scrollToSection, 50);
  } else {
    scrollToSection();
  }
};


  const handleDialogSubmit = (data) => {
    console.log("Booking submitted:", data);
  };

  // Handle login/join button click
  const handleLoginJoinClick = () => {
    handleCloseDrawer();
    openAuthModal('login');
  };

  return (
    <>
      <div
        className={`sidedrawer-backdrop ${isOpen ? "show" : ""}`}
        onClick={handleCloseAccountNavigationDrawer}
      />
      <div className={`sidedrawer ${isOpen ? "open" : ""}`}>
        <div className="sidedrawer-section">
          <div className="sidedrawer-section-title">Navigation</div>
          <ul className="sidedrawer-links">
            {navLinks.map(({ id, label }) => (
              <li key={id} onClick={() => handleNavLinkClick(id)}>
                {label}
              </li>
            ))}
          </ul>
          <div className="sidedrawer-cta">
            <button
              className="sidedrawer-btn-cta"
              onClick={() => setAssessmentDialogOpen(true)}
            >
              Book Free Assessment
            </button>
          </div>
        </div>

        {user ? (
          <div className="sidedrawer-account-group">
            <button
  className="sidedrawer-btn-dashboard"
  onClick={() => {
    handleCloseDrawer();
    navigate('/sessions');
  }}
>
  Sessions
</button>

            <div
              className="sidedrawer-account"
              onClick={() => setAccountOpen((prev) => !prev)}
            >
              <div className="sidedrawer-account-header">
                <img
                  src={
                    user.photoURL ||
                    `https://picsum.photos/seed/${user.firstName || "u"}/60`
                  }
                  alt="Avatar"
                  className="sidedrawer-account-avatar"
                />
                <div className="sidedrawer-account-info">
                  <div className="sidedrawer-account-names">
                    {user.firstName || "User"} {user.lastName || ""}
                  </div>
                  <div className="sidedrawer-account-emails">{user.email || ""}</div>
                </div>
              </div>

              <div className={`sidedrawer-account-links ${accountOpen ? "open" : ""}`}>
                <button
                  onClick={() => {
                    handleCloseAccount(500);
                    onProfileSettings?.();
                  }}
                >
                  Profile & Settings
                </button>
                <button
                  onClick={() => {
                    handleCloseAccount(500);
                    onBilling?.();
                  }}
                >
                  Manage Plan / Billing
                </button>
                <button
                  onClick={() => {
                    handleCloseAccount(500);
                    onHelpCenter?.();
                  }}
                >
                  Help Center
                </button>



                {/* Credits */}
                {(typeof user?.credits === "number" && user.credits >= 0) && (
  <div className="sidedrawer-credits">
    <div className="sidedrawer-credits-title">Credits</div>
    <div className="sidedrawer-credits-value">{user.credits}</div>
  </div>
)}

                <button
                  className="danger"
                  onClick={() => {
                    handleCloseAccount(500);
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="sidedrawer-login-join">
            <button
              className="sidedrawer-btn-outlined"
              onClick={handleLoginJoinClick}
            >
              Login / Join
            </button>
          </div>
        )}
      </div>

      <FreeAssessmentDialog
        open={assessmentDialogOpen}
        onClose={() => setAssessmentDialogOpen(false)}
        onSubmit={(data) => console.log("Assessment booked:", data)}
      />
      
      <AuthModal />
    </>
  );
}