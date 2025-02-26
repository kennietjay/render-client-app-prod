import React, { createContext, useCallback, useContext, useState } from "react";
// import api from "api";
import api from "../../utils/api"; // ✅ Import global API interceptor
import { useEffect } from "react";

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

  // //
  const getPaymentsByLoanId = useCallback(async (loanId) => {
    if (!loanId) {
      console.error("❌ Loan ID is missing");
      return;
    }

    console.log(`🔍 Fetching payments for Loan ID: ${loanId}`);

    setLoading(true);
    try {
      const response = await api.get(
        `${BASE_URL}/transactions/search/${loanId}`,
        {
          headers: getHeaders(),
        }
      );

      console.log("✅ API Response:", response?.data);

      const payments = response?.data || []; // 🔹 Extract transactions as payments

      if (payments.length) {
        setPayments(payments);
        return payments;
      } else {
        console.warn("⚠ No payments returned from API");
        setPayments([]);
        return [];
      }
    } catch (error) {
      console.error(
        "🚨 API Error:",
        error.response?.data?.message || error.message
      );
      return error.response?.data?.message || "Failed to fetch payments.";
    } finally {
      setLoading(false);
    }
  }, []);

  //
  return (
    <TransactionContext.Provider
      value={{ getPayments, payments, getPaymentsByLoanId, loading }}
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
