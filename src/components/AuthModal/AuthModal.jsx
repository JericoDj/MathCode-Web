// components/AuthModal/AuthModal.jsx
import { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';
import './AuthModal.css';

// Validators
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const passOk = (v) => (v?.length || 0) >= 8;

// Get Google Client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Updated Google OAuth Component - Uses backend route with body
const GoogleOAuth = ({ mode = 'login' }) => {
  const { setUser, closeAuthModal, openAuthModal, setGoogleSignupData } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError('');

      // Step 1: Initialize Google OAuth with backend
      const initResponse = await fetch(`${API_BASE_URL}/api/users/auth/google/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirectUri: `${window.location.origin}/auth/callback`,
          mode: mode // 'login' or 'signup'
        }),
      });

      if (!initResponse.ok) {
        const errorData = await initResponse.json();
        throw new Error(errorData.message || 'Failed to initialize Google OAuth');
      }

      const { authUrl, state } = await initResponse.json();
      
      // Step 2: Open Google OAuth in a popup window
      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      const authWindow = window.open(
        authUrl,
        'google_auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Step 3: Listen for the callback
      const handleMessage = (event) => {
        // Security check - only accept messages from same origin
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          const { token, user, isNewUser } = event.data.payload;
          
          if (isNewUser) {
            // New user - show additional info form
            setGoogleSignupData({ ...user, token });
            openAuthModal('google-signup');
          } else {
            // Existing user - complete login
            localStorage.setItem('token', token);
            localStorage.setItem('auth', JSON.stringify(user));
            setUser(user);
            closeAuthModal();
          }
          
          // Clean up
          window.removeEventListener('message', handleMessage);
          if (authWindow) authWindow.close();
        }

        if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          setError(event.data.payload.error || 'Google authentication failed');
          window.removeEventListener('message', handleMessage);
          if (authWindow) authWindow.close();
        }
      };

      window.addEventListener('message', handleMessage);

      // Fallback: Check if window closed without completing auth
      const checkWindow = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkWindow);
          window.removeEventListener('message', handleMessage);
          if (!error) {
            setError('Authentication window closed');
          }
        }
      }, 1000);

    } catch (error) {
      console.error('❌ Google OAuth failed:', error);
      setError(error.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-auth-container">
      <button
        type="button"
        className="google-auth-button"
        onClick={handleGoogleAuth}
        disabled={loading}
      >
        {loading ? (
          <span>Connecting to Google...</span>
        ) : (
          <span>Continue with Google</span>
        )}
      </button>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

// --- Google Signup Form (for setting password after Google OAuth) ---
function GoogleSignupForm({ onClose }) {
  const { completeGoogleSignup, googleSignupData } = useContext(UserContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const valid = passOk(password) && password === confirmPassword;

  async function onSubmit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setErr('');
    setBusy(true);
    
    try {
      await completeGoogleSignup({
        token: googleSignupData.token,
        password,
        phone,
        additionalData: {
          // Add any additional data you want to save
          childAge: '', // You can add a field for this if needed
        }
      });
      onClose();
    } catch (ex) {
      setErr(ex?.message || 'Failed to complete registration.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          ×
        </button>
        
        <header className="auth-modal-header">
          <h2>Complete Your Registration</h2>
          <p className="auth-modal-subtitle">
            Almost there! Please set a password for your account.
          </p>
        </header>

        {/* Show user info from Google */}
        <div className="google-user-info">
          <img 
            src={googleSignupData?.photoURL} 
            alt="Profile" 
            className="google-user-avatar"
          />
          <div className="google-user-details">
            <div className="google-user-name">
              {googleSignupData?.firstName} {googleSignupData?.lastName}
            </div>
            <div className="google-user-email">
              {googleSignupData?.email}
            </div>
          </div>
        </div>

        <form className="auth-modal-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Phone Number (Optional)</span>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="Enter your phone number"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength="8"
              placeholder="Create a password"
            />
          </label>

          <label className="field">
            <span>Confirm Password</span>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              minLength="8"
              placeholder="Confirm your password"
            />
          </label>

          {password !== confirmPassword && confirmPassword && (
            <div className="form-warning">Passwords do not match</div>
          )}

          {err && <div className="form-error">{err}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={!valid || busy}>
              {busy ? 'Creating Account…' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Login Form ---
function LoginForm({ onClose, switchToRegister }) {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const valid = emailOk(email) && pass.length > 0;

  async function onSubmit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setErr('');
    setBusy(true);
    try {
      await login({ email, password: pass });
      onClose();
    } catch (ex) {
      setErr(ex?.message || 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-modal-form" onSubmit={onSubmit}>
      <label className="field">
        <span>Email</span>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </label>

      <label className="field">
        <span>Password</span>
        <input 
          type="password" 
          value={pass} 
          onChange={(e) => setPass(e.target.value)} 
          required 
        />
      </label>

      <div className="forgot-password">
        <Link to="/reset-password" onClick={onClose}>
          Forgot your password?
        </Link>
      </div>

      {err && <div className="form-error">{err}</div>}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={!valid || busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        
        <div className="auth-switch-link">
          Don't have an account?{' '}
          <button type="button" className="link-button" onClick={switchToRegister}>
            Create an account
          </button>
        </div>
      </div>
    </form>
  );
}

// --- Register Form ---
function RegisterForm({ onClose, switchToLogin }) {
  const { register } = useContext(UserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [childAge, setChildAge] = useState('');
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

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
      onClose();
    } catch (ex) {
      setErr(ex?.message || 'Sign up failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-modal-form" onSubmit={onSubmit}>
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
        <span>Child's level</span>
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
          {busy ? 'Creating…' : 'Create Account'}
        </button>
        
        <div className="auth-switch-link">
          Already have an account?{' '}
          <button type="button" className="link-button" onClick={switchToLogin}>
            Sign in
          </button>
        </div>
      </div>
    </form>
  );
}

// Main AuthModal Component
export default function AuthModal() {
  const { 
    authModalOpen, 
    authModalMode, 
    closeAuthModal,
    openAuthModal,
    googleSignupData
  } = useContext(UserContext);

  if (!authModalOpen) return null;

  // If we have Google signup data, show password setup form
  if (authModalMode === 'google-signup' && googleSignupData) {
    return <GoogleSignupForm onClose={closeAuthModal} />;
  }

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={closeAuthModal}>
          ×
        </button>
        
        <header className="auth-modal-header">
          <h2>{authModalMode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="auth-modal-subtitle">
            {authModalMode === 'login'
              ? 'Sign in to track progress, sessions, and rewards.'
              : 'Join to access practice, coaching sessions, and progress tracking.'}
          </p>
        </header>

        {authModalMode === 'login' ? (
          <LoginForm 
            onClose={closeAuthModal} 
            switchToRegister={() => openAuthModal('register')} 
          />
        ) : (
          <RegisterForm 
            onClose={closeAuthModal} 
            switchToLogin={() => openAuthModal('login')} 
          />
        )}

        {/* Google Sign In Button */}
        <div className="google-section">
          <div className="divider">
            <span>or</span>
          </div>
          <div className="google-box">
            <GoogleOAuth mode={authModalMode} />
          </div>
        </div>
      </div>
    </div>
  );
}