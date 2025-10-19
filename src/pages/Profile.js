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
  const [deactivating, setDeactivating] = useState(false);
  const [deactivateMsg, setDeactivateMsg] = useState('');
  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? You will not be able to log in until reactivated by admin.')) return;
    setDeactivating(true);
    setDeactivateMsg('');
    try {
  await api.put(`/api/users/deactivate/${user.userId}`);
      setDeactivateMsg('Account deactivated. You will be logged out.');
      setTimeout(() => {
        login(null);
        navigate('/');
      }, 1200);
    } catch (err) {
      setDeactivateMsg('Failed to deactivate account.');
    } finally {
      setDeactivating(false);
    }
  };

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

          // Always include contact object with current values for unchanged fields
          const payload = { userId: user.userId };
          if (formData.userFirstName && formData.userFirstName !== user.userFirstName) {
            payload.userFirstName = formData.userFirstName;
          }
          if (formData.userLastName && formData.userLastName !== user.userLastName) {
            payload.userLastName = formData.userLastName;
          }
          // Build contact object with all required fields
          payload.contact = {
            email: formData.userEmail || user.contact?.email || user.userEmail || '',
            phoneNumber: formData.userPhoneNumber || user.contact?.phoneNumber || user.userPhoneNumber || '',
            address: formData.contactAddress || user.contact?.address || '',
            password: user.contact?.password || ''
          };

          console.log('Profile update payload:', payload);
          const res = await api.put('/api/users/update', payload);
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
        <h2>My Account</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          <strong>Status:</strong> {user.active ? <span style={{ color: 'green' }}>Active</span> : <span style={{ color: 'red' }}>Inactive</span>}
        </div>
        {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>First Name</label>
              <input name="userFirstName" value={formData.userFirstName} onChange={handleChange} disabled={deactivating || !user.active} />
              {errors.userFirstName && <div className="error">{errors.userFirstName}</div>}
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input name="userLastName" value={formData.userLastName} onChange={handleChange} disabled={deactivating || !user.active} />
              {errors.userLastName && <div className="error">{errors.userLastName}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="userEmail" value={formData.userEmail} type="email" disabled readOnly />
            {errors.userEmail && <div className="error">{errors.userEmail}</div>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input name="userPhoneNumber" value={formData.userPhoneNumber} onChange={handleChange} disabled={deactivating || !user.active} />
            {errors.userPhoneNumber && <div className="error">{errors.userPhoneNumber}</div>}
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="contactAddress" value={formData.contactAddress} onChange={handleChange} rows={3} disabled={deactivating || !user.active} />
            {errors.contactAddress && <div className="error">{errors.contactAddress}</div>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="userPassword" value={formData.userPassword} disabled readOnly placeholder="Password cannot be changed here" />
            {errors.userPassword && <div className="error">{errors.userPassword}</div>}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')} disabled={deactivating}>Cancel</button>
            <button type="submit" className="btn" disabled={loading || deactivating || !user.active}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
        <hr style={{ margin: '2rem 0' }} />
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-danger" onClick={handleDeactivate} disabled={deactivating || !user.active}>
            {deactivating ? 'Deactivating...' : 'Deactivate My Account'}
          </button>
          {deactivateMsg && <div className={`alert ${deactivateMsg.includes('deactivated') ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1rem' }}>{deactivateMsg}</div>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
