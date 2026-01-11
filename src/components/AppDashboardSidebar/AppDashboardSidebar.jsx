import { useState, useRef, useEffect, useContext, use } from "react";
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



  const auth = JSON.parse(localStorage.getItem('auth'));
const roles = Array.isArray(auth?.roles) ? auth.roles : [auth?.roles || user?.role].filter(Boolean);

  
  

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
  { to: "/packages", label: "Packages", icon: <FiPackage />, roles: ["parent", "tutor", "admin"] },
  { to: "/sessions", label: "Sessions", icon: <FiBarChart2 />, roles: ["student", "parent", "tutor", "admin"] },
  { to: "/profile-settings", label: "Profile", icon: <FiUser />, roles: ["student", "parent", "tutor", "admin"] },
  { to: "/manage-billing", label: "Billing", icon: <FiCreditCard />, roles: ["parent", "tutor", "admin"] },
  // { to: "/help-center", label: "Help", icon: <FiHelpCircle />, roles: ["student", "parent", "tutor", "admin"] },
];

  // Filter nav items based on user role
const filteredNavItems = navItems.filter(item => {
  // item.roles is ["parent","admin"]
  // roles is ["student"] or ["parent"]
  return item.roles.some(r => roles.includes(r));
});

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <aside className={`appdash-sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-top">

          {/* logo Section */}

          <Link to="/" className="sidebar-logo">
            <img src={MathCodeLogo} alt="MathCode Logo" />
          </Link>

          <nav className="sidebar-nav">
            {filteredNavItems.map(({ to, label, icon }) => (
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
        {/* Credits Section for Parents */}
{/* Credits Section */}

  <div className="sidebar-credits">
    <div className="credits-title">Credits</div>
    <div className="credits-amount">{auth.credits}</div>
  </div>


{/* Logout Section */}
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