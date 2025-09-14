import React, { useState, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext.jsx";
import UserController from "../controllers/UserController.jsx";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch current user once
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UserController.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ New: expose reset functions via context
  const requestPasswordReset = useCallback(async (email) => {
    return UserController.requestPasswordReset({ email });
  }, []);

  const completePasswordReset = useCallback(async (token, password) => {
    return UserController.resetPassword({ token, password });
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, requestPasswordReset, completePasswordReset }}
    >
      {children}
    </UserContext.Provider>
  );
};
