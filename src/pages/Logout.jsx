// src/pages/Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUserDetails } from '../store/userSlice';
import Cookies from 'js-cookie';
import api from '../utils/axios';
import LoadingSpinner from '../components/common/LoadingSpinner/LoadingSpinner';
import { clearOrderDetails } from '../store/orderSlice';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {

    const logoutUser = async () => {
    try{
      const response = await api.post('/auth/logout');
      dispatch(clearUserDetails());
      dispatch(clearOrderDetails());
      Cookies.remove('token');
    }
    catch (error) {
      alert('Logout failed. Please try again.');
       console.error('Logout error:', error);
    }
    finally {
      navigate('/');
    }
  }
    logoutUser();
    // Navigate to login
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <LoadingSpinner />
        <p className="fw-bold text-muted">Logging you out...</p>
      </div>
    </div>
  );
};

export default Logout;