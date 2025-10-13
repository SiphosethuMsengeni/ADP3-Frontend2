import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingBook, setUploadingBook] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const { addToCart } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const genres = [
    'all',
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
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, selectedGenre, searchTerm, sortBy]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
  const response = await api.get('/book/all');
  setBooks(response.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      // Demo data for development
      setBooks([
        {
          bookId: 1,
          title: 'Introduction to Computer Science',
          author: 'John Smith',
          pages: 450,
          genre: 'Academic Textbooks',
          quantity: 25,
          price: 599.99
        },
        {
          bookId: 2,
          title: 'Data Structures and Algorithms',
          author: 'Jane Doe',
          pages: 680,
          genre: 'Science & Technology',
          quantity: 15,
          price: 749.99
        },
        {
          bookId: 3,
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          pages: 432,
          genre: 'Literature & Fiction',
          quantity: 20,
          price: 299.99
        },
        {
          bookId: 4,
          title: 'Business Strategy Essentials',
          author: 'Michael Porter',
          pages: 520,
          genre: 'Business & Economics',
          quantity: 12,
          price: 899.99
        },
        {
          bookId: 5,
          title: 'World History: A Global Perspective',
          author: 'William Henderson',
          pages: 780,
          genre: 'History & Politics',
          quantity: 8,
          price: 1299.99
        },
        {
          bookId: 6,
          title: 'Digital Art Fundamentals',
          author: 'Sarah Chen',
          pages: 320,
          genre: 'Arts & Culture',
          quantity: 18,
          price: 649.99
        },
        {
          bookId: 7,
          title: 'Calculus: Early Transcendentals',
          author: 'James Stewart',
          pages: 1344,
          genre: 'Academic Textbooks',
          quantity: 30,
          price: 1599.99
        },
        {
          bookId: 8,
          title: 'Machine Learning Fundamentals',
          author: 'Andrew Chen',
          pages: 520,
          genre: 'Science & Technology',
          quantity: 22,
          price: 999.99
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(book =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'author':
          return a.author.localeCompare(b.author);
        case 'genre':
          return a.genre.localeCompare(b.genre);
        default: // title
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredBooks(filtered);
  };

  const handleAddToCart = (book) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (book.quantity > 0) {
      addToCart(book, 1);
      // Show success message or animation
      const button = document.getElementById(`add-to-cart-${book.bookId}`);
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Added! ✓';
        button.disabled = true;
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 1500);
      }
    }
  };

  const handleBuyNow = (book) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (book.quantity > 0) {
      addToCart(book, 1);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        Loading our amazing book collection...
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h2>📚 Snuggle Read Book Collection</h2>
        <p>Discover your next favorite read from our curated university collection</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="search">Search Books:</label>
            <input
              type="text"
              id="search"
              placeholder="Search by title, author, or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="sort">Sort By:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title">Title (A-Z)</option>
              <option value="author">Author</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="genre">Genre</option>
            </select>
          </div>
        </div>
      </div>

      {/* Genre Filters */}
      <div className="genre-filters">
        {genres.map(genre => (
          <button
            key={genre}
            className={`genre-filter ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre === 'all' ? 'All Books' : genre}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
        Showing {filteredBooks.length} of {books.length} books
        {selectedGenre !== 'all' && ` in ${selectedGenre}`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {filteredBooks.map(book => (
          <div key={book.bookId} className="book-card">
            <div className="book-image">
              {/**
               * If the backend has stored image content type (or image bytes), request the image
               * from the API and render it. Fall back to the orange placeholder if no image or
               * the image fails to load.
               */}
              {(book.imageContentType || book.image) && !imageErrors[book.bookId] ? (
                <img
                  src={`${api.defaults.baseURL.replace(/\/$/, '')}/book/${book.bookId}/image`}
                  alt={book.title}
                  style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block', borderRadius: '8px 8px 0 0' }}
                  onError={() => setImageErrors(prev => ({ ...prev, [book.bookId]: true }))}
                />
              ) : (
                <div style={{ padding: '2.5rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
                  <span style={{ fontSize: '1.15rem', textAlign: 'center', color: '#fff', display: 'block' }}>📚 {book.title}</span>
                </div>
              )}
            </div>
            <div className="book-content">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">by {book.author}</p>
              <div className="book-genre">{book.genre}</div>
              <p><strong>Pages:</strong> {book.pages}</p>
              <div className={`book-stock ${book.quantity === 0 ? 'out-of-stock' : book.quantity < 5 ? 'stock-low' : 'stock-good'}`}>
                {book.quantity === 0 ? (
                  <span>❌ Unavailable</span>
                ) : book.quantity < 5 ? (
                  <span>⚠️ Only {book.quantity} left</span>
                ) : (
                  <span>✅ {book.quantity} available</span>
                )}
              </div>
              <div className="book-price">R{book.price?.toFixed(2)}</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                {book.quantity > 0 ? (
                  <>
                    <button 
                      id={`add-to-cart-${book.bookId}`}
                      className="btn btn-success btn-small" 
                      onClick={() => handleAddToCart(book)}
                    >
                      🛒 Add to Cart
                    </button>
                    <button 
                      className="btn btn-small" 
                      onClick={() => handleBuyNow(book)}
                    >
                      ⚡ Buy Now
                    </button>
                  </>
                ) : (
                  <button className="btn btn-secondary btn-small" disabled>
                    Out of Stock
                  </button>
                )}
                {isAdmin() && (
                  <button
                    className="btn btn-outline btn-small"
                    onClick={() => {
                      setUploadingBook(book);
                      setUploadFile(null);
                      setShowUploadModal(true);
                    }}
                  >
                    📤 Upload Cover
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No books found</h3>
          <p>
            {searchTerm 
              ? `No books match your search "${searchTerm}"`
              : selectedGenre !== 'all' 
                ? `No books available in ${selectedGenre} genre`
                : 'Our book collection is being updated'
            }
          </p>
          {(searchTerm || selectedGenre !== 'all') && (
            <button 
              className="btn" 
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('all');
              }}
            >
              Show All Books
            </button>
          )}
        </div>
      )}

      {!isAuthenticated() && (
        <div className="card" style={{ marginTop: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)' }}>
          <h3>Want to purchase books?</h3>
          <p>Create an account or login to add books to your cart and make purchases.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button className="btn" onClick={() => navigate('/register')}>
              Create Account
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </div>
      )}

      {/* Upload Cover Modal for students/admins */}
      {showUploadModal && uploadingBook && isAdmin() && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Upload Cover for "{uploadingBook.title}"</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!uploadFile) { alert('Please select an image file.'); return; }
              const fd = new FormData();
              fd.append('image', uploadFile);
              try {
                const res = await api.post(`/book/${uploadingBook.bookId}/upload-image`, fd);
                alert('Image uploaded successfully.');
                setShowUploadModal(false);
                // Refresh books list to show new cover
                fetchBooks();
              } catch (err) {
                console.error('Upload error', err);
                if (err.response) {
                  alert(`Upload failed: ${err.response.status} ${err.response.statusText}`);
                } else {
                  alert('Upload failed. See console for details.');
                }
              }
            }}>
              <div className="form-group">
                <input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files[0])} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;