import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import ProfileService from "../service/ProfileService";
import styles from "../style/ProfileStyle.module.css";

const StudentProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    section: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const data = await ProfileService.getProfile(user.id);
      const profile = data.userProfile;

      if (profile) {
        setFormData({
          name: profile.name || "",
          department: profile.department || "",
          section: profile.section || "",
        });
      }
    } catch (err) {
      setError("Failed to load profile");
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
    } catch (err) {
      setError("Update failed");
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Update Your Profile</h2>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />
        <input
          type="text"
          name="section"
          placeholder="Section"
          value={formData.section}
          onChange={handleChange}
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default StudentProfile;
