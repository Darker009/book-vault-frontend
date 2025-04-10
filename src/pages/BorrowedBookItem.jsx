import React from "react";
import styles from "../style/BorrowedBooks.module.css";
import { FaExclamationTriangle } from "react-icons/fa";

const getStatusStyle = (dueDate, returned) => {
  if (returned) return "";
  const now = new Date();
  const due = new Date(dueDate);
  const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return styles.overdue;
  if (diffDays <= 2) return styles.dueSoon;
  return "";
};

const BorrowedBookItem = ({ book }) => {
  const statusClass = getStatusStyle(book.dueDate, book.returned);

  return (
    <div className={`${styles.bookCard} ${statusClass}`}>
      <h4>{book.bookTitle}</h4>
      <p>Borrowed: {book.borrowDate}</p>
      <p>Due: {book.dueDate}</p>
      {statusClass && (
        <p className={styles.status}>
          <FaExclamationTriangle />
          {statusClass === styles.overdue ? " Overdue!" : " Due Soon"}
        </p>
      )}
    </div>
  );
};

export default BorrowedBookItem;
