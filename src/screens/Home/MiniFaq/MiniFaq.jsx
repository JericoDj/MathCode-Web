import { Link } from "react-router-dom";
import "./MiniFaq.css";

export default function MiniFaq({ title = "Frequently Asked Questions" }) {
  return (
    <section className="mini-faq" aria-labelledby="mini-faq-heading">
      <h2 id="mini-faq-heading" className="faq-heading pb-4">{title}</h2>

      <aside className="contact-faq" aria-label="Common questions">
        <h3 className="faq-title">Common questions</h3>

        <details>
          <summary>How quickly do you respond?</summary>
          <p>Within 1 business day. Premier inquiries get priority scheduling.</p>
        </details>

        <details>
          <summary>What makes it Singapore Math?</summary>
          <p>We focus on bar models, heuristics, problem variations, and word problems aligned to the syllabus.</p>
        </details>

        <details>
          <summary>Is coding included?</summary>
          <p>
            Coding is optional. Kids Coding is <strong>coming soon</strong>—join the waitlist by choosing
            “Kids Coding (Soon)” in the form.
          </p>
        </details>

        <details>
          <summary>Payment methods</summary>
          <p>We accept Visa, Mastercard, and GCash. Monthly, cancel anytime.</p>
        </details>

        <div className="faq-cta">
          <Link to="/faq" className="btn btn-small btn-outline">See all FAQs</Link>
        </div>
      </aside>
    </section>
  );
}
