import { createContext, useContext } from "react";

export const SessionsContext = createContext(null);

export const useSessions = () => useContext(SessionsContext);
