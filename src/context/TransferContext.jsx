import React, { createContext, useContext, useState } from "react";
// import api from "api";
import { useCallback } from "react";
import api from "../../utils/api"; // ✅ Import global API interceptor

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const TransferContext = createContext();

// Check token validity based on expiration
const getAuthToken = () => localStorage.getItem("accessToken");
const getHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

export const TransferProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all transfers
  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`${BASE_URL}/money/transfers/all`, {
        headers: getHeaders(),
      });
      setTransfers(res.data.data);
    } catch (err) {
      setError("Error fetching transfers");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single transfer by ID
  const fetchTransferById = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`${BASE_URL}/money/transfers/${id}`, {
        headers: getHeaders(),
      });
      return res.data.data;
    } catch (err) {
      setError("Error fetching transfer");
    } finally {
      setLoading(false);
    }
  };

  // Create a transfer
  const createTransfer = async (data) => {
    setLoading(true);
    try {
      const res = await api.post(`${BASE_URL}/money/transfers/create`, data, {
        headers: getHeaders(),
      });
      fetchTransfers(); // Refresh the list
      return res.data.data;
    } catch (err) {
      setError("Error creating transfer");
    } finally {
      setLoading(false);
    }
  };

  // Update a transfer
  const updateTransfer = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.put(`${BASE_URL}/money/transfers/${id}`, data, {
        headers: getHeaders(),
      });
      fetchTransfers(); // Refresh the list
      return res.data.data;
    } catch (err) {
      setError("Error updating transfer");
    } finally {
      setLoading(false);
    }
  };

  // Delete a transfer
  const deleteTransfer = async (id) => {
    setLoading(true);
    try {
      await api.delete(`${BASE_URL}/money/transfers/${id}`, {
        headers: getHeaders(),
      });
      fetchTransfers(); // Refresh the list
    } catch (err) {
      setError("Error deleting transfer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransferContext.Provider
      value={{
        loading,
        transfers,
        fetchTransfers,
        fetchTransferById,
        createTransfer,
        updateTransfer,
        deleteTransfer,
        error,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};

export const useTransfer = () => {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error("useTransfer must be used within a TransferProvider");
  }
  return context;
};
