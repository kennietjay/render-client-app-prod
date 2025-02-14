// import api from "api";
import React, { createContext, useCallback, useContext, useState } from "react";
import api from "../../utils/api"; // ✅ Import global API interceptor
// Dynamically set BASE_URL based on the environment
// const BASE_URL = "https://render-server-app.onrender.";
// const BASE_URL =
//   "https://val-server-bcbfdrehb2agdygp.canadacentral-01.azurewebsites.net";
// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const BASE_URL = "https://render-server-app.onrender.com";

const AddressContext = createContext();

const getAuthToken = () => localStorage.getItem("accessToken");

function AddressProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    address: "",
    city: "",
    section: "",
    chiefdom: "",
    district: "",
  });

  const handleError = (error) => {
    const message = error.response?.data?.message || error.message;
    return message;
  };

  // Create Address
  const createAddress = async (customerId, newAddressData) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await api.post(
        `${BASE_URL}/customer/${customerId}/address/create`,
        newAddressData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAddress(response.data.address); // Update state with the newly created address
      return response.data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Get customer address details
  const getAddress = useCallback(async (customerId) => {
    if (!customerId) throw new Error("Customer ID is required.");
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await api.get(
        `${BASE_URL}/customer/${customerId}/address`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Fetched Address:", response.data); // Debug log
      setAddress(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching address:", handleError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update customer address details
  const updateAddress = async (updatedAddress) => {
    console.log("Updating Address:", {
      updatedAddress,
    });

    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await api.put(
        `${BASE_URL}/customer/${updatedAddress.customerId}/address`,
        updatedAddress, // Only the form data is sent in the body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (err) {
      console.error("Address API Error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AddressContext.Provider
      value={{ address, loading, createAddress, getAddress, updateAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
}

const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within an AddressProvider");
  }
  return context;
};

export { AddressProvider, useAddress };
