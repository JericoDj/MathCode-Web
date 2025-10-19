import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import MathCodeLogo from '../../assets/MathCodeNoBGcropped.png';

import {
  FiBell,
  FiLogOut,
  FiUser,
  FiSettings,
  FiBarChart2,
  FiHome,
  FiCreditCard,
  FiHelpCircle,
  FiPackage,
} from "react-icons/fi";
import "./AppDashboardSidebar.css";

export default function AppDashboardSidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const userAvatar =
    user?.photoURL || `https://picsum.photos/seed/${user?.firstName || "u"}/60`;

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome /> },
    { to: "/packages", label: "Packages", icon: <FiPackage /> },
    { to: "/profile-settings", label: "Profile", icon: <FiUser /> },
    { to: "/manage-billing", label: "Billing", icon: <FiCreditCard /> },
    { to: "/help-center", label: "Help", icon: <FiHelpCircle /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <aside className={`appdash-sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-top">
          <Link to="/" className="sidebar-logo">
            <img src={MathCodeLogo} alt="MathCode Logo" />
          </Link>

          <nav className="sidebar-nav">
            {navItems.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`sidebar-link ${
                  location.pathname === to ? "active" : ""
                }`}
                onClick={() => setSidebarOpen(false)} // close on mobile
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button Section */}
        <div className="sidebar-bottom">
          <button 
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}