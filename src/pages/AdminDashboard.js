import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [salesData, setSalesData] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    pages: '',
    genre: '',
    quantity: '',
    price: '',
    image: null
  });

  const genres = [
    'Academic Textbooks',
    'Science & Technology', 
    'Literature & Fiction',
    'Business & Economics',
    'History & Politics',
    'Arts & Culture',
    'Health & Medicine',
    'Engineering'
  ];

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchBooks();
  }, [isAdmin, navigate]);

  const generateSalesReport = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reports/sales');
      const data = res.data || {};

      // Map backend response into the shape expected by the UI. Backend currently returns
      // { totalRevenue, totalQuantitySold, topBooks } — fill remaining fields with sensible defaults.
      const report = {
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0,
        totalQuantitySold: data.totalQuantitySold || 0,
        totalDiscountsGiven: data.totalDiscountsGiven || 0,
        averageOrderValue: data.averageOrderValue || 0,
        topBooks: (data.topBooks || []).map(b => ({
          title: b.title,
          quantitySold: b.quantitySold || 0,
          revenue: b.revenue || 0,
          author: b.author || '',
          genre: b.genre || ''
        })),
        revenueByGenre: data.revenueByGenre || [],
        ordersByStatus: data.ordersByStatus || {},
        ordersToday: data.ordersToday || 0,
        ordersThisWeek: data.ordersThisWeek || 0,
        ordersThisMonth: data.ordersThisMonth || 0
      };

      setSalesData(report);
      setShowReports(true);
    } catch (error) {
      console.error('Error fetching sales report:', error);
      alert('Error fetching sales report. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
  const response = await api.get('/book/all');
  setBooks(response.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      // Do not populate demo data — show empty list and surface the error so admins can see failures
      setBooks([]);
      if (error.response) {
        alert(`Failed to fetch books: ${error.response.status} ${error.response.statusText}`);
      } else {
        alert('Failed to fetch books. Is the backend running? See console for details.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Small sub-component to render book cover with placeholder + fade-in
  const BookImage = ({ book }) => {
    const [loaded, setLoaded] = useState(false);
    const [errored, setErrored] = useState(false);
    const src = book.bookId ? `/bookstore/api/book/${book.bookId}/image` : null;
    return (
      <div style={{ position: 'relative', width: '100%', height: '180px', background: '#f4f4f4', overflow: 'hidden' }}>
        {!loaded && !errored && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            filter: 'blur(6px)', background: 'linear-gradient(135deg,#eee,#ddd)'
          }}>
            <div style={{ color: '#bbb' }}>Loading cover...</div>
          </div>
        )}
        {src && !errored && (
          <img
            src={src}
            alt={book.title}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: loaded ? 1 : 0, transition: 'opacity 300ms ease-in'
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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title || '',
        author: book.author || '',
        pages: book.pages?.toString() || '',
        genre: book.genre || '',
        quantity: book.quantity?.toString() || '',
        price: book.price?.toString() || '',
        image: null
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Client-side validation: ensure numeric fields are valid before sending
      const pages = parseInt(formData.pages, 10);
      const quantity = parseInt(formData.quantity, 10);
      const price = parseFloat(formData.price);

      if (!formData.title || !formData.author) {
        alert('Please provide both title and author.');
        setLoading(false);
        return;
      }
      if (!formData.genre) {
        alert('Please select a genre.');
        setLoading(false);
        return;
      }
      if (!Number.isFinite(pages) || pages <= 0) {
        alert('Please enter a valid number of pages.');
        setLoading(false);
        return;
      }
      if (!Number.isFinite(quantity) || quantity < 0) {
        alert('Please enter a valid quantity (0 or more).');
        setLoading(false);
        return;
      }
      if (!Number.isFinite(price) || price < 0) {
        alert('Please enter a valid price (0 or more).');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', String(formData.title));
      formDataToSend.append('author', String(formData.author));
      formDataToSend.append('pages', String(pages));
      formDataToSend.append('genre', String(formData.genre));
      formDataToSend.append('quantity', String(quantity));
      formDataToSend.append('price', String(price));
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Debug: log formData entries for inspection in console
      try {
        console.log('Prepared FormData to send:');
        for (let pair of formDataToSend.entries()) {
          console.log(pair[0]+ ':', pair[1]);
        }
      } catch (e) {
        console.log('Could not enumerate FormData', e);
      }

      if (editingBook) {
        // Update existing book
        await api.put('/book/update', {
          bookId: editingBook.bookId,
          title: formData.title,
          author: formData.author,
          pages: parseInt(formData.pages),
          genre: formData.genre,
          quantity: parseInt(formData.quantity),
          price: parseFloat(formData.price)
        });
      } else {
        // Create new book
        const res = await api.post('/book/create', formDataToSend);
        console.log('Create book response:', res.status, res.data);
      }
      
      fetchBooks();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving book:', error);
      // If server provided a response, surface it to the admin for debugging
      if (error.response) {
        const status = error.response.status;
        const statusText = error.response.statusText || '';
        // Try to extract a helpful message from the response body
        let body = '';
        try {
          body = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
        } catch (e) {
          body = String(error.response.data);
        }

        if (status === 401) {
          alert('Not authenticated. Please log in as admin.');
          return;
        }
        if (status === 403) {
          alert('Forbidden. Your account does not have permission to perform this action.');
          return;
        }

        alert(`Error saving book: ${status} ${statusText}\n${body}`);
        return;
      }

      // Network or other error without response
      alert(`Error saving book: ${error.message || 'Unknown error'}. See console for details.`);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/book/delete/${bookId}`);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        if (error.response) {
          if (error.response.status === 401) {
            alert('Not authenticated. Please log in as admin.');
            return;
          }
          if (error.response.status === 403) {
            alert('Forbidden. Your account does not have permission to delete books.');
            return;
          }
        }
        alert('Error deleting book. See console for details.');
      }
    }
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>📚 Admin Dashboard - Snuggle Read</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={generateSalesReport}>
            📊 Generate Sales Report
          </button>
          <button className="btn btn-success" onClick={() => openModal()}>
            ➕ Add New Book
          </button>
        </div>
      </div>

      <div className="admin-grid">
        <div className="card">
          <h3>📊 Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2a5298' }}>
                {books.length}
              </div>
              <div>Total Books</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
                {books.reduce((sum, book) => sum + (book.quantity || 0), 0)}
              </div>
              <div>Total Stock</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>📖 Genre Distribution</h3>
          <div style={{ marginTop: '1rem' }}>
            {genres.slice(0, 4).map(genre => {
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

      {loading && <div className="loading">Loading books...</div>}

      <div className="books-grid">
        {books.map(book => (
          <div key={book.bookId} className="book-card">
            <BookImage book={book} />
            <div className="book-content">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <div className="book-genre">{book.genre}</div>
              <p><strong>Pages:</strong> {book.pages}</p>
              <p className={`book-stock ${book.quantity < 5 ? 'stock-low' : ''}`}>
                <strong>Stock:</strong> {book.quantity} copies
              </p>
              <div className="book-price">R{book.price?.toFixed(2)}</div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button 
                  className="btn btn-warning btn-small" 
                  onClick={() => openModal(book)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger btn-small"
                  onClick={() => deleteBook(book.bookId)}
                >
                  Delete
                </button>
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">Author:</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="pages">Pages:</label>
                  <input
                    type="number"
                    id="pages"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity:</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="genre">Genre:</label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

                <div className="form-group">
                  <label htmlFor="price">Price (R):</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="image">Book Cover Image:</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                    style={{
                      padding: '0.5rem',
                      border: '2px dashed #ddd',
                      borderRadius: '5px',
                      background: '#f9f9f9'
                    }}
                  />
                  <small style={{ color: '#7f8c8d', display: 'block', marginTop: '0.25rem' }}>
                    Upload a cover image for the book (JPG, PNG, GIF supported)
                  </small>
                  {formData.image && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <strong>📎 Selected:</strong> {formData.image.name}
                    </div>
                  )}
                </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? 'Saving...' : (editingBook ? 'Update Book' : 'Add Book')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales Report Modal */}
      {showReports && salesData && (
        <div className="modal-overlay" onClick={() => setShowReports(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>📊 Sales Report & Analytics</h2>
              <button className="btn btn-secondary" onClick={() => setShowReports(false)}>
                ✕ Close
              </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #3498db, #2980b9)' }}>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>📦 Total Orders</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{salesData.totalOrders}</div>
                <small style={{ color: '#ecf0f1' }}>
                  Today: {salesData.ordersToday} | Week: {salesData.ordersThisWeek} | Month: {salesData.ordersThisMonth}
                </small>
              </div>
              
              <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #27ae60, #229954)' }}>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>💰 Total Revenue</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>R{salesData.totalRevenue.toFixed(2)}</div>
                <small style={{ color: '#d5f4e6' }}>
                  Avg Order: R{salesData.averageOrderValue.toFixed(2)}
                </small>
              </div>
              
              <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>📚 Books Sold</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{salesData.totalQuantitySold}</div>
                <small style={{ color: '#fdebd0' }}>
                  Total quantity across all orders
                </small>
              </div>
              
              <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #9b59b6, #8e44ad)' }}>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>🎓 Student Savings</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>R{salesData.totalDiscountsGiven.toFixed(2)}</div>
                <small style={{ color: '#e8daef' }}>
                  Total discounts given to students
                </small>
              </div>
            </div>

            {/* Top Books */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>📈 Top Selling Books</h3>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {salesData.topBooks.length > 0 ? (
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
                          <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>
                            {book.quantitySold}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#27ae60' }}>
                            R{book.revenue.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
                    No sales data available yet. Start selling books to see analytics!
                  </p>
                )}
              </div>
            </div>

            {/* Revenue by Genre */}
            <div className="card">
              <h3>🎭 Revenue by Genre</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {salesData.revenueByGenre.length > 0 ? (
                  salesData.revenueByGenre.map((genreData, index) => (
                    <div key={index} style={{ 
                      padding: '1rem', 
                      border: '1px solid #dee2e6', 
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)'
                    }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>{genreData.genre}</h4>
                      <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#27ae60' }}>
                        R{genreData.revenue.toFixed(2)}
                      </div>
                      <small style={{ color: '#6c757d' }}>
                        {genreData.quantity} books sold
                      </small>
                    </div>
                  ))
                ) : (
                  <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
                    No genre data available yet.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center' }}>
              <button 
                className="btn btn-success"
                onClick={() => {
                  const reportText = `
SNUGGLE READ - SALES REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY:
Total Orders: ${salesData.totalOrders}
Total Revenue: R${salesData.totalRevenue.toFixed(2)}
Books Sold: ${salesData.totalQuantitySold}
Student Discounts: R${salesData.totalDiscountsGiven.toFixed(2)}
Average Order Value: R${salesData.averageOrderValue.toFixed(2)}

TOP BOOKS:
${salesData.topBooks.map((book, i) => `${i+1}. ${book.title} - ${book.quantitySold} sold - R${book.revenue.toFixed(2)}`).join('\n')}

REVENUE BY GENRE:
${salesData.revenueByGenre.map(g => `${g.genre}: R${g.revenue.toFixed(2)} (${g.quantity} books)`).join('\n')}
                  `;
                  navigator.clipboard.writeText(reportText);
                  alert('Sales report copied to clipboard!');
                }}
              >
                📋 Copy Report
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  const data = JSON.stringify(salesData, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `snuggle-read-sales-report-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                💾 Export Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;