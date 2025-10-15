import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import { FiBell, FiUser, FiBarChart2, FiSettings, FiLogOut } from "react-icons/fi";
import "./DashboardNavIcons.css";

export default function DashboardNavIcons() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const userAvatar =
    user?.photoURL || `https://picsum.photos/seed/${user?.firstName || "u"}/60`;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="dashboard-nav-icons">
      <button className="icon-btn">
        <FiBell size={24} />
      </button>

      {/* <div ref={menuRef} className="user-dropdown-wrapper">
        <img
          src={userAvatar}
          alt="User"
          className="user-avatar"
          onClick={() => setMenuOpen(!menuOpen)}
        />

        {menuOpen && (
          <div className="user-menu">
            <Link
              to="/profile-settings"
              className="user-menu-item"
              onClick={() => setMenuOpen(false)}
            >
              <FiUser size={16} /> Profile Settings
            </Link>
            <Link
              to="/manage-billing"
              className="user-menu-item"
              onClick={() => setMenuOpen(false)}
            >
              <FiBarChart2 size={16} /> Manage Billing
            </Link>
            <Link
              to="/help-center"
              className="user-menu-item"
              onClick={() => setMenuOpen(false)}
            >
              <FiSettings size={16} /> Help Center
            </Link>
            <div
              className="user-menu-item danger"
              onClick={async () => {
                await logout();
                navigate("/");
              }}
            >
              <FiLogOut size={16} /> Logout
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}
