import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './HeaderEnhanced.css';
import logo from '../assets/logo.svg';

const HeaderEnhanced = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header-enhanced">
      {/* === Top Navigation Bar === */}
      <div className="top-nav">
        <div className="container">
          <div className="top-nav-left">
            <span className="welcome-text">
              Welcome to Snuggle Read - Your University Bookstore
            </span>
          </div>
          <div className="top-nav-right">
            <div className="contact-info">
              <span>📞 +27 21 460 3911</span>
              <span>✉️ info@snuggleread.ac.za</span>
            </div>
            {user ? (
              <div className="user-menu">
                <span>Welcome, {user.userFirstName || user.firstName}</span>
                <Link to="/profile" className="nav-link">My Account</Link>
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

      {/* === Main Navigation Bar === */}
      <div className="main-nav">
        <div className="container">
          <div className="nav-left">
            <Link to="/" className="logo">
              {logoLoaded && (
                <img
                  src={logo}
                  alt="Snuggle Read"
                  className="logo-img"
                  onError={() => setLogoLoaded(false)}
                />
              )}
              <span className="logo-text">Snuggle Read</span>
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
              {user?.role && user.role.toUpperCase() === 'ADMIN' ? (
                <>
                  <Link to="/admin" className="nav-item">Manager Dashboard</Link>
                  <Link to="/admin/orders" className="nav-item">Manage Orders</Link>
                </>
              ) : (
                <Link to="/books" className="nav-item">Shop Books</Link>
              )}
              <Link to="/about" className="nav-item" onClick={() => setMenuOpen(false)}>About</Link>
              <Link to="/contact" className="nav-item" onClick={() => setMenuOpen(false)}>Contact</Link>
              <Link to="/orders" className="nav-item">My Orders</Link>
              {user?.isAdmin && (
                <Link
                  to="/admin"
                  className="nav-item admin-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* === Cart Icon / Admin Button === */}
          <div className="nav-right">
            {user?.role && user.role.toUpperCase() === 'ADMIN' ? (
              <Link to="/admin" className="add-book-btn" title="Manager: Add Book" />
            ) : (
              <Link to="/cart" className="cart-link" title="View Cart">
                <span className="cart-icon">🛒</span>
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderEnhanced;
