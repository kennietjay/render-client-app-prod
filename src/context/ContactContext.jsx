import axios from "axios";
import React, { createContext, useContext, useState } from "react";

// const BASE_URL = "http://192.168.12.109:8000";
// const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const BASE_URL =
//   "https://val-server-bcbfdrehb2agdygp.canadacentral-01.azurewebsites.net";

const BASE_URL = "https://render-server-cawz.onrender.com";

// Create the Contact Context
const ContactContext = createContext();

// Contact Provider Component
function ContactProvider({ children }) {
  const [message, setMessage] = useState(null); // Store success message
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track errors

  const createMessage = async (formData) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/contact-us/message`,
        formData,
        {
          headers: {
            "Content-Type": "application/json", // Only include necessary headers
          },
        }
      );
      setError("");
      setMessage(response.data);
      return { success: response.data.msg };
    } catch (error) {
      console.error(
        "Error creating message:",
        error.response?.data?.msg || error.message
      );
      return { error: error.response?.data?.msg || error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactContext.Provider value={{ createMessage, message, loading, error }}>
      {children}
    </ContactContext.Provider>
  );
}

// Hook to use Contact Context
const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within a ContactProvider");
  }
  return context;
};

export { ContactProvider, useContact };
