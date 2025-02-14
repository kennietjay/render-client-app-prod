// import api from "api";
import React, { createContext, useCallback, useContext, useState } from "react";
import api from "../../utils/api"; // ✅ Import global API interceptor
// const BASE_URL = "http://192.168.12.109:8000";
// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const BASE_URL = "https://render-server-app.onrender.com";

const BankContext = createContext();

const getAuthToken = () => localStorage.getItem("accessToken");

function BankProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [bank, setBank] = useState(null);

  const handleError = (error) => {
    const message = error.response?.data?.message || error.message;
    console.error("Bank API Error:", message);
    return message;
  };

  //
  const getBank = useCallback(async (customerId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await api.get(
        `${BASE_URL}/customer/${customerId}/bank`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      //
      setBank(response.data);
      return response.data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  //
  const updateBank = async (customer_id, updatedData) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await api.put(
        `${BASE_URL}/customer/${customer_id}/bank`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBank(response.data);
      return response.data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BankContext.Provider value={{ bank, loading, getBank, updateBank }}>
      {children}
    </BankContext.Provider>
  );
}

const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error("useBank must be used within a BankProvider");
  }
  return context;
};

export { BankProvider, useBank };
