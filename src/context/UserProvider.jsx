// context/UserProvider.jsx
import { useState, useEffect } from 'react';
import { UserContext } from './UserContext.jsx';
import AuthController from '../controllers/AuthController.jsx';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [googleSignupData, setGoogleSignupData] = useState(null); // Store Google user data for password setup
  const ctrl = new AuthController();

  // Fetch current session user on load
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch("http://localhost:4000/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`, 
          },
        });

        if (res.ok) {
          const u = await res.json();
          setUser(u);
        } else {
          localStorage.removeItem("auth");
          setUser(null);
        }
      } catch (err) {
        console.warn("No active user session:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const getCurrentUser = async () => {
    const u = await ctrl.getCurrentUser({});
    setUser(u);
    return u;
  }

  const login = async ({ email, password }) => {
    const u = await ctrl.login({ email, password });
    setUser(u);
    setAuthModalOpen(false);
    return u;
  };

  const register = async (data) => {
    const u = await ctrl.register(data);
    setUser(u);
    setAuthModalOpen(false);
    return u;
  };

  const logout = async () => {
    await ctrl.logout();
    setUser(null);
  };

  // Google OAuth methods
  // context/UserProvider.jsx - Fix the googleLogin function
const googleLogin = async (credential) => {
  try {
    console.log("SIGNING GOOGLE WITH CREDENTIAL:", credential);
    
    // Send Google token to your backend - FIXED URL
    const response = await fetch('http://localhost:4000/api/users/auth/google', { // Changed from /api/auth/google
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: credential, // Send the raw credential, not decoded
      }),
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData.user);
      // Store the token
      localStorage.setItem('token', JSON.stringify(userData.token));
      setAuthModalOpen(false);
      return userData;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Google authentication failed');
    }
  } catch (error) {
    console.error('Google login failed:', error);
    throw error;
  }
};

  const completeGoogleSignup = async (password, phone = '') => {
    if (!googleSignupData) throw new Error('No Google signup data found');

    const userData = {
      ...googleSignupData,
      password,
      phone,
    };

    const u = await register(userData);
    setGoogleSignupData(null);
    return u;
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setGoogleSignupData(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        getCurrentUser,
        // Auth modal controls
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        // Google OAuth
        googleLogin,
        completeGoogleSignup,
        googleSignupData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}