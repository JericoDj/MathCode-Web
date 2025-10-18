// controllers/BookFreeAssessmentController.jsx
export default class BookFreeAssessmentController {
  constructor({ analytics = null } = {}) {
    this.analytics = analytics;
  }

  /**
   * Handles the "Book a Free Assessment" click.
   * - Checks if user is authenticated (localStorage: auth + token)
   * - Logs intent + analytics
   * - Redirects to /login if unauthenticated
   * - Returns event payload with redirect status
   */
  handleBookClick({ user = null, source = 'navbar', location = null, extras = {} } = {}) {
    // 1️⃣ Check for authentication
    let auth = null;
    let token = null;

    try {
      auth = JSON.parse(localStorage.getItem('auth'));
      token = auth?.token || null;
    } catch (_) {
      token = null;
    }

    // 2️⃣ Build event payload
    const payload = {
      event: 'book_free_assessment_click',
      source,
      path:
        location?.pathname ||
        (typeof window !== 'undefined' ? window.location.pathname : ''),
      ts: Date.now(),
      userId: user?.id || user?._id || auth?.user?.id || null,
      ...extras,
    };

    // 3️⃣ Save to localStorage (intent history)
    try {
      const key = 'mc:intents';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push(payload);
      localStorage.setItem(key, JSON.stringify(arr.slice(-50)));
    } catch (err) {
      console.warn('Intent storage failed:', err);
    }

    // 4️⃣ Fire analytics (optional / safe)
    try {
      if (typeof window !== 'undefined') {
        if (window.gtag) window.gtag('event', 'book_free_assessment_click', payload);
        if (window.fbq) window.fbq('trackCustom', 'BookFreeAssessmentClick', payload);
        if (window.mixpanel) window.mixpanel.track('Book Free Assessment Click', payload);
      }
    } catch (_) {
      /* no-op */
    }

    // 5️⃣ Redirect logic
    if (!token && typeof window !== 'undefined') {
      // User not logged in → go to login
      window.location.href = '/login';
      return { ...payload, redirected: true };
    }

    // Logged in → allow navigation
    return { ...payload, redirected: false };
  }
}
