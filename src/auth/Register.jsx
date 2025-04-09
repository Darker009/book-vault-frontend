// Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../service/AuthService";
import styles from "./LoginStyle.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await AuthService.register(formData);
      setRegistrationSuccess(true);
      setFormData({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className={styles.authWrapper}>
        <div className={styles.authContainer}>
          <h2>Registration Successful!</h2>
          <p className={styles.successText}>Please login with your credentials.</p>
          <button 
            onClick={() => navigate("/login")}
            className={styles.successButton}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <h2>Register</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p className={styles.switchAuth}>
          Already have an account?{" "}
          <Link to="/login" className={styles.linkButton}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;