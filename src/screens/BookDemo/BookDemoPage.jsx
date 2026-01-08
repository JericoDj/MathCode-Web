import "./BookDemo.css";

export default function BookDemo() {
  return (
    <main className="book-demo">
      <div className="book-demo-container">
        {/* LEFT: FORM */}
        <section className="demo-form-card">
          <h2>Take a product tour</h2>
          <p className="muted">
            See how MathCode helps students master Singapore Math through code.
          </p>

          <form className="demo-form">
            <div className="row">
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
            </div>

            <input type="email" placeholder="Work Email" required />

            <select required>
              <option value="">How do you plan on using MathCode?</option>
              <option>Parent</option>
              <option>Student</option>
              <option>Teacher</option>
              <option>School / Organization</option>
            </select>

            <button type="submit" className="primary-btn">
              Continue
            </button>
          </form>

          <p className="legal">
            By continuing, you agree to our <a href="#">Terms</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </p>
        </section>

        {/* RIGHT: CONTENT */}
        <section className="demo-info">
          <h1>See MathCode in action</h1>
          <p className="muted">
            Discover how structured math thinking and coding come together.
          </p>

          <ul className="features">
            <li>✔ Singapore Math bar models explained visually</li>
            <li>✔ Guided word problem breakdowns</li>
            <li>✔ Problem variations to build mastery</li>
            <li>✔ Coding exercises that reinforce logic</li>
          </ul>

          <div className="badges">
            <span>Trusted by parents</span>
            <span>Built for mastery</span>
            <span>STEM-aligned</span>
          </div>
        </section>
      </div>
    </main>
  );
}
