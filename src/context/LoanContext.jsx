import React, { createContext, useContext, useState, useCallback } from "react";
// import api from "api";
import api from "../../utils/api"; // ✅ Import global API interceptor

const LoanContext = createContext();

// const BASE_URL = "https://render-server-app.onrender.com";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthToken = () => localStorage.getItem("accessToken");
const getHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

function LoanProvider({ children }) {
  const [loans, setLoans] = useState([]);
  const [loan, setLoan] = useState([]);
  const [customerLoans, setCustomerLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const [loanData, setLoanData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [loanIds, setLoanIds] = useState(new Map());

  const handleError = (err) => {
    const message = err.response?.data?.message || err.message;
    const statusCode = err.response?.status || 500;
    console.error("Loan API Error:", message);
    setError({ message, statusCode });
    return { message, statusCode };
  };

  // Create a new loan
  const createLoan = async (loanData) => {
    // console.log("Loan Data (before sending):", loanData);

    setLoading(true);
    try {
      const response = await api.post(`${BASE_URL}/loans/create`, loanData, {
        headers: getHeaders(),
      });

      // console.log("Loan Created Successfully:", response.data);
      setLoan(response.data.loan);

      await getLoans();
      return response.data;
    } catch (err) {
      console.error("Error creating loan:", err.response?.data || err.message);
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Get all loans
  const getLoans = useCallback(async ({ query = "", status = "all" } = {}) => {
    setLoading(true);
    try {
      const response = await api.get(`${BASE_URL}/loans/all`, {
        params: { query, status }, // Pass query parameters
        headers: getHeaders(),
      });

      // console.log("Response Data:", response?.data);

      if (Array.isArray(response?.data?.loans)) {
        // Extract customers and loan IDs
        const { customers, loanIds } = extractCustomersAndLoans(
          response.data.loans
        );

        // console.log(customers, loanIds);

        setCustomersData(customers);
        setLoanIds(loanIds);
        setLoans(response.data.loans);
      }
    } catch (error) {
      console.error("Error fetching loans:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function within the LoanContext file
  const extractCustomersAndLoans = (loanData) => {
    if (!loanData || !Array.isArray(loanData)) {
      console.error("Invalid loanData input");
      return { customers: [], loanIds: [] };
    }

    const customers = [];
    const loanIds = []; // To store { customer_id, loan_id } pairs

    loanData.forEach((loan) => {
      if (!loan || !loan.customer || !loan.id) {
        console.warn("Invalid loan or missing data:", loan);
        return;
      }

      const customer = loan.customer;

      // Add unique customers
      if (!customers.find((c) => c.customer_id === customer.customer_id)) {
        customers.push(customer);
      }

      // Associate loan_id with customer_id
      loanIds.push({ customer_id: customer.customer_id, loan_id: loan.id });
    });

    return { customers, loanIds };
  };

  // Get loans by customer ID
  const getLoansByCustomerId = useCallback(async (customerId) => {
    console.log(customerId);
    setLoading(true);
    try {
      const response = await api.get(
        `${BASE_URL}/loans/customer/${customerId}/all`,
        {
          headers: getHeaders(),
        }
      );

      // console.log(response?.data?.loans);

      // console.log("Response Data:", response?.data);

      if (response?.data?.loans) {
        setCustomerLoans(response.data.loans);
        setLoans(response.data.loans);
      } else if (Array.isArray(response?.data)) {
        setLoans(response.loans);
        setCustomerLoans(response.data); // Handle direct array response
      } else {
        console.error("Unexpected response format:", response?.data);
      }

      // setCustomerLoans(response?.data?.loans || []);
      // return response?.data?.loans;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single loan by ID
  const getLoanById = useCallback(async (loanId) => {
    // console.log("Fetching loan by ID:", loanId);

    setLoading(true);
    try {
      const response = await api.get(`${BASE_URL}/loans/${loanId}`, {
        headers: getHeaders(),
      });

      // console.log(response.data.loan);

      setLoan(response?.data?.loan || null);
      return response?.data?.loan;
    } catch (err) {
      console.error("Error fetching loan by ID:", err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get loan with details
  const getLoanWithDetails = async (loanId) => {
    setLoading(true);
    try {
      const response = await api.get(`${BASE_URL}/loans/details/${loanId}`, {
        headers: getHeaders(),
      });
      setLoan(response?.data?.loan);
      return response?.data?.loan;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing loan
  const updateLoan = async (loanId, updatedData, customerId) => {
    // console.log(loanId, customerId);

    setLoading(true);
    try {
      const response = await api.put(
        `${BASE_URL}/loans/${customerId}/update/${loanId}`,
        updatedData,
        { headers: getHeaders() }
      );
      setLoan(response.data?.loan);

      getLoansByCustomerId(customerId);
      getLoans();
      return response?.data?.loans;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // First Review
  const firstReview = async (loanId, customerId, reviewedData) => {
    try {
      const response = await api.patch(
        `${BASE_URL}/loans/${customerId}/review/first/${loanId}`,
        reviewedData,
        {
          headers: getHeaders(),
        }
      );

      // console.log("First Review Response:", response.data);

      await getLoans();
      setLoans(response?.data?.loans);

      return { success: response.data };
    } catch (err) {
      console.error("Loan API Error:", err);
      throw err;
    }
  };

  // Second Review
  const secondReview = async (loanId, customerId, reviewedData) => {
    setLoading(true);

    // console.log("Loan ID:", loanId);
    // console.log("Customer ID:", customerId);
    // console.log("Reviewed Data:", reviewedData);

    try {
      // Correct the URL construction
      const response = await api.patch(
        `${BASE_URL}/loans/${customerId}/review/second/${loanId}`, // Ensure no extra "loans" path
        reviewedData,
        { headers: getHeaders() }
      );

      setLoans(response?.data?.loans);

      return { success: response.data };
    } catch (err) {
      console.error("Loan API Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Approve loan
  const approveLoan = async (approvalData) => {
    // console.log(approvalData);

    setLoading(true);

    try {
      // console.log("Loan ID:", approvalData.loanId);
      // console.log("Customer ID:", approvalData.customerId);
      // console.log("Approval Data:", approvalData);

      const response = await api.patch(
        `${BASE_URL}/loans/${approvalData.customerId}/approve/${approvalData.loanId}`,
        approvalData,
        { headers: getHeaders() }
      );

      await getLoans(); // Refresh loans after approval
      return { success: response.data };
    } catch (err) {
      console.error("Loan API Error:", err);
      handleError(err); // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  // Reject loan
  const rejectLoan = async (updatedFormData) => {
    // console.log(updatedFormData);

    setLoading(true);
    try {
      const response = await api.patch(
        `${BASE_URL}/loans/${updatedFormData.customerId}/reject/${updatedFormData.loanId}`,
        updatedFormData,
        { headers: getHeaders() }
      );
      // setLoan(response.data.loan);

      await getLoans();
      return { success: response.data };
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel loan
  const cancelLoan = async (updatedFormData) => {
    // console.log(updatedFormData);

    setLoading(true);
    try {
      const response = await api.patch(
        `${BASE_URL}/loans/${updatedFormData?.customerId}/cancel/${updatedFormData?.loanId}`,
        updatedFormData,
        { headers: getHeaders() }
      );
      // setLoan(response.data.loan);

      await getLoans();
      return { success: response.data };
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Close loan
  const closeLoan = async (updatedFormData) => {
    // console.log(updatedFormData);

    setLoading(true);
    try {
      const response = await api.patch(
        `${BASE_URL}/loans/${updatedFormData?.customerId}/close/${updatedFormData?.loanId}`,
        updatedFormData,
        { headers: getHeaders() }
      );
      // setLoan(response.data.loan);

      await getLoans();
      return { success: response.data };
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Pay loan
  const payLoan = async (loanId, paymentData, customerId) => {
    setLoading(true);
    try {
      const response = await api.post(
        `${BASE_URL}/loans/${customerId}/pay/${loanId}`,
        paymentData,
        { headers: getHeaders() }
      );
      setLoan(response.data.loan);
      getLoans();
      return response.data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const recordPayment = async (data, loan_id) => {
    try {
      const response = await api.post(
        `${BASE_URL}/loans/${loan_id}/pay`,
        data,
        {
          headers: getHeaders(),
        }
      );

      getLoans();
      return response?.data; // Return transaction details
    } catch (error) {
      console.error(
        "Error recording transaction:",
        error.response?.data || error.message
      );
      return error.response?.data || error.message;
    }
  };

  // Delete a loan
  const deleteLoan = async (loanId, customerId) => {
    setLoading(true);
    try {
      const response = await api.delete(
        `${BASE_URL}/loans/${customerId}/delete${loanId}`,
        { headers: getHeaders() }
      );
      await getLoansByCustomerId(customerId); // Refresh list after deletion
      return response.data;
    } catch (err) {
      return handleError(err);
    } finally {
      setLoading(false);
    }
  };

  //
  const updateCustomerData = (customerId, updatedData) => {
    setCustomersData((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.customer_id === customerId
          ? { ...customer, ...updatedData }
          : customer
      )
    );

    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.customer?.customer_id === customerId
          ? { ...loan, customer: { ...loan.customer, ...updatedData } }
          : loan
      )
    );
  };

  const updateLoanWithCustomerData = (customerId, updatedCustomer) => {
    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.customer?.customer_id === customerId
          ? { ...loan, customer: updatedCustomer }
          : loan
      )
    );
  };

  return (
    <LoanContext.Provider
      value={{
        loans,
        loan,
        customerLoans,
        loading,
        error,
        createLoan,
        recordPayment,

        customersData,
        loanIds,
        updateLoanWithCustomerData,
        updateCustomerData,

        updateLoan,
        firstReview,
        secondReview,
        approveLoan,
        rejectLoan,
        cancelLoan,
        closeLoan,
        payLoan,
        deleteLoan,
        getLoans,
        getLoansByCustomerId,
        getLoanById,
        getLoanWithDetails,
        setError,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
}

const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error("useLoan must be used within a LoanProvider");
  }
  return context;
};

export { LoanProvider, useLoan };
