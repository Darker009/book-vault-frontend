// src/pages/student/StudentBooks.jsx
import React, { useEffect, useState } from "react";
import BookService from "../../service/BookService";
import "./StudentBooks.css";

const StudentBooks = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = async () => {
    try {
      const data = await BookService.getAllBooks();
      setBooks(data);
      setError("");
    } catch (err) {
      setError("Failed to load books. Please try again later.");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.tags?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="student-books-container">
      <h2>📚 Library Books</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books by title, author, or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredBooks.length === 0 ? (
        <p className="empty-message">
          {searchTerm ? "No books match your search." : "No books available in the library."}
        </p>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-cover-container">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl.startsWith("http") ? book.imageUrl : `${process.env.REACT_APP_API_BASE_URL}${book.imageUrl}`}
                    alt={book.title}
                    className="book-cover"
                    onError={(e) => {
                      e.target.src = "/default-book-cover.jpg";
                    }}
                  />
                ) : (
                  <div className="no-cover">No Cover</div>
                )}
              </div>
              <div className="book-details">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">By {book.author}</p>
                <p className="book-section">{book.section}</p>
                <p className="book-availability">
                  Available: {book.quantity > 0 ? `${book.quantity} copies` : "Out of stock"}
                </p>
                {book.tags && (
                  <div className="book-tags">
                    {Array.isArray(book.tags) 
                      ? book.tags.map(tag => <span key={tag} className="tag">{tag}</span>)
                      : <span className="tag">{book.tags}</span>}
                  </div>
                )}
                <button className="borrow-button">
                  {book.quantity > 0 ? "Borrow Book" : "Notify Me"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentBooks;