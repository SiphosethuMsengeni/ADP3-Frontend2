import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>📚 Snuggle Read</h1>
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          
          {isAuthenticated() ? (
            <>
              {isAdmin() ? (
                <>
                  <Link to="/admin">Manager Dashboard</Link>
                </>
              ) : (
                <>
                  <Link to="/orders">My Orders</Link>
                  <Link to="/cart" className="cart-icon">
                    🛒
                    {getCartItemCount() > 0 && (
                      <span className="cart-count">{getCartItemCount()}</span>
                    )}
                  </Link>
                </>
              )}
              <div className="user-info">
                <span>Welcome, {user.userFirstName || 'User'}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-small">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;