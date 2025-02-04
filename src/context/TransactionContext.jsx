import React, { createContext, useCallback, useContext, useState } from "react";
import axios from "axios";

const TransactionContext = createContext();

// const BASE_URL = "http://192.168.12.109:5000";
const BASE_URL = "https://render-server-app.onrender.com";

const getAuthToken = () => localStorage.getItem("accessToken");
const getHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

function TransactionProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  const getPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/transactions/all`, {
        headers: getHeaders(),
      });

      setPayments(response.data?.payments);

      return response.data?.payment;
    } catch (error) {
      console.log();
      return error.data?.msg;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TransactionContext.Provider value={{ getPayments, payments, loading }}>
      {children}
    </TransactionContext.Provider>
  );
}

//
const useTransaction = () => {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }

  return context;
};

export { TransactionProvider, useTransaction };
