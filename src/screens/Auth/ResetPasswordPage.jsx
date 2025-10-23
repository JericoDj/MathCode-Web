import { useContext, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';
import './ForgotReset.css';

const passOk = (v) => (v?.length || 0) >= 8;

function useToken() {
  const location = useLocation();
  return useMemo(() => new URLSearchParams(location.search).get('token') || '', [location.search]);
}

export default function ResetPasswordPage() {
  const { completePasswordReset } = useContext(UserContext);
  const token = useToken();
  const navigate = useNavigate();

  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);

  const strength =
    Number(/[A-Z]/.test(pass)) + Number(/[a-z]/.test(pass)) + Number(/\d/.test(pass)) + Number(/[^A-Za-z0-9]/.test(pass));

  const matches = pass && pass2 && pass === pass2;
  const valid = token && passOk(pass) && matches;

  async function onSubmit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setErr('');
    setBusy(true);
    try {
      await completePasswordReset(token, pass);
      setDone(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (ex) {
      setErr(ex?.message || 'Could not reset password.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth auth--single">
      <section className="auth-card" aria-labelledby="rp-title">
        <header className="auth-header">
          <h1 id="rp-title">Set a new password</h1>
          <p className="auth-subtitle">Choose a strong password to secure your account.</p>
        </header>

        {!token && (
          <div className="notice error" role="alert">
            Missing or invalid token. Please use the link from your email or request a new one.
          </div>
        )}

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span>New password</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              aria-invalid={!!pass && !passOk(pass)}
              required
            />
            <small className="hint">At least 8 characters.</small>
            {pass && (
              <div className="meter" aria-hidden="true">
                <span className={`bar s${strength}`} />
              </div>
            )}
          </label>

          <label className="field">
            <span>Confirm new password</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              aria-invalid={!!pass2 && !matches}
              required
            />
            {!!pass2 && !matches && <small className="hint error">Passwords don’t match.</small>}
          </label>

          {err && <div className="form-error" role="alert">{err}</div>}

          <div className="form-actions">
            <button className="btn-primary" disabled={!valid || busy}>
              {busy ? 'Saving…' : 'Save new password'}
            </button>
            <Link to="/" className="btn-outline">Back to sign in</Link>
          </div>
        </form>

        {done && (
          <div className="notice success" role="status">
            <strong>Password updated.</strong> Redirecting to sign in…
          </div>
        )}
      </section>
    </main>
  );
}
