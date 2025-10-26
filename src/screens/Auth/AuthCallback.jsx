// src/screens/Auth/AuthCallback.jsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const token = searchParams.get('token');
    const isNewUser = searchParams.get('isNewUser') === 'true';
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const error = searchParams.get('error');

    console.log('AuthCallback received:', {
      success, token, isNewUser, userId, email, firstName, lastName, error
    });

    if (success === 'true' && token) {
      // Send success message back to the main window
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        payload: {
          token,
          isNewUser,
          user: {
            id: userId,
            email,
            firstName,
            lastName
          }
        }
      }, window.location.origin);
    } else if (error) {
      // Send error message back to the main window
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        payload: {
          error: error || 'Authentication failed'
        }
      }, window.location.origin);
    } else {
      // Unknown state
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_ERROR',
        payload: {
          error: 'Unexpected authentication state'
        }
      }, window.location.origin);
    }

    // Close this window after a short delay
    setTimeout(() => {
      if (window.opener) {
        window.close();
      } else {
        // If no opener (direct navigation), redirect to home
        window.location.href = '/';
      }
    }, 1000);

  }, [searchParams]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h3>Completing Authentication...</h3>
        <p>Please wait while we complete your Google authentication.</p>
        <p>This window will close automatically.</p>
      </div>
    </div>
  );
}