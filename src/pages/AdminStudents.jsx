import React, { useEffect, useState } from "react";
import UserService from "../service/BookService"; // Update this import to match your actual service
import styles from "../style/AdminStudents.module.css"; // Make sure your CSS module file exists

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setError("No token found, please log in.");
      return;
    }
  
    try {
      const data = await UserService.getAllStudents(token);
      console.log("Fetched students:", data); // Log the fetched students
      setStudents(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };
  

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className={styles.container}>
      <h2>👥 Registered Students</h2>

      {/* Error message display */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Display message when no students are found */}
      {students.length === 0 ? (
        <p className={styles.emptyMessage}>No students found.</p>
      ) : (
        <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.userProfile.name}</td>
              <td>{student.email}</td>
              <td>{student.role}</td> {/* Remove replace() */}
            </tr>
          ))}
        </tbody>
      </table>
      
      )}
    </div>
  );
};

export default AdminStudents;
