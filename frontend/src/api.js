import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://google-login-5ask.onrender.com",
});

// Har request ke saath agar token localStorage me hai to automatically bhej do
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
