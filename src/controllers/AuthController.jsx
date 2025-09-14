// controllers/AuthController.jsx
export default class AuthController {
  constructor() {
    // place to inject dependencies later (analytics, endpoints, etc.)
  }

  async login({ email, password }) {
    // If your existing UserController exposes login(), use it here.
    // Fallback to a common REST path if not.
    try {
      if (window?.UserControllerInstance?.login) {
        return await window.UserControllerInstance.login({ email, password });
      }

      // Fallback REST example; change to your API routes as needed.
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Unable to sign in');
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  }

  async register({ name, email, password, childAge }) {
    try {
      if (window?.UserControllerInstance?.register) {
        return await window.UserControllerInstance.register({ name, email, password, childAge });
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, childAge })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Unable to sign up');
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  }

  async logout() {
    try {
      if (window?.UserControllerInstance?.logout) {
        return await window.UserControllerInstance.logout();
      }
      const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Logout failed');
      return true;
    } catch (err) {
      console.warn('Logout error:', err);
      return false;
    }
  }
}
