import api from './api';

// ✅ Exportable if needed by other services
export const arrayBufferToBase64 = (arrayBuffer) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // base64 string
    reader.onerror = reject;
    reader.readAsDataURL(new Blob([arrayBuffer]));
  });
};

//used
  const getProfile = async (userId) => {
  if (!userId) throw new Error('User ID is required to fetch profile');
  const { data } = await api.get(`/auth/profile/${userId}`);
  return {
    ...data,
    profilePicUrl: data.profilePicUrl || '/default-profile.png',
  };
};

//used
const getProfileImage = async (userId) => {
  if (!userId) throw new Error('User ID is required to fetch profile image');
  try {
    const { data } = await api.get(`/auth/profile-pic/${userId}`, { responseType: 'arraybuffer' });
    return await arrayBufferToBase64(data);
  } catch (err) {
    console.error(`Failed to fetch profile image for user ${userId}:`, err);
    return '/default-profile.png';
  }
};
//used
const getAllStudents = async () => {
  try {
    const { data } = await api.get('/auth/students');
    return data;
  } catch (err) {
    console.error('Failed to fetch student list:', err);
    throw err;
  }
};
//used
const getCountOfStudent = async () => {
  try {
    const {data} = await api.get('/auth/count');
    return data;
  } catch (error) {
    console.error('Failed to fetch student list:', err);
    throw err;
  }
};

//used
const getStudentProfileImages = async (studentList) => {
  const promises = studentList.map(async (student) => {
    const image = await getProfileImage(student.id);
    return { ...student, profilePicUrl: image };
  });
  return Promise.all(promises);
};

//used
  const updateProfile = async (userId, profileData, profileImageFile) => {
  if (!userId) throw new Error('User ID is required to update profile');

  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('name', profileData.name);
  formData.append('department', profileData.department);
  formData.append('section', profileData.section);
  if (profileImageFile) {
    formData.append('profilePic', profileImageFile);
  }

  try {
    const { data } = await api.put('/auth/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
        // Authorization header likely handled by axios interceptor
      }
    });
    return data;
  } catch (err) {
    console.error('Failed to update profile:', err);
    throw err;
  }
};

export default {
  getProfile,
  getProfileImage,
  getAllStudents,
  getStudentProfileImages,
  getCountOfStudent,
  updateProfile
};
