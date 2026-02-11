// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../utils/api";

const AuthContext = createContext();

const INACTIVITY_LIMIT = 15 * 60 * 1000;

const checkTokenValidity = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded?.exp ? decoded.exp * 1000 > Date.now() : false;
  } catch {
    return false;
  }
};

const AuthProvider = ({ children }) => {
  const inactivityTimer = useRef(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [allUsers, setAllUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const signoutUser = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/user/signout", { refreshToken });
      }
    } catch (err) {
      console.warn("User signout request failed (continuing).");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/user/signin");
    }
  }, [navigate]);

  const autoLogoutOnTokenExpiration = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    if (!checkTokenValidity(token)) signoutUser();
  }, [signoutUser]);

  // Fetch logged-in profile
  const fetchUserProfile = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !checkTokenValidity(token)) {
      setLoading(false);
      return null;
    }

    try {
      const res = await api.get("/user/profile");
      setUser(res.data);
      setIsAuthenticated(true);
      return res.data;
    } catch (error) {
      console.error("❌ Fetch profile error:", error?.response?.data || error);

      if (error.response?.status === 401) {
        await signoutUser();
      }
      // 403 means: endpoint is restricted; don't logout.
      return null;
    } finally {
      setLoading(false);
    }
  }, [signoutUser]);

  // Init session once
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token && checkTokenValidity(token)) {
      setIsAuthenticated(true);
      setUser(jwtDecode(token)); // quick snapshot
      fetchUserProfile(); // server truth
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }

    const resetInactivityTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        console.warn("Logged out due to inactivity");
        signoutUser();
      }, INACTIVITY_LIMIT);
    };

    ["mousemove", "keydown", "click"].forEach((evt) =>
      window.addEventListener(evt, resetInactivityTimer),
    );

    const interval = setInterval(autoLogoutOnTokenExpiration, 60000);

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      clearInterval(interval);
      ["mousemove", "keydown", "click"].forEach((evt) =>
        window.removeEventListener(evt, resetInactivityTimer),
      );
    };
  }, [fetchUserProfile, signoutUser, autoLogoutOnTokenExpiration]);

  const signinUser = async (credentials) => {
    setLoading(true);
    try {
      const res = await api.post("/user/signin", credentials);
      const { accessToken, refreshToken } = res.data || {};

      if (!accessToken) return { error: "No access token returned." };

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      const decoded = jwtDecode(accessToken);

      // Keep your restriction if you want it
      if (!["user", "customer"].includes(decoded.role)) {
        return { error: "Unauthorized role for sign-in" };
      }

      setUser(decoded);
      setIsAuthenticated(true);

      await fetchUserProfile();

      navigate("/user/profile");
      return { success: res.data?.msg || "Signed in" };
    } catch (error) {
      return { error: error.response?.data?.msg || "Sign-in failed" };
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (payload) => {
    setLoading(true);
    try {
      const res = await api.post("/user/signup", payload);
      return { success: res.data?.msg || "User created" };
    } catch (error) {
      return { error: error.response?.data?.msg || "An error occurred." };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const res = await api.post("/user/forgot-password", { email });
      return { success: res.data };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (resetToken, password) => {
    const res = await api.post(`/user/reset-password/${resetToken}`, {
      password,
    });
    return res.data;
  };

  const changePassword = async (newPassword) => {
    try {
      const res = await api.post("/user/change-password", { newPassword });
      return { success: res.data?.msg || "Password changed" };
    } catch (error) {
      return {
        error: error.response?.data?.msg || "Failed to change password",
      };
    }
  };

  // ADMIN ONLY: only call from admin screens
  const getAllUsers = useCallback(async () => {
    try {
      const res = await api.get("/user/all");
      setAllUser(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  }, []);

  const getUserById = useCallback(async (userId) => {
    try {
      const res = await api.get(`/user/${userId}/profile`);
      return res.data;
    } catch (error) {
      return error.response?.data?.msg || "Failed to fetch user";
    }
  }, []);

  const updateUser = async (userId, payload) => {
    try {
      const res = await api.put(`/user/${userId}/update-user`, payload);
      const updatedUser = res.data?.updatedUser || res.data;
      setUser((prev) => ({ ...prev, ...updatedUser }));
      return { success: true, msg: "User details updated successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.msg || "Failed to update user",
      };
    }
  };

  const deleteUser = async (userId) => {
    const res = await api.delete(`/user/${userId}`);
    return { success: res.data?.msg || "Deleted" };
  };

  const getUserByEmailOrPhone = useCallback(async (identifier) => {
    try {
      const res = await api.get(`/user/search/${identifier}`);
      return res.data;
    } catch (error) {
      return error.response?.data?.msg || "Failed to fetch user";
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        loading,
        isAuthenticated,

        createUser,
        signinUser,
        signoutUser,
        fetchUserProfile,

        getAllUsers,
        getUserById,
        updateUser,
        deleteUser,
        getUserByEmailOrPhone,

        forgotPassword,
        resetPassword,
        changePassword,

        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export { AuthProvider, useAuth };

// import React, {
//   createContext,
//   useState,
//   useContext,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";
// // import axios from "axios";
// import api from "../../utils/api"; // ✅ Import global API interceptor
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { getHeaders } from "./getHeader";

// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes inactivity

// const AuthContext = createContext();

// // Check token validity based on expiration
// const checkTokenValidity = (token) => {
//   if (!token) return;
//   try {
//     const decoded = jwtDecode(token);
//     return decoded.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// //
// const AuthProvider = ({ children }) => {
//   const inactivityTimer = useRef(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [allUsers, setAllUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();

//   // Logout function
//   const signoutUser = useCallback(async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");

//       if (!refreshToken) throw new Error("No refresh token provided");

//       // Make sign-out request
//       const response = await api.post(
//         `${BASE_URL}/user/signout`,
//         { refreshToken },
//         { headers: getHeaders() }
//       );

//       // Clear local storage and reset authentication state
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       setUser(null);
//       setIsAuthenticated(false);
//       navigate("/user/signin");

//       return { success: response.data?.msg };
//     } catch (error) {
//       if (error.response?.status === 401) {
//         console.warn("⚠️ Signout failed: already unauthorized.");
//       } else {
//         console.error("Error signing out:", error);
//       }
//     }
//   }, [navigate]);

//   // Function to automatically logout user on token expiration
//   const autoLogoutOnTokenExpiration = useCallback(() => {
//     const token = localStorage.getItem("accessToken");
//     if (!token || !checkTokenValidity(token)) {
//       signoutUser();
//     }
//   }, [signoutUser]);

//   useEffect(() => {
//     // Function to reset the inactivity timer
//     const resetInactivityTimer = () => {
//       if (inactivityTimer.current) {
//         clearTimeout(inactivityTimer.current);
//       }
//       inactivityTimer.current = setTimeout(() => {
//         console.warn("Logged out due to inactivity");
//         signoutUser();
//       }, INACTIVITY_LIMIT); // Log out after inactivity
//     };

//     // Initialize user session on mount
//     const token = localStorage.getItem("accessToken");
//     if (token && checkTokenValidity(token)) {
//       setIsAuthenticated(true);
//       setUser(jwtDecode(token));
//     } else {
//       signoutUser();
//     }
//     setLoading(false);

//     // Monitor user activity
//     const activityEvents = ["mousemove", "keydown", "click"];
//     activityEvents.forEach((event) =>
//       window.addEventListener(event, resetInactivityTimer)
//     );

//     // Periodic token expiration check
//     const interval = setInterval(autoLogoutOnTokenExpiration, 60000); // Check every 1 minute

//     // Cleanup on unmount
//     return () => {
//       if (inactivityTimer.current) {
//         clearTimeout(inactivityTimer.current);
//       }
//       clearInterval(interval);
//       activityEvents.forEach((event) =>
//         window.removeEventListener(event, resetInactivityTimer)
//       );
//     };
//   }, [
//     signoutUser,
//     setIsAuthenticated,
//     setUser,
//     setLoading,
//     autoLogoutOnTokenExpiration,
//   ]);

//   const signinUser = async (credentials) => {
//     setLoading(true);
//     try {
//       const response = await api.post(`${BASE_URL}/user/signin`, credentials);

//       const { accessToken, refreshToken } = response.data;

//       // Decode and verify role
//       const decoded = jwtDecode(accessToken);
//       if (!["user", "customer"].includes(decoded.role)) {
//         return { error: "Unauthorized role for sign-in" };
//       }

//       // Store tokens and decode user info
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       // const decoded = jwtDecode(accessToken);
//       setUser(decoded);
//       setIsAuthenticated(true);
//       navigate("/user/profile");
//       return { success: response?.data.msg };
//     } catch (error) {
//       return { error: error.response?.data?.msg || "Sign-in failed" };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==============================================================

//   // Fetch the logged-in user’s profile
//   const fetchUserProfile = useCallback(async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       if (!accessToken) {
//         console.warn("⚠️ No access token found. Not fetching profile.");
//         return;
//       }

//       const response = await api.get(`${BASE_URL}/user/profile`, {
//         headers: getHeaders(),
//       });

//       setUser(response.data);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Fetch profile error:", error?.response?.data || error);

//       // Only log out if the error is 401 Unauthorized
//       if (error.response?.status === 401) {
//         console.warn("🚨 Unauthorized response, logging out user...");
//         signoutUser();
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [signoutUser]);

//   //
//   useEffect(() => {
//     fetchUserProfile(); // Fetch user when the provider mounts
//   }, [fetchUserProfile]);

//   // Register a regular user
//   const createUser = async (userData) => {
//     try {
//       setLoading(true);
//       const response = await api.post(`${BASE_URL}/user/signup`, userData);
//       setUser(response.data);
//       return { success: response.data?.msg };
//     } catch (error) {
//       console.error("❌ API Error:", error.response?.data || error.message);
//       return { error: error.response?.data?.msg || "An error occurred." };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Forgot password request
//   const forgotPassword = async (email) => {
//     try {
//       setLoading(true);
//       const response = await api.post(
//         `${BASE_URL}/user/forgot-password`,
//         email
//       ); // Wrap email in an object
//       return { success: response.data };
//     } catch (error) {
//       console.error("Forgot Password Error:", error);
//       throw new Error(
//         error.response?.data?.msg || "An unexpected error occurred"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset password using reset token (for locked-out users)
//   const resetPassword = async (resetToken, newPassword) => {
//     try {
//       const response = await api.post(
//         `${BASE_URL}/user/reset-password/${resetToken}`,
//         newPassword,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Reset password error:", error);
//       throw new Error(error.response?.data?.msg || "Failed to reset password");
//     }
//   };

//   // Update password from profile (for logged-in users)
//   const changePassword = async (newPasswordData) => {
//     try {
//       const response = await api.post(
//         `${BASE_URL}/user/change-password`,
//         { newPassword: newPasswordData.password },
//         { headers: getHeaders() }
//       );

//       await getAllUsers();
//       return { success: response.data.msg };
//     } catch (error) {
//       console.error(
//         "Change password error:",
//         error.response?.data || error.msg
//       );
//       return {
//         error: error.response?.data?.msg || "Failed to change password",
//       };
//     }
//   };

//   // Get all users
//   const getAllUsers = useCallback(async () => {
//     try {
//       const response = await api.get("/user/all", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });
//       setAllUser(response.data);

//       return response?.data; // 👈 This must be here
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       if (error.response?.status === 403) {
//         alert("You do not have permission to access this resource.");
//       } else {
//         alert("Failed to fetch users. Please try again later.");
//       }
//     }
//   }, []);

//   // Get a user by ID
//   const getUserById = useCallback(async (userId) => {
//     try {
//       // const accessToken = localStorage.getItem("accessToken");
//       const response = await api.get(`${BASE_URL}/user/${userId}/profile`, {
//         headers: getHeaders(),
//       });

//       return response.data;
//     } catch (error) {
//       console.error("Get user by ID error:", error.response?.data || error);
//       return error.response?.data?.msg || "Failed to fetch user";
//     }
//   }, []);

//   // Update user details
//   const updateUser = async (userId, userData) => {
//     try {
//       // const token = localStorage.getItem("accessToken");
//       const url = `${BASE_URL}/user/${userId}/update-user`;

//       const response = await api.put(url, userData, {
//         headers: getHeaders(),
//       });

//       // console.log("Update User Response:", response.data);

//       const updatedUser = response.data.updatedUser || response.data;
//       setUser((prevUser) => ({ ...prevUser, ...updatedUser }));

//       await getAllUsers();
//       return { success: true, msg: "User details updated successfully" };
//     } catch (error) {
//       console.error("Update User Error:", error.response?.data || error.msg);

//       const errorMessage = error.response?.data?.msg || "Failed to update user";
//       return { success: false, message: errorMessage };
//     }
//   };

//   // Delete a user by ID
//   const deleteUser = async (userId) => {
//     try {
//       // const accessToken = localStorage.getItem("accessToken");
//       const response = await api.delete(`${BASE_URL}/user/${userId}`, {
//         headers: getHeaders(),
//       });
//       return { success: response.data.msg };
//     } catch (error) {
//       console.error("Delete user error:", error.response?.data || error);
//       throw new Error(error.response?.data?.msg || "Failed to delete user");
//     }
//   };

//   //   // Get a user by ID
//   const getUserByEmailOrPhone = useCallback(async (identifier) => {
//     try {
//       // const accessToken = localStorage.getItem("accessToken");
//       const response = await api.get(`${BASE_URL}/user/search/${identifier}`, {
//         headers: getHeaders(),
//       });

//       return response.data;
//     } catch (error) {
//       console.error("Get user by ID error:", error.response?.data || error);
//       return error.response?.data?.msg || "Failed to fetch user";
//     }
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         allUsers,
//         loading,
//         isAuthenticated,
//         getUserByEmailOrPhone,

//         createUser,
//         signinUser,
//         signoutUser,

//         fetchUserProfile,
//         getUserById,
//         getAllUsers,
//         updateUser,
//         deleteUser,

//         forgotPassword,
//         resetPassword,
//         changePassword,
//         setIsAuthenticated,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export { AuthProvider, useAuth };
