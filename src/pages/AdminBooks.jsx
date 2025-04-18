import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookService from "../service/BookService";
import styles from "../style/AdminBooks.module.css";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await BookService.getAllBooks(token);
      setBooks(data);
    } catch (err) {
      setError("Failed to load books");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/books/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await BookService.deleteBook(id, token);
      fetchBooks();
    } catch (err) {
      setError("Failed to delete book");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className={styles.container}>
      <h2>📚 Admin Book Management</h2>

      {error && <div className={styles.error}>{error}</div>}

      <button className={styles.addButton} onClick={() => navigate("/admin/books/add")}>
        ➕ Add Book
      </button>

      {books.length === 0 ? (
        <p className={styles.emptyMessage}>No books found. Please add a book to get started.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Section</th>
              <th>Quantity</th>
              <th>Tags</th>
              <th>Borrow Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.section}</td>
                <td>{book.quantity}</td>
                <td>{book.tags || "N/A"}</td>
                <td>{book.borrowCount}</td>
                <td>
                  <button className={styles.editButton} onClick={() => handleEdit(book.id)}>
                    ✏️ Edit
                  </button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(book.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBooks;
