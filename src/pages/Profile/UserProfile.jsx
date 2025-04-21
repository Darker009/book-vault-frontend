import React, { useEffect, useState } from 'react';
import UserService from '../../services/UserService';
import { getUser } from '../../services/tokenService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './UserProfile.css'; // Rename AdminProfile.css if needed

const UserProfile = () => {
    const storedUser = getUser();
    const userId = storedUser?.id;
    const navigate = useNavigate(); // Initialize navigate

    const [profile, setProfile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setError('No user logged in');
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoading(true);
                const profileData = await UserService.getProfile(userId);
                setProfile(profileData);
                setError(null);

                if (!profileData.profilePic || profileData.profilePic === '/default-profile.png') {
                    const profileImageData = await UserService.getProfileImage(userId);
                    setProfileImage(profileImageData);
                } else {
                    setProfileImage(profileData.profilePic);
                }
            } catch (err) {
                console.error('Failed to load profile:', err);
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const getProfileImageUrl = () => profileImage || '/default-profile.png';

    if (loading) return <div className="loading-spinner">Loading profile...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!profile) return <div className="error-message">No profile data available</div>;

    return (
        <div className="user-profile-container">
            <div className="header-section">
                <h2>👤 Profile</h2>
            </div>

            <div className="profile-card">
                <div className="profile-pic-container">
                    <img 
                        src={getProfileImageUrl()}
                        alt="Profile"
                        className="profile-pic"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-profile.png';
                        }}
                    />
                </div>

                <div className="profile-details">
                    <div className="detail-row">
                        <span className="detail-label">Name:</span>
                        <span className="detail-value">{profile.name}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{profile.email}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Department:</span>
                        <span className="detail-value">{profile.department || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Section:</span>
                        <span className="detail-value">{profile.section || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Role:</span>
                        <span className="detail-value">{profile.role?.replace('ROLE_', '') || 'User'}</span>
                    </div>
                </div>
                {/* Add the Edit Profile button */}
                <button 
                    className="edit-profile-button" 
                    onClick={() => navigate('/user/edit-profile')} 
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
