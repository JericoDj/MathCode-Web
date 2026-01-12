export default class AuthController {
  constructor() {
    const api = import.meta.env.VITE_API_URL || "http://localhost:4000";
    this.API_BASE = api;                           // ex: https://backend.com
    this.baseUrl = `${api}/api/users`;             // ex: https://backend.com/api/users
  }

  async getCurrentUser() {
    try {
      const savedAuth = localStorage.getItem("token");
      if (!savedAuth) return null;

      const response = await fetch(`${this.baseUrl}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(savedAuth)}`,
        },
      });

      if (!response.ok) return null;
      return response.json();
    } catch (e) {
      console.warn("Failed to fetch user:", e);
      return null;
    }
  }

  async login({ email, password }) {
    try {
      if (window?.UserControllerInstance?.login) {
        const data = await window.UserControllerInstance.login({ email, password });
        localStorage.setItem("auth", JSON.stringify(data));
        return data;
      }

      const res = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Unable to sign in");
      }

      const loginData = await res.json();

      localStorage.setItem("auth", JSON.stringify(loginData.user));
      localStorage.setItem("token", JSON.stringify(loginData.token));

      const profileRes = await fetch(`${this.baseUrl}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
        credentials: "include",
      });

      if (!profileRes.ok) throw new Error("Failed to fetch user profile");

      return profileRes.json();

    } catch (err) {
      throw err;
    }
  }

  async register({ firstName, lastName, phone, email, password, childAge }) {
    try {
      if (window?.UserControllerInstance?.register) {
        return await window.UserControllerInstance.register({
          firstName, lastName, phone, email, password, childAge
        });
      }

      const res = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, phone, email, password, childAge }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Unable to sign up");
      }

      const data = await res.json();

      const profileRes = await fetch(`${this.baseUrl}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        credentials: "include",
      });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user profile after registration");
      }

      const user = await profileRes.json();

      localStorage.setItem("auth", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(data.token));

      return user;

    } catch (err) {
      throw err;
    }
  }

  async logout() {
    try {
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      return true;
    } catch (err) {
      console.warn("Logout error:", err);
      return false;
    }
  }
}
