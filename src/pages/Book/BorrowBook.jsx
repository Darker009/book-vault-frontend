import React, { useEffect, useState } from 'react';
import BookService from '../../services/BookService';
import { useAuth } from '../../auth/AuthContext';
import styles from './BorrowBook.module.css';

const BorrowBook = () => {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allBooks, borrowed] = await Promise.all([
          BookService.getAllBooks(),
          BookService.getMyBorrowedBooks()
        ]);

        const booksWithImages = await Promise.all(
          allBooks.map(async (book) => ({
            ...book,
            image: await BookService.getBookImage(book.id)
          }))
        );

        setBooks(booksWithImages);
        setBorrowedBooks(borrowed);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      await BookService.borrowBook(bookId);
      const updatedBorrowed = await BookService.getMyBorrowedBooks();
      setBorrowedBooks(updatedBorrowed);
    } catch (error) {
      alert('Failed to borrow book. You might have reached your limit or already borrowed it.');
    }
  };

  const handleReturn = async (borrowId) => {
    try {
      await BookService.returnBook(borrowId);
      const updatedBorrowed = await BookService.getMyBorrowedBooks();
      setBorrowedBooks(updatedBorrowed);
    } catch (error) {
      alert('Failed to return book.');
    }
  };

  const isBorrowed = (bookId) => {
    return borrowedBooks.find(borrow => borrow.book.id === bookId && !borrow.returned);
  };

  const borrowedCount = borrowedBooks.filter(b => !b.returned).length;

  const filteredBooks = books.filter(book =>
    [book.title, book.author, book.isbn, ...(book.tags || [])]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by title, author, ISBN or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.bookGrid}>
        {filteredBooks.map((book) => {
          const borrowedInfo = isBorrowed(book.id);
          return (
            <div key={book.id} className={styles.bookCard}>
              <img
                src={book.image || '/placeholder.png'}
                alt={book.title}
                className={styles.bookImage}
              />
              <h2 className={styles.bookTitle}>{book.title}</h2>
              <p className={styles.bookAuthor}>by {book.author}</p>
              <p className={styles.bookMeta}><strong>Language:</strong> {book.language}</p>
              <p className={styles.bookMeta}><strong>Publisher:</strong> {book.publisher}</p>

              {borrowedInfo ? (
                <button
                  onClick={() => handleReturn(borrowedInfo.id)}
                  className={`${styles.actionButton} ${styles.returnButton}`}
                >
                  Return
                </button>
              ) : (
                <button
                  onClick={() => handleBorrow(book.id)}
                  className={`${styles.actionButton} ${styles.borrowButton}`}
                  disabled={borrowedCount >= 3}
                >
                  {borrowedCount >= 3 ? 'Limit Reached' : 'Borrow'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BorrowBook;
