import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomeEnhanced.css';
import IconBook from '../assets/icons/book.svg';
import IconCart from '../assets/icons/cart.svg';
import IconDelivery from '../assets/icons/delivery.svg';
import IconStar from '../assets/icons/star.svg';
import { useState } from "react";

// Hero slideshow images - University focused
const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1722248540590-ba8b7af1d7b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbGlicmFyeSUyMHN0dWRlbnRzJTIwc3R1ZHlpbmd8ZW58MXx8fHwxNzYwMjg3NTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Empowering University Students',
    description: 'Your one-stop shop for all academic textbooks and study materials'
  },
  {
    image: 'https://images.unsplash.com/photo-1731983568664-9c1d8a87e7a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwdGV4dGJvb2tzJTIwYWNhZGVtaWN8ZW58MXx8fHwxNzYwMjg3NTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Quality Academic Resources',
    description: 'Comprehensive textbooks for every course, delivered to your doorstep'
  },
  {
    image: 'https://images.unsplash.com/photo-1602221527282-dabc4778535b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYm9va3N0b3JlfGVufDF8fHx8MTc2MDI4NzU4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Your Campus Bookstore Online',
    description: 'Browse our extensive catalog from the comfort of your dorm or home'
  },
  {
    image: 'https://images.unsplash.com/photo-1704748082614-8163a88e56b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMHN0dWR5aW5nfGVufDF8fHx8MTc2MDIwODAyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Supporting Your Academic Journey',
    description: 'From first year to graduation - we have the books you need to succeed'
  },
  {
    image: 'https://images.unsplash.com/photo-1620459134634-867369354df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwZWR1Y2F0aW9uJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NjAyODc1OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Achieve Your Academic Goals',
    description: 'Quality textbooks and study guides to help you excel in your studies'
  },
  {
    image: 'https://images.unsplash.com/photo-1706195546853-a81b6a190daf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVhZGluZyUyMGJvb2tzfGVufDF8fHx8MTc2MDI4MTYzOHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Fueling Brilliant Minds',
    description: 'One course at a time - quality textbooks for your academic success'
  }
];

// Genre images with distinct visuals - Complete university subject coverage
const genreImages = {
  // General Categories
  all: 'https://images.unsplash.com/photo-1683871268982-a19153dbb35d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcGVuJTIwYm9vayUyMGxpYnJhcnl8ZW58MXx8fHwxNjAyODYyOTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  Textbooks: 'https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0Ym9vayUyMGVkdWNhdGlvbiUyMHN0dWR5fGVufDF8fHx8MTc2MDI4Nzk3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  Fiction: 'https://images.unsplash.com/photo-1666198259234-f7033c78b94e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWN0aW9uJTIwbm92ZWxzJTIwYm9va3NoZWxmfGVufDF8fHx8MTc2MDI4Nzk3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  'Non-fiction': 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWxmJTIwaGVscCUyMGJvb2tzfGVufDF8fHx8MTc2MDI4NjI5MHww&ixlib=rb-4.1.0&q=80&w=1080',
  Biography: 'https://images.unsplash.com/photo-1561121587-28c15de34c17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9ncmFwaHklMjBib29rcyUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzYwMjg2MjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  
  // STEM Subjects
  'Computer Science': 'https://images.unsplash.com/photo-1580121441575-41bcb5c6b47c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNjaWVuY2UlMjBwcm9ncmFtbWluZyUyMHRleHRib29rfGVufDF8fHx8MTc2MDI4NzU5MHww&ixlib=rb-4.1.0&q=80&w=1080',
  Mathematics: 'https://images.unsplash.com/photo-1588912914017-923900a34710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGVkdWNhdGlvbiUyMHRleHRib29rfGVufDF8fHx8MTc2MDI4NzU5MXww&ixlib=rb-4.1.0&q=80&w=1080',
  Programming: 'https://images.unsplash.com/photo-1667984436031-ea1d9ff307ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGUlMjBkZXZlbG9wZXJ8ZW58MXx8fHwxNzYwMjg3OTc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  Statistics: 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGF0aXN0aWNzJTIwZGF0YSUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NjAyODc5NzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  Engineering: 'https://images.unsplash.com/photo-1744627049760-f22f045992fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMGJsdWVwcmludCUyMGRlc2lnbnxlbnwxfHx8fDE3NjAyODc5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  
  // Natural Sciences
  Physics: 'https://images.unsplash.com/photo-1758685733737-71f8945decf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwZXF1YXRpb25zJTIwY2xhc3Nyb29tfGVufDF8fHx8MTc2MDI4Nzk3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  Chemistry: 'https://images.unsplash.com/photo-1616996692022-60cb0f438b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBsYWJvcmF0b3J5JTIwYmVha2VyfGVufDF8fHx8MTc2MDI4Nzk3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  Biology: 'https://images.unsplash.com/photo-1636386689060-37d233b5d345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9sb2d5JTIwY2VsbHMlMjBtaWNyb3Njb3BlfGVufDF8fHx8MTc2MDI4Nzk3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  Science: 'https://images.unsplash.com/photo-1605781645799-c9c7d820b4ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFib3JhdG9yeSUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjAyNzA1OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'Environmental Science': 'https://images.unsplash.com/photo-1598813960856-a83fa955c0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwbmF0dXJlJTIwc3VzdGFpbmFiaWxpdHl8ZW58MXx8fHwxNzYwMjg3OTc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  
  // Business & Social Sciences
  Economics: 'https://images.unsplash.com/photo-1607948937289-5ca19c59e70f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29ub21pY3MlMjBidXNpbmVzcyUyMHRleHRib29rfGVufDF8fHx8MTc2MDI4Nzk3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  Finance: 'https://images.unsplash.com/photo-1745509267945-b25cbb4d50ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwbW9uZXklMjBjaGFydHN8ZW58MXx8fHwxNzYwMjg3OTc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  Accounting: 'https://images.unsplash.com/photo-1711344397160-b23d5deaa012?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2NvdW50aW5nJTIwY2FsY3VsYXRvciUyMGxlZGdlcnxlbnwxfHx8fDE3NjAyODc5NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  Marketing: 'https://images.unsplash.com/photo-1656164631668-8673eab87b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBhZHZlcnRpc2luZyUyMHN0cmF0ZWd5fGVufDF8fHx8MTc2MDI4Nzk3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  Psychology: 'https://images.unsplash.com/photo-1673255745677-e36f618550d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2d5JTIwYnJhaW4lMjBtaW5kfGVufDF8fHx8MTc2MDI4Nzk3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  
  // Humanities
  History: 'https://images.unsplash.com/photo-1613324766451-2d03b2ea8190?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3J5JTIwYm9va3MlMjBsaWJyYXJ5fGVufDF8fHx8MTc2MDI4MzcyOXww&ixlib=rb-4.1.0&q=80&w=1080'
};

