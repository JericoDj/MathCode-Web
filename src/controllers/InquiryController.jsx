// controllers/inquiryController.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function submitInquiryController(formData) {
  const data = { ...formData };

  // normalize checkbox field
  if (data.updates !== undefined) {
    data.updates = data.updates === "on" || data.updates === true;
  }

  try {
    const res = await fetch(`${API_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to submit inquiry");
    }

    const result = await res.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("InquiryController Error:", error);
    throw error;
  }
}
