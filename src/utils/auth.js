import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';

export const getUserRole = () => {
  const token = Cookies.get('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded || null;
  } catch (err) {
    console.error('Invalid token', err);
    return null;
  }
};

export function getToken() {
    // adjust key if you persist token under a different key
    try {
        const root = localStorage.getItem('persist:root');
        if (!root) return null;
        const parsed = JSON.parse(root);
        const userSlice = parsed.user ? JSON.parse(parsed.user) : null;
        return userSlice?.userDetails?.token || localStorage.getItem('token') || null;
    } catch {
        return localStorage.getItem('token') || null;
    }
}

export function isTokenValid(token) {
    if (!token) return false;
    try {
        // lightweight decode without installing new deps
        const base64 = token.split('.')[1];
        if (!base64) return false;
        const payload = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
        const exp = payload.exp;
        if (typeof exp !== 'number') return false;
        return Date.now() < exp * 1000;
    } catch {
        return false;
    }
}