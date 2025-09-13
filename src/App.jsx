import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppNavBar from "./components/AppNavBar.jsx";
import HomePage from "./screens/Home/HomePage.jsx";
import AboutPage from "./screens/About/AboutPage.jsx";
import ContactPage from "./screens/Contact/ContactPage.jsx";
import NotFoundPage from "./screens/NotFound/NotFoundPage.jsx";
import { UserProvider } from "./context/UserProvider.jsx";
import './App.css';

function App() {

  function AppRoutes () {
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }
  return (
    <UserProvider>
      <Router>
        <h1>MathCode</h1>
        {/* <AppNavBar /> */}
        <main>
          {/* <AppRoutes /> */}
        </main>
      </Router>
    </UserProvider>
  );
}

export default App;
