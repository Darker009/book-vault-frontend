import React, { useEffect, useState } from "react";
import RecommendationService from "../service/BookService";
import styles from "../style/AdminRecommendations.module.css";

const AdminRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetching book recommendations
  const fetchRecommendations = async (bookId) => {
    setLoading(true);
    try {
      const data = await RecommendationService.getRecommendations(bookId);
      console.log(data);
      if (Array.isArray(data)) {
        setRecommendations(data);
      } else {
        setError("Invalid data format received.");
      }
    } catch (err) {
      setError("Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommendations when the component mounts
  useEffect(() => {
    const bookId = 1; // Replace with the dynamic value for the bookId
    fetchRecommendations(bookId);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📚 Book Recommendations</h2>

      {loading ? (
        <p className={styles.loading}>Loading recommendations...</p>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : recommendations.length === 0 ? (
        <p className={styles.empty}>No recommendations available.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Book</th>
              <th>Recommended Books</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec, index) => (
              <tr key={index}>
                <td>{rec.bookTitle}</td>
                <td>
                  {rec.recommendedBooks && rec.recommendedBooks.length > 0 ? (
                    rec.recommendedBooks.map((title, i) => (
                      <span key={i} className={styles.badge}>
                        {title}
                      </span>
                    ))
                  ) : (
                    <span>No recommendations available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminRecommendations;
