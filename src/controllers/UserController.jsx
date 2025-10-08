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
    const response = await fetch('https://mathcode-backend.onrender.com/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  }

  static async getCurrentUser() {
  // 1️⃣ Try to get user from localStorage
  const savedAuth = localStorage.getItem('auth');
  if (!savedAuth) return null; // ❌ early exit if nothing saved

  try {
    const { user, token } = JSON.parse(savedAuth);
    if (user) return user; // ✅ return local user immediately

    // If user is missing, we can optionally exit early
    if (!user) return null;
    
    // 2️⃣ Otherwise, fetch from backend if token exists
    if (!token) return null;

    const response = await fetch('https://mathcode-backend.onrender.com/api/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null; // fail silently
    return response.json();
  } catch (e) {
    console.warn('Failed to parse saved auth or fetch user:', e);
    return null;
  }
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
