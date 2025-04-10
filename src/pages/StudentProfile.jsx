import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import ProfileService from "../service/ProfileService";
import { useNavigate } from "react-router-dom";
import styles from "../style/StudentProfileStyle.module.css";

const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const data = await ProfileService.getProfile(user.id);
      setProfile(data.userProfile || {});
    } catch (err) {
      setError("Failed to load profile");
    }
  };

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const handleEdit = () => {
    navigate("/student/profile/edit");
  };

  return (
    <div className={styles.profileContainer}>
      <h2>Your Profile</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {profile ? (
        <div className={styles.profileInfo}>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Department:</strong> {profile.department}</p>
          <p><strong>Section:</strong> {profile.section}</p>

          <button onClick={handleEdit} className={styles.editButton}>
            Edit Profile
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StudentProfile;
