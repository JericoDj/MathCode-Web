// controllers/PackageController.jsx
const SPAM_WINDOW_DAYS = 30;

function daysFrom(ts) {
  return (Date.now() - ts) / (1000 * 60 * 60 * 24);
}

export default class PackageController {
   constructor({ analytics = null, baseUrl =  import.meta.env.VITE_API_URL || "http://localhost:4000" } = {}) {
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

      const res = await fetch(`${this.baseUrl}/api/packages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });


      
      if (!res.ok) {
   
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to submit package request");
      }

        
      const data = await res.json();

      return data;
    } catch (err) {
      console.error("package submission failed:", err);
      throw err;
    }
  }

  /** Fetch all packages for the current user */
  async getAllPackages() {
  try {
    // 1. Get auth token
    let token = localStorage.getItem("token");
    if (!token) return [];

    try { token = JSON.parse(token); } catch {}

    // 2. Resolve userId directly from auth storage (not UI)
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const userId = auth?.user?.id || auth?.id;

    if (!userId) {
      console.warn("⚠ No userId available, skipping getAllPackages()");
      return [];
    }

    // 3. Request only user's packages
    const res = await fetch(`${this.baseUrl}/api/packages/mine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Session expired, please login again.");
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.message || "Failed to fetch user packages.");
    }

    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error("❌ getAllPackages() failed:", err);
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