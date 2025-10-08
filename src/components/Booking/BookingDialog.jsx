// components/Booking/BookingDialog.jsx
import { useState, useRef, useEffect } from "react";
import { SessionContext } from "../../context/SessionContext.jsx"; // import session context
import { useContext } from "react";

const CONCERNS = [
  { id: "catchup", label: "Catch up on current topics", emoji: "⏳" },
  { id: "foundations", label: "Build strong foundations", emoji: "🏗️" },
  { id: "mastery", label: "Mastery & enrichment", emoji: "🥇" },
  { id: "examprep", label: "Exam prep", emoji: "📝" },
  { id: "coding", label: "Coding intro (kid-friendly)", emoji: "💻" },
];

export default function BookingDialog({ open, onClose }) {
  const [concerns, setConcerns] = useState([]);
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [timePref, setTimePref] = useState("");
  const firstRef = useRef(null);

  const { submitBooking, isSubmitting } = useContext(SessionContext); 

  useEffect(() => {
    if (open) {
      setConcerns([]);
      setAge("");
      setNotes("");
      setTimePref("");
      setTimeout(() => firstRef.current?.focus(), 0);
    }
  }, [open]);

  const canSubmit = concerns.length > 0 && !!age && !isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const result = await submitBooking({ concerns, age, notes, timePref });

    if (result.success) {
      onClose?.();
    } else {
      alert(result.message || "Failed to submit session request.");
    }
  };

  const toggleConcern = (id) => {
    setConcerns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (!open) return null;

  return (
    <div
      className="fsdlg-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        className="fsdlg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fsdlg-title"
      >
        <header className="fsdlg-header">
          <h3 id="fsdlg-title">Book a Session</h3>
          <p>Quick diagnostic + parent consult. Tell us your goals and preferred time.</p>
        </header>

        <form onSubmit={handleSubmit}>
          <fieldset className="fsdlg-fieldset">
            <legend>Goals</legend>
            <div className="fsdlg-chipgrid">
              {CONCERNS.map(({ id, label, emoji }, idx) => {
                const active = concerns.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    ref={idx === 0 ? firstRef : null}
                    className={`chip ${active ? "is-active" : ""}`}
                    aria-pressed={active}
                    onClick={() => toggleConcern(id)}
                  >
                    <span className="chip-emoji" aria-hidden="true">
                      {emoji}
                    </span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="fsdlg-fieldset">
            <legend>Child’s level</legend>
            <div className="fsdlg-radiogrid">
              {["5-7", "8-10", "11-12"].map((id) => (
                <label key={id} className={`radio ${age === id ? "is-active" : ""}`}>
                  <input
                    type="radio"
                    name="age"
                    value={id}
                    checked={age === id}
                    onChange={() => setAge(id)}
                  />
                  <span>Ages {id}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="fsdlg-two">
            <label className="fsdlg-label">
              Notes (optional)
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Topics, pain points, schedule constraints…"
              />
            </label>
            <label className="fsdlg-label">
              Preferred times (optional)
              <input
                value={timePref}
                onChange={(e) => setTimePref(e.target.value)}
                placeholder="e.g., Wed 5–6pm, Sat morning"
              />
            </label>
          </div>

          <div className="fsdlg-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!canSubmit}
              title={!canSubmit ? "Select at least one goal and a level" : undefined}
            >
              {isSubmitting ? "Submitting…" : "Request Session"}
            </button>
            <button type="button" className="btn btn-link" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
