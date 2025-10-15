// context/SessionProvider.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import SessionController from "../controllers/SessionController.jsx";
import FreeSessionDialog from "../components/FreeSession/FreeSessionDialog.jsx";
import SessionsDialog from "../components/SessionDialog/SessionDialog.jsx";
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

  // --- Dialog State ---
  const [dialogState, setDialogState] = useState({
    open: false,
    
  });

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

  // --- Helpers for Dialog ---
  const openDialog = (sessionDataArray = []) => {
    if (!Array.isArray(sessionDataArray)) {
      console.warn("openDialog expects an array of session objects.");
      return;
    }

    const validSessions = sessionDataArray.map((s, i) => ({
      _id: s._id || `temp_id_${i}`,
      status: s.status || "unknown",
      requestedBy: s.requestedBy || "Unknown",
      program: s.program || "N/A",
      service: s.service || "N/A",
      mode: s.mode || "N/A",
      tutor: s.tutor || "N/A",
      notes: s.notes || "",
      dateRequested: s.dateRequested || new Date().toISOString(),
      createdAt: s.createdAt || new Date().toISOString(),
      updatedAt: s.updatedAt || new Date().toISOString(),
    }));

    setDialogState({ open: true, sessions: validSessions });
  };

  const closeDialog = () =>
    setDialogState((prev) => ({ ...prev, open: false }));

  // --- 🧩 New: Manual Setter Function ---
  const setSessions = (newSessions = []) => {
    if (!Array.isArray(newSessions)) {
      console.warn("setSessions expects an array of session objects.");
      return;
    }
    setDialogState((prev) => ({ ...prev, sessions: newSessions }));
  };


  const fetchAllSessions = async () => {
  setLoading(true);
  try {
    const sessions = await ctrl.getAllSessions();

    setAllSessions(sessions);
    setSessions(sessions); // optional: update dialog sessions too
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
        openDialog,
        closeDialog,
        setSessions,
        fetchAllSessions,
        allSessions,
        sessions: dialogState.sessions,
        dialogOpen: dialogState.open,
      }}
    >
      {children}

      {/* Global Dialogs */}
      <FreeSessionDialog />
      <SessionsDialog
        open={dialogState.open}
        onClose={closeDialog}
        
      />
    </SessionContext.Provider>
  );
}
