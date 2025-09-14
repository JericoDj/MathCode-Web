export default class UserController {
  // Keep your existing methods (unchanged signatures)
  static async login(username, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  }

  static async register(username, email, password) {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  }

  static async getCurrentUser() {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch user data');
    return response.json();
  }

  static async logout() {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  }

  // ✅ New: request reset link
  static async requestPasswordReset({ email }) {
    const res = await fetch('/api/password/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const msg = await safeMessage(res, 'Could not send reset email');
      throw new Error(msg);
    }
    return res.json();
  }

  // ✅ New: complete reset with token
  static async resetPassword({ token, password }) {
    const res = await fetch('/api/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    if (!res.ok) {
      const msg = await safeMessage(res, 'Reset failed');
      throw new Error(msg);
    }
    return res.json();
  }
}

// helper – tries to read server error, falls back to default
async function safeMessage(res, fallback) {
  try {
    const data = await res.json();
    return data?.message || fallback;
  } catch {
    return fallback;
  }
}
