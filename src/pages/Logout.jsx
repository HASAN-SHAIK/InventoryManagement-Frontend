// src/pages/Logout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUserDetails } from '../store/userSlice';
import Cookies from 'js-cookie';
import api from '../utils/axios';

const Logout = ({setUserDetails, setShowNavbar}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {

    setShowNavbar(false);
  

    // Navigate to login
    navigate('/login');
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Logging out...</span>
        </div>
        <p className="fw-bold text-muted">Logging you out...</p>
      </div>
    </div>
  );
};

export default Logout;