import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';


const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    genres: 4
  });

  // 👇 Add your images here
  const genreImages = [
    '/Student.jpg',
    '/LibraryPicture1.jpg',
    '/LibraryPicture2.jpg',
    '/books-blog-image.jpg'
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % genreImages.length);
    }, 5000); // change slide every 5 seconds
    return () => clearInterval(interval);
  }, [genreImages.length]);

  const fetchStats = async () => {
    try {
      const booksResponse = await api.get('/book/all');
      setStats(prev => ({
        ...prev,
        totalBooks: booksResponse.data?.length || 150,
        totalUsers: 1250,
        genres: 4
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalBooks: 150,
        totalUsers: 1250,
        genres: 4
      });
    }
  };

  return (
    <div className="container">
      {/* 🌟 HERO SECTION WITH IMAGE SLIDESHOW */}
      <div
        className="hero"
        style={{
          backgroundImage: `url(${genreImages[currentSlide]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 1s ease-in-out',
          color: '#fff',
          padding: '5rem 2rem'
        }}
      >
        <div
          className="hero-content"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          <h2>Welcome to Snuggle Read</h2>
          <p>Your premier university bookstore for academic and leisure reading. 
             Discover knowledge, embrace learning, and fuel your intellectual journey.</p>
          <div className="hero-cta">
            <button 
              className="btn btn-success" 
              onClick={() => navigate('/books')}
            >
              Browse Books
            </button>
            {!isAuthenticated() && (
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/register')}
              >
                Join Snuggle Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📊 STATS SECTION */}
      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalBooks}+</div>
          <div className="stat-label">Books Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}+</div>
          <div className="stat-label">Happy Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.genres}+</div>
          <div className="stat-label">Book Genres</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Online Access</div>
        </div>
      </div>

      {/* 🧭 FEATURES SECTION */}
      <div className="features" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginTop: '3rem'
      }}>
        <div className="card">
          <h3>📚 Academic Excellence</h3>
          <p>Curated collection of textbooks, reference materials, and scholarly resources 
             to support your academic journey at the university.</p>
        </div>

        <div className="card">
          <h3>🛒 Easy Shopping</h3>
          <p>Seamless online shopping experience with secure cart management and 
             convenient ordering system for students.</p>
        </div>

        <div className="card">
          <h3>📖 Diverse Genres</h3>
          <p>From academic textbooks to fiction, science, and technology - explore 
             our extensive collection across multiple genres.</p>
        </div>

        <div className="card">
          <h3>🎓 Student-Friendly</h3>
          <p>Special pricing and deals for university students with quick delivery 
             and flexible payment options.</p>
        </div>
      </div>

      {/* 🌍 VISION & MISSION */}
      <div className="card" style={{ marginTop: '2.5rem' }}>
        <h3>Our Vision & Mission</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
          <div>
            <h4>Vision</h4>
            <p>
              To be the leading university e-commerce bookstore that connects students and
              campus communities with affordable, accessible, and curated academic and leisure
              reading — empowering learning everywhere on and off campus.
            </p>
          </div>

          <div>
            <h4>Mission</h4>
            <p>
              Snuggle Read delivers a student-first online bookstore experience focused on:
            </p>
            <ul>
              <li>Providing affordable textbooks and essential academic resources for university courses.</li>
              <li>Offering easy online ordering, campus delivery or collection points, and secure payments.</li>
              <li>Curating selections that support both study and personal growth across disciplines.</li>
              <li>Supporting students with exclusive discounts, promotions, and helpful customer service.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 🏷️ GENRES SECTION */}
      <div className="card" style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h3>Featured Genres</h3>
        <div className="genre-filters">
          <div className="genre-filter">Academic Textbooks</div>
          <div className="genre-filter">Science & Technology</div>
          <div className="genre-filter">Literature & Fiction</div>
          <div className="genre-filter">Business & Economics</div>
        </div>
        <button 
          className="btn" 
          onClick={() => navigate('/books')}
          style={{ marginTop: '1rem' }}
        >
          Explore All Books
        </button>
      </div>
    </div>
  );
};

export default Home;
