import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../service/AuthService";
import { useAuth } from "../auth/AuthContext";
import styles from "./LoginStyle.module.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ 
    email: "", 
    password: "" 
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setRole } = useAuth();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await AuthService.login(credentials);
      setUser(data.user);
      setRole(data.user.role);

      // Redirect based on role
      const redirectPath = data.user.role === "ROLE_ADMIN" 
        ? "/admin-dashboard" 
        : "/student-dashboard";
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <h2>Welcome Back</h2>
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={credentials.email}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            aria-label={loading ? "Logging in..." : "Login"}
          >
            {loading ? (
              <span className={styles.loadingText}>Logging in...</span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        
        <p className={styles.switchAuth}>
          New to Book Vault?{" "}
          <Link to="/register" className={styles.linkButton}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;