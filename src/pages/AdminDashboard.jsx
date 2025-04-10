import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import styles from "../style/DashboardAdmin.module.css";
import BookService from "../service/BookService"; // 👈 All API functions now come from here

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const booksData = await BookService.getAllBooks(token);
      const studentData = await BookService.getAllStudents(token);
      const borrowData = await BookService.getAllBorrows(token);

      setBooks(booksData);
      setStudents(studentData);
      setBorrows(borrowData);
    } catch (error) {
      console.error("Dashboard loading error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalAvailable = books.reduce((sum, b) => sum + b.quantity, 0);
  const totalBorrowed = borrows.filter(b => !b.returned).length;

  const pieData = [
    { name: "Available", value: totalAvailable },
    { name: "Borrowed", value: totalBorrowed },
  ];

  const COLORS = ["#36A2EB", "#FF6384"];

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Welcome, Admin!</h2>
      <p className={styles.subheading}>Here's a quick snapshot of your library.</p>

      {/* 📊 Stats Cards */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>📚 Total Books: {books.length}</div>
        <div className={styles.statCard}>👥 Students: {students.length}</div>
        <div className={styles.statCard}>📖 Borrowed Books: {totalBorrowed}</div>
        <div className={styles.statCard}>🟢 Total Available: {totalAvailable}</div>
      </div>

      {/* 🥧 Chart */}
      <div className={styles.chartContainer}>
        <PieChart width={250} height={250}>
          <Pie
            data={pieData}
            dataKey="value"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* 🔘 Action Buttons */}
      <div className={styles.buttonGroup}>
        <Link to="/admin/books" className={styles.dashboardButton}>
          📚 Manage Books
        </Link>
        <Link to="/admin/students" className={styles.dashboardButton}>
          👥 View Students
        </Link>
        <Link to="/admin/stats" className={styles.dashboardButton}>
          📊 View Detailed Stats
        </Link>
        <Link to="/admin/borrows" className={styles.dashboardButton}>
          🔁 Borrow Records
        </Link>
        <Link to="/admin/recommendations" className={styles.dashboardButton}>
          📈 Book Recommendations
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
