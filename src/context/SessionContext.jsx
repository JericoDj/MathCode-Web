import { createContext, useContext } from "react";

// This context will directly expose controller functions like request(), cancel(), etc.
export const SessionContext = createContext(null);

