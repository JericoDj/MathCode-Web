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

// Working Frontend Google OAuth Component
const GoogleOAuth = () => {
  const { setUser, closeAuthModal } = useContext(UserContext);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      // Check if client ID is available
      if (!GOOGLE_CLIENT_ID) {
        console.error('Google Client ID is missing. Please check your environment variables.');
        return;
      }

      // Load Google Identity Services
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          // Render the button
          if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(googleButtonRef.current, {
              theme: 'outline',
              size: 'large',
              width: 400,
              text: 'signin_with',
              logo_alignment: 'left',
            });
          }
        }
      };

      script.onerror = () => {
        console.error('Failed to load Google Sign-In script');
      };

      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    };

    initializeGoogleSignIn();
  }, []);

  const handleCredentialResponse = async (response) => {
  try {
    console.log('Google sign-in successful, sending token to backend...');
    
    // Send the Google credential to your backend
    const result = await fetch('http://localhost:4000/api/users/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: response.credential,
      }),
    });

    if (result.ok) {
      const data = await result.json();
      console.log(data);
      
      // Store token and update user state
      localStorage.setItem('token', JSON.stringify(data.token));
         localStorage.setItem('auth', JSON.stringify(data.user));
      setUser(data.user);
      closeAuthModal();
      
      console.log('Google authentication completed successfully!');
    } else {
      // If backend fails, simulate login with test users
    }
  } catch (error) {
    console.error('Google authentication failed:', error);
    // If there's an error, simulate login with test users
    await simulateLogin(response);
  }
};


  return (
    <div>
      {GOOGLE_CLIENT_ID ? (
        <div ref={googleButtonRef}></div>
      ) : (
        <div style={{ 
          padding: '10px', 
          background: '#ffebee', 
          border: '1px solid #f44336',
          borderRadius: '4px',
          textAlign: 'center',
          color: '#c62828'
        }}>
          Google Sign-In is not configured. Please check your environment variables.
        </div>
      )}
    </div>
  );
};


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
          <LoginForm onClose={closeAuthModal} switchToRegister={() => openAuthModal('register')} />
        ) : (
          <RegisterForm onClose={closeAuthModal} switchToLogin={() => openAuthModal('login')} />
        )}

        {/* Google Sign In Button */}
        <div className="google-section">
          <div className="divider">
            <span>or</span>
          </div>
          <div className="google-box">
               < GoogleOAuth />

          </div>
       
        </div>
      </div>
    </div>
  );
}

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
      await completeGoogleSignup(password, phone);
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