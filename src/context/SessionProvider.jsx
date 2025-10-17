// context/SessionProvider.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import SessionController from "../controllers/SessionController.jsx";
import FreeSessionDialog from "../components/FreeSession/FreeSessionDialog.jsx";
import { SessionContext } from "./SessionContext.jsx";

export function SessionProvider({ children, analytics = null, config = {} }) {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [allSessions, setAllSessions] = useState([]);

  // Initialize controller once
  const ctrlRef = useRef(null);
  if (!ctrlRef.current) {
    ctrlRef.current = new SessionController({ analytics, ...config });
  }
  const ctrl = ctrlRef.current;

  // Update controller context when user/location changes
  useEffect(() => {
    ctrl.setContext?.({ user, location });
  }, [user, location, ctrl]);

  // --- Core Actions ---
  const requestSession = async (opts = {}) => {
    setLoading(true);
    try {
      const res = await ctrl.submitSession({ user, location, ...opts });
      return res;
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId) => {
    setLoading(true);
    try {
      const res = await ctrl.cancelSession?.(sessionId);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSessions = async () => {
    setLoading(true);
    try {
      const sessions = await ctrl.getAllSessions();
      setAllSessions(sessions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        loading,
        controller: ctrl,
        requestSession,
        cancelSession,
        fetchAllSessions,
        allSessions,
        sessions: allSessions, // Provide sessions data
      }}
    >
      {children}

      {/* Only keep FreeSessionDialog if needed, remove SessionsDialog */}
      <FreeSessionDialog />
    </SessionContext.Provider>
  );
}