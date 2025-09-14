// App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppNavBar from "./components/AppNavBar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import HomePage from "./screens/Home/HomePage.jsx";
import AboutPage from "./screens/About/AboutPage.jsx";
import NotFoundPage from "./screens/NotFound/NotFoundPage.jsx";
import { UserProvider } from "./context/UserProvider.jsx";
import ScrollToHash from "./utils/ScrollToHash.jsx"; // ← add this
import "./App.css";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <ScrollToHash offset={50} />  {/* ensures /#pricing scrolls correctly */}
        <AppNavBar />
        {/* Avoid nested <main>; HomePage already renders a <main>.
            Change this wrapper to a div for semantics: */}
        <div>
          <AppRoutes />
        </div>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
