import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import { FiBell, FiLogOut, FiUser, FiSettings, FiBarChart2 } from "react-icons/fi";
import "./AppDashboardNavBar.css";

export default function AppDashboardNavBar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const userAvatar = user?.photoURL || `https://picsum.photos/seed/${user?.firstName || 'u'}/60`;

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  return (
    <header className="appdash-navbar">
      <div className="appdash-left">
        <Link to="/" className="appdash-logo">
          <span className="logo-mark">MC</span> <span>MathCode</span>
        </Link>

        <nav className="appdash-nav">
          <Link to="/dashboard" className="appdash-link">Dashboard</Link>
          <Link to="/profile-settings" className="appdash-link">Profile</Link>
          <Link to="/manage-billing" className="appdash-link">Billing</Link>
          <Link to="/help-center" className="appdash-link">Help</Link>
        </nav>
      </div>

      <div className="appdash-right">
        <button className="appdash-icon-btn">
          <FiBell />
        </button>

        <div ref={menuRef} style={{ position: "relative" }}>
          <img
            src={userAvatar}
            alt="User"
            className="appdash-avatar"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="appdash-menu">
              <Link className="appdash-menu-item" to="/profile-settings" onClick={() => setMenuOpen(false)}>
                <FiUser size={16} style={{ marginRight: 8 }} /> Profile Settings
              </Link>
              <Link className="appdash-menu-item" to="/manage-billing" onClick={() => setMenuOpen(false)}>
                <FiBarChart2 size={16} style={{ marginRight: 8 }} /> Manage Billing
              </Link>
              <Link className="appdash-menu-item" to="/help-center" onClick={() => setMenuOpen(false)}>
                <FiSettings size={16} style={{ marginRight: 8 }} /> Help Center
              </Link>
              <div className="appdash-menu-item danger" onClick={async () => {
                await logout();
                navigate("/");
              }}>
                <FiLogOut size={16} style={{ marginRight: 8 }} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
