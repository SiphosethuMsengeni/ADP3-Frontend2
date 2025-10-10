import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userFirstName: '',
    userLastName: '',
    userEmail: '',
    userPassword: '',
    userPhoneNumber: '',
    contactAddress: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        userFirstName: user.userFirstName || '',
        userLastName: user.userLastName || '',
        userEmail: user.contact?.email || user.userEmail || '',
        userPassword: '',
        userPhoneNumber: user.contact?.phoneNumber || user.userPhoneNumber || '',
        contactAddress: user.contact?.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    const namePattern = /^[a-zA-Z\s-']{2,50}$/;
    if (!formData.userFirstName || !namePattern.test(formData.userFirstName.trim())) errs.userFirstName = 'First name is required (2-50 letters)';
    if (!formData.userLastName || !namePattern.test(formData.userLastName.trim())) errs.userLastName = 'Last name is required (2-50 letters)';
    if (!formData.userEmail || !/\S+@\S+\.\S+/.test(formData.userEmail.trim())) errs.userEmail = 'A valid email is required';
    const phone = (formData.userPhoneNumber || '').replace(/\s/g, '');
    if (!phone || !/^(\+27|0)[6-8][0-9]{8}$/.test(phone)) errs.userPhoneNumber = 'Enter a valid South African phone number';
    if (!formData.contactAddress || formData.contactAddress.trim().length < 10) errs.contactAddress = 'Address is required (min 10 characters)';
    if (formData.userPassword && (formData.userPassword.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.userPassword))) {
      errs.userPassword = 'Password must be 8+ chars and include upper, lower and a digit';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setMessage('');
    try {
      const payload = {
        userId: user.userId,
        userFirstName: formData.userFirstName,
        userLastName: formData.userLastName,
        userEmail: formData.userEmail,
        userPhoneNumber: formData.userPhoneNumber,
        contact: {
          email: formData.userEmail,
          phoneNumber: formData.userPhoneNumber,
          address: formData.contactAddress
        }
      };
      if (formData.userPassword) {
        payload.userPassword = formData.userPassword;
        payload.contact.password = formData.userPassword;
      }

      const res = await api.put('/users/update', payload);
      // update local auth state with latest user returned by server
      const updated = res.data || res;
      login(updated);
      setMessage('Profile updated successfully');
      setTimeout(() => navigate('/'), 900);
    } catch (err) {
      console.error('Profile update error:', err);
      const body = err?.response?.data;
      // if backend returns validation map
      if (body && typeof body === 'object') {
        setErrors(body);
      } else {
        setMessage('Failed to update profile.');
      }
    } finally { setLoading(false); }
  };

  if (!user) return <div className="container">Please sign in to access your profile.</div>;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 700, margin: '2rem auto' }}>
        <h2>My Profile</h2>
        {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>First Name</label>
              <input name="userFirstName" value={formData.userFirstName} onChange={handleChange} />
              {errors.userFirstName && <div className="error">{errors.userFirstName}</div>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="userLastName" value={formData.userLastName} onChange={handleChange} />
              {errors.userLastName && <div className="error">{errors.userLastName}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="userEmail" value={formData.userEmail} onChange={handleChange} type="email" />
            {errors.userEmail && <div className="error">{errors.userEmail}</div>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input name="userPhoneNumber" value={formData.userPhoneNumber} onChange={handleChange} />
            {errors.userPhoneNumber && <div className="error">{errors.userPhoneNumber}</div>}
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="contactAddress" value={formData.contactAddress} onChange={handleChange} rows={3} />
            {errors.contactAddress && <div className="error">{errors.contactAddress}</div>}
          </div>

          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" name="userPassword" value={formData.userPassword} onChange={handleChange} />
            {errors.userPassword && <div className="error">{errors.userPassword}</div>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
