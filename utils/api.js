import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure JSON by default (safe)
    config.headers = config.headers || {};
    if (!config.headers["Content-Type"] && config.method !== "get") {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Token invalid/expired
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } else if (status === 403) {
      console.warn("🚫 Forbidden: User does not have permission.");
    }

    return Promise.reject(error);
  },
);

export default api;
