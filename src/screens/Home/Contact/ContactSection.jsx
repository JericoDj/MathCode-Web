import { useState } from "react";
import { Link } from "react-router-dom";
import { submitInquiryController } from "../../../controllers/InquiryController";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import "./ContactSection.css";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log("Inquiry email:", data.email); // << HERE

    try {
      await submitInquiryController(data);

      setSubmitted(true);
      form.reset();
    } catch (err) {
      console.error("Inquiry submit failed:", err);
    }

    setLoading(false);
  }


  return (
    <section className="contact" aria-labelledby="contact-heading">
      <div className="contact-inner">
        <header className="contact-header">
          <h2 id="contact-heading" className="contact-title pb-3">Contact Us</h2>
          <p className="contact-subtitle py-3">
            Tell us your child’s goals and current level — we’ll recommend the best plan.
          </p>
        </header>

        <div className="contact-grid">
          <article className="form-card" aria-label="Contact form">
            {submitted && (
              <div className="alert-success" role="status" aria-live="polite">
                🎉 Thanks! We’ll get back to you within <strong>1 business day</strong>.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="parentName">Your name</label>
                  <input id="parentName" name="parentName" type="text" required placeholder="Jane Apolinario" />
                </div>

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    inputMode="email"
                    placeholder="LetsTalk@mail.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="grade">Child’s level</label>
                  <select id="grade" name="grade" defaultValue="P3">
                    <option value="P1">Primary 1</option>
                    <option value="P2">Primary 2</option>
                    <option value="P3">Primary 3</option>
                    <option value="P4">Primary 4</option>
                    <option value="P5">Primary 5</option>
                    <option value="P6">Primary 6</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="topic">Topic</label>
                  <select id="topic" name="topic" defaultValue="pricing">
                    <option value="pricing">Pricing & plans</option>
                    <option value="guided">Guided package</option>
                    <option value="premier">Premier sessions</option>
                    <option value="support">Technical support</option>
                    <option value="kids">Kids Coding (Soon)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Share goals, pain points, or a recent problem that was tricky…"
                  required
                />
              </div>

              <div className="form-row compact">
                <label className="checkbox">
                  <input type="checkbox" name="updates" defaultChecked />
                  <span>Send me practice tips and updates</span>
                </label>

                <div className="contact-actions">
  <button type="submit" className="btn btn-primary" disabled={loading}>
    {loading ? "Sending..." : "Send message"}
  </button>

  {loading && <LoadingSpinner text="Sending inquiry..." />}
</div>
              </div>
            </form>

            <p className="meta">
              Need help choosing a plan?
              Email us at{" "}
              <a href="mailto:dejesusjerico528@gmail.com">dejesusjerico528@gmail.com</a>.
              <br />
              No mail app?{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=dejesusjerico528@gmail.com&su=MathCode%20Inquiry"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Gmail
              </a>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
