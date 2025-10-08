import React from "react";
import "./TermsPage.css";

export default function TermsPage({
    companyName = "MathCode",
    effectiveDate = "September 24, 2025",
    contactEmail = "support@mathcode.example",
}) {
    return (
        <>
            <br /><br /><br />
            <main className="terms-page">
                <article className="terms-article">
                    {/* Header */}
                    <header className="terms-header">
                        <h1>Terms & Conditions</h1>
                        <p className="effective-date">
                            Effective date: <time dateTime="2025-09-24">{effectiveDate}</time>
                        </p>
                    </header>

                    {/* Intro */}
                    <section className="terms-intro">
                        <p>
                            Welcome to {companyName}! These Terms & Conditions ("Terms") govern your access to and use of our website and services.
                            By using our services, you agree to these Terms. Please read them carefully.
                        </p>
                    </section>

                    {/* Sections */}
                    {[
                        { title: "1. Acceptance of Terms", content: "By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree, please do not use our services." },
                        { title: "2. User Responsibilities", content: "You agree to use our services only for lawful purposes. You must not engage in harmful or illegal activities, violate others' rights, or interfere with our systems." },
                        { title: "3. Account Security", content: "You are responsible for maintaining the confidentiality of your account and password. Notify us immediately if you suspect unauthorized access." },
                        { title: "4. Content", content: "All content provided by {companyName} is for educational and informational purposes. You may not copy, distribute, or modify our content without permission." },
                        { title: "5. Payment & Refunds", content: "If using paid services, you agree to pay all fees specified. Refund policies are detailed in your purchase agreement or invoice." },
                        { title: "6. Termination", content: "We may suspend or terminate access to services if Terms are violated. Upon termination, you must cease use of our services immediately." },
                        { title: "7. Limitation of Liability", content: "To the fullest extent permitted by law, {companyName} is not liable for any indirect, incidental, or consequential damages arising from use of our services." },
                        { title: "8. Governing Law", content: "These Terms are governed by the laws of the jurisdiction where {companyName} is based. Disputes will be resolved in accordance with applicable law." },
                        { title: "9. Changes to Terms", content: "We may update these Terms periodically. Material changes will be notified, and the Effective date will reflect the last revision." },
                    ].map((section, idx) => (
                        <section key={idx} className="terms-section">
                            <h2>{section.title}</h2>
                            <div className="terms-content">{section.content}</div>
                        </section>
                    ))}

                    {/* Footer */}
                    <footer className="terms-footer">
                        <div className="contact-info">
                            <p>Questions or requests?</p>
                            <p>Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
                        </div>
                        <div className="footer-actions">
                            <button onClick={() => window.print()} className="btn-print">Print Terms</button>
                            <button onClick={() => window.print()} className="btn-export">Export PDF</button>
                        </div>
                    </footer>
                </article>
            </main>
        </>
    );
}
