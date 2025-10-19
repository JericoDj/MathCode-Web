// controllers/FreePackageSubmitController.jsx
import FreePackageController from "./PackageController.jsx"; // reuse userUsed/markUserUsed + tracking if you like

export default class FreePackageSubmitController {
  constructor({ analytics = null } = {}) {
    this.analytics = analytics;
    this.base = new FreePackageController({ analytics }); // reuse helpers
  }

  _track(event, payload) {
    try {
      if (this.analytics?.track) this.analytics.track(event, payload);
      if (typeof window !== "undefined") {
        if (window.gtag) window.gtag("event", event, payload);
        if (window.fbq) window.fbq("trackCustom", event, payload);
        if (window.mixpanel) window.mixpanel.track(event, payload);
      }
    } catch {}
  }

  /**
   * Submit the free session form.
   * Decides next step:
   * - Guest: stash form, send to /register
   * - Logged-in + already used: open upsell dialog
   * - Logged-in + eligible: (stub) send to server, mark used, navigate to scheduling/thank-you
   */
  async submit({ user, form, location }) {
    const payload = {
      ...form,
      ts: Date.now(),
      path: location?.pathname || (typeof window !== "undefined" ? window.location.pathname : ""),
      userId: user?.id || user?._id || null,
    };
    this._track("free_package_submit_attempt", payload);

    // 1) No user -> stash + navigate to register
    if (!user) {
      try {
        localStorage.setItem("mc:pending_free_request", JSON.stringify(payload));
      } catch {}
      this._track("free_package_submit_guest_redirect", payload);
      return { action: "redirect_register", url: `/register?intent=free_package&from=${encodeURIComponent(payload.path)}` };
    }

    // 2) Logged-in but already used -> open upsell
    if (this.base.userUsed(user)) {
      try {
        window.dispatchEvent(new CustomEvent("mc:open-upsell-dialog", { detail: payload }));
      } catch {}
      this._track("free_package_submit_used_upsell", payload);
      return { action: "open_upsell" };
    }

    // 3) Logged-in & eligible -> (stub) send to server, mark used, go scheduling
    try {
      // TODO: replace with your API call
      // await fetch('/api/free-session', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });

      this.base.markUserUsed(user);
      this._track("free_package_submit_success", payload);

      const params = new URLSearchParams({
        plan: "free",
        focus: form.concerns.join(","),
        age: form.age,
        notes: form.notes || "",
        timePref: form.timePref || "",
        from: payload.path,
      }).toString();
      return { action: "goto_packages", url: `/packages?${params}` };
    } catch (err) {
      console.warn("Free package submit failed:", err);
      this._track("free_package_submit_error", { ...payload, error: String(err) });
      return { action: "error", error: err };
    }
  }
}
