import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import BookService from '../service/BookService';
import styles from '../style/BookPageStyle.module.css';

const BookPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const data = await BookService.getAllBooks(token);
      setBooks(data);
    } catch (err) {
      setError("Failed to fetch books.");
    }
  };

  // Fetch borrowed books
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

  // Check borrow availability
  const canBorrow = (book) => {
    const activeBorrows = borrowedBooks.filter((b) => !b.returned);
    const alreadyBorrowed = activeBorrows.some((b) => b.book.id === book.id);
    return book.quantity > 0 && activeBorrows.length < 3 && !alreadyBorrowed;
  };

  // Handle borrowing a book
  const handleBorrow = async (bookId) => {
    try {
      await BookService.borrowBook(bookId, token);
      await fetchBooks();
      await fetchBorrowedBooks();
    } catch (err) {
      setError("Failed to borrow book.");
    }
  };

  // Handle returning a book
  const handleReturn = async (borrowId) => {
    try {
      await BookService.returnBook(borrowId, token);
      await fetchBooks();
      await fetchBorrowedBooks();
    } catch (err) {
      setError("Failed to return book.");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.bookPageContainer}>
      <h2 className={styles.title}>Book List</h2>
      <div className={styles.bookList}>
        {books.map((book) => (
          <div key={book.id} className={styles.bookCard}>
            <div className={styles.bookInfo}>
              <h4>{book.title}</h4>
              <p>Author: {book.author}</p>
              <p>ISBN: {book.isbn}</p>
              <p>Category: {book.category || "General"}</p>
              <p>Available: {book.quantity}</p>
            </div>
            <button
              onClick={() => handleBorrow(book.id)}
              className={styles.borrowButton}
              disabled={!canBorrow(book)}
            >
              {book.quantity === 0
                ? "Out of Stock"
                : borrowedBooks.filter((b) => !b.returned).length >= 3
                ? "Limit Reached"
                : borrowedBooks.some((b) => !b.returned && b.book.id === book.id)
                ? "Already Borrowed"
                : "Borrow"}
            </button>
          </div>
        ))}
      </div>

      <h3>Your Borrowed Books</h3>
      <div className={styles.borrowedBooks}>
        {borrowedBooks.length === 0 ? (
          <p>You haven't borrowed any books yet.</p>
        ) : (
          borrowedBooks.map((borrowed) => (
            <div key={borrowed.id} className={styles.borrowedBookCard}>
              <h4>{borrowed.book.title}</h4>
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
          ))
        )}
      </div>
    </div>
  );
};

export default BookPage;
