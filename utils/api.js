import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ Automatically attach Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Automatically detect expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // alert("Session expired. Please log in again.");
      localStorage.removeItem("accessToken");
      //   window.location.href = "/signin";
    } else if (error.response?.status === 403) {
      console.warn("🚫 Forbidden: User does not have permission.");
      // don't log them out
    }

    return Promise.reject(error);
  }
);

export default api;
