import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // your configured axios instance

const genres = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Mathematics',
  'History',
  'Biography',
  'Fantasy',
  'Romance',
  'Mystery',
  'Programming'
];

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Books state
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageRefresh, setImageRefresh] = useState(Date.now());

  // Users state
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  // Modal & form state
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    pages: '',
    genre: '',
    quantity: '',
    price: '',
    image: null
  });

  // Sales report
  const [showReports, setShowReports] = useState(false);
  const [salesData, setSalesData] = useState(null);

  // Basic permission redirect
  useEffect(() => {
    if (!isAdmin) {
      navigate('/'); // or another safe page for non-admins
    }
  }, [isAdmin, navigate]);

  // initial books load
  useEffect(() => {
    fetchBooks();
  }, []);

  // ---------- Books CRUD ----------
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/book/all'); // adjust as needed
      setBooks(res.data || []);
      setImageRefresh(Date.now()); // Refresh image cache
    } catch (err) {
      console.error('Failed to fetch books', err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title || '',
        author: book.author || '',
        pages: book.pages || '',
        genre: book.genre || '',
        quantity: book.quantity || '',
        price: book.price || '',
        image: null // don't prefill file inputs
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        pages: '',
        genre: '',
        quantity: '',
        price: '',
        image: null
      });
    }
    setShowModal(true);
  };

  const deleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/api/book/delete/${bookId}`);
      await fetchBooks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete book');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('author', formData.author);
    payload.append('pages', formData.pages);
    payload.append('genre', formData.genre);
    payload.append('quantity', formData.quantity);
    payload.append('price', formData.price);

    if (formData.image) {
      payload.append('image', formData.image);
    }

    try {
      setLoading(true);
      if (editingBook) {
        // update - send as JSON since backend expects @RequestBody
        const updateData = {
          bookId: editingBook.bookId,
          title: formData.title,
          author: formData.author,
          pages: parseInt(formData.pages),
          genre: formData.genre,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price),
          // Keep existing image data for now
          image: editingBook.image,
          imageContentType: editingBook.imageContentType
        };
        await api.put('/api/book/update', updateData, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        // If there's a new image, upload it separately
        if (formData.image) {
          const imageFormData = new FormData();
          imageFormData.append('image', formData.image);
          await api.post(`/api/book/${editingBook.bookId}/upload-image`, imageFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        
        alert('Book updated successfully');
      } else {
        // create
        await api.post('/api/book/create', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Book added successfully');
      }
      setShowModal(false);
      setEditingBook(null);
      await fetchBooks();
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  // ---------- Users CRUD ----------
  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError('');
    try {
      const res = await api.get('/api/users/all');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setUsers([]);
      setUsersError('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const deactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      await api.put(`/api/users/deactivate/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Failed to deactivate user');
    }
  };

  const reactivateUser = async (userId) => {
    if (!window.confirm('Are you sure you want to reactivate this user?')) return;
    try {
      await api.put(`/api/users/reactivate/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Failed to reactivate user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/users/delete/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Failed to delete user');
    }
  };

  // ---------- Sales Report ----------
  const generateSalesReport = async () => {
    try {
      const res = await api.get('/reports/sales'); // adjust path
      setSalesData(res.data || null);
      setShowReports(true);
    } catch (err) {
      console.error('Failed to get sales report', err);
      alert('Failed to generate sales report');
    }
  };

  // ---------- Small helper - image preview component ----------
  const BookImage = ({ book }) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);

    // Only show image if the book has image data (imageContentType indicates image exists)
    const hasImage = book.imageContentType;
    const src = hasImage && book.bookId ? `http://localhost:8081/bookstore/api/book/${book.bookId}/image?t=${imageRefresh}` : null;

    if (!src) {
      return (
        <div style={{ width: '140px', height: '200px', background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#bbb', textAlign: 'center' }}>📚<br/>{book.title}</div>
        </div>
      );
    }

    return (
      <div style={{ width: '140px', height: '200px', position: 'relative', background: '#f4f4f4' }}>
        {!errored && (
          <img
            src={src}
            alt={book.title}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 300ms ease-in'
            }}
          />
        )}
        {errored && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>📚<br/>{book.title}</div>
          </div>
        )}
      </div>
    );
  };

  // ---------- Render ----------
  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>📚 Admin Dashboard - Snuggle Read</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={generateSalesReport}>📊 Generate Sales Report</button>
          <button className="btn btn-outline" onClick={() => navigate('/admin/orders')}>🗂️ Manage Orders</button>
          <button className="btn btn-outline" onClick={() => { setShowUsers(true); fetchUsers(); }}>👥 Manage Users</button>
          <button className="btn btn-success" onClick={() => openModal()}>➕ Add New Book</button>
        </div>
      </div>

      {/* Users Modal */}
      {showUsers && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '90%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto', position: 'relative', padding: '1rem' }}>
            <h3>👥 Users Management</h3>
            <button className="btn btn-secondary" style={{ position: 'absolute', top: 10, right: 10 }} onClick={() => setShowUsers(false)}>Close</button>
            {usersLoading ? (
              <div className="loading">Loading users...</div>
            ) : usersError ? (
              <div className="alert alert-error">{usersError}</div>
            ) : (
              <div className="table-container" style={{ overflowX: 'auto', marginTop: '1rem' }}>
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
                        <td style={{ padding: '1rem' }}>{user.userFirstName} {user.userLastName}</td>
                        <td style={{ padding: '1rem' }}>{user.userEmail}</td>
                        <td style={{ padding: '1rem' }}>{user.userPhoneNumber}</td>
                        <td style={{ padding: '1rem' }}>{user.contact?.address || 'N/A'}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          {user.active ? <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span> : <span style={{ color: 'red', fontWeight: 'bold' }}>Inactive</span>}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }} onClick={() => alert('Edit user not implemented in dashboard. Use Users page for full edit.')}>Edit</button>
                            {user.active ? (
                              <button className="btn" style={{ backgroundColor: '#ffc107', color: '#333', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }} onClick={() => deactivateUser(user.userId)}>Deactivate</button>
                            ) : (
                              <button className="btn" style={{ backgroundColor: '#28a745', color: '#fff', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }} onClick={() => reactivateUser(user.userId)}>Reactivate</button>
                            )}
                            <button className="btn" style={{ backgroundColor: '#dc3545', color: '#fff', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }} onClick={() => deleteUser(user.userId)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p style={{ padding: '1rem' }}>No users found.</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <h3>📊 Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2a5298' }}>{books.length}</div>
              <div>Total Books</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>{books.reduce((sum, book) => sum + (Number(book.quantity) || 0), 0)}</div>
              <div>Total Stock</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h3>📖 Genre Distribution</h3>
          <div style={{ marginTop: '1rem' }}>
            {genres.slice(0, 6).map(genre => {
              const count = books.filter(book => book.genre === genre).length;
              return (
                <div key={genre} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>{genre}</span>
                  <span style={{ fontWeight: 'bold', color: '#2a5298' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Book grid */}
      {loading && <div className="loading">Loading books...</div>}

      <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        {books.map(book => (
          <div key={book.bookId} className="book-card" style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
            <BookImage book={book} />
            <div className="book-content" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 className="book-title" style={{ margin: 0 }}>{book.title}</h3>
              <p className="book-author" style={{ margin: '0.25rem 0' }}>by {book.author}</p>
              <div className="book-genre" style={{ marginBottom: '0.5rem' }}>{book.genre}</div>
              <p style={{ margin: 0 }}><strong>Pages:</strong> {book.pages}</p>
              <p className={`book-stock ${book.quantity < 5 ? 'stock-low' : ''}`} style={{ marginTop: '0.5rem' }}>
                <strong>Stock:</strong> {book.quantity} copies
              </p>
              <div className="book-price" style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>R{(Number(book.price) || 0).toFixed(2)}</div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button className="btn btn-warning btn-small" onClick={() => openModal(book)}>Edit</button>
                <button className="btn btn-danger btn-small" onClick={() => deleteBook(book.bookId)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No books in inventory</h3>
          <p>Start by adding your first book to the collection!</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10003, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '20px' }} onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ width: '90%', maxWidth: '700px', maxHeight: '85vh', background: '#fff', padding: '1.5rem', borderRadius: '8px', marginTop: '20px', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
              </div>

              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <label htmlFor="author">Author:</label>
                <input type="text" id="author" name="author" value={formData.author} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="pages">Pages:</label>
                  <input type="number" id="pages" name="pages" value={formData.pages} onChange={handleInputChange} min="1" required style={{ width: '100%', padding: '0.5rem' }} />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity:</label>
                  <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} min="0" required style={{ width: '100%', padding: '0.5rem' }} />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label htmlFor="genre">Genre:</label>
                <select id="genre" name="genre" value={formData.genre} onChange={handleInputChange} required style={{ width: '100%', padding: '0.5rem' }}>
                  <option value="">Select a genre</option>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label htmlFor="price">Price (R):</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} step="0.01" min="0" required style={{ width: '100%', padding: '0.5rem' }} />
              </div>

              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label htmlFor="image">Book Cover Image:</label>
                <input type="file" id="image" name="image" accept="image/*" onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files[0] || null }))} style={{ display: 'block', marginTop: '0.5rem' }} />
                {formData.image && <div style={{ marginTop: '0.5rem' }}><strong>📎 Selected:</strong> {formData.image.name}</div>}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingBook(null); }} disabled={loading}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={loading}>{loading ? 'Saving...' : (editingBook ? 'Update Book' : 'Add Book')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales Report Modal */}
      {showReports && salesData && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowReports(false)}>
          <div className="modal" style={{ width: '95%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', background: '#fff', padding: '1rem', borderRadius: '8px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>📊 Sales Report & Analytics</h2>
              <button className="btn btn-secondary" onClick={() => setShowReports(false)}>✕ Close</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                <h3>📦 Total Orders</h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{salesData.totalOrders}</div>
                <small>Today: {salesData.ordersToday} | Week: {salesData.ordersThisWeek} | Month: {salesData.ordersThisMonth}</small>
              </div>

              <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                <h3>💰 Total Revenue</h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>R{(salesData.totalRevenue || 0).toFixed(2)}</div>
                <small>Avg Order: R{(salesData.averageOrderValue || 0).toFixed(2)}</small>
              </div>

              <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                <h3>📚 Books Sold</h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{salesData.totalQuantitySold}</div>
                <small>Total quantity across all orders</small>
              </div>

              <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                <h3>💰 Revenue Growth</h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  R{salesData.averageOrderValue ? salesData.averageOrderValue.toFixed(2) : '0.00'}
                </div>
                <small>Average order value</small>
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
              <h3>📈 Top Selling Books</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {salesData.topBooks && salesData.topBooks.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Book</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center' }}>Quantity Sold</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.topBooks.map((book, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                          <td style={{ padding: '0.75rem' }}>
                            <strong>{book.title}</strong><br />
                            <small style={{ color: '#6c757d' }}>by {book.author} • {book.genre}</small>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>{book.quantitySold}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#27ae60' }}>R{(book.revenue || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>No sales data available yet.</p>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
              <h3>🎭 Revenue by Genre</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {salesData.revenueByGenre && salesData.revenueByGenre.length > 0 ? (
                  salesData.revenueByGenre.map((g, i) => (
                    <div key={i} style={{ padding: '1rem', border: '1px solid #dee2e6', borderRadius: '8px', background: '#fff' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>{g.genre}</h4>
                      <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>R{(g.revenue || 0).toFixed(2)}</div>
                      <small style={{ color: '#6c757d' }}>{g.quantity} books sold</small>
                    </div>
                  ))
                ) : (
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6c757d', padding: '1rem' }}>No genre data available yet.</p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-success" onClick={() => {
                const reportText = `
SNUGGLE READ - SALES REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY:
Total Orders: ${salesData.totalOrders}
Total Revenue: R${(salesData.totalRevenue || 0).toFixed(2)}
Books Sold: ${salesData.totalQuantitySold}
Average Order Value: R${(salesData.averageOrderValue || 0).toFixed(2)}

TOP BOOKS:
${(salesData.topBooks || []).map((b, i) => `${i+1}. ${b.title} - ${b.quantitySold} sold - R${(b.revenue || 0).toFixed(2)}`).join('\n')}

REVENUE BY GENRE:
${(salesData.revenueByGenre || []).map(g => `${g.genre}: R${(g.revenue || 0).toFixed(2)} (${g.quantity} books)`).join('\n')}
                `;
                navigator.clipboard.writeText(reportText);
                alert('Sales report copied to clipboard!');
              }}>📋 Copy Report</button>

              <button className="btn btn-outline" onClick={() => {
                const data = JSON.stringify(salesData, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `snuggle-read-sales-report-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}>💾 Export Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
