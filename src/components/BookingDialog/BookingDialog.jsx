import React, { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import "./BookingDialog.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function BookingDialog({ onClose, onSuccess }) {
  const { openAuthModal } = useContext(UserContext);
  const firstRef = useRef(null);

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [timezone, setTimezone] = useState("");

  // Child selection
  const [childSelection, setChildSelection] = useState("existing");
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

    const storedToken = localStorage.getItem("token");

  const [newChild, setNewChild] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: "",
    school: "",
    email: "",
    phone: "",
    age: "",
  });

  // Booking form fields
  const [formData, setFormData] = useState({
    subject: "",
    grade: "",
    preferredDate: "",
    preferredTime: "",
    duration: "60",
    packageType: "1-1",
    sessionsPerWeek: "2",
    notes: "",
  });

  const loadUser = async (storedToken = token) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${JSON.parse(storedToken)}` },
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const data = await res.json();
    setUser(data);

    if (!data.guardianOf || data.guardianOf.length === 0) {
      setChildSelection("new");
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);

    setTimeout(() => firstRef.current?.focus(), 100);

    setLoading(false);
  } catch (err) {
    console.error(err);
    setShowAuthPrompt(true);
    setLoading(false);
  }
};


  // AUTO OPEN — load user & token right away
 useEffect(() => {


  if (!storedToken) {
    setShowAuthPrompt(true);
    setLoading(false);
    return;
  }

  setToken(storedToken);
  loadUser(storedToken);

}, []);

  const handleLoginClick = () => {
    onClose();
    openAuthModal("login");
  };

  const handleSignupClick = () => {
    onClose();
    openAuthModal("register");
  };

  const handleNewChildChange = (e) => {
    const { name, value } = e.target;
    setNewChild((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour < 20; hour++) {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    console.log("Submitting booking with data:", { formData, childSelection, newChild, selectedChildIndex });

    const childToSubmit =
      childSelection === "existing"
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
          
          
         
          
          duration: formData.duration,
          packageType: formData.packageType,
          sessionsPerWeek: formData.sessionsPerWeek,
          
          requestedBy: user.id,
          child: childToSubmit,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          timezone,
          status: "requested_assessment",
          notes: formData.notes,

          
        }),

       
      });


      if (!res.ok) throw new Error("Failed to submit package request");

      if (typeof onSuccess === "function") onSuccess();

      loadUser(storedToken);

      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // AUTH PROMPT IF NOT LOGGED IN
  if (showAuthPrompt) {
    return (
      <div className="dialog-backdrop">
        <div className="dialog-box booking-dialog">
          <div className="dialog-header">
            <h2>📦 Book a Package</h2>
            <button className="btn-close" onClick={onClose}>✕</button>
          </div>

          <div className="booking-auth-prompt">
            <div className="auth-icon">🔐</div>
            <h3>Login Required</h3>
            <p>Please log in or create an account to continue.</p>

            <div className="auth-buttons">
              <button className="btn-primary" onClick={handleLoginClick}>
                Login
              </button>
              <button className="btn-outline" onClick={handleSignupClick}>
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOADER
  if (loading) {
    return (
      <div className="dialog-backdrop">
        <div className="dialog-box booking-dialog">
          <div className="loading-block">
            <div className="spinner" />
            <p>Loading your account…</p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN FORM UI
  return (
    <div className="dialog-backdrop">
      <div className="dialog-box booking-dialog">
        <div className="dialog-header">
          <h2>📦 Book New Package</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form id="bookingForm" onSubmit={handleSubmit} className="booking-form">

          {/* Select existing vs new student */}
          {user?.guardianOf?.length > 0 && (
            <fieldset className="booking-fieldset">
              <legend>Select a Student</legend>
              {user.guardianOf.map((child, idx) => (
                <label key={child._id} className="radio">
                  <input
                    type="radio"
                    name="childSelection"
                    checked={childSelection === "existing" && selectedChildIndex === idx}
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
            </fieldset>
          )}

          {/* New student form */}
          {childSelection === "new" && (
            <fieldset className="booking-fieldset">
              <legend>New Student Information</legend>

              <div className="form-group">
                <label>First Name *</label>
                <input
                  ref={firstRef}
                  type="text"
                  name="firstName"
                  value={newChild.firstName}
                  onChange={handleNewChildChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={newChild.lastName}
                  onChange={handleNewChildChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade Level *</label>
                <input
                  type="text"
                  name="gradeLevel"
                  value={newChild.gradeLevel}
                  onChange={handleNewChildChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={newChild.phone}
                  onChange={handleNewChildChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newChild.email}
                  onChange={handleNewChildChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="text"
                  name="age"
                  value={newChild.age}
                  onChange={handleNewChildChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>School *</label>
                <input
                  type="text"
                  name="school"
                  value={newChild.school}
                  onChange={handleNewChildChange}
                  required
                />
              </div>
            </fieldset>
          )}

          {/* Package Details */}
          <fieldset className="booking-fieldset">
            <legend>Package Details</legend>

            <div className="form-group">
              <label>Package Type *</label>
              <select name="packageType" value={formData.packageType} onChange={handleFormChange} required>
                <option value="1-1">1:1 Private Tutoring</option>
                <option value="1-2">1:2 Small Group</option>
              </select>
            </div>

            <div className="form-group">
              <label>Sessions Per Week *</label>
              <select name="sessionsPerWeek" value={formData.sessionsPerWeek} onChange={handleFormChange} required>
                <option value="2">2 sessions/week</option>
                <option value="3">3 sessions/week</option>
                <option value="5">5 sessions/week</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <select name="subject" value={formData.subject} onChange={handleFormChange} required>
                <option value="">Select a subject</option>
                <option value="Singapore Math">Singapore Math</option>
                <option value="Scratch Coding">Scratch Coding</option>
                <option value="Python Basics">Python Basics</option>
                <option value="Python Advanced">Python Advanced</option>
                <option value="Robotics">Robotics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
              </select>
            </div>

            <div className="form-group">
              <label>Grade Level</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleFormChange}
                placeholder="e.g., Grade 3"
              />
            </div>

            <div className="form-group">
              <label>Preferred Date *</label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleFormChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="form-group">
              <label>Preferred Time *</label>
              <select name="preferredTime" value={formData.preferredTime} onChange={handleFormChange} required>
                <option value="">Select a time</option>
                {generateTimeOptions().map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {timezone && (
              <p className="timezone-display">
                Your timezone: <strong>{timezone}</strong>
              </p>
            )}

            <div className="form-group">
              <label>Duration</label>
              <select name="duration" value={formData.duration} onChange={handleFormChange}>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea
                name="notes"
                rows="3"
                placeholder="Any specific topics or requests..."
                value={formData.notes}
                onChange={handleFormChange}
              />
            </div>
          </fieldset>
        </form>

        <footer className="dialog-footer">
          <button
            type="submit"
            form="bookingForm"
            className="btn-primary"
            disabled={submitting}
          >
            {submitting ? "Booking..." : "Book Package"}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
}
