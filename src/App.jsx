// App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import AppNavBar from "./components/AppNavBar.jsx";
import Footer from "./components/Footer/Footer.jsx";

// Context Providers
import { UserProvider } from "./context/UserProvider.jsx";
import { FreeSessionProvider } from "./context/FreeSessionProvider.jsx";

// Utils
import ScrollToHash from "./utils/ScrollToHash.jsx"; 

// Screens
import HomePage from "./screens/Home/HomePage.jsx";
import AboutPage from "./screens/About/AboutPage.jsx";
import AuthPage from "./screens/Auth/AuthPage.jsx";
import LogoutPage from "./screens/Auth/LogoutPage.jsx";
import NotFoundPage from "./screens/NotFound/NotFoundPage.jsx";
import ForgotPasswordPage from "./screens/Auth/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./screens/Auth/ResetPasswordPage.jsx";
import Dashboard from "./screens/Dashboard/Dashboard.jsx";

import "./App.css";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />

       {/* Auth */}
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/reset-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/confirm" element={<ResetPasswordPage />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

    </Routes>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <FreeSessionProvider /* analytics={window.mixpanel} config={{ spamWindowDays: 30 }} */>

          <AppNavBar />
          <div>
            <AppRoutes />
          </div>
          <Footer />
        </FreeSessionProvider>
      </Router>
    </UserProvider>
  );
}