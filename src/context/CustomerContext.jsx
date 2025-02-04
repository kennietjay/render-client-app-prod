import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

// const BASE_URL = "http://192.168.12.109:8000";
// const BASE_URL = import.meta.env.VITE_BACKEND_URL;
// const BASE_URL =
//   "https://val-server-bcbfdrehb2agdygp.canadacentral-01.azurewebsites.net";

const BASE_URL = "https://render-server-app.onrender.com";

const CustomerContext = createContext();

const getAuthToken = () => localStorage.getItem("accessToken");

const CustomerProvider = ({ children }) => {
  const { user } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customer details
  const fetchCustomer = useCallback(async () => {
    if (!user?.id) {
      console.warn("No user ID available to fetch customer");
      setCustomer(null); // Clear customer state
      return;
    }

    console.log("Fetching customer for user ID:", user.id);

    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await axios.get(`${BASE_URL}/customer/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomer(response?.data);
      setError(null); // Clear any previous errors

      return response?.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      console.error("Customer API Error:", message);
      setCustomer(null); // Reset customer data on error
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  //
  const getCustomers = useCallback(async () => {
    try {
      setLoading(true);

      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await axios.get(`${BASE_URL}/customer/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response);

      setCustomers(response?.data);
      setError(null); // Clear error if successful
      return response?.data;
    } catch (error) {
      console.error(
        "Error fetching customers:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || "Failed to fetch customers");
      setCustomers(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update customer details
  const updateCustomer = async (customerId, updatedData) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await axios.put(
        `${BASE_URL}/customer/${customerId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCustomer(response.data);
      setError(null); // Clear any previous errors
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      console.error("Customer Update API Error:", message);
      return message;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        error,
        fetchCustomer,
        updateCustomer,
        getCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use the CustomerContext
const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider");
  }
  return context;
};

export { CustomerProvider, useCustomer };
