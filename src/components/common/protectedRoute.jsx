import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../../utils/axios';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    api.get('/auth/login')
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;