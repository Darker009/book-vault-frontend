import React, { useEffect, useState } from "react";
import BookService from "../service/BookService";
import styles from "../style/StudentBooks.module.css";

const StudentBooks = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      const data = await BookService.getAllBooks(token);
      setBooks(data);
    } catch (err) {
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const borrowed = await BookService.getBorrowedBooks(token);
      setBorrowedBooks(borrowed);
    } catch (err) {
      console.error("Failed to fetch borrowed books");
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await BookService.borrowBook(bookId, token);
      await fetchBooks();
      await fetchBorrowedBooks();
    } catch (err) {
      alert("Borrowing failed. Check limits or availability.");
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await BookService.returnBook(borrowId, token);
      await fetchBooks();
      await fetchBorrowedBooks();
    } catch (err) {
      alert("Returning failed.");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📘 Available Books</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Available</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => {
              const borrowedEntry = borrowedBooks.find(
                (b) => b.book.id === book.id && !b.returned
              );

              return (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.quantity > 0 ? "Yes" : "No"}</td>
                  <td>
                    {borrowedEntry ? (
                      <button
                        className={styles.returnBtn}
                        onClick={() => handleReturn(borrowedEntry.id)}
                      >
                        Return
                      </button>
                    ) : (
                      <button
                        className={styles.borrowBtn}
                        onClick={() => handleBorrow(book.id)}
                        disabled={book.quantity <= 0}
                      >
                        Borrow
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentBooks;
