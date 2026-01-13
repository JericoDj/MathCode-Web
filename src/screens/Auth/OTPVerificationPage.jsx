import { useContext, useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';
import './OTPVerification.css';

export default function OTPVerificationPage() {
  const { resetPasswordWithOTP, requestPasswordReset } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { email, purpose = 'password-reset' } = location.state || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split('').slice(0, 6);
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
      inputRefs.current[Math.min(newOtp.length, 5)].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setErr('Please enter the complete 6-digit code');
      return;
    }

    if (password.length < 8) {
      setErr('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErr('Passwords do not match');
      return;
    }

    setBusy(true);
    setErr('');

    try {
      await resetPasswordWithOTP(email, otpString, password);
      
      // Redirect to login on success
      navigate('/login', { 
        state: { 
          message: 'Password reset successfully! Please login with your new password.' 
        } 
      });
    } catch (error) {
      setErr(error.message || 'Invalid verification code or password reset failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || busy) return;

    setBusy(true);
    setErr('');

    try {
      await requestPasswordReset(email);
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setPassword('');
      setConfirmPassword('');
      inputRefs.current[0].focus();
    } catch (error) {
      setErr(error.message || 'Failed to resend code. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <main className="otp-verification">
      <div className="otp-container">
        <div className="otp-card">
          <header className="otp-header">
            <div className="otp-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
              </svg>
            </div>
            <h1>Reset Your Password</h1>
            <p className="otp-subtitle">
              Enter the 6-digit code sent to <strong>{email}</strong> and your new password
            </p>
          </header>

          <form className="otp-form" onSubmit={handleSubmit}>
            <div className="otp-inputs-container">
              <label className="otp-label">Verification Code</label>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="otp-input"
                    autoFocus={index === 0}
                    disabled={busy}
                  />
                ))}
              </div>
            </div>

            <div className="password-fields">
              <div className="form-group">
                <label htmlFor="newPassword" className="otp-label">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  minLength="8"
                  required
                  disabled={busy}
                  className="password-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="otp-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength="8"
                  required
                  disabled={busy}
                  className="password-input"
                />
              </div>
            </div>

            {err && <div className="otp-error" role="alert">{err}</div>}

            <button 
              type="submit" 
              className="otp-submit-btn"
              disabled={busy || otp.join('').length !== 6 || password.length < 8 || password !== confirmPassword}
            >
              {busy ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="otp-resend">
            <p>
              Didn't receive the code?{' '}
              {canResend ? (
                <button 
                  type="button" 
                  className="otp-resend-btn"
                  onClick={handleResend}
                  disabled={busy}
                >
                  Resend code
                </button>
              ) : (
                <span className="otp-countdown">
                  Resend in {countdown}s
                </span>
              )}
            </p>
          </div>

          <footer className="otp-footer">
            <Link to="/forgot-password" className="otp-back-link">
              ← Back to forgot password
            </Link>
          </footer>
        </div>

        
      </div>
    </main>
  );
}