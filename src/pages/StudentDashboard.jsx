import React from "react";
import { Link } from "react-router-dom";
import styles from "../../src/style/DashboardStyle.module.css";
const StudentDashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.title}>Welcome, Student!</h2>
      <p className={styles.subtitle}>This is your dashboard. You can:</p>
      <ul className={styles.linkList}>
        <li>
          <Link to="/student-profile" className={styles.link}>
            Update Profile
          </Link>
        </li>
        <li>
          <Link to="/browse-books" className={styles.link}>
            Browse & Borrow Books
          </Link>
        </li>
        <li>
          <Link to="/my-borrowed-books" className={styles.link}>
            View Borrowed Books
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StudentDashboard;
