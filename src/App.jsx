import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from "react-router-dom";
import { HiMenu } from "react-icons/hi"; // hamburger icon

import AppNavBar from "./components/AppNavBar/AppNavBar.jsx";
import AppDashboardSidebar from "./components/AppDashboardSidebar/AppDashboardSidebar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import DashboardNavIcons from "./components/DashboardNavIcons/DashboardNavIcons.jsx";

import MathCodeLogo from '../src/assets/MathCodeNoBGcropped.png';

import { UserProvider } from "./context/UserProvider.jsx";
import { SessionProvider } from "./context/SessionProvider.jsx";
import { StudentProvider } from "./context/StudentProvider.jsx";
import { PlanProvider } from "./context/PlanProvider.jsx";

// Screens
import HomePage from "./screens/Home/HomePage.jsx";
import SessionPage from "./screens/SessionPage/SessionPage.jsx";
import AboutPage from "./screens/About/AboutPage.jsx";
import AuthPage from "./screens/Auth/AuthPage.jsx";
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

import "./App.css";

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
    location.pathname.startsWith("/manage-billing") ||
    location.pathname.startsWith("/sessions") ||
    location.pathname.startsWith("/help-center");
  

  return (
    <div className={`app-layout ${isDashboardRoute ? "dashboard-layout" : "site-layout"}`}>
      {isDashboardRoute ? (
        <>
          {/* Topbar */}
          
          
          
          
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

            

          {/* Dashboard layout: sidebar + main */}
          <div className="dashboard-content">
            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div
                className="sidebar-overlay"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside className={`dashboard-sidebar me-5 ${sidebarOpen ? "open" : ""}`}>
              <AppDashboardSidebar 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
              />
            </aside>

            {/* Floating nav buttons (web only) */}
            <div className="sidebar-nav-icons web-only">
              <DashboardNavIcons />
            </div>

            {/* Main content */}
            <main className="dashboard-main">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile-settings" element={<ProfileSettings />} />
                <Route path="/manage-billing" element={<ManageBilling />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/sessions" element={<SessionPage />} />
              
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
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/register" element={<AuthPage mode="register" />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/reset-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/confirm" element={<ResetPasswordPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              
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
        <SessionProvider>
          <StudentProvider>
            <PlanProvider>
              <LayoutWrapper />
            </PlanProvider>
          </StudentProvider>
        </SessionProvider>
      </Router>
    </UserProvider>
  );
}