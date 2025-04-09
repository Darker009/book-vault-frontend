import api from "./api";

const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

const login = async (credentials) => {
  try {
    // Clear any existing token before logging in:
    localStorage.removeItem("token");
    const response = await api.post("/auth/login", credentials);
    const data = response.data;

    // Save user and token
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    return data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

const AuthService = {
  register,
  login,
  getCurrentUser,
  logout,
};

export default AuthService;
