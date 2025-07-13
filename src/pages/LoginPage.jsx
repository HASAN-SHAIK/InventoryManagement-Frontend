import { useState } from 'react';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login/Login';

const LoginPage = ({ setShowNavbar}) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/login', form); // cookie is auto-stored
      setShowNavbar(true);
      navigate('/dashboard'); // redirect on success
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Login setShowNavbar={setShowNavbar}/>
    // <div className="container mt-5">
    //   <h2>Login</h2>
    //   {error && <div className="alert alert-danger">{error}</div>}
    //   <form onSubmit={handleSubmit}>
    //     <div className="mb-3">
    //       <label>Email</label>
    //       <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
    //     </div>
    //     <div className="mb-3">
    //       <label>Password</label>
    //       <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
    //     </div>
    //     <button className="btn btn-primary">Login</button>
    //   </form>
    // </div>
  );
};

export default LoginPage;