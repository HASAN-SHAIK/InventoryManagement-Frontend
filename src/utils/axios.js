import axios from 'axios';
import { getToken, isTokenValid } from './auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || '/',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (!isTokenValid(token)) {
    try {
      localStorage.removeItem('persist:root');
      localStorage.removeItem('token');
    } catch (e) {}
    // stop the request and force login page
    window.location.replace('/login');
    return Promise.reject(new axios.Cancel('Token expired or invalid'));
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

export default api;