// screens/Auth/LogoutPage.jsx
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext.jsx';
import AuthController from '../../controllers/AuthController.jsx';

export default function LogoutPage() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const ctrl = new AuthController();
      await ctrl.logout();
      setUser(null);
      navigate('/?signed_out=1', { replace: true });
    })();
  }, [setUser, navigate]);

  return null;
}
