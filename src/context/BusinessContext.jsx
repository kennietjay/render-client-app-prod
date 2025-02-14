// import api from "api";
import React, { createContext, useCallback, useContext, useState } from "react";
import api from "../../utils/api"; // ✅ Import global API interceptor

// const BASE_URL = "http://192.168.12.109:8000";
// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const BASE_URL =
//   "https://val-server-bcbfdrehb2agdygp.canadacentral-01.azurewebsites.net";

const BASE_URL = "https://render-server-app.onrender.com";

const BusinessContext = createContext();

const getAuthToken = () => localStorage.getItem("accessToken");

function BusinessProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState([]);

  const handleError = (error) => {
    const message = error.response?.data?.message || error.message;
    console.error("Business API Error:", message);
    return message;
  };

  const createBusiness = async (customerId, newBusinesses) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await api.post(
        `${BASE_URL}/customer/${customerId}/businesses/create`,
        newBusinesses,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh the guarantors list after adding a new guarantor
      await getBusinesses(customerId);

      return response.data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const getBusinesses = useCallback(async (customerId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await api.get(
        `${BASE_URL}/customer/${customerId}/businesses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBusinesses(response.data);
      return response.data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  //
  const getBusiness = useCallback(async (customerId, businessId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) throw new Error("No access token found");

      const response = await api.get(
        `${BASE_URL}/customer/${customerId}/businesses/:${businessId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBusinesses(response.data);
      return response.data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  //
  const updateBusiness = useCallback(
    async (customerId, businessId, updatedData) => {
      setLoading(true);
      try {
        const token = getAuthToken();
        if (!token) throw new Error("No access token found");

        const response = await api.put(
          `${BASE_URL}/customer/${customerId}/businesses/${businessId}`,
          updatedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Refresh the businesses list
        await getBusinesses(customerId);
        return response.data;
      } catch (err) {
        return handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [getBusinesses]
  );

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        loading,
        createBusiness,
        getBusiness,
        getBusinesses,
        updateBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
};

export { BusinessProvider, useBusiness };
