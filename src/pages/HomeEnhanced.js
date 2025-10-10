import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomeEnhanced.css';

const HomeEnhanced = () => {
  const { user } = useAuth();

  const featuredGenres = [
    { name: 'Academic', icon: '🎓', description: 'Essential textbooks and academic resources' },
    { name: 'Fiction', icon: '📚', description: 'Captivating stories and novels' },
    { name: 'Science', icon: '🔬', description: 'Scientific discoveries and research' },
    { name: 'Technology', icon: '💻', description: 'Latest in tech and programming' }
  ];

  const stats = [
    { number: '50,000+', label: 'Books Available' },
    { number: '25,000+', label: 'Happy Students' },
    { number: '500+', label: 'Universities Served' },
    { number: '15+', label: 'Years of Excellence' }
  ];

  return (
    <div className="home-enhanced">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-text">
                <h1 className="hero-title">
                  Welcome to <span className="brand-highlight">Snuggle Read</span>
                </h1>
                <p className="hero-subtitle">
                  Your Premier University E-Commerce Bookstore
                </p>
                <p className="hero-description">
                  Discover thousands of academic books, textbooks, and literary treasures. 
                  From cutting-edge research publications to timeless classics, we're your 
                  one-stop destination for knowledge and learning.
                </p>
                <div className="hero-actions">
                  <Link to="/books" className="cta-button primary">
                    Explore Books
                  </Link>
                  {!user && (
                    <Link to="/register" className="cta-button secondary">
                      Join Now
                    </Link>
                  )}
                </div>
                <div className="hero-features">
                  <div className="feature-item">
                    <span className="feature-icon">🚚</span>
                    <span>Free Campus Delivery</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💰</span>
                    <span>Student Discounts</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📖</span>
                    <span>Digital & Physical Books</span>
                  </div>
                </div>
              </div>
              <div className="hero-image">
                <img src="/images/hero-books.jpg" alt="University Books" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="vision-mission-section">
        <div className="container">
          <div className="section-header">
            <h2>About Snuggle Read</h2>
            <p>Empowering Education Through Knowledge</p>
          </div>
          
          <div className="vision-mission-grid">
            <div className="vision-card">
              <div className="card-icon">🔮</div>
              <h3>Our Vision</h3>
              <p>
                To be the leading university bookstore that bridges the gap between 
                students and knowledge, making quality educational resources accessible 
                to every learner across South Africa and beyond.
              </p>
            </div>
            
            <div className="mission-card">
              <div className="card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                We provide a comprehensive e-commerce platform offering academic books, 
                textbooks, and educational materials to university students, faculty, 
                and researchers, with exceptional service and competitive prices.
              </p>
            </div>
            
            <div className="values-card">
              <div className="card-icon">⭐</div>
              <h3>Our Values</h3>
              <ul>
                <li>📚 Academic Excellence</li>
                <li>🤝 Student-First Service</li>
                <li>💡 Innovation in Learning</li>
                <li>🌍 Accessibility for All</li>
                <li>🔒 Trust & Reliability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Special */}
      <section className="specialty-section">
        <div className="container">
          <div className="section-header">
            <h2>What Makes Snuggle Read Special?</h2>
            <p>Your University E-Commerce Bookstore Experience</p>
          </div>
          
          <div className="specialty-grid">
            <div className="specialty-item">
              <div className="specialty-icon">🎓</div>
              <h4>University Focused</h4>
              <p>Specifically curated for university students, faculty, and academic institutions with specialized collections for different fields of study.</p>
            </div>
            
            <div className="specialty-item">
              <div className="specialty-icon">🛒</div>
              <h4>E-Commerce Excellence</h4>
              <p>Seamless online shopping experience with advanced search, filtering, and recommendation systems tailored for academic needs.</p>
            </div>
            
            <div className="specialty-item">
              <div className="specialty-icon">📍</div>
              <h4>Multi-Campus Reach</h4>
              <p>Serving multiple universities and campuses across South Africa with localized inventory and campus-specific collections.</p>
            </div>
            
            <div className="specialty-item">
              <div className="specialty-icon">💝</div>
              <h4>Student Benefits</h4>
              <p>Exclusive student discounts, flexible payment options, textbook rental programs, and special academic pricing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Genres */}
      <section className="featured-genres-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Book Categories</h2>
            <p>Discover knowledge across all disciplines</p>
          </div>
          
          <div className="genres-grid">
            {featuredGenres.map((genre, index) => (
              <Link to={`/books?genre=${genre.name}`} key={index} className="genre-card">
                <div className="genre-icon">{genre.icon}</div>
                <h4>{genre.name}</h4>
                <p>{genre.description}</p>
                <span className="explore-link">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of students who trust Snuggle Read for their academic needs</p>
            <div className="cta-actions">
              <Link to="/books" className="cta-button primary large">
                Browse Books Now
              </Link>
              {!user && (
                <Link to="/register" className="cta-button secondary large">
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeEnhanced;