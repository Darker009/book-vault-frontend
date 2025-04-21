import React, { useEffect, useState } from "react";
import BookService from "../../services/BookService";
import UserService from "../../services/UserService";
import "./AdminStats.css";

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uniqueBorrowCount, setUniqueBorrowCount] = useState(null);
    const [uniqueActiveBorrowCount, setUniqueActiveBorrowCount] = useState(null);


    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);

                const [bookStats, studentCount] = await Promise.all([
                    BookService.getBookStatistics(),
                    UserService.getCountOfStudent()
                ]);

                setStats({
                    ...bookStats,
                    totalStudents: studentCount // ✅ include this manually
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
                setError("Failed to load stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        const fetchUniqueBorrowCount = async () => {
            try {
                const borrows = await BookService.getAllBorrowedBooks();
                const seen = new Set();

                for (const borrow of borrows) {
                    const key = `${borrow.studentName}-${borrow.bookTitle}`;
                    seen.add(key);
                }

                setUniqueBorrowCount(seen.size);
            } catch (err) {
                console.error("Error fetching unique borrow count:", err);
            }
        };

        fetchUniqueBorrowCount();
    }, []);

    useEffect(() => {
        const fetchUniqueActiveBorrows = async () => {
            try {
                const activeBorrows = await BookService.getActiveBorrowedBooks();
                const seen = new Set();
                const uniquePairs = [];

                for (const borrow of activeBorrows) {
                    const key = `${borrow.studentName}-${borrow.bookName}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniquePairs.push({
                            Student: borrow.studentName,
                            Book: borrow.bookName
                        });
                    }
                }

                setUniqueActiveBorrowCount(uniquePairs.length); // Set count for stat card
            } catch (err) {
                console.error("Error fetching unique active borrows:", err);
            }
        };

        fetchUniqueActiveBorrows();
    }, []);


    const openModal = async (type) => {
        try {
            setError("");
            let data = [];
            let title = "";

            switch (type) {
                case "books":
                    const books = await BookService.getAllBooks();
                    data = books.map(({ title, author, genre }) => ({
                        Title: title,
                        Author: author,
                        Genre: genre
                    }));
                    title = "All Books";
                    break;

                case "students":
                    const [students, count] = await Promise.all([
                        UserService.getAllStudents(),
                        UserService.getCountOfStudent()
                    ]);

                    data = students.map(({ name, email }) => ({
                        Name: name,
                        Email: email
                    }));

                    title = `All Students (${count})`;
                    break;


                case "borrows":
                    const borrows = await BookService.getAllBorrowedBooks();
                    const uniquePairs = [];
                    const seen = new Set();

                    for (const borrow of borrows) {
                        const key = `${borrow.studentName}-${borrow.bookTitle}`;
                        if (!seen.has(key)) {
                            seen.add(key);
                            uniquePairs.push({
                                Student: borrow.studentName,
                                Book: borrow.bookTitle
                            });
                        }
                    }

                    data = uniquePairs;
                    title = "All Borrows (Unique)";

                    break;

                case "activeBorrows":
                    const activeBorrows = await BookService.getActiveBorrowedBooks();
                    const seenActive = new Set();
                    const uniqueActivePairs = [];

                    for (const borrow of activeBorrows) {
                        const key = `${borrow.studentName}-${borrow.bookName}`;
                        if (!seenActive.has(key)) {
                            seenActive.add(key);
                            uniqueActivePairs.push({
                                Student: borrow.studentName,
                            });
                        }
                    }

                    data = uniqueActivePairs;
                    title = "Active Borrow Records (Unique)";
                    break;


                case "overdue":
                    const overdueBooks = await BookService.getOverdueBooks();
                    data = overdueBooks.map(({ studentName, bookName, borrowedDate, dueDate }) => ({
                        Student: studentName,
                        Book: bookName,
                        Borrowed: new Date(borrowedDate).toLocaleDateString(),
                        Due: new Date(dueDate).toLocaleDateString(),
                        DaysOverdue: Math.floor((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24)),
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

    if (loading) return <div className="container">Loading stats...</div>;
    if (error) return <div className="container">{error}</div>;

    return (
        <div className="admin-stats-container">
            <h2 className="admin-stats-heading">📊 Library Stats Overview</h2>

            {stats && (
                <div className="stats-cards">
                    <div className="stat-card" onClick={() => openModal("books")}>
                        <h3>Total Books</h3>
                        <p>{stats.totalBooks ?? "N/A"}</p>
                    </div>
                    <div className="stat-card" onClick={() => openModal("students")}>
                        <h3>Total Students</h3>
                        <p>{stats.totalStudents ?? "N/A"}</p>
                    </div>

                    <div className="stat-card" onClick={() => openModal("borrows")}>
                        <h3>Total Borrows</h3>
                        <p>{uniqueBorrowCount ?? "N/A"}</p>
                    </div>

                    <div className="stat-card" onClick={() => openModal("activeBorrows")}>
                        <h3>Active Borrows</h3>
                        <p>{uniqueActiveBorrowCount ?? "N/A"}</p>
                    </div>

                    <div className="stat-card" onClick={() => openModal("overdue")}>
                        <h3>Overdue Books</h3>
                        <p>{stats.borrowStats?.overdueCount ?? "N/A"}</p>
                    </div>
                </div>
            )}

            {stats?.booksByGenre && (
                <div className="genre-section">
                    <h3>📚 Genre-wise Book Count</h3>
                    <div className="genre-list">
                        {Object.entries(stats.booksByGenre).map(([genre, count]) => (
                            <div key={genre} className="genre-item">
                                <span className="genre-name">{genre}:</span>
                                <span className="genre-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>
                            &times;
                        </button>
                        <h3 className="modal-title">{modalTitle}</h3>
                        <div className="modal-body">
                            {modalData?.length ? (
                                <table className="details-table">
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