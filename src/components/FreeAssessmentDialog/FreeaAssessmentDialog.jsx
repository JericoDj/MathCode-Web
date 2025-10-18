import React, { useState, useEffect, useRef } from "react";
import "./FreeAssessmentDialog.css";

const localDev = "http://localhost:4000";

export default function FreeAssessmentDialog({ open, onClose }) {
  const firstRef = useRef(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childSelection, setChildSelection] = useState("existing"); // "existing" | "new"
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [newChild, setNewChild] = useState({
    firstName: "",
    lastName: "",
    gradeLevel: "",
    school: "",
    email: "",
    phone: "",
    age: "",
  });
  const [sessionData, setSessionData] = useState({
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch user info from API
  useEffect(() => {
    if (!open) return;

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/login";
      return;
    }

    setToken(storedToken);

    const fetchUser = async () => {
      try {
        const res = await fetch(`${localDev}/api/users/me`, {
          headers: { Authorization: `Bearer ${JSON.parse(storedToken)}` },
        });
        const data = await res.json();
        setUser(data);

        // Default to "new student" if none found
        if (!data.guardianOf || data.guardianOf.length === 0) {
          setChildSelection("new");
        }

        setLoading(false);
        setTimeout(() => firstRef.current?.focus(), 100);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [open]);

  if (!open) return null;

  const handleChildChange = (e) => {
    const { name, value } = e.target;
    setNewChild((prev) => ({ ...prev, [name]: value }));
  };

  const handleSessionChange = (e) => {
    const { name, value } = e.target;
    setSessionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const childToSubmit =
      childSelection === "existing"
        ? user.guardianOf[selectedChildIndex]
        : newChild;

    try {
      const res = await fetch(`${localDev}/api/sessions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          child: childToSubmit,
          preferredDate: sessionData.preferredDate,
          preferredTime: sessionData.preferredTime,
          notes: sessionData.notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit session request.");
      alert("✅ Assessment booked successfully!");
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
          <form onSubmit={handleSubmit} className="fad-form">
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
                  <label>Emergency Contact *</label>
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

            {/* Session Info */}
            <fieldset className="fad-fieldset">
              <legend>Session Details</legend>
              <div className="form-group">
                <label>Preferred Date *</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={sessionData.preferredDate}
                  onChange={handleSessionChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Preferred Time *</label>
                <input
                  type="time"
                  name="preferredTime"
                  value={sessionData.preferredTime}
                  onChange={handleSessionChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  rows={3}
                  name="notes"
                  value={sessionData.notes}
                  onChange={handleSessionChange}
                  placeholder="Any learning goals, concerns, or topics to focus on..."
                />
              </div>
            </fieldset>

            {/* Actions */}
            
          </form>
          
        )}

        {/* Footer */}
<div className="fad-footer">
  <div className="fad-actions">
    <button
      type="submit"
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
