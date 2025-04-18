import React, { useEffect, useState } from "react";
import BookService from "../service/BookService";
import styles from "../style/AdminStats.module.css";

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await BookService.getSummaryStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const openModal = async (type) => {
    try {
      setError("");
      let data = [];
      let title = "";

      switch (type) {
        case "books":
          const books = await BookService.getAllBooks();
          data = books.map(({ title, author, genre }) => ({ Title: title, Author: author, Genre: genre }));
          title = "All Books";
          break;

        case "students":
          const students = await BookService.getAllStudents();
          data = students.map(({ userProfile, email }) => ({
            Name: userProfile?.name || "N/A",
            Email: email,
          }));
          title = "All Students";
          break;

        case "borrows":
          const borrows = await BookService.getAllBorrows();
          data = borrows.map(({ studentName }) => ({ Student: studentName}));
          title = "All Borrow Records";
          break;

        case "activeBorrows":
          const active = await BookService.getBorrowedBooks();
          data = active.map(({ studentName, bookName, borrowedDate, dueDate }) => ({
            Student: studentName,
              }));
          title = "Active Borrows";
          break;

        case "overdue":
          const allBorrows = await BookService.getAllBorrows();
          const now = new Date();
          data = allBorrows
            .filter(({ dueDate, status }) => new Date(dueDate) < now && status === "active")
            .map(({ studentName, bookName, borrowedDate, dueDate }) => ({
              Student: studentName,
              Book: bookName,
              Borrowed: new Date(borrowedDate).toLocaleDateString(),
              Due: new Date(dueDate).toLocaleDateString(),
              DaysOverdue: Math.floor((now - new Date(dueDate)) / (1000 * 60 * 60 * 24)),
            }));
          title = "Overdue Books";
          break;

        default:
          return;
      }

      setModalData(data);
      setModalTitle(title);
      setIsModalOpen(true);
    } catch (err) {
      console.error(`Error fetching ${type} data:`, err);
      setError(`Failed to load ${type} data`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setModalTitle("");
  };

  if (loading) return <div className={styles.container}>Loading stats...</div>;
  if (error) return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📊 Library Stats Overview</h2>

      {stats && (
        <div className={styles.cards}>
          <div className={styles.card} onClick={() => openModal("books")}>
            <h3>Total Books</h3>
            <p>{stats.totalBooks ?? "N/A"}</p>
          </div>
          <div className={styles.card} onClick={() => openModal("students")}>
            <h3>Total Students</h3>
            <p>{stats.totalStudents ?? "N/A"}</p>
          </div>
          <div className={styles.card} onClick={() => openModal("borrows")}>
            <h3>Total Borrows</h3>
            <p>{stats.borrowStats?.totalBorrows ?? "N/A"}</p>
          </div>
          <div className={styles.card} onClick={() => openModal("activeBorrows")}>
            <h3>Active Borrows</h3>
            <p>{stats.borrowStats?.activeBorrows ?? "N/A"}</p>
          </div>
          <div className={styles.card} onClick={() => openModal("overdue")}>
            <h3>Overdue Books</h3>
            <p>{stats.borrowStats?.overdueCount ?? "N/A"}</p>
          </div>
        </div>
      )}

      {stats?.booksByGenre && (
        <div className={styles.genreSection}>
          <h3>📚 Genre-wise Book Count</h3>
          <div className={styles.genreList}>
            {Object.entries(stats.booksByGenre).map(([genre, count]) => (
              <div key={genre} className={styles.genreItem}>
                <span className={styles.genreName}>{genre}:</span>
                <span className={styles.genreCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <h3 className={styles.modalTitle}>{modalTitle}</h3>
            <div className={styles.modalContent}>
              {modalData?.length ? (
                <table className={styles.detailsTable}>
                  <thead>
                    <tr>
                      {Object.keys(modalData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modalData.map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).map((val, i) => (
                          <td key={i}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
