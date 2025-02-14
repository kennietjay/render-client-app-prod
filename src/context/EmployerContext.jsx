// import api from "api";
import React, { createContext, useCallback, useContext, useState } from "react";
import api from "../../utils/api"; // ✅ Import global API interceptor

// const BASE_URL = "http://192.168.12.109:8000";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const BASE_URL = "https://render-server-app.onrender.com";

const EmployerContext = createContext();

const getAuthToken = () => localStorage.getItem("accessToken");

function EmployerProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [employer, setEmployer] = useState(null);

  const handleError = (error) => {
    const message = error.response?.data?.message || error.message;
    console.error("Employer API Error:", message);
    return message;
  };

  const createEmployer = async (req, res) => {
    //
  };

  const getEmployer = useCallback(async (customerId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await api.get(
        `${BASE_URL}/customer/${customerId}/employer`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployer(response.data);
      return response.data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  //
  const updateEmployer = async (data) => {
    try {
      const token = getAuthToken();
      const { customerId, ...updatedData } = data;
      const response = await api.put(
        `${BASE_URL}/customer/${customerId}/employer`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating employer:", error.message);
      throw new Error(
        error.response?.data?.message || "Failed to update employer."
      );
    }
  };

  return (
    <EmployerContext.Provider
      value={{ employer, loading, getEmployer, createEmployer, updateEmployer }}
    >
      {children}
    </EmployerContext.Provider>
  );
}

const useEmployer = () => {
  const context = useContext(EmployerContext);
  if (!context) {
    throw new Error("useEmployer must be used within an EmployerProvider");
  }
  return context;
};

export { EmployerProvider, useEmployer };
