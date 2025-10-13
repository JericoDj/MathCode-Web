import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import AppNavBar from "./components/AppNavBar.jsx";
import AppDashboardNavBar from "./components/AppDashboardNavBar.jsx";
import Footer from "./components/Footer/Footer.jsx";

import { UserProvider } from "./context/UserProvider.jsx";
import { SessionProvider } from "./context/SessionProvider.jsx";
import { StudentProvider } from "./context/StudentProvider.jsx";
import { PlanProvider } from "./context/PlanProvider.jsx";

import HomePage from "./screens/Home/HomePage.jsx";
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
  const isDashboardRoute = location.pathname.startsWith("/dashboard") || 
    location.pathname.startsWith("/profile-settings") ||
    location.pathname.startsWith("/manage-billing") ||
    location.pathname.startsWith("/help-center");

  return (
    <>
      {isDashboardRoute ? <AppDashboardNavBar /> : <AppNavBar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/manage-billing" element={<ManageBilling />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {!isDashboardRoute && <Footer />}
    </>
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
