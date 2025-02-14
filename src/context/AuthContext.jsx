import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
// import axios from "axios";
import api from "../../utils/api"; // ✅ Import global API interceptor
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { showSessionExpiredMessage } from "../../utils/sessionUtils";

// const BASE_URL = "https://render-server-app.onrender.com";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes inactivity

const AuthContext = createContext();

// Check token validity based on expiration
const checkTokenValidity = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const AuthProvider = ({ children }) => {
  const inactivityTimer = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [allUsers, setAllUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("loggedOut") === "true") {
      showSessionExpiredMessage();
      sessionStorage.removeItem("loggedOut"); // ✅ Remove flag after showing
    }
  }, []);

  // Logout function
  const signoutUser = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) throw new Error("No refresh token provided");

      // Make sign-out request
      const response = await api.post(
        `${BASE_URL}`,
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Clear local storage and reset authentication state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/user/signin");

      return { success: response.data?.msg };
    } catch (error) {
      return { error: error.response?.data?.msg || "Sign-out failed" };
    }
  }, [navigate]);

  // Function to automatically logout user on token expiration
  const autoLogoutOnTokenExpiration = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token || !checkTokenValidity(token)) {
      signoutUser();
    }
  }, [signoutUser]);

  useEffect(() => {
    // Function to reset the inactivity timer
    const resetInactivityTimer = () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      inactivityTimer.current = setTimeout(() => {
        console.warn("Logged out due to inactivity");
        signoutUser();
      }, INACTIVITY_LIMIT); // Log out after inactivity
    };

    // Initialize user session on mount
    const token = localStorage.getItem("accessToken");
    if (token && checkTokenValidity(token)) {
      setIsAuthenticated(true);
      setUser(jwtDecode(token));
    } else {
      signoutUser();
    }
    setLoading(false);

    // Monitor user activity
    const activityEvents = ["mousemove", "keydown", "click"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    // Periodic token expiration check
    const interval = setInterval(autoLogoutOnTokenExpiration, 60000); // Check every 1 minute

    // Cleanup on unmount
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      clearInterval(interval);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
    };
  }, [
    signoutUser,
    // checkTokenValidity,
    setIsAuthenticated,
    setUser,
    setLoading,
    autoLogoutOnTokenExpiration,
  ]);

  // Sign-in function
  const signinUser = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post(`${BASE_URL}/user/signin`, credentials);

      console.log("BASE_URL:", import.meta.env.VITE_BACKEND_URL);

      const { accessToken, refreshToken } = response.data;

      // Decode and verify role
      const decoded = jwtDecode(accessToken);
      if (!["user", "customer"].includes(decoded.role)) {
        return { error: "Unauthorized role for sign-in" };
      }

      // Store tokens and decode user info
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);

      // const decoded = jwtDecode(accessToken);
      setUser(decoded);
      setIsAuthenticated(true);
      navigate("/user/profile");
      return { success: response?.data.msg };
    } catch (error) {
      return { error: error.response?.data?.msg || "Sign-in failed" };
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================

  // Fetch the logged-in user’s profile
  const fetchUserProfile = useCallback(async () => {
    try {
      // ✅ Ensure token exists before fetching profile
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found. User is logged out.");
      }

      // ✅ Fetch user profile
      const response = await api.get("/user/profile"); // Use the global `api`
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Fetch profile error:",
        error.response?.data || error.message
      );

      // ✅ If user is logged out, reset everything
      if (error.message.includes("User logged out")) {
        setUser(null);
        setIsAuthenticated(false);
      }

      throw new Error(error.response?.data?.msg || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile(); // Fetch user when the provider mounts
  }, [fetchUserProfile]);

  // =============================================================
  const createUser = async (userData) => {
    console.log("📌 Sending user data to backend:", userData);

    try {
      setLoading(true);
      const response = await api.post("/user/signup", userData);

      const createdUser = response?.data?.user || response?.data;

      console.log("✅ Created User:", createdUser);

      setNewUser(createdUser);
      getAllUsers(); // ✅ Refresh user list after adding new user

      return { success: true, msg: response?.data?.msg, createdUser };
    } catch (error) {
      console.error(
        "❌ Signup Error:",
        error.response?.data?.msg || error?.msg
      );

      return {
        success: false,
        msg: error.response?.data?.msg || "Signup failed. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password request
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await api.post(
        `${BASE_URL}/user/forgot-password`,
        email
      ); // Wrap email in an object
      return { success: response.data };
    } catch (error) {
      console.error("Forgot Password Error:", error);
      throw new Error(
        error.response?.data?.msg || "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset password using reset token (for locked-out users)
  const resetPassword = async (resetToken, newPassword) => {
    try {
      const response = await api.post(
        `${BASE_URL}/user/reset-password/${resetToken}`,
        newPassword,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.error("Reset password error:", error);
      throw new Error(error.response?.data?.msg || "Failed to reset password");
    }
  };

  // Update password from profile (for logged-in users)
  const changePassword = async (newPasswordData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.post(
        `${BASE_URL}/user/change-password`,
        { newPassword: newPasswordData.password },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      await getAllUsers();
      return { success: response.data.msg };
    } catch (error) {
      console.error(
        "Change password error:",
        error.response?.data || error.message
      );
      return {
        error: error.response?.data?.msg || "Failed to change password",
      };
    }
  };

  // Get all users
  const getAllUsers = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(`${BASE_URL}/user/all`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setAllUsers(response?.data);
      return response?.data;
    } catch (error) {
      console.error("Get all users error:", error.response?.data || error);
      throw new Error(error.response?.data?.msg || "Failed to fetch users");
    }
  }, []);

  // Get a user by ID
  const getUserById = useCallback(async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(`${BASE_URL}/user/${userId}/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      console.error("Get user by ID error:", error.response?.data || error);
      return error.response?.data?.msg || "Failed to fetch user";
    }
  }, []);

  // Get a user by ID
  const getUserByEmailOrPhone = useCallback(async (identifier) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.get(`${BASE_URL}/user/search/${identifier}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      console.error("Get user by ID error:", error.response?.data || error);
      return error.response?.data?.msg || "Failed to fetch user";
    }
  }, []);

  // Update user details
  const updateUser = async (userId, userData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const url = `${BASE_URL}/user/${userId}/update-user`;

      console.log("Updating User with URL:", url);
      console.log("Request Headers:", { Authorization: `Bearer ${token}` });
      console.log("Updated User Data:", userData);

      const response = await api.put(url, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Update User Response:", response.data);

      const updatedUser = response.data.updatedUser || response.data;
      setUser((prevUser) => ({ ...prevUser, ...updatedUser }));

      await getAllUsers();
      return { success: true, message: "User details updated successfully" };
    } catch (error) {
      console.error(
        "Update User Error:",
        error.response?.data || error.message
      );

      const errorMessage = error.response?.data?.msg || "Failed to update user";
      return { success: false, message: errorMessage };
    }
  };

  // Delete a user by ID
  const deleteUser = async (userId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await api.delete(`${BASE_URL}/user/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return { success: response.data.msg };
    } catch (error) {
      console.error("Delete user error:", error.response?.data || error);
      throw new Error(error.response?.data?.msg || "Failed to delete user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        newUser,
        allUsers,
        loading,
        isAuthenticated,

        createUser,
        signinUser,
        signoutUser,

        fetchUserProfile,
        getUserById,
        getAllUsers,
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
