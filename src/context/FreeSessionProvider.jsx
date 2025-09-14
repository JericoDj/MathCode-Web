// providers/FreeSessionProvider.jsx
import { useCallback, useMemo, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { FreeSessionCtx } from "../context/FreeSessionContext.jsx";
import { UserContext } from "../context/UserContext.jsx";
import FreeSessionController from "../controllers/FreeSessionController.jsx";
import FreeSessionDialog from "../components/FreeSession/FreeSessionDialog.jsx";

/**
 * Wrap your app (inside <Router/>) to expose requestFreeSession() everywhere.
 * Optional props: { analytics, config }
 */
export function FreeSessionProvider({ children, analytics = null, config = {} }) {
  const { user } = useContext(UserContext);
  const location = useLocation();

  // Single controller instance for the whole app
  const ctrlRef = useRef(null);
  if (!ctrlRef.current) {
    ctrlRef.current = new FreeSessionController({ analytics, ...config });
  }

  const requestFreeSession = useCallback(
    ({ source = "unknown", extras = {} } = {}) => {
      return ctrlRef.current.handleFreeSessionClick({ user, location, source, extras });
    },
    [user, location]
  );

  const value = useMemo(() => ({ requestFreeSession }), [requestFreeSession]);

  return (
    <FreeSessionCtx.Provider value={value}>
      {children}
      {/* Mount the single dialog once, globally */}
      <FreeSessionDialog />
    </FreeSessionCtx.Provider>
  );
}