const HomeEnhanced = () => {
  const { user } = useAuth();

  const featuredGenres = [
    { name: 'Fiction', image: genreImages.Fiction, description: 'Captivating stories and novels' },
    { name: 'Non-Fiction', image: genreImages['Non-fiction'], description: 'Real stories and knowledge' },
    { name: 'Science', image: genreImages.Science, description: 'Scientific discoveries and research' },
    { name: 'Mathematics', image: genreImages.Mathematics, description: 'Mathematical concepts and theory' },
    { name: 'History', image: genreImages.History, description: 'Historical books and archives' },
    { name: 'Biography', image: genreImages.Biography, description: 'Life stories of remarkable people' },
    { name: 'Fantasy', image: genreImages.Fiction, description: 'Magical worlds and adventures' },
    { name: 'Romance', image: genreImages.Fiction, description: 'Love stories and relationships' },
    { name: 'Mystery', image: genreImages.Fiction, description: 'Thrilling mysteries and detective stories' },
    { name: 'Programming', image: genreImages.Programming, description: 'Coding and software development' }
  ];

  const stats = [
    { number: '50,000+', label: 'Books Available' },
    { number: '25,000+', label: 'Happy Students' },
    { number: '500+', label: 'Universities Served' },
    { number: '15+', label: 'Years of Excellence' }
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleMobileMenu = () => setMobileMenuOpen(open => !open);

  // Auto-advance slideshow
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="home-enhanced">
      {/* Hero Slideshow Section */}
      <section className="hero-slideshow">
        <div className="slideshow-container">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${slide.image})`,
                display: index === currentSlide ? 'block' : 'none'
              }}
            >
              <div className="slide-overlay"></div>
              <div className="slide-content">
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>
                <div className="slide-actions">
                  <Link to="/books" className="cta-button primary">
                    Shop Now
                  </Link>
                  {!user && (
                    <Link to="/register" className="cta-button secondary">
                      Sign Up
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Slideshow Controls */}
          <button className="slide-control prev" onClick={prevSlide}>
            ‹
          </button>
          <button className="slide-control next" onClick={nextSlide}>
            ›
          </button>
          
          {/* Slide Indicators */}
          <div className="slide-indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
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
                <div className="genre-image-wrapper">
                  <img src={genre.image} alt={genre.name} className="genre-image" />
                  <div className="genre-overlay"></div>
                </div>
                <div className="genre-content">
                  <h4>{genre.name}</h4>
                  <p>{genre.description}</p>
                  <span className="explore-link">Explore →</span>
                </div>
              </Link>
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
