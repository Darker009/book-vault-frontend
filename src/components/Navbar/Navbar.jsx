// src/components/Navbar/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Get role from user object
  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link 
          to={user ? (role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/student/dashboard') : '/'} 
          className="logo" 
          onClick={handleLinkClick}
        >
          BookVault
        </Link>
        
        <button 
          className={`hamburger ${isOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          {!user ? (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`} 
                onClick={handleLinkClick}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${isActive('/register') ? 'active' : ''}`} 
                onClick={handleLinkClick}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {role === 'ROLE_ADMIN' && (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/books" 
                    className={`nav-link ${isActive('/books') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Books
                  </Link>
                  <Link 
                    to="/admin/students" 
                    className={`nav-link ${isActive('/students') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Students
                  </Link>

                  <Link 
                    to="/admin/stats" 
                    className={`nav-link ${isActive('/admin/stats') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Stats
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Profile
                  </Link>
                  
                </>
              )}
              
              {role === 'ROLE_STUDENT' && (
                <>
                  <Link 
                    to="/student/dashboard" 
                    className={`nav-link ${isActive('/student/dashboard') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/books" 
                    className={`nav-link ${isActive('/books') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Books
                  </Link>

                  <Link 
                    to="/borrow/books" 
                    className={`nav-link ${isActive('/borrow/books') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Borrow Books
                  </Link>
                  <Link 
                    to="/borrowed/books" 
                    className={`nav-link ${isActive('/borrowed/books') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Borrowed Books
                  </Link>

                  <Link 
                    to="/profile" 
                    className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    Profile
                  </Link>
                </>
              )}
              
              <div className="user-section">
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;