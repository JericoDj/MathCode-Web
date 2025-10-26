// App.jsx
import { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Link, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";

import AppNavBar from "./components/AppNavBar/AppNavBar.jsx";
import AppDashboardSidebar from "./components/AppDashboardSidebar/AppDashboardSidebar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import DashboardNavIcons from "./components/DashboardNavIcons/DashboardNavIcons.jsx";
import AuthModal from "./components/AuthModal/AuthModal.jsx";

import MathCodeLogo from '../src/assets/MathCodeNoBGcropped.png';

import { UserProvider } from "./context/UserProvider.jsx"; // Import UserContext
import { PackageProvider } from "./context/PackageProvider.jsx";
import { StudentProvider } from "./context/StudentProvider.jsx";
import { PlanProvider } from "./context/PlanProvider.jsx";

// Screens
import HomePage from "./screens/Home/HomePage.jsx";
import PackagePage from "./screens/PackagePage/PackagePage.jsx";
import AboutPage from "./screens/About/AboutPage.jsx";
import SessionsPage from "./screens/Sessions/SessionsPage.jsx";
import LogoutPage from "./screens/Auth/LogoutPage.jsx";
import NotFoundPage from "./screens/NotFound/NotFoundPage.jsx";
import ForgotPasswordPage from "./screens/Auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./screens/Auth/ResetPasswordPage.jsx";
import PrivacyPage from "./screens/Privacy/PrivacyPage.jsx";
import TermsPage from "./screens/Terms/TermsPage.jsx";
import PricingPage from "./screens/Pricing/PricingPage.jsx";
import Dashboard from "./screens/Dashboard/Dashboard.jsx";
import ProfileSettings from "./screens/ProfileSettings/ProfileSettings.jsx";
import ManageBilling from "./screens/ManageBilling/ManageBilling.jsx";
import HelpCenter from "./screens/HelpCenter/HelpCenter.jsx";
import ContactPage from "./screens/Contact/ContactPage.jsx";
import VerifyOTPPage from "./screens/Auth/OTPVerificationPage.jsx";
import AuthCallback from "./screens/Auth/AuthCallback.jsx"; // Import the new AuthCallback component

import "./App.css";

// Simple component to handle Google OAuth success
function GoogleOAuthHandler() {
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const handleGoogleCallback = async () => {
      // Check for token in URL parameters
      const urlParams = new URLSearchParams(location.search);
      const token = urlParams.get('token');
      const isNewUser = urlParams.get('isNewUser') === 'true';

      if (token) {
        try {
          console.log('Google OAuth callback received token');
          
          // Store the token
          localStorage.setItem('token', JSON.stringify(token));
          
          // Fetch user data with the token
          const response = await fetch(`${API_BASE_URL}/api/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            
            // Clear URL parameters and redirect
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            
            // Redirect based on whether it's a new user
            if (isNewUser) {
              navigate('/profile-settings', { replace: true });
            } else {
              navigate('/dashboard', { replace: true });
            }
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Google OAuth callback error:', error);
          navigate('/', { replace: true });
        }
      }
    };

    handleGoogleCallback();
  }, [location, navigate, setUser]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Completing Google Sign In...</h2>
      <p>Please wait while we finish setting up your account.</p>
    </div>
  );
}

function LayoutWrapper() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Prevent body scrolling when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/profile-settings") ||
    location.pathname.startsWith("/sessions") ||
    location.pathname.startsWith("/manage-billing") ||
    location.pathname.startsWith("/packages") ||
    location.pathname.startsWith("/help-center");

  return (
    <div className={`app-layout ${isDashboardRoute ? "dashboard-layout" : "site-layout"}`}>
      {/* Auth Modal - available on all pages */}
      <AuthModal />
      
      {isDashboardRoute ? (
        <>
          {/* Dashboard layout */}
          <div className="dashboard-topbar">
            <div>
              <Link to="/" className="logo">
                <img src={MathCodeLogo} alt="MathCode Logo" />
              </Link>
            </div>
            <div>
              <div className="topbar-left">
                <div className="topbar-right mobile-only">
                  <DashboardNavIcons />
                </div>
                <button
                  className="hamburger-btn"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <HiMenu className="menu-button justify-content-end" size={30} />
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-content">
            {sidebarOpen && (
              <div
                className="sidebar-overlay"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <aside className={`dashboard-sidebar me-5 ${sidebarOpen ? "open" : ""}`}>
              <AppDashboardSidebar 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
              />
            </aside>

            <div className="sidebar-nav-icons web-only">
              <DashboardNavIcons />
            </div>

            <main className="dashboard-main">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                <Route path="/manage-billing" element={<ManageBilling />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/packages" element={<PackagePage />} />
                <Route path="/sessions" element={<SessionsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        <>
          <AppNavBar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              {/* Google OAuth callback handlers */}
              <Route path="/google-oauth-callback" element={<GoogleOAuthHandler />} />
              <Route path="/auth/callback" element={<AuthCallback />} /> {/* Add this route */}
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/reset-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/confirm" element={<ResetPasswordPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/verify-otp" element={<VerifyOTPPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <PackageProvider>
          <StudentProvider>
            <PlanProvider>
              <LayoutWrapper />
            </PlanProvider>
          </StudentProvider>
        </PackageProvider>
      </Router>
    </UserProvider>
  );
}