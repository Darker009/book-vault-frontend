import React, { useEffect, useState } from "react";
import RecommendationService from "../service/BookService";
import styles from "../style/AdminRecommendations.module.css";

const AdminRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await RecommendationService.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      setError("Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
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
                  {rec.recommendedBooks.map((title, i) => (
                    <span key={i} className={styles.badge}>
                      {title}
                    </span>
                  ))}
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
