import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
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
        <nav className="appdash-nav">
          <Link to="/dashboard" className="appdash-link">Dashboard</Link>
          <Link to="/packages" className="appdash-link">Packages</Link>
          <Link to="/profile-settings" className="appdash-link">Profile</Link>
          <Link to="/manage-billing" className="appdash-link">Billing</Link>
          <Link to="/help-center" className="appdash-link">Help</Link>
        </nav>
      </div>

      <div className="appdash-right">
        <button className="appdash-icon-btn">
          <FiBell />
        </button>

        <div className="appdash-user-menu" ref={menuRef}>
          <button 
            className="appdash-user-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img src={userAvatar} alt="User avatar" className="appdash-avatar" />
            <span className="appdash-user-name">
              {user?.firstName || 'User'}
            </span>
          </button>

          {menuOpen && (
            <div className="appdash-dropdown">
              <button 
                className="appdash-dropdown-item"
                onClick={() => navigate('/profile-settings')}
              >
                <FiUser />
                Profile & Settings
              </button>
              <button 
                className="appdash-dropdown-item"
                onClick={() => navigate('/packages')}
              >
                <FiBarChart2 />
                My Packages
              </button>
              <button 
                className="appdash-dropdown-item"
                onClick={() => navigate('/manage-billing')}
              >
                <FiSettings />
                Billing
              </button>
              <div className="appdash-dropdown-divider"></div>
              <button 
                className="appdash-dropdown-item appdash-logout"
                onClick={logout}
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}