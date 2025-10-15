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

        
      </div>
    </header>
  );
}
