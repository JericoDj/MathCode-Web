import React, { useState } from "react";
import { submitInquiryController } from "../../controllers/InquiryController";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./ContactPage.css";

export default function ContactPage({
  companyName = "MathCode",
  contactEmail = "dejesusjerico528@gmail.com",
  phoneNumber = "+63 (976) 014-3260",
//   address = "123 Learning Lane, Tech City, Country",
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setSubmitted(false);
    setError("");

    try {
      await submitInquiryController({
        parentName: formData.name,
        email: formData.email,
        topic: formData.subject || "General",
        message: formData.message,
        updates: true,
      });

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error("Inquiry failed:", err);
      setError("Failed to send. Please try again.");
    }

    setSending(false);
  }

  return (
    <main className="contact-page">
      <article className="contact-article">
        <header className="contact-header">
          <h1>Contact Us</h1>
          <p>We’d love to hear from you. Reach out for support, inquiries, or feedback.</p>
        </header>

        <div className="contact-content">
          {/* Contact Info */}
          <section className="contact-info">
  <h2>Our Information</h2>

  <div className="info-block">
    <p><strong>Company:</strong> {companyName}</p>
    <p><strong>Email:</strong> {contactEmail}</p>
    <p><strong>Phone:</strong> <a href={`tel:${phoneNumber}`}>{phoneNumber}</a></p>
  </div>

  {submitted && (
    <div className="contact-success">
      🎉 Thanks! We’ll get back to you within <strong>1 business day</strong>.
    </div>
  )}

  {error && (
    <div className="contact-error">
      ⚠ {error}
    </div>
  )}
</section>

          {/* Contact Form */}
          <section className="contact-form-section">
            <h2>Send Us a Message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                Subject
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject (optional)"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  required
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </label>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
  <button type="submit" className="btn-submit" disabled={sending}>
    {sending ? "Sending..." : "Send Message"}
  </button>

  {sending && <LoadingSpinner text="Processing inquiry..." />}
</div>
            </form>
          </section>
        </div>
      </article>
    </main>
  );
}
