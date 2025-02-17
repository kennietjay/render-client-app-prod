import React, { createContext, useCallback, useContext, useState } from "react";
// import api from "api";
import api from "../../utils/api"; // ✅ Import global API interceptor

const TransactionContext = createContext();

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
      const response = await api.get(`${BASE_URL}/transactions/all`, {
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

  //
  const paymentByLoanId = useCallback(async (loanId) => {
    setLoading(true);
    try {
      const response = await api.get(
        `${BASE_URL}/transactions/search/${loanId}`,
        {
          headers: getHeaders(),
        }
      );

      // console.log(response.data.loan);

      // setLoan(response?.data?.loan || null);
      return response?.data?.loan;
    } catch (err) {
      console.error("Error fetching loan by ID:", err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TransactionContext.Provider
      value={{ getPayments, payments, paymentByLoanId, loading }}
    >
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
