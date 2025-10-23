import React, { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from '../../context/UserContext.jsx';
import "./FreeAssessmentDialog.css";

// const localDev = "http://localhost:4000";

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";


export default function FreeAssessmentDialog({ open, onClose }) {
  const { openAuthModal } = useContext(UserContext); // ✅ Get openAuthModal from context
  const firstRef = useRef(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childSelection, setChildSelection] = useState("existing"); // "existing" | "new"
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [timezone, setTimezone] = useState("");
  const [newChild, setNewChild] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: "",
    school: "",
    email: "",
    phone: "",
    age: "",
  });
  const [packageData, setPackageData] = useState({
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false); // ✅ New state for auth prompt

  // 🕓 Generate half-hour time options
  function generateTimeOptions() {
    const times = [];
    const start = 8; // 8 AM
    const end = 20; // 8 PM

    for (let hour = start; hour < end; hour++) {
      for (let min of [0, 30]) {
        const h = hour % 12 === 0 ? 12 : hour % 12;
        const period = hour < 12 ? "AM" : "PM";
        const formatted = `${h.toString().padStart(2, "0")}:${min
          .toString()
          .padStart(2, "0")} ${period}`;
        times.push(formatted);
      }
    }
    return times;
  }

  // ✅ Fetch user info from API - UPDATED to use AuthModal
  useEffect(() => {
    if (!open) return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.log("No token found, showing auth prompt");
      setShowAuthPrompt(true);
      setLoading(false);
      return;
    }

    setToken(storedToken);

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${JSON.parse(storedToken)}` },
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        
        const data = await res.json();
        setUser(data);

        // Default to "new student" if none found
        if (!data.guardianOf || data.guardianOf.length === 0) {
          setChildSelection("new");
        }

        // 🌎 Detect timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(tz);

        setLoading(false);
        setTimeout(() => firstRef.current?.focus(), 100);
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoading(false);
        setShowAuthPrompt(true); // Show auth prompt on error
      }
    };

    fetchUser();
  }, [open]);

  // ✅ Handle login button click
  const handleLoginClick = () => {
    onClose(); // Close assessment dialog
    openAuthModal('login'); // Open auth modal
  };

  // ✅ Handle signup button click
  const handleSignupClick = () => {
    onClose(); // Close assessment dialog
    openAuthModal('register'); // Open auth modal in register mode
  };

  if (!open) return null;

  // ✅ Show authentication prompt if no user is logged in
  if (showAuthPrompt) {
    return (
      <div
        className="fad-overlay"
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <section className="fad-dialog" role="dialog" aria-modal="true">
          <header className="fad-header">
            <h2>🎯 Book a Free Assessment</h2>
            <button className="btn-close" onClick={onClose}>✕</button>
          </header>

          <div className="fad-auth-prompt">
            <div className="auth-prompt-icon">🔐</div>
            <h3>Authentication Required</h3>
            <p>Please log in or create an account to book a free assessment session.</p>
            
            <div className="auth-prompt-buttons">
              <button 
                className="btn-primary" 
                onClick={handleLoginClick}
              >
                Login
              </button>
              <button 
                className="btn-outline" 
                onClick={handleSignupClick}
              >
                Create Account
              </button>
            </div>
            
            <p className="auth-prompt-note">
              You'll be able to book your assessment right after signing in!
            </p>
          </div>
        </section>
      </div>
    );
  }

  const handleChildChange = (e) => {
    const { name, value } = e.target;
    setNewChild((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    setPackageData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const childToSubmit = childSelection === "existing"
      ? {
          _id: user.guardianOf[selectedChildIndex]._id,
          firstName: user.guardianOf[selectedChildIndex].firstName,
          lastName: user.guardianOf[selectedChildIndex].lastName,
          gradeLevel: user.guardianOf[selectedChildIndex].gradeLevel,
          school: user.guardianOf[selectedChildIndex].school,
          email: user.guardianOf[selectedChildIndex].email,
          phone: user.guardianOf[selectedChildIndex].phone,
          age: user.guardianOf[selectedChildIndex].age,
        }
      : newChild;

    try {
      const res = await fetch(`${API_BASE_URL}/api/packages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify({
          requestedBy: user.id,
          child: childToSubmit,
          preferredDate: packageData.preferredDate,
          preferredTime: packageData.preferredTime,
          timezone: timezone, 
          status: "requested_assessment",
          notes: packageData.notes,
        }),
      });

      console.log(res);

      if (!res.ok) throw new Error("Failed to submit package request.");

      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fad-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="fad-dialog" role="dialog" aria-modal="true">
        <header className="fad-header">
          <h2>🎯 Book a Free Assessment</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </header>

        {loading ? (
          <p>Loading user info...</p>
        ) : (
          <form id="assessmentForm" onSubmit={handleSubmit} className="fad-form">
            {/* Existing Students */}
            {user?.guardianOf?.length > 0 && (
              <fieldset className="fad-fieldset">
                <legend>Select a Student</legend>
                <div className="fad-radio-group">
                  {user.guardianOf.map((child, idx) => (
                    <label key={child._id} className="radio">
                      <input
                        type="radio"
                        name="childSelection"
                        checked={
                          childSelection === "existing" &&
                          selectedChildIndex === idx
                        }
                        onChange={() => {
                          setChildSelection("existing");
                          setSelectedChildIndex(idx);
                        }}
                      />
                      {child.firstName} {child.lastName} ({child.gradeLevel})
                    </label>
                  ))}
                  <label className="radio">
                    <input
                      type="radio"
                      name="childSelection"
                      checked={childSelection === "new"}
                      onChange={() => setChildSelection("new")}
                    />
                    ➕ New Student
                  </label>
                </div>
              </fieldset>
            )}

            {/* New Student Info */}
            {childSelection === "new" && (
              <fieldset className="fad-fieldset">
                <legend>New Student Information</legend>

                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={newChild.firstName}
                      onChange={handleChildChange}
                      ref={firstRef}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={newChild.lastName}
                      onChange={handleChildChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Grade Level *</label>
                  <input
                    type="text"
                    name="gradeLevel"
                    value={newChild.gradeLevel}
                    onChange={handleChildChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Emergency Contact Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={newChild.phone}
                    onChange={handleChildChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newChild.email}
                    onChange={handleChildChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Age *</label>
                  <input
                    type="text"
                    name="age"
                    value={newChild.age}
                    onChange={handleChildChange}
                    placeholder="e.g., 7"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>School *</label>
                  <input
                    type="text"
                    name="school"
                    value={newChild.school}
                    onChange={handleChildChange}
                    required
                  />
                </div>
              </fieldset>
            )}

            {/* Package Info */}
            <fieldset className="fad-fieldset">
              <legend>Assessment Date</legend>
              <div className="form-group">
                <label>Preferred Date *</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={packageData.preferredDate}
                  onChange={handlePackageChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Preferred Time *</label>
                <select
                  name="preferredTime"
                  value={packageData.preferredTime}
                  onChange={handlePackageChange}
                  required
                >
                  <option value="">Select a time</option>
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🌍 Display detected timezone */}
              {timezone && (
                <p className="timezone-display">
                  Your local timezone: <strong>{timezone}</strong>
                </p>
              )}

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  rows={3}
                  name="notes"
                  value={packageData.notes}
                  onChange={handlePackageChange}
                  placeholder="Any learning goals, concerns, or topics to focus on..."
                />
              </div>
            </fieldset>
          </form>
        )}
        <div className="fad-footer">
          <div className="fad-actions">
            <button
              type="submit"
              form="assessmentForm"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? "Booking..." : "Book Assessment"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}