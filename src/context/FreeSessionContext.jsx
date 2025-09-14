// context/FreeSessionContext.jsx
import { createContext, useContext } from "react";

/**
 * Exposes { requestFreeSession: (opts) => { action, reason } }
 * The provider supplies the real implementation.
 */
export const FreeSessionCtx = createContext(null);

export function useFreeSession() {
  const ctx = useContext(FreeSessionCtx);
  if (!ctx) {
    throw new Error("useFreeSession must be used within <FreeSessionProvider>");
  }
  return ctx;
}
