// context/PackageProvider.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import PackageController from "../controllers/PackageController.jsx";

import { PackageContext } from "./PackageContext.jsx";

export function PackageProvider({ children, analytics = null, config = {} }) {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [allPackages, setAllPackages] = useState([]);

  // Initialize controller once
  const ctrlRef = useRef(null);
  if (!ctrlRef.current) {
    ctrlRef.current = new PackageController({ analytics, ...config });
  }
  const ctrl = ctrlRef.current;

  // Update controller context when user/location changes
  useEffect(() => {
    ctrl.setContext?.({ user, location });
  }, [user, location, ctrl]);

  // --- Core Actions ---
  const requestPackage = async (opts = {}) => {
    setLoading(true);
    try {
      const res = await ctrl.submitPackage({ user, location, ...opts });
      return res;
    } finally {
      setLoading(false);
    }
  };

  const cancelPackage = async (packageId) => {
    setLoading(true);
    try {
      const res = await ctrl.cancelPackage?.(packageId);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPackages = async () => {
    setLoading(true);
    try {
      const packages = await ctrl.getAllPackages();
      setAllPackages(packages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PackageContext.Provider
      value={{
        loading,
        controller: ctrl,
        requestPackage,
        cancelPackage,
        fetchAllPackages,
        allPackages,
        packages: allPackages, // Provide packages data
      }}
    >
      {children}

      {/* Only keep FreePackageDialog if needed, remove PackagesDialog */}

    </PackageContext.Provider>
  );
}