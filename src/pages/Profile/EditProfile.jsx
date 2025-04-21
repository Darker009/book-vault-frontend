import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import { getUser } from '../../services/tokenService';
import './EditProfile.css';

const EditProfile = () => {
    const storedUser = getUser();
    const userId = storedUser?.id;
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: '',
        email: '',
        department: '',
        section: '',
    });
    const [profileImage, setProfileImage] = useState(null); 
    const [profileImageFile, setProfileImageFile] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

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

                if (profileData.profilePic && profileData.profilePic !== '/default-profile.png') {
                    setProfileImage(profileData.profilePic);
                } else {
                    const base64Img = await UserService.getProfileImage(userId);
                    setProfileImage(base64Img);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file); // save the actual file
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result); // show preview
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await UserService.updateProfile(userId, profile, profileImageFile); // pass image file
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => {
                navigate('/profile');
            }, 1000);
        } catch (err) {
            setError('Failed to update profile. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="edit-profile-container">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileUpdate} className="edit-profile-form">
                {successMessage && <div className="success-message">{successMessage}</div>}
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="department">Department:</label>
                    <input
                        type="text"
                        id="department"
                        name="department"
                        value={profile.department || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="section">Section:</label>
                    <input
                        type="text"
                        id="section"
                        name="section"
                        value={profile.section || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="profileImage">Profile Picture:</label>
                    <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {profileImage && (
                        <div className="profile-image-preview">
                            <img
                                src={profileImage}
                                alt="Profile Preview"
                                className="profile-pic-preview"
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
