// import api from "api";
import React, { createContext, useContext, useState } from "react";
import api from "../../utils/api"; // ✅ Import global API interceptor
// const BASE_URL = "http://192.168.12.109:8000";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// const BASE_URL = "https://render-server-app.onrender.com";

// Create the Contact Context
const ContactContext = createContext();

// Contact Provider Component
function ContactProvider({ children }) {
  const [loading, setLoading] = useState(false); // Track loading state

  const createMessage = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post(
        `${BASE_URL}/contact-us/message`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return { success: true, msg: response.data.msg };
    } catch (error) {
      console.error(
        "Error creating message:",
        error.response?.data?.msg || error.message
      );

      return {
        success: false,
        msg:
          error.response?.data?.msg ||
          "Failed to send message. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactContext.Provider value={{ createMessage, loading }}>
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
