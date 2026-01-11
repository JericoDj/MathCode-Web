export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const getToken = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  if (!token) throw new Error("Authentication required");
  return token;
};

// GET ALL SESSIONS
export const fetchAllSessions = async () => {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/sessions`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
};

// GET SESSIONS BY USER
export const fetchSessionsByUser = async (userId) => {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/sessions/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();

  console.log("Fetched sessions for user:", data);
  if (!res.ok) throw new Error("Failed to fetch user sessions");
  return data;
};

// CREATE SESSION
export const createSession = async (payload) => {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
};

// UPDATE SESSION DETAILS
export const updateSession = async (id, payload) => {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/sessions/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Failed to update session");
  return res.json();
};

// UPDATE SESSION STATUS
export const updateSessionStatus = async (id, status) => {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/sessions/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) throw new Error("Failed to update session status");
  return res.json();
};
