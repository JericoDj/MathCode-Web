import { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';
import AuthController from '../../controllers/AuthController.jsx';
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
  const { user, setUser, loading } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const nextUrl = useNextRedirect();
  const nextQS = useMemo(() => {
    const p = new URLSearchParams(location.search);
    const n = p.get('next');
    return n ? `?next=${encodeURIComponent(n)}` : '';
  }, [location.search]);

  // mode from route
  const derivedMode =
    location.pathname.includes('/register') ? 'register' :
    location.pathname.includes('/login')    ? 'login'    :
    initialMode || 'login';

  const [mode, setMode] = useState(derivedMode);
  const [busy, setBusy] = useState(false);
  const ctrl = useMemo(() => new AuthController(), []);

  useEffect(() => setMode(derivedMode), [derivedMode]);

  // Already logged in? go next
  useEffect(() => {
    if (!loading && user) navigate(nextUrl, { replace: true });
  }, [user, loading, navigate, nextUrl]);

  const switchTo = (m) => {
    setMode(m);
    navigate(m === 'login' ? `/login${nextQS}` : `/register${nextQS}`, { replace: true });
  };

  return (
    
    <main className="auth">
        <br/>
      <section className="auth-card" aria-labelledby="auth-title">
        <header className="auth-header">
          <h1 id="auth-title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to track progress, sessions, and rewards.'
              : 'Join to access practice, coaching sessions, and progress tracking.'}
          </p>
        </header>

        <div className="auth-switch" role="tablist" aria-label="Auth mode">
          <button
            role="tab"
            className={`switch-btn ${mode === 'login' ? 'is-active' : ''}`}
            aria-selected={mode === 'login'}
            onClick={() => switchTo('login')}
          >
            Sign in
          </button>
          <button
            role="tab"
            className={`switch-btn ${mode === 'register' ? 'is-active' : ''}`}
            aria-selected={mode === 'register'}
            onClick={() => switchTo('register')}
          >
            Join
          </button>
        </div>

        {mode === 'login' ? (
          <LoginForm busy={busy} setBusy={setBusy} ctrl={ctrl} setUser={setUser} nextUrl={nextUrl} />
        ) : (
          <RegisterForm busy={busy} setBusy={setBusy} ctrl={ctrl} setUser={setUser} nextUrl={nextUrl} />
        )}

        <footer className="auth-footer">
          {mode === 'login' ? (
            <p>
              New to MathCode?{' '}
              <button className="linklike" onClick={() => switchTo('register')}>Create an account</button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button className="linklike" onClick={() => switchTo('login')}>Sign in</button>
            </p>
          )}
          <p className="auth-help-links">
            <Link to="/#faq" className="underlined">Read FAQs</Link> · <Link to="/#contact" className="underlined">Contact us</Link>
          </p>
        </footer>
      </section>

      <aside className="auth-aside">
        <div className="aside-inner">
          <h2>Why parents choose us</h2>
          <ul>
            <li><strong>Singapore Math</strong> foundations + modern feedback.</li>
            <li><strong>Clear explanations</strong> and right-sized hints.</li>
            <li><strong>Coaching sessions</strong> to close gaps fast.</li>
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

function LoginForm({ busy, setBusy, ctrl, setUser, nextUrl }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const valid = emailOk(email) && (pass?.length || 0) > 0; // ✅ relaxed for login

  async function onSubmit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setErr('');
    setBusy(true);
    try {
      const u = await ctrl.login({ email, password: pass });
      setUser(u);
      window.location.assign(nextUrl);
    } catch (ex) {
      setErr(ex?.message || 'Sign in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form p" onSubmit={onSubmit} noValidate>
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

      <label className="field">
        <span>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />
        <div className="field-row">
          <small className="hint">Use your account password.</small>
          <Link to="/reset-password" className="linklike small">Forgot Password?</Link>
        </div>
      </label>

      {err && <div className="form-error" role="alert">{err}</div>}

      <div className="form-actions">
        <button className="btn-primary" disabled={!valid || busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <Link to="/register" className="btn-outline">Create account</Link>
      </div>
    </form>
  );
}

function RegisterForm({ busy, setBusy, ctrl, setUser, nextUrl }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [childAge, setChildAge] = useState('');
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState('');

  const passStrong =
    /[A-Z]/.test(pass) + /[a-z]/.test(pass) + /\d/.test(pass) + /[^A-Za-z0-9]/.test(pass);
  const valid = name.trim().length >= 2 && emailOk(email) && passOk(pass) && agree;

  async function onSubmit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setErr('');
    setBusy(true);
    try {
      const u = await ctrl.register({ name: name.trim(), email, password: pass, childAge });
      setUser(u);
      window.location.assign(nextUrl);
    } catch (ex) {
      setErr(ex?.message || 'Sign up failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <label className="field">
        <span>Parent / Guardian name</span>
        <input
          type="text"
          placeholder="e.g., Elaine Tan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {name && name.trim().length < 2 && <small className="hint error">Please enter your full name.</small>}
      </label>

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

      <label className="field">
        <span>Password</span>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          aria-invalid={pass && !passOk(pass)}
          required
        />
        <small className="hint">At least 8 characters.</small>
        {pass && (
          <div className="meter" aria-hidden="true">
            <span className={`bar s${passStrong}`} />
          </div>
        )}
      </label>

      <label className="field">
        <span>Child’s level (optional)</span>
        <select value={childAge} onChange={(e) => setChildAge(e.target.value)}>
          <option value="">Select…</option>
          <option value="5-7">Ages 5–7</option>
          <option value="8-10">Ages 8–10</option>
          <option value="11-12">Ages 11–12</option>
        </select>
        <small className="hint">Helps us personalize the first session.</small>
      </label>

      <label className="check">
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
        <span>
          I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
        </span>
      </label>

      {err && <div className="form-error" role="alert">{err}</div>}

      <div className="form-actions">
        <button className="btn-primary" disabled={!valid || busy}>
          {busy ? 'Creating…' : 'Join'}
        </button>
        <Link to="/login" className="btn-outline">Sign in</Link>
      </div>
    </form>
  );
}
