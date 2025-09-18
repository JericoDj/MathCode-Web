import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from '../../context/UserContext.jsx';
import "./SideDrawer.css";

export default function SideDrawer({
  isOpen,
  onClose,
  onFreeSession,
  onDashboard,
  onProfileSettings,
  onBilling,
  onHelpCenter,
  onLogout,
}) {
  const { user } = useContext(UserContext);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "pricing", label: "Pricing" },
    { id: "program", label: "Program" },
    { id: "contact", label: "Contact" },
    { id: "faq", label: "FAQ" },
  ];

  // Reset dropdown when user changes
  useEffect(() => {
    setAccountOpen(false);
  }, [user]);

  // Close account dropdown whenever drawer closes
  const handleCloseAccount = (delay = 0) => {
  if (delay > 0) {
    // keep it open for the transition duration
    setTimeout(() => setAccountOpen(false), delay);
  } else {
    setAccountOpen(false);
  }
};

const handleCloseDrawer = () => {
  handleCloseAccount(500); // 0.5s delay for smooth closing
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
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else if (id === "faq")
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    };

    if (location.pathname !== "/" || location.hash !== `#${id}`) {
      navigate(`/#${id}`, { replace: false });
      setTimeout(scrollToSection, 50);
    } else scrollToSection();
  };

  const userInitial = (user?.firstName || user?.email || "U")[0]?.toUpperCase();

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? "show" : ""}`} onClick={handleCloseDrawer} />
      <div className={`side-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-section">
          <div className="drawer-section-title">Navigation</div>
          <ul className="drawer-links">
            {navLinks.map(({ id, label }) => (
              <li key={id} onClick={() => handleNavLinkClick(id)}>
                {label}
              </li>
            ))}
          </ul>
          <div className="drawer-cta">
            <button className="btn-cta" onClick={() => { handleCloseDrawer(); onFreeSession?.(); }}>
              Book a Free Session
            </button>
          </div>
        </div>

        {user ? (
          <div className="drawer-account-group">
            <button className="btn-dashboard" onClick={() => { handleCloseDrawer(); onDashboard?.(); }}>
              Dashboard
            </button>
            <div className="drawer-account" onClick={() => setAccountOpen((prev) => !prev)}>
  <div className="account-header">
    <img
      src={user.photoURL || `https://picsum.photos/seed/${user.firstName || "u"}/60`}
      alt="Avatar"
      className="account-avatar"
    />
    <div id="account-infos" className="account-info">
      <div className="account-names">{user.firstName || "User"} {user.lastName || ""}</div>
      <div className="account-emails">{user.email || ""}</div>
    </div>
  </div>

<div className={`account-links ${accountOpen ? "open" : ""}`}>
  <button onClick={() => { handleCloseAccount(500); onProfileSettings?.(); }}>Profile & Settings</button>
  <button onClick={() => { handleCloseAccount(500); onBilling?.(); }}>Manage Plan / Billing</button>
  <button onClick={() => { handleCloseAccount(500); onHelpCenter?.(); }}>Help Center</button>
  <button className="danger" onClick={() => { handleCloseAccount(500); onLogout?.(); }}>Logout</button>
</div>
</div>
          </div>
        ) : (
          <div className="drawer-login-join">
            <button
              className="btn-outline"
              onClick={() => {
                handleCloseDrawer();
                navigate("/login");
              }}
            >
              Login / Join
            </button>
          </div>
        )}
      </div>
    </>
  );
}
