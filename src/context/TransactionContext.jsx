import React, { createContext, useCallback, useContext, useState } from "react";
import api from "../../utils/api";
import { getHeaders } from "./getHeader";

const TransactionContext = createContext();
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function TransactionProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  const getPayments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`${BASE_URL}/transactions/all`, {
        headers: getHeaders(),
      });
      const list = Array.isArray(data?.payments) ? data.payments : [];
      setPayments(list);
      return list; // ✅ always an array
    } catch (error) {
      console.error("Error fetching all payments:", error);
      setPayments([]); // ✅ keep state as array
      return []; // ✅ always an array
    } finally {
      setLoading(false);
    }
  }, []);

  //
  const getPaymentsByLoanOrCustomerId = useCallback(async (id) => {
    if (!id) {
      console.error("❌ ID is missing");
      return [];
    }
    setLoading(true);
    try {
      const { data } = await api.get(`${BASE_URL}/transactions/search/${id}`, {
        headers: getHeaders(),
      });

      console.log(data);

      const list = Array.isArray(data?.payments)
        ? data.payments
        : Array.isArray(data?.transactions)
        ? data.transactions
        : [];
      setPayments(list);

      return list; // ✅ always an array
    } catch (error) {
      console.error(
        "🚨 API Error:",
        error?.response?.data?.message || error.message
      );
      return []; // ✅ always an array
    } finally {
      setLoading(false);
    }
  }, []);

  //
  const getPaymentsByLoanId = useCallback(
    async (loanId) => {
      if (!loanId) {
        console.error("❌ Loan ID is missing");
        return [];
      }
      return getPaymentsByLoanOrCustomerId(loanId);
    },
    [getPaymentsByLoanOrCustomerId]
  );

  return (
    <TransactionContext.Provider
      value={{
        getPayments,
        payments,
        getPaymentsByLoanId,
        getPaymentsByLoanOrCustomerId,
        loading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

const useTransaction = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransaction must be used within a TransactionProvider");
  return ctx;
};

export { TransactionProvider, useTransaction };
