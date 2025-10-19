import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './HomeEnhanced.css';

import IconBook from '../assets/icons/book.svg';
import IconCart from '../assets/icons/cart.svg';
import IconDelivery from '../assets/icons/delivery.svg';
import IconStar from '../assets/icons/star.svg';

const HomeEnhanced = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    universities: 0,
    years: 15,
  });

  
  const genreImages = [
    '/Student.jpg',
    '/LibraryPicture1.jpg',
    '/LibraryPicture2.jpg',
    '/books-blog-image.jpg'
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const booksResponse = await api.get('/book/all');
        setStats({
          totalBooks: booksResponse.data?.length || 200,
          totalUsers: 1250,
          universities: 500,
          years: 15,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          totalBooks: 200,
          totalUsers: 1250,
          universities: 500,
          years: 15,
        });
      }
    };
    fetchStats();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % genreImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [genreImages.length]);

  
  const featuredGenres = [
    { name: 'Academic', icon: IconBook, description: 'Essential textbooks and academic resources' },
    { name: 'Fiction', icon: IconBook, description: 'Captivating stories and novels' },
    { name: 'Science', icon: IconStar, description: 'Scientific discoveries and research' },
    { name: 'Technology', icon: IconStar, description: 'Latest in tech and programming' }
  ];

  return (
    <div className="home-enhanced">
      {/* === HERO SECTION WITH SLIDESHOW === */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${genreImages[currentSlide]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 1s ease-in-out',
        }}
      >
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
                Discover academic and leisure books to fuel your journey.
              </p>
              <div className="hero-actions">
                <Link to="/books" className="cta-button primary">Explore Books</Link>
                {!isAuthenticated() && (
                  <Link to="/register" className="cta-button secondary">Join Now</Link>
                )}
              </div>
              <div className="hero-features">
                <div className="feature-item">
                  <img src={IconDelivery} alt="delivery" className="feature-icon" />
                  <span>Free Campus Delivery</span>
                </div>
                <div className="feature-item">
                  <img src={IconCart} alt="quality" className="feature-icon" />
                  <span>Quality Assured</span>
                </div>
                <div className="feature-item">
                  <img src={IconBook} alt="digital" className="feature-icon" />
                  <span>Digital & Physical Books</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === ABOUT / VISION / MISSION === */}
      <section className="vision-mission-section">
        <div className="container">
          <div className="section-header">
            <h2>About Snuggle Read</h2>
            <p>Empowering Education Through Knowledge</p>
          </div>
          <div className="vision-mission-grid">
            <div className="vision-card">
              <div className="card-icon"><img src={IconStar} alt="vision" /></div>
              <h3>Our Vision</h3>
              <p>
                To be the leading university bookstore that bridges the gap between
                students and knowledge, making quality educational resources accessible
                to every learner across South Africa and beyond.
              </p>
            </div>
            <div className="mission-card">
              <div className="card-icon"><img src={IconStar} alt="mission" /></div>
              <h3>Our Mission</h3>
              <p>
                We provide a comprehensive e-commerce platform offering academic books,
                textbooks, and educational materials to students, faculty, and researchers,
                with exceptional service and competitive prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === FEATURED GENRES === */}
      <section className="featured-genres-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Book Categories</h2>
            <p>Discover knowledge across all disciplines</p>
          </div>
          <div className="genres-grid">
            {featuredGenres.map((genre, index) => (
              <Link to={`/books?genre=${genre.name}`} key={index} className="genre-card">
                <div className="genre-icon"><img src={genre.icon} alt={genre.name} /></div>
                <h4>{genre.name}</h4>
                <p>{genre.description}</p>
                <span className="explore-link">Explore →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* === STATS SECTION (Dynamic) === */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{stats.totalBooks}+</div>
              <div className="stat-label">Books Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.totalUsers}+</div>
              <div className="stat-label">Happy Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.universities}+</div>
              <div className="stat-label">Universities Served</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.years}+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>Join thousands of students who trust Snuggle Read for their academic needs.</p>
            <div className="cta-actions">
              <Link to="/books" className="cta-button primary large">
                Browse Books Now
              </Link>
              {!isAuthenticated() && (
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
