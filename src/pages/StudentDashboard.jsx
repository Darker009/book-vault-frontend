import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import styles from "../style/DashboardStudent.module.css";
import { useAuth } from "../auth/AuthContext";
import BookService from "../service/BookService";

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

  const canBorrow = (book) => {
    const activeBorrows = borrowedBooks.filter((b) => !b.returned).length;
    return book.quantity > 0 && activeBorrows < 3;
  };


  const handleBorrow = async (bookId) => {
    try {
      await BookService.borrowBook(bookId, token);
      setSuccessMessage("Book borrowed successfully!");
      await fetchBooks();
      await fetchBorrowedBooks();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to borrow book.");
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await BookService.returnBook(borrowId, token);
      setSuccessMessage("Book returned successfully!");
      await fetchBooks();
      await fetchBorrowedBooks();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to return book.");
    }
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
            🔓 Borrow Slots Left: {3 - borrowedBooks.length}
          </div>
        </div>

        <div className={styles.chartContainer}>
          <PieChart width={250} height={250}>
            <Pie
              data={[
                { name: "Borrowed", value: borrowedBooks.length },
                {
                  name: "Available",
                  value: books.reduce((sum, b) => sum + b.quantity, 0),
                },
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

      {/* 📚 Available Books Section */}
      <div className={styles.section}>
        <h3>Available Books</h3>
        <div className={styles.bookList}>
          {books.map((book) => (
            <div key={book.id} className={styles.bookCard}>
              <h4>{book.title}</h4>
              <p>Author: {book.author}</p>
              <p>ISBN: {book.isbn}</p>
              <p>Available: {book.quantity}</p>
              <button
                onClick={() => handleBorrow(book.id)}
                className={styles.borrowButton}
                disabled={!canBorrow(book)}
              >
                {book.quantity === 0
                  ? "Out of Stock"
                  : borrowedBooks.filter((b) => !b.returned).length >= 3
                    ? "Limit Reached"
                    : "Borrow"}

              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 📕 Borrowed Books Section */}
      <div className={styles.section}>
        <h3>Your Borrowed Books</h3>
        {borrowedBooks.length === 0 ? (
          <p>You haven't borrowed any books yet.</p>
        ) : (
          <div className={styles.bookList}>
            {borrowedBooks.map((borrowed) => (
              <div key={borrowed.id} className={styles.bookCard}>
                <h4>{borrowed.book.title}</h4>
                <p>Author: {borrowed.book.author}</p>
                <p>Borrowed on: {new Date(borrowed.borrowDate).toLocaleDateString()}</p>
                <p>Due on: {new Date(borrowed.dueDate).toLocaleDateString()}</p>
                {!borrowed.returned && (
                  <button
                    onClick={() => handleReturn(borrowed.id)}
                    className={styles.returnButton}
                  >
                    Return
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
