import { useState, useEffect, useContext } from "react";
import { SessionsContext } from "../context/SessionsContext.jsx";
import { UserContext } from "../context/UserContext.jsx";

import {
  fetchAllSessions,
  fetchSessionsByUser,
  createSession,
  updateSession,
  updateSessionStatus,
} from "../controllers/SessionsController.jsx";

export default function SessionsProvider({ children }) {
  const { user } = useContext(UserContext);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUserSessions = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await fetchSessionsByUser(user.id);
      setSessions(data.sessions || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshAllSessions = async () => {
    try {
      setLoading(true);
      const data = await fetchAllSessions();
      setSessions(data.sessions || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const addSession = async (payload) => {
    await createSession(payload);
    await loadUserSessions();
  };

  const editSession = async (id, payload) => {
    await updateSession(id, payload);
    await loadUserSessions();
  };

  const changeStatus = async (id, status) => {
    await updateSessionStatus(id, status);
    await loadUserSessions();
  };

  useEffect(() => {
    loadUserSessions();
  }, [user]);

  return (
    <SessionsContext.Provider value={{
      sessions,
      loading,
      error,
      loadUserSessions,
      refreshAllSessions,
      addSession,
      editSession,
      changeStatus
    }}>
      {children}
    </SessionsContext.Provider>
  );
}
