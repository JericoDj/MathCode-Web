// controllers/BookAPackageController.jsx
export default class BookAPackageController {
  constructor({ analytics = null } = {}) {
    this.analytics = analytics; // optional DI if you have a wrapper
  }

  /**
   * Handle "Book a Package" click.
   * Runs side effects (analytics/localStorage) then lets the Link navigate.
   */
  bookPackageClick({ user = null, source = 'navbar', location = null, extras = {} } = {}) {
    const payload = {
      event: 'book_package_click',
      source,
      path: location?.pathname || (typeof window !== 'undefined' ? window.location.pathname : ''),
      ts: Date.now(),
      userId: user?.id || user?._id || null,
      ...extras,
    };

    // Persist a short intent hiswtory
    try {
      const key = 'mc:intents';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.push(payload);
      localStorage.setItem(key, JSON.stringify(arr.slice(-50)));
    } catch (err) {
      console.warn('Intent storage failed:', err);
    }

    // Fire any available analytics (all optional / safe)
    try {
      if (typeof window !== 'undefined') {
        if (window.gtag) window.gtag('event', 'book_package_click', payload);
        if (window.fbq) window.fbq('trackCustom', 'BookPackageClick', payload);
        if (window.mixpanel) window.mixpanel.track('Book Package Click', payload);
      }
    } catch (_) {
      /* no-op */
    }

    // If you later need to gate navigation, return something the caller can check.
    return payload;
  }
}
