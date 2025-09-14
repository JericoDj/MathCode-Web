// components/Booking/FreeSessionDialog.jsx
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import FreeSessionSubmitController from "../../controllers/FreeSessionSubmitController.jsx";
import "./FreeSessionDialog.css";

const CONCERNS = [
  { id: "catchup", label: "Catch up on current topics", emoji: "⏳" },
  { id: "foundations", label: "Build strong foundations", emoji: "🏗️" },
  { id: "mastery", label: "Mastery & enrichment", emoji: "🥇" },
  { id: "examprep", label: "Exam prep", emoji: "📝" },
  { id: "coding", label: "Coding intro (kid-friendly)", emoji: "💻" },
];

export default function FreeSessionDialog() {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [concerns, setConcerns] = useState([]);
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");
  const [timePref, setTimePref] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const prevFocus = useRef(null);
  const firstRef = useRef(null);

  // Open via event from the click controller/provider
  useEffect(() => {
    const onOpen = () => {
      prevFocus.current = document.activeElement;
      setOpen(true);
      setConcerns([]); setAge(""); setNotes(""); setTimePref("");
      setTimeout(() => firstRef.current?.focus(), 0);
    };
    window.addEventListener("mc:open-free-session-dialog", onOpen);
    return () => window.removeEventListener("mc:open-free-session-dialog", onOpen);
  }, []);

  const canSubmit = concerns.length > 0 && !!age;

  function closeDialog() {
    setOpen(false);
    prevFocus.current?.focus?.();
  }

  function toggleConcern(id) {
    setConcerns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function submitFree(e) {
    e.preventDefault();
    const ctrl = new FreeSessionSubmitController();
    const res = await ctrl.submit({
      user,
      location,
      form: { concerns, age, notes, timePref },
    });

    // Close the dialog before navigation/opening another
    closeDialog();

    if (res?.action === "redirect_register" && res.url) {
      navigate(res.url);
    } else if (res?.action === "goto_packages" && res.url) {
      navigate(res.url);
    } else if (res?.action === "open_upsell") {
      // Upsell dialog opens via event inside the controller
    } else if (res?.action === "error") {
      // Optional: show a toast or message UI here
      console.warn("Free session submission error:", res.error);
    }
  }

  if (!open) return null;

  return (
    <div className="fsdlg-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) closeDialog(); }}>
      <section className="fsdlg" role="dialog" aria-modal="true" aria-labelledby="fsdlg-title">
        <header className="fsdlg-header">
          <h3 id="fsdlg-title">Book a Free 20-min Session</h3>
          <p>Quick diagnostic + parent consult. Tell us your goals and preferred time.</p>
        </header>

        <form onSubmit={submitFree}>
          <fieldset className="fsdlg-fieldset">
            <legend>Goals</legend>
            <div className="fsdlg-chipgrid">
              {CONCERNS.map(({ id, label, emoji }, idx) => {
                const active = concerns.includes(id);
                return (
                  <button
                    key={id}
                    ref={idx === 0 ? firstRef : null}
                    type="button"
                    className={`chip ${active ? "is-active" : ""}`}
                    aria-pressed={active}
                    onClick={() => toggleConcern(id)}
                  >
                    <span className="chip-emoji" aria-hidden="true">{emoji}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="fsdlg-fieldset">
            <legend>Child’s level</legend>
            <div className="fsdlg-radiogrid">
              {["5-7","8-10","11-12"].map((id) => (
                <label key={id} className={`radio ${age === id ? "is-active" : ""}`}>
                  <input type="radio" name="age" value={id} checked={age === id} onChange={() => setAge(id)} />
                  <span>Ages {id}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="fsdlg-two">
            <label className="fsdlg-label">
              Notes (optional)
              <textarea rows={3} value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Topics, pain points, schedule constraints…" />
            </label>
            <label className="fsdlg-label">
              Preferred times (optional)
              <input value={timePref} onChange={(e)=>setTimePref(e.target.value)} placeholder="e.g., Wed 5–6pm, Sat morning" />
            </label>
          </div>

          <div className="fsdlg-actions">
            <button type="submit" className="btn btn-primary" disabled={!canSubmit} title={!canSubmit ? "Select at least one goal and a level" : undefined}>
              Request Free Session
            </button>
            <button type="button" className="btn btn-link" onClick={closeDialog}>Cancel</button>
          </div>
        </form>
      </section>
    </div>
  );
}
