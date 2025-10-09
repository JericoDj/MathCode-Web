// context/FreeSessionProvider.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { SessionContext } from "./SessionContext.jsx";
import { UserContext } from "./UserContext.jsx";
import SessionController from "../controllers/SessionController.jsx";
import FreeSessionDialog from "../components/FreeSession/FreeSessionDialog.jsx";

export function SessionProvider({ children, analytics = null, config = {} }) {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Initialize controller only once
  const ctrlRef = useRef(null);
  if (!ctrlRef.current) {
    ctrlRef.current = new SessionController({ analytics, ...config });
  }
  const ctrl = ctrlRef.current;

  // Update context dependencies if controller supports it
  useEffect(() => {
    ctrl.setContext?.({ user, location });
  }, [user, location, ctrl]);

  // Actions — clean, top-level like in UserProvider
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



  return (
    <SessionContext.Provider
      value={{
        loading,
        requestSession,
        cancelSession,
        controller: ctrl, 
      }}
    >
      {children}
      <FreeSessionDialog />
    </SessionContext.Provider>
  );
}
