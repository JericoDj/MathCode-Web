import { createContext, useContext } from "react";

// This context will directly expose controller functions like request(), cancel(), etc.
export const PackageContext = createContext(null);

// Optional: Create a custom hook for easier usage
export const usePackage = () => {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error("usePackage must be used within a PackageProvider");
  }
  return context;
};