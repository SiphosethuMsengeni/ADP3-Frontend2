import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './HeaderEnhanced.css';





const HeaderEnhanced = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);

  const genres = [
    'Fiction', 'Academic', 'Science', 'History', 'Biography', 
    'Mystery', 'Romance', 'Fantasy', 'Horror', 'Poetry',
    'Drama', 'Philosophy', 'Psychology', 'Business', 'Technology',
    'Health', 'Cookbook', 'Travel', 'Children', 'Young Adult'
  ];

  const [logoLoaded, setLogoLoaded] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGenreSelect = (genre) => {
    navigate(`/books?genre=${genre}`);
    setGenreDropdownOpen(false);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header-enhanced">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="container">
          <div className="top-nav-left">
            <span className="welcome-text">
              Welcome to Snuggle Read - Your University Bookstore
            </span>
          </div>
          <div className="top-nav-right">
            
             <Link to="/books" className="nav-link browse-link">
    📘 Browse Books
  </Link>
            <div className="contact-info">
              <span>📞 +27 21 460 3911</span>
              <span>✉️ info@snuggleread.ac.za</span>
            </div>
            
            {user ? (
              <div className="user-menu">
                <span>Welcome, {user.firstName}</span>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="main-nav">
        <div className="container">
          <div className="nav-left">
            <Link to="/" className="logo">
              <img src="/BookIcon.png" alt="Snuggle Read Icon" className="book-logo-icon" />
              <span className="logo-text">Snuggle Read</span>
            </Link>
          </div>

          <div className="nav-center">
            <nav className="main-menu">
              <Link to="/" className="nav-item">Home</Link>
              {/* If current user is admin (store manager), show manager links instead of shopper nav */}
              {user?.role && user.role.toUpperCase() === 'ADMIN' ? (
                <>
                  <Link to="/admin" className="nav-item">Manager Dashboard</Link>
                  <Link to="/admin/orders" className="nav-item">Manage Orders</Link>
                </>
              ) : (
                <Link to="/books" className="nav-item">Shop Books</Link>
              )}
              {/* Genre Dropdown */}
              <div className="dropdown" onMouseLeave={() => setGenreDropdownOpen(false)}>
                <button 
                  className="nav-item dropdown-toggle"
                  onMouseEnter={() => setGenreDropdownOpen(true)}
                  onClick={() => setGenreDropdownOpen(!genreDropdownOpen)}
                >
                  Genres ▼
                </button>
                {genreDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-grid">
                      {genres.map(genre => (
                        <button
                          key={genre}
                          className="dropdown-item"
                          onClick={() => handleGenreSelect(genre)}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/about" className="nav-item">About</Link>
              <Link to="/contact" className="nav-item">Contact</Link>
              
              {user?.isAdmin && (
                <Link to="/admin" className="nav-item admin-link">Admin</Link>
              )}
            </nav>
          </div>

          <div className="nav-right">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search books..." 
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>
            {/* If user is admin (store manager), show Add Book button instead of cart */}
            {user?.role && user.role.toUpperCase() === 'ADMIN' ? (
              <Link to="/admin" className="add-book-btn" title="Manager: Add Book">
                ➕ Add Book
              </Link>
            ) : (
              <Link to="/cart" className="cart-link">
                <span className="cart-icon">🛒</span>
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bottom-nav">
        <div className="container">
          <div className="quick-links">
            <Link to="/books?category=new-arrivals" className="quick-link">New Arrivals</Link>
            <Link to="/books?category=bestsellers" className="quick-link">Best Sellers</Link>
            <Link to="/books?category=discounted" className="quick-link">Discounted Books</Link>
            <Link to="/books?category=textbooks" className="quick-link">Textbooks</Link>
            <Link to="/orders" className="quick-link">My Orders</Link>
          </div>
          <div className="announcement">
            <span className="announcement-text">
              🎓 Student Discount: 15% off all textbooks! Use code STUDENT15
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderEnhanced;
