import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './HeaderEnhanced.css';

const HeaderEnhanced = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);

  const genres = [
    'Fiction', 'Non-Fiction', 'Science', 'Mathematics', 'History', 
    'Biography', 'Fantasy', 'Romance', 'Mystery', 'Programming'
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGenreSelect = (genre) => {
    navigate(`/books?genre=${genre}`);
    setGenreDropdownOpen(false);
    setMenuOpen(false);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = (searchTerm || '').trim();
    if (!q) {
      // If empty, navigate to books list
      navigate('/books');
      setMenuOpen(false);
      return;
    }
    // encode and navigate with query param
    navigate(`/books?search=${encodeURIComponent(q)}`);
    setMenuOpen(false);
  };

  return (
    <header className="header-enhanced">
      {/* Main Navigation Bar */}
      <div className="main-nav">
        <div className="container">
          <div className="nav-left">
            <Link to="/" className="logo">
              <img 
                src="/images/book-stack-logo.svg" 
                alt="Snuggle Read" 
                className="logo-img"
              />
              <div className="logo-content">
                <span className="logo-text">Snuggle Read</span>
                <span className="logo-slogan">Fuelling brilliant minds, one course at a time.</span>
              </div>
            </Link>
            {/* Mobile menu toggle */}
            <button
              className={`menu-toggle ${menuOpen ? 'open' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="main-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="hamburger" />
            </button>
          </div>

          <div className="nav-center">
            <nav id="main-menu" className={`main-menu ${menuOpen ? 'open' : ''}`}>
              <Link to="/" className="nav-item">Home</Link>
              {/* If current user is admin (store manager), show manager links instead of shopper nav */}
              {user?.role && user.role.toUpperCase() === 'ADMIN' ? (
                <>
                  <Link to="/admin" className="nav-item">Manager Dashboard</Link>
                  <Link to="/admin/orders" className="nav-item">Manage Orders</Link>
                </>
              ) : (
                <Link to="/books" className="nav-item">Shop books</Link>
              )}

              <Link to="/about" className="nav-item" onClick={() => setMenuOpen(false)}>About</Link>
              {!isAdmin() && (
                <Link to="/orders" className="nav-item" onClick={() => setMenuOpen(false)}>My Orders</Link>
              )}
              
              {user?.isAdmin && (
                <Link to="/admin" className="nav-item admin-link" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
            </nav>
          </div>

          <div className="nav-right">
            {/* Cart link (Add Book button removed) */}
            <Link to="/cart" className="cart-link">
              <span className="cart-icon">🛒</span>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
            
            {/* Auth buttons or user menu */}
            {user ? (
              <div className="user-menu-main">
                <span className="welcome-user">Welcome, {user.userFirstName || user.firstName}</span>
                <Link to="/profile" className="profile-btn">My Account</Link>
                <button onClick={handleLogout} className="logout-btn-main">Logout</button>
              </div>
            ) : (
              <div className="auth-buttons-main">
                <Link to="/login" className="auth-btn-main login-btn-main">Login</Link>
                <Link to="/register" className="auth-btn-main register-btn-main">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Hidden for Admin users */}
      {!isAdmin() && (
        <div className="bottom-nav">
          <div className="container">
            <div className="announcement">
              <span className="announcement-text">
                📚 Welcome to Snuggle Read - Your University Bookstore!
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderEnhanced;
