import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, handleAPIError } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    userFirstName: '',
    userLastName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    userPhoneNumber: '',
    studentNumber: '',
    address: ''
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

  const validateField = (name, value) => {
    // validate a single field and update errors state for immediate feedback
    const v = (value ?? formData[name] ?? '').toString().trim();
    let message = '';

    switch (name) {
      case 'userFirstName':
        if (!v) message = 'First name is required and cannot be empty';
        else if (v.length < 2) message = 'First name must be at least 2 characters';
        else if (v.length > 50) message = 'First name cannot exceed 50 characters';
        else if (!/^[a-zA-Z\s-']+$/.test(v)) message = 'First name can only contain letters, spaces, hyphens, and apostrophes';
        break;
      case 'userLastName':
        if (!v) message = 'Last name is required and cannot be empty';
        else if (v.length < 2) message = 'Last name must be at least 2 characters';
        else if (v.length > 50) message = 'Last name cannot exceed 50 characters';
        else if (!/^[a-zA-Z\s-']+$/.test(v)) message = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
        break;
      case 'userEmail':
        if (!v) message = 'University email is required and cannot be empty';
        else if (!/\S+@\S+\.\S+/.test(v)) message = 'Please enter a valid email address';
        else if (!v.toLowerCase().includes('.ac.za')) message = 'Please use your university email address (.ac.za domain required)';
        break;
      case 'userPassword':
        if (!v) message = 'Password is required and cannot be empty';
        else if (v.length < 8) message = 'Password must be at least 8 characters long';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v)) message = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        break;
      case 'confirmPassword':
        if (!v) message = 'Please confirm your password';
        else if (formData.userPassword !== v) message = 'Passwords do not match';
        break;
      case 'userPhoneNumber':
        if (!v) message = 'Phone number is required and cannot be empty';
        else if (!/^(\+27|0)[6-8][0-9]{8}$/.test(v.replace(/\s/g, ''))) message = 'Please enter a valid South African phone number (e.g., +27 81 234 5678 or 081 234 5678)';
        break;
      case 'studentNumber':
        if (!v) message = 'Student number is required and cannot be empty';
        else if (!/^\d{6,10}$/.test(v)) message = 'Student number must be 6-10 digits with no spaces or letters';
        break;
      case 'address':
        if (!v) message = 'Residential address is required and cannot be empty';
        else if (v.length < 10) message = 'Please provide a complete address (minimum 10 characters)';
        else if (v.length > 200) message = 'Address cannot exceed 200 characters';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: message }));
    return !message;
  };

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.userFirstName || !formData.userFirstName.trim()) {
      newErrors.userFirstName = 'First name is required and cannot be empty';
    } else if (formData.userFirstName.trim().length < 2) {
      newErrors.userFirstName = 'First name must be at least 2 characters';
    } else if (formData.userFirstName.trim().length > 50) {
      newErrors.userFirstName = 'First name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.userFirstName.trim())) {
      newErrors.userFirstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Last name validation
    if (!formData.userLastName || !formData.userLastName.trim()) {
      newErrors.userLastName = 'Last name is required and cannot be empty';
    } else if (formData.userLastName.trim().length < 2) {
      newErrors.userLastName = 'Last name must be at least 2 characters';
    } else if (formData.userLastName.trim().length > 50) {
      newErrors.userLastName = 'Last name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.userLastName.trim())) {
      newErrors.userLastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Email validation
    if (!formData.userEmail || !formData.userEmail.trim()) {
      newErrors.userEmail = 'University email is required and cannot be empty';
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail.trim())) {
      newErrors.userEmail = 'Please enter a valid email address';
    } else if (!formData.userEmail.trim().toLowerCase().includes('.ac.za')) {
      newErrors.userEmail = 'Please use your university email address (.ac.za domain required)';
    }

    // Password validation
    if (!formData.userPassword || formData.userPassword.length === 0) {
      newErrors.userPassword = 'Password is required and cannot be empty';
    } else if (formData.userPassword.length < 8) {
      newErrors.userPassword = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.userPassword)) {
      newErrors.userPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword || formData.confirmPassword.length === 0) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.userPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone number validation
    if (!formData.userPhoneNumber || !formData.userPhoneNumber.trim()) {
      newErrors.userPhoneNumber = 'Phone number is required and cannot be empty';
    } else if (!/^(\+27|0)[6-8][0-9]{8}$/.test(formData.userPhoneNumber.replace(/\s/g, ''))) {
      newErrors.userPhoneNumber = 'Please enter a valid South African phone number (e.g., +27 81 234 5678 or 081 234 5678)';
    }

    // Student number validation
    if (!formData.studentNumber || !formData.studentNumber.trim()) {
      newErrors.studentNumber = 'Student number is required and cannot be empty';
    } else if (!/^\d{6,10}$/.test(formData.studentNumber.trim())) {
      newErrors.studentNumber = 'Student number must be 6-10 digits with no spaces or letters';
    }

    // Address validation
    if (!formData.address || !formData.address.trim()) {
      newErrors.address = 'Residential address is required and cannot be empty';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address (minimum 10 characters)';
    } else if (formData.address.trim().length > 200) {
      newErrors.address = 'Address cannot exceed 200 characters';
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
      const registrationData = {
        userFirstName: formData.userFirstName,
        userLastName: formData.userLastName,
        userEmail: formData.userEmail,
        userPassword: formData.userPassword,
        userPhoneNumber: formData.userPhoneNumber,
        studentNumber: formData.studentNumber,
        contact: {
          email: formData.userEmail,
          phoneNumber: formData.userPhoneNumber,
          address: formData.address,
          password: formData.userPassword
        }
      };

      const response = await userService.create(registrationData);
      
      // Registration successful - redirect to login
      setMessage('Registration successful! Welcome to Snuggle Read! Please log in with your new account.');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setMessage(handleAPIError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>🎓 Join Snuggle Read</h2>
          <p>Create your student account and start your reading journey</p>
        </div>
        
        {message && (
          <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="userFirstName">First Name: <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                id="userFirstName"
                name="userFirstName"
                value={formData.userFirstName}
                onChange={handleChange}
                onBlur={(e) => validateField('userFirstName', e.target.value)}
                placeholder="Enter your first name"
                required
                minLength="2"
                maxLength="50"
                aria-required="true"
              />
              {errors.userFirstName && <div className="error">{errors.userFirstName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="userLastName">Last Name: <span style={{color: 'red'}}>*</span></label>
              <input
                type="text"
                id="userLastName"
                name="userLastName"
                value={formData.userLastName}
                onChange={handleChange}
                onBlur={(e) => validateField('userLastName', e.target.value)}
                placeholder="Enter your last name"
                required
                minLength="2"
                maxLength="50"
                aria-required="true"
              />
              {errors.userLastName && <div className="error">{errors.userLastName}</div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userEmail">University Email: <span style={{color: 'red'}}>*</span></label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              onBlur={(e) => validateField('userEmail', e.target.value)}
              placeholder="student@university.ac.za"
              required
              aria-required="true"
            />
            {errors.userEmail && <div className="error">{errors.userEmail}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="studentNumber">Student Number: <span style={{color: 'red'}}>*</span></label>
            <input
              type="text"
              id="studentNumber"
              name="studentNumber"
              value={formData.studentNumber}
              onChange={handleChange}
              onBlur={(e) => validateField('studentNumber', e.target.value)}
              placeholder="Your 6-10 digit student number"
              required
              aria-required="true"
            />
            {errors.studentNumber && <div className="error">{errors.studentNumber}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="userPhoneNumber">Phone Number: <span style={{color: 'red'}}>*</span></label>
            <input
              type="tel"
              id="userPhoneNumber"
              name="userPhoneNumber"
              value={formData.userPhoneNumber}
              onChange={handleChange}
              onBlur={(e) => validateField('userPhoneNumber', e.target.value)}
              placeholder="+27 XX XXX XXXX"
              required
              aria-required="true"
            />
            {errors.userPhoneNumber && <div className="error">{errors.userPhoneNumber}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Residential Address: <span style={{color: 'red'}}>*</span></label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={(e) => validateField('address', e.target.value)}
              placeholder="Your complete residential address for delivery"
              rows="3"
              required
              aria-required="true"
            />
            {errors.address && <div className="error">{errors.address}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="userPassword">Password: <span style={{color: 'red'}}>*</span></label>
              <input
                type="password"
                id="userPassword"
                name="userPassword"
                value={formData.userPassword}
                onChange={handleChange}
                onBlur={(e) => validateField('userPassword', e.target.value)}
                placeholder="Create a secure password"
                required
                aria-required="true"
              />
              {errors.userPassword && <div className="error">{errors.userPassword}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password: <span style={{color: 'red'}}>*</span></label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={(e) => validateField('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                required
                aria-required="true"
              />
              {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn"
            disabled={isLoading}
            style={{ width: '100%', marginBottom: '1rem' }}
            aria-disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : '🎓 Create Student Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p>Already have an account? 
            <Link to="/login" style={{ marginLeft: '0.5rem', color: '#2a5298', textDecoration: 'none', fontWeight: 'bold' }}>
              Sign In Here
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="card" style={{ 
          marginTop: '2rem', 
          background: 'linear-gradient(135deg, #e8f5e8, #f0f8ff)',
          border: '2px solid #27ae60'
        }}>
          <h4 style={{ marginBottom: '1rem', color: '#27ae60' }}>🎁 Student Benefits</h4>
          <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
            ✅ 5% automatic student discount on all purchases<br />
            📚 Access to exclusive academic titles<br />
            🚚 Free shipping on orders over R500<br />
            📱 Digital access to select e-books<br />
            🔄 Easy returns and exchanges<br />
            💬 Priority customer support
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#7f8c8d' }}>
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
          <p>🔒 Your information is secure and will never be shared with third parties.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;