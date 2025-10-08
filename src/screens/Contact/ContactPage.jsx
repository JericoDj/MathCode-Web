import React, { useState } from "react";
import "./ContactPage.css";

export default function ContactPage({
    companyName = "MathCode",
    contactEmail = "support@mathcode.example",
    phoneNumber = "+1 (555) 123-4567",
    address = "123 Learning Lane, Tech City, Country"
}) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you, ${formData.name}! Your message has been sent.`);
        setFormData({name: "", email: "", subject: "", message: ""});
    };

    return (
        <main className="contact-page">
            <article className="contact-article">
                <header className="contact-header">
                    <h1>Contact Us</h1>
                    <p>We would love to hear from you. Reach out for support, inquiries, or feedback.</p>
                </header>

                <div className="contact-content">
                    {/* Contact Info */}
                    <section className="contact-info">
                        <h2>Our Information</h2>
                        <p><strong>Company:</strong> {companyName}</p>
                        <p><strong>Email:</strong> <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
                        <p><strong>Phone:</strong> <a href={`tel:${phoneNumber}`}>{phoneNumber}</a></p>
                        <p><strong>Address:</strong> {address}</p>
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
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your full name"
                                />
                            </label>
                            <label>
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your email address"
                                />
                            </label>
                            <label>
                                Subject
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Subject (optional)"
                                />
                            </label>
                            <label>
                                Message
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    placeholder="Write your message here..."
                                ></textarea>
                            </label>
                            <button type="submit" className="btn-submit">Send Message</button>
                        </form>
                    </section>
                </div>
            </article>
        </main>
    );
}
