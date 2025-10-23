// controllers/PackageController.jsx
const SPAM_WINDOW_DAYS = 30;

function daysFrom(ts) {
  return (Date.now() - ts) / (1000 * 60 * 60 * 24);
}

export default class PackageController {
  constructor({ analytics = null, baseUrl = "math-code-backend.vercel.app/api/request-packages" } = {}) {
    this.analytics = analytics;
    this.baseUrl = baseUrl;
  }

  /** Inject runtime context (user, location, etc.) */
  setContext({ user, location }) {
    this.user = user;
    this.location = location;
  }

  /** Analytics tracking helper */
  _track(event, payload) {
    try {
      if (this.analytics?.track) this.analytics.track(event, payload);

      if (typeof window !== "undefined") {
        if (window.gtag) window.gtag("event", event, payload);
        if (window.fbq) window.fbq("trackCustom", event, payload);
        if (window.mixpanel) window.mixpanel.track(event, payload);
      }
    } catch (err) {
      console.warn("Tracking failed:", err);
    }
  }

  /** Check if guest is throttled */
  _guestBlocked() {
    try {
      const data = JSON.parse(localStorage.getItem("mc:package_guest") || '{"count":0,"last":0}');
      return data.last ? daysFrom(data.last) < SPAM_WINDOW_DAYS : false;
    } catch {
      return false;
    }
  }

  /** Mark guest as having used a package recently */
  _markGuestThrottle() {
    try {
      const data = JSON.parse(localStorage.getItem("mc:package_guest") || '{"count":0,"last":0}');
      localStorage.setItem("mc:package_guest", JSON.stringify({ count: data.count + 1, last: Date.now() }));
    } catch {}
  }

  /** Check if user has already used package */
  userUsed(user) {
    const serverFlag =
      user?.entitlements?.PackageUsed ||
      user?.flags?.PackageUsed ||
      user?.trials?.PackageUsed;

    if (serverFlag === true) return true;

    const uid = user?.id || user?._id || user?.uid;
    if (!uid) return false;

    try {
      return localStorage.getItem(`mc:package_used:${uid}`) === "1";
    } catch {
      return false;
    }
  }

  /** Mark user as having used their package */
  markUserUsed(user) {
    const uid = user?.id || user?._id || user?.uid;
    if (!uid) return;
    try {
      localStorage.setItem(`mc:package_used:${uid}`, "1");
    } catch {}
  }

  /** Open the package dialog flow */
  async handlePackageClick({ user = null, source = "navbar", location = null, extras = {} } = {}) {
    const payload = {
      event: "package_click",
      source,
      path: location?.pathname || (typeof window !== "undefined" ? window.location.pathname : ""),
      ts: Date.now(),
      userId: user?.id || user?._id || null,
      ...extras,
    };

    this._track("package_click", payload);

    let action = "open_signup";
    let reason = null;

    if (!user) {
      if (this._guestBlocked()) {
        action = "open_signup_throttled";
        reason = "throttled";
      }
    } else if (this.userUsed(user)) {
      action = "open_upsell";
    } else {
      action = "open_form";
    }

    if (!user) this._markGuestThrottle();

    try {
      window.dispatchEvent(
        new CustomEvent("mc:open-package-dialog", {
          detail: { ...payload, action, reason },
        })
      );
    } catch (err) {
      console.warn("Dialog open event failed:", err);
    }

    return { action, reason };
  }

  /** Example: Submit a package request to backend */
  async submitPackage(formData) {
    try {
      const authDetails = localStorage.getItem("token");
      const token = JSON.parse(authDetails);
      console.log(token);

      const res = await fetch("http://localhost:4000/api/packages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      console.log(res);
      
      if (!res.ok) {
        console.log("res is not okay");
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to submit package request");
      }

        
      const data = await res.json();
       console.log("res is okay"); 
      console.log(data);
       console.log("res is okay"); 
 
      return data;
    } catch (err) {
      console.error("package submission failed:", err);
      throw err;
    }
  }

  /** Fetch all packages for the current user */
  async getAllPackages() {
    try {
      // Get token from localStorage - handle both string and object formats
      let token = localStorage.getItem("token");
      console.log("Raw token from localStorage:", token);

      // Handle case where token might be stored as a JSON string
      if (token) {
        try {
          // Try to parse if it's a JSON string
          const parsed = JSON.parse(token);
          token = typeof parsed === 'string' ? parsed : parsed.token || parsed.accessToken || token;
        } catch (e) {
          // If parsing fails, it's already a string token
          console.log("Token is already a string, using as-is");
        }
      }

      // Clean up token - remove any quotes if present
      if (token && typeof token === 'string') {
        token = token.replace(/^"(.*)"$/, '$1'); // Remove surrounding quotes if any
      }

      console.log("Processed token:", token);

      if (!token || token === 'null' || token === 'undefined') {
        throw new Error("No valid token found");
      }

      const res = await fetch(`http://localhost:4000/api/packages/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        if (res.status === 401) {
          // Token is invalid/expired - clear it
          localStorage.removeItem("token");
          throw new Error("Invalid or expired token. Please login again.");
        }
        
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || `Failed to fetch packages: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Packages data:", data);
      return data.items || data;
    } catch (err) {
      console.error("getAllPackages failed:", err);
      
      // If it's an auth error, you might want to redirect to login
      if (err.message.includes('token') || err.message.includes('401')) {
        // Optionally trigger a logout or redirect
        this.handleAuthError();
      }
      
      return [];
    }
  }

  /** Handle authentication errors */
  handleAuthError() {
    console.warn("Authentication error detected");
    
    // Clear invalid token
    localStorage.removeItem("token");
    
    // You can optionally redirect to login page
    // window.location.href = '/login';
    
    // Or dispatch an event that your app can listen to
    try {
      window.dispatchEvent(new CustomEvent('auth:token-expired'));
    } catch (e) {
      console.warn("Could not dispatch auth error event:", e);
    }
  }

  /** Example: Cancel a package */
  async cancelPackage(packageId) {
    try {
      const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

      const res = await fetch(`${this.baseUrl}/${packageId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to cancel package");
      }

      const result = await res.json();
      this._track("package_cancelled", { userId: this.user?.id || null });
      return result;
    } catch (err) {
      console.error(" package cancellation failed:", err);
      throw err;
    }
  }

  /** Open dialog manually (trigger event) */
  openDialog() {
    try {
      // window.dispatchEvent(new CustomEvent("mc:open-package-dialog"));
    } catch (err) {
      console.warn("Failed to open dialog:", err);
    }
  }
}