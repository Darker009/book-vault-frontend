import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import styles from "../style/DashboardStudent.module.css";
import { useAuth } from "../auth/AuthContext";
import BookService from "../service/BookService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      const data = await BookService.getAllBooks(token);
      setBooks(data);
    } catch (err) {
      setError("Failed to fetch books.");
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const data = await BookService.getBorrowedBooks(token);
      setBorrowedBooks(data);
    } catch (err) {
      setError("Failed to fetch borrowed books.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchBooks();
      await fetchBorrowedBooks();
      setLoading(false);
    };
    loadData();
  }, []);

  // Slider settings with enhanced animations
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  if (loading) return <div className={styles.dashboardContainer}>Loading...</div>;
  if (error) return <div className={styles.dashboardContainer}>Error: {error}</div>;

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.title}>Welcome, {user?.name || "Student"}!</h2>
      <p className={styles.subtitle}>This is your dashboard.</p>

      {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* 📊 Stats Section */}
      <div className={styles.statsSection}>
        <h3>Your Book Stats</h3>
        <div className={styles.statsCards}>
          <div className={styles.statCard}>📚 Total Books: {books.length}</div>
          <div className={styles.statCard}>📖 Borrowed: {borrowedBooks.length}</div>
          <div className={styles.statCard}>
            🟢 Available: {books.reduce((sum, b) => sum + b.quantity, 0)}
          </div>
          <div className={styles.statCard}>
            🔓 Borrow Slots Left: {3 - borrowedBooks.filter((b) => !b.returned).length}
          </div>
        </div>

        <div className={styles.chartContainer}>
          <PieChart width={250} height={250}>
            <Pie
              data={[ 
                { name: "Borrowed", value: borrowedBooks.length },
                { name: "Available", value: books.reduce((sum, b) => sum + b.quantity, 0) }
              ]}
              dataKey="value"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              <Cell fill="#FF6B6B" />
              <Cell fill="#4ECDC4" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* 📚 Available Books Slider Section */}
      <div className={styles.section}>
        <h3>Available Books</h3>
        
        {/* Books in Enhanced Slider */}
        <Slider {...sliderSettings}>
          {books.map((book) => (
            <div key={book.id} className={styles.bookCard}>
              <div className={styles.bookInfo}>
                <h4 className={styles.bookTitle}>{book.title}</h4>
                <p className={styles.bookAuthor}>By {book.author}</p>
                <div className={styles.bookMetaContainer}>
                  <p className={styles.bookMeta}>ISBN: {book.isbn}</p>
                  <p className={styles.bookMeta}>Available: {book.quantity}</p>
                  <p className={styles.bookMeta}>Category: {book.category || "General"}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* 📘 Borrowed Books Section */}
      {borrowedBooks.length > 0 && (
        <div className={styles.section}>
          <h3>Your Borrowed Books</h3>
          <div className={styles.borrowedBooksContainer}>
            {borrowedBooks.map((book) => (
              <div key={book.id} className={styles.bookCard}>
                <div className={styles.bookInfo}>
                  <h4 className={styles.bookTitle}>{book.book?.title}</h4>
                  <p className={styles.bookAuthor}>By {book.book?.author}</p>
                  <div className={styles.bookMetaContainer}>
                    <p className={styles.bookMeta}>Due Date: {book.dueDate}</p>
                    <p className={styles.bookMeta}>Pickup: {book.pickupMessage || "Not assigned"}</p>
                    <p className={styles.bookMeta}>Returned: {book.returned ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
