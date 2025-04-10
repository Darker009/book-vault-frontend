// src/pages/AdminProfile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import ProfileService from "../service/ProfileService";
import styles from "../style/AdminProfileStyle.module.css";

const AdminProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    designation: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await ProfileService.getProfile(user.id);
      const fetchedProfile = data.userProfile;
      setProfile(fetchedProfile);
      setFormData({
        name: fetchedProfile?.name || "",
        department: fetchedProfile?.department || "",
        designation: fetchedProfile?.designation || "",
      });
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await ProfileService.updateProfile({
        userId: user.id,
        ...formData,
      });
      setMessage("Profile updated successfully");
      setIsEditing(false);
      fetchProfile(); // Refresh profile view
    } catch (err) {
      setError("Update failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.profileContainer}>
      <h2>Admin Profile</h2>

      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!isEditing ? (
        profile && (
          <div className={styles.profileDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Name:</span>
              <span className={styles.detailValue}>{profile.name || "Not provided"}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Email:</span>
              <span className={styles.detailValue}>{user.email}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Department:</span>
              <span className={styles.detailValue}>{profile.department || "Not provided"}</span>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Edit Profile
            </button>
          </div>
        )
      ) : (
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
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminProfile;
