// src/pages/Welcome/Welcome.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaBookOpen, FaSearch, FaUserPlus, FaSignInAlt, FaArrowRight } from 'react-icons/fa';
import bookshelfImg from '../../assets/Book.jpg';
import './Welcome.css';

const Welcome = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching featured books
  useEffect(() => {
    const timer = setTimeout(() => {
      setFeaturedBooks([
        { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://covers.openlibrary.org/b/id/240726-S.jpg" },
        { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", cover: "https://covers.openlibrary.org/b/id/240727-S.jpg" },
        { id: 3, title: "1984", author: "George Orwell", cover: "https://covers.openlibrary.org/b/id/240728-S.jpg" }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="welcome-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to <span className="highlight">Book Vault</span></h1>
          <p className="subtitle">Your personal library management system with thousands of books at your fingertips</p>
          
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary" onClick={scrollToTop}>
              <FaUserPlus /> Get Started
            </Link>
            <Link to="/login" className="btn btn-outline" onClick={scrollToTop}>
              <FaSignInAlt /> Login
            </Link>
          </div>
        </div>
        <div className="hero-image">
        <img src={bookshelfImg} alt="Bookshelf" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Book Vault?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaBookOpen className="feature-icon" />
            <h3>Extensive Collection</h3>
            <p>Access thousands of books across all genres from classic literature to modern bestsellers.</p>
          </div>
          <div className="feature-card">
            <FaSearch className="feature-icon" />
            <h3>Smart Search</h3>
            <p>Find exactly what you're looking for with our powerful search and filtering options.</p>
          </div>
          <div className="feature-card">
            <i className="feature-icon">📱</i>
            <h3>Multi-Device Sync</h3>
            <p>Your library syncs across all devices so you can pick up where you left off.</p>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-books-section">
        <div className="section-header">
          <h2>Featured Books</h2>
          <Link to="/browse" className="view-all" onClick={scrollToTop}>
            View All <FaArrowRight />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="books-loading">Loading featured books...</div>
        ) : (
          <div className="books-grid">
            {featuredBooks.map(book => (
              <div key={book.id} className="book-card">
                <img src={book.cover} alt={book.title} className="book-cover" />
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p className="book-author">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Readers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"Book Vault has completely transformed how I organize and discover books. Highly recommended!"</p>
            <div className="testimonial-author">- Sarah J.</div>
          </div>
          <div className="testimonial-card">
            <p>"As an avid reader, I've tried many apps but Book Vault stands out with its clean interface and powerful features."</p>
            <div className="testimonial-author">- Michael T.</div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <h2>Ready to Build Your Digital Library?</h2>
        <p>Join thousands of readers who are already enjoying Book Vault</p>
        <Link to="/register" className="btn btn-primary btn-large" onClick={scrollToTop}>
          <FaUserPlus /> Sign Up for Free
        </Link>
      </section>
    </div>
  );
};

export default Welcome;