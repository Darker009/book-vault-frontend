import React, { useEffect, useState } from 'react';
import BookService from '../../services/BookService';
import { useAuth } from '../../auth/AuthContext';
import styles from './BorrowedBooks.module.css';

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const data = await BookService.getMyBorrowedBooks();
        const booksWithImages = await Promise.all(
          data
            .filter(borrow => !borrow.returned)
            .map(async (borrow) => ({
              ...borrow,
              book: {
                ...borrow.book,
                image: await BookService.getBookImage(borrow.book.id)
              }
            }))
        );
        setBorrowedBooks(booksWithImages);
      } catch (error) {
        console.error('Failed to load borrowed books:', error);
      }
    };

    fetchBorrowedBooks();
  }, []);

  const handleReturn = async (borrowId) => {
    try {
      await BookService.returnBook(borrowId);
      setBorrowedBooks(prev => prev.filter(b => b.id !== borrowId));
    } catch (error) {
      alert('Failed to return book.');
    }
  };

  if (borrowedBooks.length === 0) {
    return <div className={styles.empty}>You have no borrowed books.</div>;
  }

  return (
    <div className={styles.borrowedBooksContainer}>
      {borrowedBooks.map(({ id, book, borrowDate }) => (
        <div key={id} className={styles.bookCard}>
          <img
            src={book.image || '/placeholder.png'}
            alt={book.title}
            className={styles.bookImage}
          />
          <div className={styles.bookInfo}>
            <h3 className={styles.title}>{book.title}</h3>
            <p className={styles.author}>by {book.author}</p>
            <p className={styles.meta}><strong>Language:</strong> {book.language}</p>
            <p className={styles.meta}><strong>Publisher:</strong> {book.publisher}</p>
            <p className={styles.date}>Borrowed on: {new Date(borrowDate).toLocaleDateString()}</p>
            <button
              onClick={() => handleReturn(id)}
              className={`${styles.actionButton} ${styles.returnButton}`}
            >
              Return
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BorrowedBooks;
