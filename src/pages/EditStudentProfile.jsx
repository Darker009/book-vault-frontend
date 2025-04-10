// src/pages/student/EditStudentProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import ProfileService from "../service/ProfileService";
import styles from "../style/EditStyle.module.css";

const EditStudentProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    section: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await ProfileService.getProfile(user.id);
        const profile = data.userProfile || {};
        setFormData({
          name: profile.name || "",
          department: profile.department || "",
          section: profile.section || "",
        });

      } catch (err) {
        setError("Failed to load profile");
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await ProfileService.updateProfile({
        userId: user.id,
        ...formData,
      });
      navigate("/student/profile"); // ✅ redirect after update
    } catch (err) {
      setError("Update failed");
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Edit Student Profile</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Section</label>
          <input
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/student/profile")}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudentProfile;
