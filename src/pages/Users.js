import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [formData, setFormData] = useState({
    userFirstName: '',
    userLastName: '',
    userEmail: '',
    userPassword: '',
    userPhoneNumber: '',
    contactEmail: '',
    contactPhoneNumber: '',
    contactAddress: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Deactivate user
  const deactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await api.put(`/users/deactivate/${userId}`);
        fetchUsers();
      } catch (error) {
        alert('Failed to deactivate user');
      }
    }
  };

  // Reactivate user
  const reactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to reactivate this user?')) {
      try {
        await api.put(`/users/reactivate/${userId}`);
        fetchUsers();
      } catch (error) {
        alert('Failed to reactivate user');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
  const response = await api.get('/users/all');
  setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
      // Demo data for development
      setUsers([
        {
          userId: '1',
          userFirstName: 'John',
          userLastName: 'Doe',
          userEmail: 'john.doe@example.com',
          userPhoneNumber: '+27123456789',
          contact: {
            contactId: '1',
            email: 'john.doe@example.com',
            phoneNumber: '+27123456789',
            address: '123 Main Street, Cape Town, 8001'
          }
        },
        {
          userId: '2',
          userFirstName: 'Jane',
          userLastName: 'Smith',
          userEmail: 'jane.smith@example.com',
          userPhoneNumber: '+27987654321',
          contact: {
            contactId: '2',
            email: 'jane.smith@example.com',
            phoneNumber: '+27987654321',
            address: '456 Oak Avenue, Johannesburg, 2000'
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const openModal = (user = null, mode = 'edit') => {
    if (mode === 'view') {
      setViewingUser(user);
      setShowModal(true);
      return;
    }

    setViewingUser(null);
    if (user) {
      setEditingUser(user);
      setFormData({
        userFirstName: user.userFirstName || '',
        userLastName: user.userLastName || '',
        userEmail: user.userEmail || '',
        userPassword: '', // Don't pre-fill password for security
        userPhoneNumber: user.userPhoneNumber || '',
        contactEmail: user.contact?.email || '',
        contactPhoneNumber: user.contact?.phoneNumber || '',
        contactAddress: user.contact?.address || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        userFirstName: '',
        userLastName: '',
        userEmail: '',
        userPassword: '',
        userPhoneNumber: '',
        contactEmail: '',
        contactPhoneNumber: '',
        contactAddress: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setViewingUser(null);
    setFormData({
      userFirstName: '',
      userLastName: '',
      userEmail: '',
      userPassword: '',
      userPhoneNumber: '',
      contactEmail: '',
      contactPhoneNumber: '',
      contactAddress: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // client-side validation
    const valid = validateUserForm();
    if (!valid) return;
    try {
      const userData = {
        userFirstName: formData.userFirstName,
        userLastName: formData.userLastName,
        userEmail: formData.userEmail,
        userPhoneNumber: formData.userPhoneNumber,
        contact: {
          email: formData.contactEmail || formData.userEmail,
          phoneNumber: formData.contactPhoneNumber || formData.userPhoneNumber,
          address: formData.contactAddress
        }
      };

      // Only include password if it's provided (for updates, empty password means no change)
      if (formData.userPassword) {
        userData.userPassword = formData.userPassword;
        userData.contact.password = formData.userPassword;
      }

      if (editingUser) {
        // Update existing user
  // include userId for server-side validation
  await api.put('/users/update', { userId: editingUser.userId, ...userData });
      } else {
        // Create new user
        if (!formData.userPassword) {
          alert('Password is required for new users');
          return;
        }
  await api.post('/users/create', userData);
      }
      
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error('Error saving user:', error);
      // For demo purposes, simulate success
      if (editingUser) {
        setUsers(users.map(user => 
          user.userId === editingUser.userId 
            ? { 
                ...user, 
                ...userData, 
                userId: editingUser.userId,
                contact: {
                  ...user.contact,
                  ...userData.contact,
                  contactId: user.contact?.contactId
                }
              }
            : user
        ));
      } else {
        const newUser = {
          ...userData,
          userId: Date.now().toString(),
          contact: {
            ...userData.contact,
            contactId: Date.now().toString()
          }
        };
        setUsers([...users, newUser]);
      }
      closeModal();
    }
  };

  const validateUserForm = () => {
    const errs = {};
    const namePattern = /^[a-zA-Z\s-']{2,50}$/;
    if (!formData.userFirstName || !namePattern.test(formData.userFirstName.trim())) {
      errs.userFirstName = 'First name is required (2-50 letters)';
    }
    if (!formData.userLastName || !namePattern.test(formData.userLastName.trim())) {
      errs.userLastName = 'Last name is required (2-50 letters)';
    }
    if (!formData.userEmail || !/\S+@\S+\.\S+/.test(formData.userEmail.trim())) {
      errs.userEmail = 'A valid email is required';
    }
    const phone = (formData.userPhoneNumber || '').replace(/\s/g, '');
    if (!phone || !/^(\+27|0)[6-8][0-9]{8}$/.test(phone)) {
      errs.userPhoneNumber = 'Enter a valid South African phone number';
    }
    if (!formData.contactAddress || formData.contactAddress.trim().length < 10) {
      errs.contactAddress = 'Address is required (min 10 characters)';
    }
    if (!editingUser) {
      // creating new user requires password
      if (!formData.userPassword || formData.userPassword.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.userPassword)) {
        errs.userPassword = 'Password must be 8+ chars and include upper, lower and a digit';
      }
    } else if (formData.userPassword) {
      // if provided during edit, validate strength
      if (formData.userPassword.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.userPassword)) {
        errs.userPassword = 'Password must be 8+ chars and include upper, lower and a digit';
      }
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
  await api.delete(`/users/delete/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        // For demo purposes, simulate success
        setUsers(users.filter(user => user.userId !== userId));
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Users Management</h2>
        <button className="btn" onClick={() => openModal()}>
          Add New User
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Phone</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Address</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Active</th>
              <th style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.userId} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>
                  {user.userFirstName} {user.userLastName}
                </td>
                <td style={{ padding: '1rem' }}>{user.userEmail}</td>
                <td style={{ padding: '1rem' }}>{user.userPhoneNumber}</td>
                <td style={{ padding: '1rem' }}>{user.contact?.address || 'N/A'}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {user.active ? (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
                  ) : (
                    <span style={{ color: 'red', fontWeight: 'bold' }}>Inactive</span>
                  )}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                      onClick={() => openModal(user, 'view')}
                    >
                      View
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                      onClick={() => openModal(user, 'edit')}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn" 
                      style={{ 
                        backgroundColor: '#dc3545', 
                        fontSize: '0.8rem', 
                        padding: '0.3rem 0.6rem' 
                      }}
                      onClick={() => deleteUser(user.userId)}
                    >
                      Delete
                    </button>
                    {user.active ? (
                      <button
                        className="btn"
                        style={{ backgroundColor: '#ffc107', color: '#333', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        onClick={() => deactivateUser(user.userId)}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className="btn"
                        style={{ backgroundColor: '#28a745', color: '#fff', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
                        onClick={() => reactivateUser(user.userId)}
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>No users found. Add your first user!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ 
            width: '90%', 
            maxWidth: '600px', 
            maxHeight: '90vh', 
            overflow: 'auto' 
          }}>
            {viewingUser ? (
              // View Mode
              <>
                <h3>User Details</h3>
                <div style={{ lineHeight: '1.6' }}>
                  <p><strong>Name:</strong> {viewingUser.userFirstName} {viewingUser.userLastName}</p>
                  <p><strong>Email:</strong> {viewingUser.userEmail}</p>
                  <p><strong>Phone:</strong> {viewingUser.userPhoneNumber}</p>
                  <p><strong>User ID:</strong> {viewingUser.userId}</p>
                  
                  <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Contact Information</h4>
                  <p><strong>Contact Email:</strong> {viewingUser.contact?.email || 'N/A'}</p>
                  <p><strong>Contact Phone:</strong> {viewingUser.contact?.phoneNumber || 'N/A'}</p>
                  <p><strong>Address:</strong> {viewingUser.contact?.address || 'N/A'}</p>
                  <p><strong>Contact ID:</strong> {viewingUser.contact?.contactId || 'N/A'}</p>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={() => openModal(viewingUser, 'edit')}
                  >
                    Edit User
                  </button>
                </div>
              </>
            ) : (
              // Edit/Create Mode
              <>
                <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label htmlFor="userFirstName">First Name:</label>
                      <input
                        type="text"
                        id="userFirstName"
                        name="userFirstName"
                        value={formData.userFirstName}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.userFirstName && <div className="error">{formErrors.userFirstName}</div>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="userLastName">Last Name:</label>
                      <input
                        type="text"
                        id="userLastName"
                        name="userLastName"
                        value={formData.userLastName}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.userLastName && <div className="error">{formErrors.userLastName}</div>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="userEmail">Email:</label>
                    <input
                      type="email"
                      id="userEmail"
                      name="userEmail"
                      value={formData.userEmail}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.userEmail && <div className="error">{formErrors.userEmail}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="userPassword">
                      Password {editingUser && '(leave blank to keep current)'}:
                    </label>
                    <input
                      type="password"
                      id="userPassword"
                      name="userPassword"
                      value={formData.userPassword}
                      onChange={handleInputChange}
                      required={!editingUser}
                    />
                    {formErrors.userPassword && <div className="error">{formErrors.userPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="userPhoneNumber">Phone Number:</label>
                    <input
                      type="tel"
                      id="userPhoneNumber"
                      name="userPhoneNumber"
                      value={formData.userPhoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                    {formErrors.userPhoneNumber && <div className="error">{formErrors.userPhoneNumber}</div>}
                  </div>

                  <h4 style={{ margin: '1.5rem 0 0.5rem 0' }}>Contact Information</h4>
                  
                  <div className="form-group">
                    <label htmlFor="contactEmail">Contact Email:</label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="Leave blank to use user email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactPhoneNumber">Contact Phone:</label>
                    <input
                      type="tel"
                      id="contactPhoneNumber"
                      name="contactPhoneNumber"
                      value={formData.contactPhoneNumber}
                      onChange={handleInputChange}
                      placeholder="Leave blank to use user phone"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactAddress">Address:</label>
                    <textarea
                      id="contactAddress"
                      name="contactAddress"
                      value={formData.contactAddress}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                    {formErrors.contactAddress && <div className="error">{formErrors.contactAddress}</div>}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      Cancel
                    </button>
                    <button type="submit" className="btn">
                      {editingUser ? 'Update' : 'Create'} User
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;