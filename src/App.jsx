// App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Components
import AppNavBar from "./components/AppNavBar.jsx";
import Footer from "./components/Footer/Footer.jsx";

// Context Providers
import { UserProvider } from "./context/UserProvider.jsx";
import { SessionProvider } from "./context/SessionProvider.jsx";

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
import PrivacyPage from "./screens/Privacy/PrivacyPage.jsx";
import TermsPage from "./screens/Terms/TermsPage.jsx";
import PricingPage from "./screens/Pricing/PricingPage.jsx";
import Dashboard from "./screens/Dashboard/Dashboard.jsx";
import ProfileSettings from "./screens/ProfileSettings/ProfileSettings.jsx";
import ManageBilling from "./screens/ManageBilling/ManageBilling.jsx";
import HelpCenter from "./screens/HelpCenter/HelpCenter.jsx";
import ContactPage from "./screens/Contact/ContactPage.jsx";



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
      <Route path="/profile-settings" element={<ProfileSettings />} />
      <Route path="/manage-billing" element={<ManageBilling />} />
      <Route path="/help-center" element={<HelpCenter />} />

      {/* Privacy Policy */}
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage></TermsPage>}/>
      <Route path="/contact" element={<ContactPage></ContactPage>}/>
      <Route path="/pricing" element={<PricingPage></PricingPage>}/>
      

    </Routes>
  );
}


export default function App() {
  return (
    <UserProvider>
      <Router>
        <SessionProvider /* analytics={window.mixpanel} config={{ spamWindowDays: 30 }} */>

          <AppNavBar />
          <div>
            <AppRoutes />
          </div>
          <Footer />
        </SessionProvider>
      </Router>
    </UserProvider>
  );
}