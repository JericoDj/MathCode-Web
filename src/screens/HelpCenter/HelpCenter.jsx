import "./HelpCenter.css";

export default function HelpCenter() {
  return (
    <>
      <br />
    

      <div className="help-center">
        <h2>Help Center</h2>
        <p className="me-auto">
          Find answers to common questions or get in touch with our support team.
        </p>

              <br />

        {/* Search */}
        <div className="search-box col-sm-12 col-md-10 mx-auto">
          <input type="text" placeholder="Search for help topics..." />
          <button className="btn-primary">Search</button>
        </div>

        <div className="help-grid col-sm-12 col-md-8 mx-auto">
          {/* Categories */}
          <section className="card">
            <h3>Account</h3>
            <ul>
              <li>How to update profile details</li>
              <li>Resetting your password</li>
              <li>Managing child profiles</li>
            </ul>
          </section>

          <section className="card">
            <h3>Billing</h3>
            <ul>
              <li>View or download invoices</li>
              <li>Update payment method</li>
              <li>Cancel or change plan</li>
            </ul>
          </section>

          <section className="card">
            <h3>Technical Support</h3>
            <ul>
              <li>Troubleshooting login issues</li>
              <li>Fixing video call problems</li>
              <li>Reporting a bug</li>
            </ul>
          </section>

          <section className="card">
            <h3>General</h3>
            <ul>
              <li>How our programs work</li>
              <li>Understanding progress reports</li>
              <li>Contacting instructors</li>
            </ul>
          </section>
        </div>

        {/* Contact Support */}
        <section className="card contact-support col-sm-12 col-md-6 mx-auto">
          <h3>Need More Help?</h3>
          <p>
            If you couldn’t find the answer, reach out to our support team. We’re
            here to help.
          </p>
          <div className="contact-options">
            <button className="btn-outline">Email Support</button>
            <button className="btn-outline">Live Chat</button>
            <button className="btn-outline">Call Us</button>
          </div>
        </section>
      </div>
    </>
  );
}
