// context/UserProvider.jsx
import { useState, useEffect } from 'react';
import { UserContext } from './UserContext.jsx';
import AuthController from '../controllers/AuthController.jsx';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [googleSignupData, setGoogleSignupData] = useState(null);
  const ctrl = new AuthController();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "math-code-backend-fh0n8n7g3-jericos-projects-f568a5b3.vercel.app";

  // Fetch current session user on load
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(token)}`, 
          },
        });

        if (res.ok) {
          const u = await res.json();
          setUser(u);
          localStorage.setItem("auth", JSON.stringify(u));
          console.log("Active user session found:", u);
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

  // Password Reset Functions
  const requestPasswordReset = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  };

  const verifyOTP = async (email, otp, purpose = 'password-reset') => {
    try {
      // For password reset, we'll verify during the reset process
      // This function can be used for general OTP verification if needed
      // For now, we'll just return success if we reach this point
      return { success: true, message: 'OTP verified successfully' };
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  };

  const resetPasswordWithOTP = async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  // Google OAuth methods
  const googleLogin = async (credential) => {
    try {
      console.log("SIGNING GOOGLE WITH CREDENTIAL:", credential);
      
      const response = await fetch(`${API_BASE_URL}/api/users/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credential,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
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
        // Password reset functions
        requestPasswordReset,
        verifyOTP,
        resetPasswordWithOTP,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}