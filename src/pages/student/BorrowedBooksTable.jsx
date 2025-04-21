import React from 'react';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const BorrowedBooksTable = ({ books, borrowedBooks, onReturn }) => {
  const isBorrowed = (bookId) => {
    return borrowedBooks.find(b => b.book.id === bookId && !b.returned);
  };

  return (
    <div className="books-table">
      {books.length === 0 ? (
        <div className="empty-state">
          <p>No books found</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => {
              const borrowed = isBorrowed(book.id);
              return (
                <tr key={book.id}>
                  <td>
                    <div className="book-info">
                      <img src={book.image || '/book-placeholder.png'} alt={book.title} />
                      <div>
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {borrowed ? (
                      <span className="status borrowed">
                        <FiClock /> Borrowed
                      </span>
                    ) : (
                      <span className="status available">
                        <FiCheckCircle /> Available
                      </span>
                    )}
                  </td>
                  <td>
                    {borrowed ? new Date(borrowed.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    {borrowed ? (
                      <button 
                        className="return-btn"
                        onClick={() => onReturn(borrowed.id)}
                      >
                        <FiXCircle /> Return
                      </button>
                    ) : (
                      <button 
                        className="borrow-btn"
                        disabled={borrowedBooks.filter(b => !b.returned).length >= 3}
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

export default BorrowedBooksTable;