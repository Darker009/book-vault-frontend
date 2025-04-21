import { api } from './api';  // Using named import
import { setToken, setUser, removeToken, removeUser } from './tokenService';

// Register user
export const register = async (registrationData) => {
  try {
    const formData = new FormData();
    Object.entries(registrationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'profilePic') {
        formData.append(key, value);
      }
    });

    if (registrationData.profilePic) {
      formData.append('profilePic', registrationData.profilePic);
    }

    const { data } = await api.post('/auth/register', formData);

    if (data && data.message) {
      return data.message; // Handle server success message if available
    }

    return data; // Return the response if no specific message
  } catch (error) {
    console.error('Registration failed:', error);
    let errorMessage = 'An error occurred during registration. Please try again later.';
    
    // Check if the error response contains a specific message
    if (error.response && error.response.data?.message) {
      errorMessage = error.response.data.message;
    }

    throw new Error(errorMessage);
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const { data } = await api.post('/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password
    });

    // Validate the login response structure
    if (!data || !data.token || !data.user) {
      throw new Error('Invalid login response structure');
    }

    // Validate user role
    if (!['ROLE_ADMIN', 'ROLE_STUDENT'].includes(data.user.role)) {
      throw new Error('Invalid user role');
    }

    // Store token and user data in local storage
    setToken(data.token);
    setUser(data.user);

    return data;
  } catch (error) {
    console.error('Login failed:', error);

    // Remove any stored token/user on failure
    removeToken();
    removeUser();
    
    let errorMessage = 'Login failed. Please try again.';
    if (error.response && error.response.data?.message) {
      errorMessage = error.response.data.message || errorMessage;
    }

    throw new Error(errorMessage);
  }
};

// Logout user
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Always remove token and user data on logout
    removeToken();
    removeUser();
  }
};

// Default export as an object containing all auth functions
const AuthService = {
  register,
  login,
  logout
};

export default AuthService;
