import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService, handleAPIError } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('shop'); // 'shop' or 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');

    try {
      const response = await authService.login(formData.email, formData.password, tab === 'admin' ? 'admin' : 'customer');

      // response may be { user, token } or a raw user object (backend returns User)
      const userObj = response.user ? response.user : response;
      // Store token if provided
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }

      if (userObj) {
        login(userObj);
        
        // Check if logging in via admin tab
        if (tab === 'admin') {
          if (userObj.role && userObj.role.toUpperCase() === 'ADMIN') {
            setMessage('Admin login successful! Redirecting to dashboard...');
            setTimeout(() => {
              navigate('/admin');
            }, 500);
          } else {
            setMessage('Invalid admin credentials. Please check your login details.');
          }
        } else {
          // Regular customer login
          setMessage('Login successful!');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Login error (raw):', error);
      // Use shared API error formatter to get a helpful message for the user
      // Handle different error statuses
      if (error.response && error.response.status === 401) {
        setMessage('Invalid credentials or account not found. Please register first.');
      } else if (error.response && error.response.status === 403) {
        setMessage('Admin accounts must use the Admin login tab.');
      } else {
        const friendly = handleAPIError(error);
        setMessage(friendly);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '520px', margin: '2rem auto', padding: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <h2 style={{ marginBottom: '0.25rem' }}>Snuggle Reads</h2>
          <p style={{ marginTop: 0, color: '#7f8c8d' }}>Where every book feels like a warm hug</p>
        </div>

        {/* Tab selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={() => { setTab('shop'); setFormData(f => ({ ...f, userType: 'customer' })); }}
            className={`btn ${tab === 'shop' ? 'active' : 'secondary'}`}>
            Shop Books
          </button>
          <button onClick={() => { setTab('admin'); setFormData(f => ({ ...f, userType: 'admin' })); }}
            className={`btn ${tab === 'admin' ? 'active' : 'secondary'}`}>
            Admin
          </button>
        </div>
        
        {message && (
          <div className={`alert ${message.includes('Invalid') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '0 1rem' }}>
            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={tab === 'admin' ? 'admin@example.com' : 'your.university@domain.ac.za'}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password && <div className="error">{errors.password}</div>}
            </div>

            <button 
              type="submit" 
              className="btn"
              disabled={isLoading}
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {isLoading ? 'Signing In...' : (tab === 'admin' ? '🔐 Admin Sign In' : '🔐 Sign In')}
            </button>
          </div>
        </form>

        {tab === 'shop' && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p>Don't have an account? 
              <Link to="/register" style={{ marginLeft: '0.5rem', color: '#2a5298', textDecoration: 'none', fontWeight: 'bold' }}>
                Create Student Account
              </Link>
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
          <p>🔒 Your data is secure with Snuggle Read</p>
          <p>📚 Access thousands of academic resources</p>
        </div>
      </div>
    </div>
  );
};

export default Login;