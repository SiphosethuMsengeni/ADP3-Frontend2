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
