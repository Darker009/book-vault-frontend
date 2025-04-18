import React, { useEffect, useState } from "react";
import BorrowService from "../service/BookService";
import styles from "../style/AdminBorrows.module.css";

const AdminBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [error, setError] = useState("");

  const fetchBorrows = async () => {
    try {
      const data = await BorrowService.getAllBorrows();
      console.log(data);
      setBorrows(data);
    } catch (err) {
      setError("Failed to fetch borrow records.");
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📖 Borrow Records</h2>

      {error && <div className={styles.error}>{error}</div>}

      {borrows.length === 0 ? (
        <p>No borrow records found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Book</th>
              <th>Borrowed On</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Returned On</th> {/* Added Returned On column */}
            </tr>
          </thead>
          <tbody>
            {borrows.map((b) => (
              <tr key={b.id}>
                <td>{b.studentName}</td>
                <td>{b.bookTitle}</td>
                <td>{b.borrowDate}</td>
                <td>{b.dueDate}</td>
                <td className={b.overdue ? styles.overdue : ""}>
                  {b.overdue ? "Overdue" : "On Time"}
                </td>
                <td>{b.returned ? "Return" : "Not Returned"}</td> {/* Show return date if book is returned */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBorrows;
