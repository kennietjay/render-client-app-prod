// import api from "api";
import React, { createContext, useCallback, useContext, useState } from "react";
import api from "../../utils/api"; // ✅ Import global API interceptor
import { getHeaders } from "./getHeader";

// const BASE_URL = "http://192.168.12.109:8000";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const GuarantorContext = createContext();

// const getAuthToken = () => localStorage.getItem("accessToken");

function GuarantorProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [guarantors, setGuarantors] = useState([]);

  const handleError = (error) => {
    const message = error.response?.data?.message || error.message;
    console.error("Guarantor API Error:", message);
    throw new Error(message);
  };

  // Create a new guarantor
  const createGuarantor = async (newGuarantor, customerId) => {
    setLoading(true);
    try {
      const response = await api.post(
        `${BASE_URL}/customer/${customerId}/guarantors/create`,
        newGuarantor,
        { headers: getHeaders() }
      );
    } catch (error) {
      return error.data;
    } finally {
      setLoading(false);
    }
  };

  // Fetch all guarantors for a customer
  const getGuarantors = useCallback(async (customerId) => {
    setLoading(true);
    try {
      if (!customerId) throw new Error("Customer ID is required.");

      const response = await api.get(
        `${BASE_URL}/customer/${customerId}/guarantors/all`,
        {
          headers: getHeaders(),
        }
      );
      setGuarantors(response.data);
      return response.data;
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single guarantor
  const getOneGuarantor = useCallback(async (customerId, guarantorId) => {
    setLoading(true);
    try {
      const response = await api.get(
        `${BASE_URL}/customer/${customerId}/guarantor/${guarantorId}`,
        {
          headers: getHeaders(),
        }
      );
      return response.data; // Return the guarantor data
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn("Guarantor not found:", error.response.data.message);
      } else {
        console.error("Error fetching guarantor:", error);
      }
      throw error; // Re-throw the error for further handling
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a guarantor
  const updateGuarantor = async (
    customerId,
    guarantorId,
    guarantorFormData
  ) => {
    setLoading(true);
    try {
      const response = await api.put(
        `${BASE_URL}/customer/${customerId}/guarantors/${guarantorId}`,
        guarantorFormData,
        {
          headers: getHeaders(),
        }
      );

      // Refresh guarantors after updating
      await getGuarantors(customerId);

      return response.data;
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuarantorContext.Provider
      value={{
        guarantors,
        loading,
        createGuarantor,
        getGuarantors,
        getOneGuarantor,
        updateGuarantor,
      }}
    >
      {children}
    </GuarantorContext.Provider>
  );
}

const useGuarantor = () => {
  const context = useContext(GuarantorContext);
  if (!context) {
    throw new Error("useGuarantor must be used within a GuarantorProvider");
  }
  return context;
};

export { GuarantorProvider, useGuarantor };
