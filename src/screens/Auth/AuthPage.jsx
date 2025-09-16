// pages/AuthPage/AuthPage.jsx
import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';
import './AuthPage.css';

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const passOk  = (v) => (v?.length || 0) >= 8;

function useNextRedirect() {
  const location = useLocation();
  return useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get('next') || '/dashboard';
  }, [location.search]);
}

export default function AuthPage({ mode: initialMode }) {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const nextUrl = useNextRedirect();

  const nextQS = useMemo(() => {
    const p = new URLSearchParams(location.search);
    const n = p.get('next');
    return n ? `?next=${encodeURIComponent(n)}` : '';
  }, [location.search]);

  const derivedMode =
    location.pathname.includes('/register') ? 'register' :
    location.pathname.includes('/login')    ? 'login'    :
    initialMode || 'login';

  const [mode, setMode] = useState(derivedMode);
  const [busy, setBusy] = useState(false);

  useEffect(() => setMode(derivedMode), [derivedMode]);

  // Already logged in? redirect
  useEffect(() => {
    if (!loading && user) navigate(nextUrl, { replace: true });
  }, [user, loading, navigate, nextUrl]);

  const switchTo = (m) => {
    setMode(m);
    navigate(m === 'login' ? `/login${nextQS}` : `/register${nextQS}`, { replace: true });
  };

  return (
    <main className="auth pt-5">
      <section className="auth-card">
        <header className="auth-header">
          <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to track progress, sessions, and rewards.'
              : 'Join to access practice, coaching sessions, and progress tracking.'}
          </p>
        </header>

        <div className="auth-switch">
          <button
            className={`switch-btn ${mode === 'login' ? 'is-active' : ''}`}
            onClick={() => switchTo('login')}
          >
            Sign in
          </button>
          <button
            className={`switch-btn ${mode === 'register' ? 'is-active' : ''}`}
            onClick={() => switchTo('register')}
          >
            Join
          </button>
        </div>

        {mode === 'login' ? (
          <LoginForm busy={busy} setBusy={setBusy} nextUrl={nextUrl} />
        ) : (
          <RegisterForm busy={busy} setBusy={setBusy} nextUrl={nextUrl} />
        )}
      </section>
    </main>
  );
}

function LoginForm({ busy, setBusy, nextUrl }) {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const valid = emailOk(email) && pass.length > 0;

  async function onSubmit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setErr('');
    setBusy(true);
    try {
      await login({ email, password: pass });
      window.location.assign(nextUrl);
    } catch (ex) {
      setErr(ex?.message || 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <label className="field">
        <span>Password</span>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required />
      </label>

      {err && <div className="form-error">{err}</div>}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={!valid || busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <Link to="/register" className="btn-outline">Create account</Link>
      </div>
    </form>
  );
}

function RegisterForm({ busy, setBusy, nextUrl }) {
  const { register } = useContext(UserContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [childAge, setChildAge] = useState('');
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState('');

  const valid =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    emailOk(email) &&
    passOk(pass) &&
    phone.trim().length >= 7 &&
    agree;

  async function onSubmit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setErr('');
    setBusy(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
        email,
        password: pass,
        childAge,
      });
      window.location.assign(nextUrl);
    } catch (ex) {
      setErr(ex?.message || 'Sign up failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label className="field">
        <span>First name</span>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
      </label>

      <label className="field">
        <span>Last name</span>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </label>

      <label className="field">
        <span>Phone</span>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </label>

      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <label className="field">
        <span>Password</span>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required />
      </label>

      <label className="field">
        <span>Child’s level</span>
        <select value={childAge} onChange={(e) => setChildAge(e.target.value)}>
          <option value="">Select…</option>
          <option value="5-7">Ages 5–7</option>
          <option value="8-10">Ages 8–10</option>
          <option value="11-12">Ages 11–12</option>
        </select>
      </label>

      <label className="check">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        I agree to the <Link to="/terms" className="underlined">Terms</Link> and <Link to="/privacy" className="underlined">Privacy Policy</Link>.
      </label>

      {err && <div className="form-error">{err}</div>}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={!valid || busy}>
          {busy ? 'Creating…' : 'Join'}
        </button>
        <Link to="/login" className="btn-outline">Sign in</Link>
      </div>
    </form>
  );
}
