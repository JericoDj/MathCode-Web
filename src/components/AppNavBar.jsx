import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import UserController from '../controllers/UserController.jsx';
import './AppNavBar.css';

export default function AppNavBar() {
  const { user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userController = new UserController();
        const userData = await userController.getCurrentUser();
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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">MC</span>
          <span className="logo-word">MathCode</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className={`navbar-toggle ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar-menu ${open ? 'open' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={() => setOpen(false)}>Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link" onClick={() => setOpen(false)}>About</Link>
          </li>
          <li className="navbar-item">
            <Link to="/contact" className="navbar-link" onClick={() => setOpen(false)}>Contact</Link>
          </li>

          {isLoading ? (
            <li className="navbar-item">
              <span className="navbar-link muted">Loading…</span>
            </li>
          ) : user ? (
            <>
              <li className="navbar-item">
                <Link to="/dashboard" className="navbar-link" onClick={() => setOpen(false)}>Dashboard</Link>
              </li>
              <li className="navbar-item">
                <Link to="/profile" className="navbar-link" onClick={() => setOpen(false)}>Profile</Link>
              </li>
              <li className="navbar-item">
                <Link to="/logout" className="navbar-link" onClick={() => setOpen(false)}>Logout</Link>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link" onClick={() => setOpen(false)}>Login</Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-link" onClick={() => setOpen(false)}>Register</Link>
              </li>
            </>
          )}

          {/* CTAs duplicated for mobile drawer */}
          <li className="menu-cta-mobile">
            <Link to="/packages" className="btn-cta" onClick={() => setOpen(false)}>Book a Package</Link>
          </li>
          {!user && !isLoading && (
            <li className="menu-cta-mobile">
              <Link to="/practice/sample" className="btn-outline" onClick={() => setOpen(false)}>
                Try a Sample
              </Link>
            </li>
          )}
        </ul>

        {/* Right-side CTAs (desktop) */}
        <div className="navbar-cta">
          <Link to="/packages" className="btn-cta" onClick={() => setOpen(false)}>Book a Package</Link>
          {!user && !isLoading && (
            <Link to="/practice/sample" className="btn-outline" onClick={() => setOpen(false)}>
              Try a Sample
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
