import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import AppNavBar from "./components/AppNavBar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import HomePage from "./screens/Home/HomePage.jsx";
import AboutPage from "./screens/About/AboutPage.jsx";

import NotFoundPage from "./screens/NotFound/NotFoundPage.jsx";
import { UserProvider } from "./context/UserProvider.jsx";
import "./App.css";

function AppRoutes() {
  return (
    <Routes>
      {/* Default route for "/" */}
      <Route path="/" element={<HomePage />} />
      {/* Or, if you prefer redirecting to /home, swap the above for:
          <Route path="/" element={<Navigate to="/home" replace />} /> */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
       
        <AppNavBar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
