import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
// import api from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getHeaders } from "./getHeader";
import api from "../../utils/api"; // ✅ Import global API interceptor

const StaffContext = createContext();

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Check token validity based on expiration
const checkTokenValidity = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const StaffProvider = ({ children }) => {
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staffProfile, setStaffProfile] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [staffDetailedList, setStaffDetailedList] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);

  const navigate = useNavigate();

  // console.log(BASE_URL);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && checkTokenValidity(token)) {
      setIsStaffAuthenticated(true);
      setStaffProfile(jwtDecode(token)); // Decode user info from token
    } else {
      setIsStaffAuthenticated(false);
    }
    setLoading(false);
  }, []);

  // Create a new staff member
  const createStaff = useCallback(async (staffData) => {
    try {
      setLoading(true);
      const response = await api.post(`${BASE_URL}/staff/create`, staffData, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Create Staff Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all staff members
  const getAllStaff = useCallback(async () => {
    try {
      console.log("Fetching all staff...");

      //
      const response = await api.get(`${BASE_URL}/staff/all`, {
        headers: getHeaders(),
      });

      // console.log("Response Data:", response.data);
      setStaffData(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error.response || error.message);
      throw error;
    }
  }, []);

  // Assign a role to a staff member
  const assignRole = useCallback(async (staffId, roleId) => {
    try {
      const response = await api.post(
        `${BASE_URL}/staff/assign-role`,
        { staff_id: staffId, role_id: roleId },
        { headers: getHeaders() }
      );
      return response?.data;
    } catch (error) {
      console.error("Assign Role Error:", error);
      throw error;
    }
  }, []);

  // Update a staff member's role
  const updateRole = useCallback(async (staffId, roleId) => {
    try {
      const response = await api.put(
        `${BASE_URL}/staff/${staffId}/change-role`,
        { roleId },
        { headers: getHeaders() }
      );
      return response?.data;
    } catch (error) {
      console.error("Update Role Error:", error);
      throw error;
    }
  }, []);

  // Update a staff member's role
  const updateStaff = async (staffId, staffData) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      throw new Error("Unauthorized");
    }

    try {
      const response = await api.put(
        `${BASE_URL}/staff/${staffId}/update-staff`,
        staffData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response?.data;
    } catch (error) {
      console.error(
        "Update Staff Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // Revoke a role from a staff member
  const revokeRole = useCallback(async (staffId, roleId) => {
    try {
      const response = await api.delete(`${BASE_URL}/staff/revoke-role`, {
        data: { staff_id: staffId, role_id: roleId },
        headers: getHeaders(),
      });
      return response?.data;
    } catch (error) {
      console.error("Revoke Role Error:", error);
      throw error;
    }
  }, []);

  // Assign permissions to a staff member
  const assignPermissions = useCallback(async (staffId, permissions) => {
    try {
      const response = await api.post(
        `${BASE_URL}/staff/${staffId}/assign-permissions`,
        { permissions },
        { headers: getHeaders() }
      );
      return response?.data;
    } catch (error) {
      console.error("Assign Permissions Error:", error);
      throw error;
    }
  }, []);

  // Update permissions for a staff member
  const updatePermissions = useCallback(async (staffId, permissions) => {
    try {
      const response = await api.put(
        `${BASE_URL}/staff/${staffId}/update-permissions`,
        { permissions },
        { headers: getHeaders() }
      );
      return response?.data;
    } catch (error) {
      console.error("Update Permissions Error:", error);
      throw error;
    }
  }, []);

  //Manage permissions for a staff member
  const managePermissions = useCallback(async (staffId, permissions) => {
    try {
      const response = await api.post(
        `${BASE_URL}/staff/${staffId}/manage-permissions`,
        { permissions },
        { headers: getHeaders() }
      );
      return response?.data;
    } catch (error) {
      console.error("Update Permissions Error:", error);
      throw error;
    }
  }, []);

  // Fetch permissions
  const getStaffPermissions = useCallback(async (staffId) => {
    try {
      const response = await api.get(
        `${BASE_URL}/staff/${staffId}/staff-permissions`,
        {
          headers: getHeaders(),
        }
      );

      // console.log(response?.data?.permissions);

      return response?.data?.permissions;
    } catch (error) {
      console.error("Fetch Permissions Error:", error);
      throw error;
    }
  }, []);

  // Sign in a staff member
  const signInStaff = useCallback(
    async (credentials) => {
      setLoading(true);
      try {
        // console.log("Formatted Form Data: ", import.meta.env.VITE_BACKEND_URL);
        const response = await api.post(
          `${BASE_URL}/staff/signin`,
          credentials
        );

        const { accessToken, refreshToken, staff } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setStaffProfile(staff);
        setIsStaffAuthenticated(true);
        navigate("/staff/dashboard", { replace: true });

        return response.data?.msg;
      } catch (error) {
        console.error(
          "Sign In Staff Error:",
          error.response?.data || error.message
        );
        return { error: error.response?.data?.msg || "Sign-in failed" }; // Let the calling function handle the error
      } finally {
        setLoading(false); // Ensure spinner stops in all cases
      }
    },
    [navigate]
  );

  // Sign out a staff member
  const signOutStaff = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post(
          `${BASE_URL}/staff/signout`,
          { refreshToken },
          { headers: getHeaders() }
        );
      }

      // Clear tokens and reset state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setStaffProfile(null);
      setIsStaffAuthenticated(false);

      navigate("/staff/signin");
    } catch (error) {
      console.error("Error during sign out:", error.message);
      throw error;
    }
  };

  // Fetch detailed staff members
  const getAllStaffAndDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BASE_URL}/staff/all-details`, {
        headers: getHeaders(),
      });
      setStaffDetailedList(response.data);
    } catch (error) {
      console.error("Fetch All Staff and Details Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch staff details by ID
  const getStaffById = useCallback(async (staffId) => {
    try {
      const response = await api.get(`${BASE_URL}/staff/${staffId}`, {
        headers: getHeaders(),
      });

      setStaffData(response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch Staff By ID Error:", error);
      throw error;
    }
  }, []);

  // Fetch the logged-in staff profile
  const getStaffProfile = useCallback(async () => {
    try {
      console.log("Sending request to /profile...");

      const response = await api.get(`${BASE_URL}/staff/profile`, {
        headers: getHeaders(),
      });
      setStaffProfile(response?.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching staff profile:",
        error.response?.data || error.message
      );
      return null;
    }
  }, []);

  // Forgot password for staff
  const forgotPassword = useCallback(async (email) => {
    try {
      const response = await api.post(`${BASE_URL}/staff/forgot-password`, {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Forgot Password Error:", error);
      throw error;
    }
  }, []);

  // Reset password for staff
  const resetPassword = useCallback(async (token, password) => {
    try {
      const response = await api.post(
        `${BASE_URL}/staff/reset-password/${token}`,
        {
          password,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Reset Password Error:", error);
      throw error;
    }
  }, []);

  // Refresh token for staff
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await api.post(
        `${BASE_URL}/staff/refresh-token`,
        { refreshToken },
        { headers: getHeaders() }
      );
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } catch (error) {
      console.error("Refresh Token Error:", error);
      throw error;
    }
  }, []);

  // Activate a staff member
  const activateStaff = useCallback(async (staffId) => {
    try {
      const response = await api.patch(
        `${BASE_URL}/staff/${staffId}/activate`,
        {},
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Activate Staff Error:", error);
      throw error;
    }
  }, []);

  // Deactivate a staff member
  const deactivateStaff = useCallback(async (staffId) => {
    try {
      const response = await api.patch(
        `${BASE_URL}/staff/${staffId}/deactivate`,
        {},
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Deactivate Staff Error:", error);
      throw error;
    }
  }, []);

  // Fetch roles
  const getRoles = useCallback(async () => {
    try {
      const response = await api.get(`${BASE_URL}/staff/roles`, {
        headers: getHeaders(),
      });
      setAllRoles(response.data);
    } catch (error) {
      console.error("Fetch Roles Error:", error);
      throw error;
    }
  }, []);

  // Fetch permissions
  const getPermissions = useCallback(async () => {
    try {
      const response = await api.get(`${BASE_URL}/staff/permissions`, {
        headers: getHeaders(),
      });
      setAllPermissions(response.data);
    } catch (error) {
      console.error("Fetch Permissions Error:", error);
      throw error;
    }
  }, []);

  // Delete a staff member
  const deleteStaff = useCallback(async (staffId) => {
    try {
      const response = await api.delete(`${BASE_URL}/staff/${staffId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Delete Staff Error:", error);
      throw error;
    }
  }, []);

  // utils/roleCheck.js
  const hasRole = (user, roles = []) => {
    if (!user?.roles || !Array.isArray(user.roles)) return false;

    return user.roles.some((role) => roles.includes(role.name));
  };

  return (
    <StaffContext.Provider
      value={{
        staffData,
        staffDetailedList,
        staffProfile,
        allRoles,
        allPermissions,
        loading,

        createStaff,
        getAllStaff,
        getAllStaffAndDetails,
        getStaffById,
        getStaffProfile,
        deleteStaff,

        assignRole,
        updateRole,
        updateStaff,
        revokeRole,
        assignPermissions,
        updatePermissions,

        managePermissions,
        getStaffPermissions,

        activateStaff,
        deactivateStaff,

        getRoles,
        getPermissions,
        hasRole,

        signInStaff,
        signOutStaff,
        forgotPassword,
        resetPassword,
        refreshToken,
        isStaffAuthenticated,
        setIsStaffAuthenticated,
        setStaffProfile,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};
//
// import React, {
//   createContext,
//   useState,
//   useContext,
//   useCallback,
//   useEffect,
// } from "react";
// // import api from "api";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import api from "../../utils/api"; // ✅ Import global API interceptor
// const StaffContext = createContext();

// // const BASE_URL = "https://render-server-app.onrender.com";

// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// // Check token validity based on expiration
// const checkTokenValidity = (token) => {
//   try {
//     const decoded = jwtDecode(token);
//     return decoded.exp * 1000 > Date.now();
//   } catch {
//     return false;
//   }
// };

// export const StaffProvider = ({ children }) => {
//   const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [staffProfile, setStaffProfile] = useState(null);
//   const [staffData, setStaffData] = useState([]);
//   const [staffDetailedList, setStaffDetailedList] = useState([]);
//   const [allRoles, setAllRoles] = useState([]);
//   const [allPermissions, setAllPermissions] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token && checkTokenValidity(token)) {
//       setIsStaffAuthenticated(true);
//       setStaffProfile(jwtDecode(token)); // Decode user info from token
//     } else {
//       setIsStaffAuthenticated(false);
//     }
//     setLoading(false);
//   }, []);

//   // Helper function to get authorization headers
//   const getHeaders = () => {
//     const token = localStorage.getItem("accessToken");
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   // Create a new staff member
//   const createStaff = useCallback(async (staffData) => {
//     try {
//       setLoading(true);
//       const response = await api.post(`${BASE_URL}/staff/create`, staffData, {
//         headers: getAuthHeaders(),
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Create Staff Error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch all staff members
//   const getAllStaff = useCallback(async () => {
//     try {
//       console.log("Fetching all staff...");
//       const response = await api.get(`${BASE_URL}/staff/all`, {
//         headers: getAuthHeaders(),
//       });
//       // console.log("Response Data:", response.data);
//       setStaffData(response.data);
//     } catch (error) {
//       console.error("Error fetching staff:", error.response || error.message);
//       throw error;
//     }
//   }, []);

//   // Assign a role to a staff member
//   const assignRole = useCallback(async (staffId, roleId) => {
//     try {
//       const response = await api.post(
//         `${BASE_URL}/staff/assign-role`,
//         { staff_id: staffId, role_id: roleId },
//         { headers: getAuthHeaders() }
//       );
//       return response?.data;
//     } catch (error) {
//       console.error("Assign Role Error:", error);
//       throw error;
//     }
//   }, []);

//   // Update a staff member's role
//   const updateRole = useCallback(async (staffId, roleId) => {
//     try {
//       const response = await api.put(
//         `${BASE_URL}/staff/${staffId}/change-role`,
//         { roleId },
//         { headers: getAuthHeaders() }
//       );
//       return response?.data;
//     } catch (error) {
//       console.error("Update Role Error:", error);
//       throw error;
//     }
//   }, []);

//   // Update a staff member's role
//   const updateStaff = async (staffId, staffData) => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       console.error("No access token found");
//       throw new Error("Unauthorized");
//     }

//     try {
//       const response = await api.put(
//         `${BASE_URL}/staff/${staffId}/update-staff`,
//         staffData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       return response?.data;
//     } catch (error) {
//       console.error(
//         "Update Staff Error:",
//         error.response?.data || error.message
//       );
//       throw error;
//     }
//   };

//   // Revoke a role from a staff member
//   const revokeRole = useCallback(async (staffId, roleId) => {
//     try {
//       const response = await api.delete(`${BASE_URL}/staff/revoke-role`, {
//         data: { staff_id: staffId, role_id: roleId },
//         headers: getAuthHeaders(),
//       });
//       return response?.data;
//     } catch (error) {
//       console.error("Revoke Role Error:", error);
//       throw error;
//     }
//   }, []);

//   // Assign permissions to a staff member
//   const assignPermissions = useCallback(async (staffId, permissions) => {
//     try {
//       const response = await api.post(
//         `${BASE_URL}/staff/${staffId}/assign-permissions`,
//         { permissions },
//         { headers: getAuthHeaders() }
//       );
//       return response?.data;
//     } catch (error) {
//       console.error("Assign Permissions Error:", error);
//       throw error;
//     }
//   }, []);

//   // Update permissions for a staff member
//   const updatePermissions = useCallback(async (staffId, permissions) => {
//     try {
//       const response = await api.put(
//         `${BASE_URL}/staff/${staffId}/update-permissions`,
//         { permissions },
//         { headers: getAuthHeaders() }
//       );
//       return response?.data;
//     } catch (error) {
//       console.error("Update Permissions Error:", error);
//       throw error;
//     }
//   }, []);

//   //Manage permissions for a staff member
//   const managePermissions = useCallback(async (staffId, permissions) => {
//     try {
//       const response = await api.post(
//         `${BASE_URL}/staff/${staffId}/manage-permissions`,
//         { permissions },
//         { headers: getAuthHeaders() }
//       );
//       return response?.data;
//     } catch (error) {
//       console.error("Update Permissions Error:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch permissions
//   const getStaffPermissions = useCallback(async (staffId) => {
//     try {
//       const response = await api.get(
//         `${BASE_URL}/staff/${staffId}/staff-permissions`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );

//       // console.log(response?.data?.permissions);

//       return response?.data?.permissions;
//     } catch (error) {
//       console.error("Fetch Permissions Error:", error);
//       throw error;
//     }
//   }, []);

//   // Sign in a staff member
//   const signInStaff = useCallback(
//     async (credentials) => {
//       setLoading(true);
//       try {
//         // console.log("Formatted Form Data: ", import.meta.env.VITE_BACKEND_URL);
//         const response = await api.post(
//           `${BASE_URL}/staff/signin`,
//           credentials
//         );

//         const { accessToken, refreshToken, staff } = response.data;

//         localStorage.setItem("accessToken", accessToken);
//         localStorage.setItem("refreshToken", refreshToken);

//         setStaffProfile(staff);
//         setIsStaffAuthenticated(true);
//         navigate("/staff/dashboard", { replace: true });

//         return response.data?.msg;
//       } catch (error) {
//         console.error(
//           "Sign In Staff Error:",
//           error.response?.data || error.message
//         );
//         return { error: error.response?.data?.msg || "Sign-in failed" }; // Let the calling function handle the error
//       } finally {
//         setLoading(false); // Ensure spinner stops in all cases
//       }
//     },
//     [navigate]
//   );

//   // Sign out a staff member
//   const signOutStaff = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       if (refreshToken) {
//         await api.post(
//           `${BASE_URL}/staff/signout`,
//           { refreshToken },
//           { headers: getAuthHeaders() }
//         );
//       }

//       // Clear tokens and reset state
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       setStaffProfile(null);
//       setIsStaffAuthenticated(false);

//       navigate("/staff/signin");
//     } catch (error) {
//       console.error("Error during sign out:", error.message);
//       throw error;
//     }
//   };

//   // Fetch detailed staff members
//   const getAllStaffAndDetails = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`${BASE_URL}/staff/all-details`, {
//         headers: getAuthHeaders(),
//       });
//       setStaffDetailedList(response.data);
//     } catch (error) {
//       console.error("Fetch All Staff and Details Error:", error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch staff details by ID
//   const getStaffById = useCallback(async (staffId) => {
//     try {
//       const response = await api.get(`${BASE_URL}/staff/${staffId}`, {
//         headers: getAuthHeaders(),
//       });

//       setStaffData(response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Fetch Staff By ID Error:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch the logged-in staff profile
//   const getStaffProfile = useCallback(async () => {
//     try {
//       console.log("Sending request to /profile...");

//       const response = await api.get(`${BASE_URL}/staff/profile`, {
//         headers: getAuthHeaders(),
//       });

//       // console.log("Received response from /profile:", response.data); // Log the full response

//       setStaffProfile(response?.data);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "Error fetching staff profile:",
//         error.response?.data || error.message
//       );
//       return null;
//     }
//   }, []);

//   // Forgot password for staff
//   const forgotPassword = useCallback(async (email) => {
//     try {
//       const response = await api.post(`${BASE_URL}/staff/forgot-password`, {
//         email,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Forgot Password Error:", error);
//       throw error;
//     }
//   }, []);

//   // Reset password for staff
//   const resetPassword = useCallback(async (token, password) => {
//     try {
//       const response = await api.post(
//         `${BASE_URL}/staff/reset-password/${token}`,
//         {
//           password,
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Reset Password Error:", error);
//       throw error;
//     }
//   }, []);

//   // Refresh token for staff
//   const refreshToken = useCallback(async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       const response = await api.post(
//         `${BASE_URL}/staff/refresh-token`,
//         { refreshToken },
//         { headers: getAuthHeaders() }
//       );
//       const { accessToken } = response.data;
//       localStorage.setItem("accessToken", accessToken);
//       return accessToken;
//     } catch (error) {
//       console.error("Refresh Token Error:", error);
//       throw error;
//     }
//   }, []);

//   // Activate a staff member
//   const activateStaff = useCallback(async (staffId) => {
//     try {
//       const response = await api.patch(
//         `${BASE_URL}/staff/${staffId}/activate`,
//         {},
//         {
//           headers: getAuthHeaders(),
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Activate Staff Error:", error);
//       throw error;
//     }
//   }, []);

//   // Deactivate a staff member
//   const deactivateStaff = useCallback(async (staffId) => {
//     try {
//       const response = await api.patch(
//         `${BASE_URL}/staff/${staffId}/deactivate`,
//         {},
//         {
//           headers: getAuthHeaders(),
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Deactivate Staff Error:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch roles
//   const getRoles = useCallback(async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/staff/roles`, {
//         headers: getAuthHeaders(),
//       });
//       setAllRoles(response.data);
//     } catch (error) {
//       console.error("Fetch Roles Error:", error);
//       throw error;
//     }
//   }, []);

//   // Fetch permissions
//   const getPermissions = useCallback(async () => {
//     try {
//       const response = await api.get(`${BASE_URL}/staff/permissions`, {
//         headers: getAuthHeaders(),
//       });
//       setAllPermissions(response.data);
//     } catch (error) {
//       console.error("Fetch Permissions Error:", error);
//       throw error;
//     }
//   }, []);

//   // Delete a staff member
//   const deleteStaff = useCallback(async (staffId) => {
//     try {
//       const response = await api.delete(`${BASE_URL}/staff/${staffId}`, {
//         headers: getAuthHeaders(),
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Delete Staff Error:", error);
//       throw error;
//     }
//   }, []);

//   return (
//     <StaffContext.Provider
//       value={{
//         staffData,
//         staffDetailedList,
//         staffProfile,
//         allRoles,
//         allPermissions,
//         loading,

//         createStaff,
//         getAllStaff,
//         getAllStaffAndDetails,
//         getStaffById,
//         getStaffProfile,
//         deleteStaff,

//         assignRole,
//         updateRole,
//         updateStaff,
//         revokeRole,
//         assignPermissions,
//         updatePermissions,

//         managePermissions,
//         getStaffPermissions,

//         activateStaff,
//         deactivateStaff,

//         getRoles,
//         getPermissions,

//         signInStaff,
//         signOutStaff,
//         forgotPassword,
//         resetPassword,
//         refreshToken,
//         isStaffAuthenticated,
//         setIsStaffAuthenticated,
//         setStaffProfile,
//       }}
//     >
//       {children}
//     </StaffContext.Provider>
//   );
// };

// export const useStaff = () => {
//   const context = useContext(StaffContext);
//   if (!context) {
//     throw new Error("useStaff must be used within a StaffProvider");
//   }
//   return context;
// };
