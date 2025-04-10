import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import styles from "../navbar/NavbarStyle.module.css";

const Navbar = () => {
  const { user, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark ${styles.navbarCustom}`}>
      <div className="container-fluid">
        <Link className={`navbar-brand ${styles.brand}`} to="/">
          📚 Book Vault
        </Link>
        <button
          className={`navbar-toggler ${styles.toggler}`}
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className={styles.togglerIcon}></span>
          <span className={styles.togglerIcon}></span>
          <span className={styles.togglerIcon}></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''} ${styles.navbarCollapse}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!user && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${styles.navLink}`} to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${styles.navLink}`} to="/register" onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </li>
              </>
            )}
            {user && role === "ROLE_ADMIN" && (
              <>
              <li className="nav-item">
                  <Link className={`nav-link ${styles.navLink}`} to="/admin-dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${styles.navLink}`} to="/admin/profile" onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${styles.navLink}`} to="/admin/books" onClick={() => setIsOpen(false)}>
                    Books
                  </Link>
                </li>
                <li className="nav-item">
                  <button className={`btn ${styles.logoutBtn}`} onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
            {user && role === "ROLE_STUDENT" && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${styles.navLink}`} to="/student-dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${styles.navLink}`} to="/student/profile" onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${styles.navLink}`} to="/student/books" onClick={() => setIsOpen(false)}>
                    Books
                  </Link>
                </li>
                
                <li className="nav-item">
                  <button className={`btn ${styles.logoutBtn}`} onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;