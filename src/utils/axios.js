import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // adjust to your backend base URL
  withCredentials: true, // send cookies
});

export default api;