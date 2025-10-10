import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await authService.login(formData.email, formData.password, 'admin');
      const userObj = response.user ? response.user : response;
      if (response.token) localStorage.setItem('authToken', response.token);
      if (userObj) {
        login(userObj);
        if (userObj.role && userObj.role.toUpperCase() === 'ADMIN') {
          navigate('/admin');
        } else {
          setMessage('You are not an admin. Please use a student account or contact support.');
        }
      }
    } catch (err) {
      if (err.response && err.response.status === 401) setMessage('Invalid admin credentials');
      else setMessage('Login failed. Please try again later.');
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center' }}>Admin Sign In</h2>
        {message && <div className={`alert ${message.includes('Invalid') ? 'alert-error' : 'alert-success'}`}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
