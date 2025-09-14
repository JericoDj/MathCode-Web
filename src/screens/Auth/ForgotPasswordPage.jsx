import { useContext, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';
import './ForgotReset.css';

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function useNextRedirect() {
  const location = useLocation();
  return useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get('next') || '/dashboard';
  }, [location.search]);
}

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useContext(UserContext);
  const nextUrl = useNextRedirect();

  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const [lastSentAt, setLastSentAt] = useState(0);

  const valid = emailOk(email);
  const canResend = Date.now() - lastSentAt > 30_000; // 30s cooldown

  async function onSubmit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setErr('');
    setBusy(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
      setLastSentAt(Date.now());
    } catch (ex) {
      setErr(ex?.message || 'Could not send reset email.');
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    if (!canResend || busy) return;
    setErr('');
    setBusy(true);
    try {
      await requestPasswordReset(email.trim());
      setLastSentAt(Date.now());
    } catch (ex) {
      setErr(ex?.message || 'Could not resend email.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth auth--single">
      <section className="auth-card" aria-labelledby="fp-title">
        <header className="auth-header">
          <h1 id="fp-title">Forgot your password?</h1>
          <p className="auth-subtitle">Enter your email and we’ll send you a reset link.</p>
        </header>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={email && !emailOk(email)}
              required
            />
            {email && !emailOk(email) && <small className="hint error">Please enter a valid email.</small>}
          </label>

          {err && <div className="form-error" role="alert">{err}</div>}

          <div className="form-actions">
            <button className="btn-primary" disabled={!valid || busy}>
              {busy ? 'Sending…' : 'Send reset link'}
            </button>
            <Link to={`/login?next=${encodeURIComponent('/')}`} className="btn-outline">Back to sign in</Link>
          </div>
        </form>

        {sent && (
          <div className="notice success" role="status">
            <strong>Check your email.</strong> We’ve sent a link to <em>{email}</em>.  
            {canResend ? (
              <> Didn’t get it? <button className="linklike small" onClick={resend}>Resend</button>.</>
            ) : (
              <> You can resend in a few seconds…</>
            )}
          </div>
        )}

        <footer className="auth-footer">
          <p className="auth-help-links">
            <Link to="/#faq" className="underlined">Read FAQs</Link> · <Link to="/#contact" className="underlined">Contact us</Link>
          </p>
        </footer>
      </section>

      <aside className="auth-aside">
        <div className="aside-inner">
          <h2>Tip</h2>
          <ul>
            <li>Look in <strong>Spam</strong> or <strong>Promotions</strong> if you don’t see it.</li>
            <li>Links expire for security—use it soon.</li>
          </ul>
          <div className="aside-cta">
            <Link to="/#program" className="btn-light">Explore program</Link>
            <Link to="/#pricing" className="btn-ghost">See pricing</Link>
          </div>
        </div>
      </aside>
    </main>
  );
}
