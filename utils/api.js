import axios from "axios";
import { showSessionExpiredMessage } from "./sessionUtils";
const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://render-server-app.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});

let isLoggingOut = false; // ✅ Prevent infinite API requests after logout

// ✅ Automatically attach Authorization header
api.interceptors.request.use((config) => {
  if (isLoggingOut) {
    return Promise.reject(new Error("User logged out, stopping requests"));
  }

  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Detect expired tokens softly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !isLoggingOut
    ) {
      console.warn("Session expired. Redirecting to home...");

      // ✅ Prevent multiple logout actions
      isLoggingOut = true;
      sessionStorage.setItem("loggedOut", "true");

      // ✅ Show a soft message instead of redirecting immediately
      showSessionExpiredMessage();

      // ✅ Clear auth data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // ✅ Redirect only if NOT already on home/login
      //   if (!["/", "/user/signin"].includes(window.location.pathname)) {
      //     window.location.href = "/";
      //   }

      // ✅ Reset after 5 seconds to allow new logins
      setTimeout(() => {
        isLoggingOut = false;
        sessionStorage.removeItem("loggedOut");
      }, 5000);
    }

    return Promise.reject(error);
  }
);

export default api;

//
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const api = axios.create({
//   baseURL: BASE_URL,
// });

// let isLoggingOut = false; // ✅ Prevent infinite API requests after logout

// // ✅ Automatically attach Authorization header
// api.interceptors.request.use((config) => {
//   // Stop making API requests if user is logged out
//   if (isLoggingOut || sessionStorage.getItem("loggedOut") === "true") {
//     return Promise.reject(new Error("User logged out, stopping requests"));
//   }

//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // ✅ Detect expired tokens softly
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (
//       (error.response?.status === 401 || error.response?.status === 403) &&
//       !isLoggingOut
//     ) {
//       console.warn("Session expired. Redirecting to home...");

//       // ✅ Prevent multiple logouts
//       isLoggingOut = true;
//       sessionStorage.setItem("loggedOut", "true");

//       // ✅ Clear auth data
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");

//       // ✅ Redirect only if NOT already on home/login
//       if (
//         !["/", "/user/signin"].includes(window.location.pathname) &&
//         !window.location.pathname.startsWith("/public")
//       ) {
//         window.location.href = "/"; // Redirect to home
//       }

//       // ✅ Reset after 5 seconds to allow new logins
//       setTimeout(() => {
//         isLoggingOut = false;
//         sessionStorage.removeItem("loggedOut");
//       }, 5000);
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

//
//
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const api = axios.create({
//   baseURL: BASE_URL,
// });

// // ✅ Automatically attach Authorization header
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // ✅ Automatically detect expired tokens
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       alert("Session expired. Please log in again.");
//       localStorage.removeItem("accessToken");
//       //   window.location.href = "/signin";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
