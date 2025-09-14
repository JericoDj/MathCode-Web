// controllers/FreeSessionController.jsx
const SPAM_WINDOW_DAYS = 30;

function daysFrom(ts) {
  return (Date.now() - ts) / (1000 * 60 * 60 * 24);
}

export default class FreeSessionController {
  constructor({ analytics = null } = {}) {
    this.analytics = analytics;
  }

  _track(event, payload) {
    try {
      if (this.analytics?.track) this.analytics.track(event, payload);
      if (typeof window !== 'undefined') {
        if (window.gtag) window.gtag('event', event, payload);
        if (window.fbq) window.fbq('trackCustom', event, payload);
        if (window.mixpanel) window.mixpanel.track(event, payload);
      }
    } catch {}
  }

  _guestBlocked() {
    try {
      const data = JSON.parse(localStorage.getItem('mc:free_session_guest') || '{"count":0,"last":0}');
      if (!data.last) return false;
      return daysFrom(data.last) < SPAM_WINDOW_DAYS;
    } catch { return false; }
  }

  _markGuestThrottle() {
    try {
      const data = JSON.parse(localStorage.getItem('mc:free_session_guest') || '{"count":0,"last":0}');
      localStorage.setItem('mc:free_session_guest', JSON.stringify({ count: data.count + 1, last: Date.now() }));
    } catch {}
  }

  userUsed(user) {
    const serverFlag = user?.entitlements?.freeSessionUsed || user?.flags?.freeSessionUsed || user?.trials?.freeSessionUsed;
    if (serverFlag === true) return true;
    const uid = user?.id || user?._id || user?.uid;
    if (!uid) return false;
    try { return localStorage.getItem(`mc:free_session_used:${uid}`) === '1'; } catch { return false; }
  }

  markUserUsed(user) {
    const uid = user?.id || user?._id || user?.uid;
    if (!uid) return;
    try { localStorage.setItem(`mc:free_session_used:${uid}`, '1'); } catch {}
  }

  handleFreeSessionClick({ user = null, source = 'navbar', location = null, extras = {} } = {}) {
    const payload = {
      event: 'free_session_click',
      source,
      path: location?.pathname || (typeof window !== 'undefined' ? window.location.pathname : ''),
      ts: Date.now(),
      userId: user?.id || user?._id || null,
      ...extras,
    };
    this._track('free_session_click', payload);

    let action = 'open_signup';
    let reason = null;

    if (!user) {
      if (this._guestBlocked()) {
        action = 'open_signup_throttled';
        reason = 'throttled';
      }
    } else if (this.userUsed(user)) {
      action = 'open_upsell';
    } else {
      action = 'open_form';
    }

    if (!user) this._markGuestThrottle();

    try {
      window.dispatchEvent(new CustomEvent('mc:open-free-session-dialog', { detail: { ...payload, action, reason } }));
    } catch (err) {
      console.warn('Dialog open event failed:', err);
    }

    return { action, reason };
  }
}
