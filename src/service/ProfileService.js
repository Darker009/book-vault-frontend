import api from "./api";

const getProfile = async (userId) => {
  const response = await api.get(`/auth/profile/${userId}`);
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put("/auth/profile/update", profileData);
  return response.data;
};

const ProfileService = {
  getProfile,
  updateProfile,
};

export default ProfileService;
