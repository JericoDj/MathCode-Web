export default class AuthController {
  constructor() {
    // place to inject dependencies later (analytics, endpoints, etc.)
    this.baseUrl = "https://mathcode-backend.onrender.com/api/users";
  }

  async getCurrentUser() {
    const savedAuth = localStorage.getItem('auth');
  if (!savedAuth) return null; 
  try {
    const { user, token } = JSON.parse(savedAuth);
    if (user) return user; 

    // If user is missing, we can optionally exit early
    if (!user) return null;
    
    // 2️⃣ Otherwise, fetch from backend if token exists
    if (!token) return null;

    const response = await fetch(`${this.baseUrl}/me`, {
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
  async login({ email, password }) {
    try {
      // Optional window override
      if (window?.UserControllerInstance?.login) {
        const data = await window.UserControllerInstance.login({ email, password });
        localStorage.setItem("auth", JSON.stringify(data));
        return data;
      }

      // 1️⃣ Log in to get token
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

      // 2️⃣ Save login data to localStorage
      localStorage.setItem("auth", JSON.stringify(loginData));

      // 3️⃣ Fetch full user profile
      const profileRes = await fetch(`${this.baseUrl}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
        credentials: "include",
      });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user profile after login");
      }

      const user = await profileRes.json();

      // ✅ Return full user object
      return user;

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

      const res = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, phone, email, password, childAge }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Unable to sign up');
      }

      const data = await res.json();

      // Optionally fetch user profile after registration
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
      localStorage.setItem("auth", JSON.stringify({ ...data, user }));

      return user;

    } catch (err) {
      throw err;
    }
  }

  async logout() {
  try {
   
    localStorage.removeItem("auth");

    //  setUser(null);

    // same below 

    // // If your app keeps a UserControllerInstance, clear it too
    // if (window?.UserControllerInstance) {
    //   window.UserControllerInstance = null;
    // }

    // Return success (no backend call needed)
    return true;
  } catch (err) {
    console.warn("Logout error:", err);
    return false;
  }
}
}
