// controllers/SessionController.jsx
const SPAM_WINDOW_DAYS = 30;

function daysFrom(ts) {
  return (Date.now() - ts) / (1000 * 60 * 60 * 24);
}

export default class SessionController {
  constructor({ analytics = null, baseUrl = "https://mathcode-backend.onrender.com/api/request-sessions" } = {}) {
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
      const data = JSON.parse(localStorage.getItem("mc:session_guest") || '{"count":0,"last":0}');
      return data.last ? daysFrom(data.last) < SPAM_WINDOW_DAYS : false;
    } catch {
      return false;
    }
  }

  /** Mark guest as having used a session recently */
  _markGuestThrottle() {
    try {
      const data = JSON.parse(localStorage.getItem("mc:session_guest") || '{"count":0,"last":0}');
      localStorage.setItem("mc:session_guest", JSON.stringify({ count: data.count + 1, last: Date.now() }));
    } catch {}
  }

  /** Check if user has already used session */
  userUsed(user) {
    const serverFlag =
      user?.entitlements?.SessionUsed ||
      user?.flags?.SessionUsed ||
      user?.trials?.SessionUsed;

    if (serverFlag === true) return true;

    const uid = user?.id || user?._id || user?.uid;
    if (!uid) return false;

    try {
      return localStorage.getItem(`mc:session_used:${uid}`) === "1";
    } catch {
      return false;
    }
  }

  /** Mark user as having used their session */
  markUserUsed(user) {
    const uid = user?.id || user?._id || user?.uid;
    if (!uid) return;
    try {
      localStorage.setItem(`mc:session_used:${uid}`, "1");
    } catch {}
  }

  /** Open the session dialog flow */
  async handleSessionClick({ user = null, source = "navbar", location = null, extras = {} } = {}) {
    const payload = {
      event: "session_click",
      source,
      path: location?.pathname || (typeof window !== "undefined" ? window.location.pathname : ""),
      ts: Date.now(),
      userId: user?.id || user?._id || null,
      ...extras,
    };

    this._track("session_click", payload);

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
        new CustomEvent("mc:open-session-dialog", {
          detail: { ...payload, action, reason },
        })
      );
    } catch (err) {
      console.warn("Dialog open event failed:", err);
    }

    return { action, reason };
  }

  /** Example: Submit a session request to backend */
  async submitSession(formData) {
    try {
      const authDetails = localStorage.getItem("token");
      const token = JSON.parse(authDetails);
      console.log(token);

      const res = await fetch("http://localhost:4000/api/sessions/", {
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
        throw new Error(data?.message || "Failed to submit session request");
      }

        
      const data = await res.json();
       console.log("res is okay"); 
      console.log(data);
       console.log("res is okay"); 
 
      return data;
    } catch (err) {
      console.error("session submission failed:", err);
      throw err;
    }
  }

  /** Fetch all sessions for the current user */
async getAllSessions() {
  try {
    const token = localStorage.getItem("token");
    console.log(token);


    if (!token) throw new Error("No token found");

    const res = await fetch(`http://localhost:4000/api/sessions/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.message || "Failed to fetch sessions");
    }
    
    const data = await res.json();
    console.log(data.items);
    return data.items;
  } catch (err) {
    console.error("getAllSessions failed:", err);
    return [];
  }
}


  /** Example: Cancel a session */
  async cancelSession(sessionId) {
    try {
      const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

      const res = await fetch(`${this.baseUrl}/${sessionId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to cancel session");
      }

      const result = await res.json();
      this._track("session_cancelled", { userId: this.user?.id || null });
      return result;
    } catch (err) {
      console.error(" session cancellation failed:", err);
      throw err;
    }
  }

  /** Open dialog manually (trigger event) */
  openDialog() {
    try {
      // window.dispatchEvent(new CustomEvent("mc:open-session-dialog"));
    } catch (err) {
      console.warn("Failed to open dialog:", err);
    }
  }
}



