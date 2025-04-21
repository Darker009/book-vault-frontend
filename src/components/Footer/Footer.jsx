import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo">
            <Link to="/" className="logo-link">BookVault</Link>
            <p className="footer-description">Your ultimate book library platform. Explore, Borrow, and Manage your books with ease.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>Email: support@bookvault.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BookVault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
