import React from "react";
import { Link } from "react-router-dom";
import styles from "../style/DashboardAdmin.module.css";

const AdminDashboard = () => {
  return (
    <div className={styles.container}>
      <h2>Welcome, Admin!</h2>
      <p>This is your admin dashboard. You can:</p>
      <div className={styles.buttonGroup}>
        <Link to="/add-book" className={styles.dashboardButton}>Add Book</Link>
        <Link to="/update-book" className={styles.dashboardButton}>Update Book</Link>
        <Link to="/all-books" className={styles.dashboardButton}>View All Books</Link>
        <Link to="/delete-book" className={styles.dashboardButton}>Delete Book</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;