import React, { useEffect, useState } from "react";
import StatsService from "../service/BookService";
import styles from "../style/AdminStats.module.css";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const data = await StatsService.getSummaryStats();
      console.log("Fetched stats:", data); // Log the fetched stats
      setStats(data);
    } catch (err) {
      setError("Failed to load stats");
    }
  };
  

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📊 Library Stats Overview</h2>

      {error && <div className={styles.error}>{error}</div>}

      {stats && (
        <>
          <div className={styles.cards}>
            <div className={styles.card}>
              <h3>Total Books</h3>
              <p>{stats.totalBooks}</p>
            </div>
            <div className={styles.card}>
              <h3>Total Students</h3>
              <p>{stats.totalStudents}</p>
            </div>
            <div className={styles.card}>
              <h3>Total Borrows</h3>
              <p>{stats.borrowStats.totalBorrows}</p>
            </div>
            <div className={styles.card}>
              <h3>Overdue Books</h3>
              <p>{stats.borrowStats.overdueCount}</p>
            </div>
            <div className={styles.card}>
              <h3>Active Borrows</h3>
              <p>{stats.borrowStats.activeBorrows}</p>
            </div>
          </div>

          <div>
            <h3>📚 Genre-wise Book Count</h3>
            <ul>
              {Object.entries(stats.booksByGenre).map(([genre, count]) => (
                <li key={genre}>
                  {genre}: <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStats;
