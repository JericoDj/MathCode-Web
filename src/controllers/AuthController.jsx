export default class AuthController {
  constructor() {
    // place to inject dependencies later (analytics, endpoints, etc.)
    
  // const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
    
    // this.baseUrl = "https://mathcode-backend.onrender.com/api/users";
    // this.baseUrl = "http://localhost:4000/api/users";
        this.baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  }

  async getCurrentUser() {
   

  try {
     const savedAuth = localStorage.getItem('token');


  
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(savedAuth)}`,
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
        console.log(data);
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

      const userData = JSON.stringify(loginData.user);
      console.log(userData);

      const token = JSON.stringify(loginData.token);
      console.log(token);

      // 2️⃣ Save login data to localStorage
      localStorage.setItem("auth", userData);
      localStorage.setItem("token", token)
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
    localStorage.removeItem("token");

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
