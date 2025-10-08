import React from "react";
import "./PrivacyPage.css";

export default function PrivacyPage({
    companyName = "MathCode",
    effectiveDate = "September 24, 2025",
    contactEmail = "privacy@mathcode.example",
}) {
    return (
        <>
            <br />
            <br />
            <br />
            <main className="privacy-page">
                <article className="privacy-article">
                    {/* Header */}
                    <header className="privacy-header">
                        <h1>Privacy Policy</h1>
                        <p className="effective-date">
                            Effective date: <time dateTime="2025-09-24">{effectiveDate}</time>
                        </p>
                    </header>


                    {/* Intro */}
                    <section className="privacy-intro">
                        <p>
                            {companyName} ("we", "us", or "our") values your privacy. This Privacy Policy
                            explains what information we collect, why we collect it, and how you can
                            manage it when you use our website and services.
                        </p>
                    </section>

                    {/* Sections */}
                    {[
                        {
                            title: "1. Information We Collect",
                            content: (
                                <ul>
                                    <li><strong>Information you provide:</strong> account info, email, profile, support messages.</li>
                                    <li><strong>Usage data:</strong> pages visited, features used, timestamps, performance metrics.</li>
                                    <li><strong>Device & connection data:</strong> IP (anonymized), browser, OS, device IDs.</li>
                                </ul>
                            ),
                        },
                        {
                            title: "2. How We Use Your Information",
                            content: "We use collected information to provide and improve our services, personalize content, respond to support requests, detect abuse or security incidents, and send relevant updates or offers (with your consent when required).",
                        },
                        {
                            title: "3. Cookies & Tracking",
                            content: "We use cookies and similar technologies to remember preferences, enable core functionality, and gather analytics. You can control cookies through your browser settings. Blocking cookies may impact some site features.",
                        },
                        {
                            title: "4. Third-Party Services",
                            content: "We may share data with trusted third parties (hosting, analytics, payment processors). They act as processors and must protect your data.",
                        },
                        {
                            title: "5. Data Retention",
                            content: "We retain personal data only as long as necessary. Retention periods vary by type — contact us for details.",
                        },
                        {
                            title: "6. Security",
                            content: "We implement industry-standard safeguards (encryption in transit, access controls, monitoring) to protect data. However, no system is completely secure — breaches will be reported as required by law.",
                        },
                        {
                            title: "7. Children",
                            content: "Our services are not for children under 13. We do not knowingly collect data from children; contact us if you believe we have.",
                        },
                        {
                            title: "8. Your Rights",
                            content: "Depending on your jurisdiction, you may access, correct, export, delete, restrict, or object to processing of your data. Contact us to exercise your rights.",
                        },
                        {
                            title: "9. Changes to This Policy",
                            content: "We may update this Privacy Policy. Material changes will be announced; the Effective date will reflect the last revision.",
                        },
                    ].map((section, idx) => (
                        <section key={idx} className="privacy-section">
                            <h2>{section.title}</h2>
                            <div className="privacy-content">{section.content}</div>
                        </section>
                    ))}

                    {/* Footer */}
                    <footer className="privacy-footer">
                        <div className="contact-info">
                            <p>Questions or requests?</p>
                            <p>Email: <a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>
                        </div>
                        <div className="footer-actions">
                            <button onClick={() => window.print()} className="btn-print">Print Policy</button>
                            <button onClick={() => window.print()} className="btn-export">Export PDF</button>
                        </div>
                    </footer>
                </article>

                {/* Decorative bar */}
                {/* <div className="decorative-bar"></div> */}
            </main>
        </>
    );
}
