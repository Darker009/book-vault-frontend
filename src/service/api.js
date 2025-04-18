import axios from "axios";

const api = axios.create({
  baseURL: "https://bookvault-fdwh.onrender.com/api",
});

// ✅ Add token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
