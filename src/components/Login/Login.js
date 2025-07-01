// src/pages/Login/Login.js

import React, { useState } from 'react';
import './Login.css';
import api from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setShowNavbar }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/login', form); // Set-Cookie works if backend handles it
      setShowNavbar(true);
      setIsLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Hasan Inventory</h2>
      <div className="floating-shape logincube green"></div>
      <div className="floating-shape logincircle red"></div>
        {error && <div className="alert text-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className='form-label'>Email</label>
          <input
            className='form-control loginzindex'
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />

          <label className='form-label'>Password</label>
          <input
            className='form-control loginpasswordinput'
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••"
            style={{zIndex: '1000 !important'}}
          />
         <div className="floating-shape loginring orange"></div>
          <button style={{zIndex: 1000}} type="submit" className='letsgo'>{ isLoading ? <div class="spinner-border text-primary" role="status"></div> : `Let's Go`}</button>
        </form>
      </div>

      {/* Floating decorative shapes */}
      <div className="floating-shape circle red"></div>
      <div className="floating-shape triangle purple"></div>
      <div className="floating-shape square yellow"></div>
      <div className="floating-shape wave pink"></div>
      <div className="floating-shape ring orange"></div>
      <div className="floating-shape cube green"></div>
    </div>
  );
};

export default Login;