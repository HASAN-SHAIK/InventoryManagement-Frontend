import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserDetails } from '../../store/userSlice';
import { getToken, isTokenValid } from '../../utils/auth';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.userDetails);
  const token = user?.token || getToken();

  if (!isTokenValid(token)) {
    dispatch(clearUserDetails());
    // also clear persisted raw token keys to avoid immediate rehydration
    try { localStorage.removeItem('token'); } catch {}
    try { localStorage.removeItem('persist:root'); } catch {}
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;