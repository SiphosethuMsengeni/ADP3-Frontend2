import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { contactService } from '../services/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email.' });
      return;
    }
    try {
      await contactService.create({ email, message: 'Newsletter subscription' });
      setStatus({ type: 'success', message: 'Subscribed — check your inbox!' });
      setEmail('');
    } catch (err) {
      console.warn('Newsletter subscribe failed, saving locally', err);
      // Fallback: save to localStorage for later sync
      const subs = JSON.parse(localStorage.getItem('snuggleReadSubscriptions') || '[]');
      subs.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem('snuggleReadSubscriptions', JSON.stringify(subs));
      setStatus({ type: 'success', message: 'Subscribed locally (offline). We will sync when online.' });
      setEmail('');
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div className="footer-section">
            <h4>Snuggle Read</h4>
            <p>Your university bookstore — textbooks, academic titles and more.</p>
            <div className="contact">
              <div>📞 +27 21 460 3911</div>
              <div>✉️ info@snuggleread.ac.za</div>
            </div>
          </div>

          <div className="footer-section">
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/books?category=new-arrivals">New Arrivals</Link></li>
              <li><Link to="/books?category=bestsellers">Best Sellers</Link></li>
              <li><Link to="/books?category=textbooks">Textbooks</Link></li>
              <li><Link to="/books?category=discounted">Discounted</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h5>Student Resources</h5>
            <ul>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section newsletter">
            <h5>Stay Updated</h5>
            <p>Get student deals and new arrivals in your inbox.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Your university email" aria-label="email" />
              <button className="btn" type="submit">Subscribe</button>
            </form>
            {status && (
              <div style={{ marginTop: '0.5rem', color: status.type === 'error' ? '#e74c3c' : '#27ae60' }}>{status.message}</div>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <div>© {new Date().getFullYear()} Snuggle Read — All rights reserved.</div>
          <div>
            <small style={{ marginRight: '1rem' }}><Link to="/admin/login">Admin Sign In</Link></small>
            <div className="socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
