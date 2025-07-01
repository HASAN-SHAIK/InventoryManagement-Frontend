import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api', // adjust to your backend base URL
  withCredentials: true, // send cookies
});

export default api;