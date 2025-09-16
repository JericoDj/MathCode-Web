// controllers/AuthController.jsx
export default class AuthController {
  constructor() {
    // place to inject dependencies later (analytics, endpoints, etc.)
  }

  async login({ email, password }) {
    try {
      if (window?.UserControllerInstance?.login) {
        const data = await window.UserControllerInstance.login({ email, password });
        localStorage.setItem("auth", JSON.stringify(data));
        return data;
      }

      const res = await fetch("https://mathcode-backend.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Unable to sign in");
      }

      const data = await res.json();

      // ✅ Save to localStorage
      localStorage.setItem("auth", JSON.stringify(data));

      return data;
    } catch (err) {
      throw err;
    }
  }

  async register({ firstName, lastName, phone, email, password, childAge }) {
    try {
      if (window?.UserControllerInstance?.register) {
        return await window.UserControllerInstance.register({
          firstName,
          lastName,
          phone,
          email,
          password,
          childAge,
        });
      }

      const res = await fetch(
        'https://mathcode-backend.onrender.com/api/users/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            firstName,
            lastName,
            phone,
            email,
            password,
            childAge,
          }),
        }
      );

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

      const res = await fetch('https://mathcode-backend.onrender.com/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Logout failed');
      return true;
    } catch (err) {
      console.warn('Logout error:', err);
      return false;
    }
  }
}
