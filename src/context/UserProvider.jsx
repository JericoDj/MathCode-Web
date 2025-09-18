// context/UserProvider.jsx
import { useState, useEffect } from 'react';
import { UserContext } from './UserContext.jsx'; // ✅ import only the context
import AuthController from '../controllers/AuthController.jsx';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const ctrl = new AuthController();

  // Fetch current session user on load
  useEffect(() => {
  async function fetchUser() {

    try {
      const saved = localStorage.getItem("auth");
      console.log("Saved auth:", saved);
      if (!saved) {
        setUser(null);
        return;
      }

      const { token } = JSON.parse(saved);

      const res = await fetch("https://mathcode-backend.onrender.com/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        credentials: "include",
      });

      if (res.ok) {
        const u = await res.json();
        setUser(u);
      } else {
        // token expired or invalid
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


  const login = async ({ email, password }) => {
    const u = await ctrl.login({ email, password });
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const u = await ctrl.register(data);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await ctrl.logout();
    setUser(null);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
