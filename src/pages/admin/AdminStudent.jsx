import React, { useEffect, useState } from 'react';
import UserService from '../../services/UserService';
import './AdminStudent.css';

const AdminStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const rawStudents = await UserService.getAllStudents();
        console.log('Fetched students:', rawStudents);
        const studentsWithImages = await UserService.getStudentProfileImages(rawStudents);
        setStudents(studentsWithImages);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load student list');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div className="loading-spinner">Loading students...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="admin-student-container">
      <h2>👨‍🎓 Student List</h2>
      <table className="student-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Section</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan="5">No students found</td></tr>
          ) : (
            students.map((student) => (
              <tr key={student.id}>
                <td>
                  <img
                    src={student.profilePicUrl || '/default-profile.png'}
                    alt="profile"
                    className="student-pic"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-profile.png';
                    }}
                  />
                </td>
                <td data-label="Name">{student.name}</td>
                <td data-label="Email">{student.email}</td>
                <td data-label="Department">{student.department || 'N/A'}</td>
                <td data-label="Section">{student.section || 'N/A'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStudent;
