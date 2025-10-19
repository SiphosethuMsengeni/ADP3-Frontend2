import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAdmin } = useAuth();
  const [formData, setFormData] = useState({ 
    email: 'admin@snuggleread.ac.za', 
    password: 'admin123' 
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      console.log('Attempting admin login with:', { email: formData.email, password: '***' });
      const response = await authService.login(formData.email, formData.password, 'admin');
      console.log('Login response:', response);
      
      const userObj = response.user ? response.user : response;
      if (response.token) localStorage.setItem('authToken', response.token);
      if (userObj) {
        login(userObj);
        console.log('User logged in:', userObj);
        if (userObj.role && userObj.role.toUpperCase() === 'ADMIN') {
          setMessage('Login successful! Redirecting to admin dashboard...');
          // Immediate navigation to admin dashboard
          setTimeout(() => {
            navigate('/admin');
          }, 500);
        } else {
          setMessage(`You are not an admin. Role: ${userObj.role}. Please use the student login page.`);
        }
      }
    } catch (err) {
      console.error('Admin login error:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
      }
      if (err.response && err.response.status === 401) {
        setMessage('Invalid admin credentials');
      } else if (err.response && err.response.status === 403) {
        setMessage('Access denied. This login is for administrators only.');
      } else {
        setMessage(`Login failed: ${err.message || 'Please try again later.'}`);
      }
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
        
        {/* Debug info */}
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '0.9em' }}>
          <strong>Admin Credentials for Testing:</strong><br/>
          Email: admin@snuggleread.ac.za<br/>
          Password: admin123<br/>
          <small>API URL: http://localhost:8081/bookstore</small>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
