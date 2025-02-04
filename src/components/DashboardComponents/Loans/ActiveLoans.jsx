import React, { useState } from "react";
import styles from "./LoanPage.module.css";
import PaginatedActiveLoans from "../../Pagination/PaginatedActiveLoans";
import LoadingSpinner from "../../LoadingSpinner";

function ActiveLoans(props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [loading, setLoading] = useState(false);

  const activeLoans = loanData.filter(
    (loan) => loan.status === "approved" || loan.status === "paying"
  );

  // Function to open the sidebar with loan details
  const openSidebar = (loan) => {
    setSelectedLoanId(loan.loan_id);
    setIsSidebarOpen(loan);
  };

  // Function to close the sidebar
  const closeSidebar = () => {
    setSelectedLoanId(null);
    setIsSidebarOpen(null);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div
          className={`${styles.loansContainer} ${
            isSidebarOpen ? styles.expanded : ""
          }`}
        >
          <h3>Approved Loans/Payment in Progress</h3>
          <p>This page displays all active loans.</p>

          <PaginatedActiveLoans
            activeLoans={activeLoans} // Ensure this is correct
            itemsPerPage={6}
            openSidebar={openSidebar}
            closeSidebar={closeSidebar}
            selectedLoanId={selectedLoanId}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      )}
    </>
  );
}

export default ActiveLoans;

const loanData = [
  {
    loan_id: "LN0001",
    customer_id: "2024010001",
    first_name: "John",
    last_name: "Doe",
    contact_number: "+1234567890",
    loan_amount: 5000.0,
    interest_rate: 5.0,
    status: "approved",
    loan_type: "personal",
    approval_date: "2024-01-15",
    due_date: "2025-01-15",
    duration_months: 12,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0002",
    customer_id: "2024010002",
    first_name: "Jane",
    last_name: "Smith",
    contact_number: "+1234567891",
    loan_amount: 15000.0,
    interest_rate: 4.5,
    status: "reviewing",
    loan_type: "business",
    approval_date: null,
    due_date: null,
    duration_months: 24,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0003",
    customer_id: "2024010003",
    first_name: "Robert",
    last_name: "Brown",
    contact_number: "+1234567892",
    loan_amount: 3000.0,
    interest_rate: 6.0,
    status: "paying",
    loan_type: "car",
    approval_date: "2024-02-10",
    due_date: "2025-02-10",
    duration_months: 12,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0004",
    customer_id: "2024010004",
    first_name: "Emily",
    last_name: "Clark",
    contact_number: "+1234567893",
    loan_amount: 7000.0,
    interest_rate: 5.5,
    status: "rejected",
    loan_type: "personal",
    approval_date: null,
    due_date: null,
    duration_months: 18,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0005",
    customer_id: "2024010005",
    first_name: "Michael",
    last_name: "Davis",
    contact_number: "+1234567894",
    loan_amount: 2500.0,
    interest_rate: 4.0,
    status: "approved",
    loan_type: "education",
    approval_date: "2024-03-01",
    due_date: "2025-03-01",
    duration_months: 12,
    repayment_frequency: "quarterly",
  },
  {
    loan_id: "LN0006",
    customer_id: "2024010006",
    first_name: "Sarah",
    last_name: "Johnson",
    contact_number: "+1234567895",
    loan_amount: 10000.0,
    interest_rate: 6.5,
    status: "approved",
    loan_type: "business",
    approval_date: "2024-03-15",
    due_date: "2026-03-15",
    duration_months: 24,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0007",
    customer_id: "2024010007",
    first_name: "James",
    last_name: "Wilson",
    contact_number: "+1234567896",
    loan_amount: 4500.0,
    interest_rate: 4.8,
    status: "approved",
    loan_type: "personal",
    approval_date: "2024-04-05",
    due_date: "2025-04-05",
    duration_months: 12,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0008",
    customer_id: "2024010008",
    first_name: "Linda",
    last_name: "Martinez",
    contact_number: "+1234567897",
    loan_amount: 2000.0,
    interest_rate: 7.0,
    status: "closed",
    loan_type: "emergency",
    approval_date: "2024-04-20",
    due_date: "2025-04-20",
    duration_months: 12,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0009",
    customer_id: "2024010009",
    first_name: "Steven",
    last_name: "Moore",
    contact_number: "+1234567898",
    loan_amount: 12000.0,
    interest_rate: 5.2,
    status: "reviewing",
    loan_type: "business",
    approval_date: null,
    due_date: null,
    duration_months: 36,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0010",
    customer_id: "2024010010",
    first_name: "Anna",
    last_name: "Taylor",
    contact_number: "+1234567899",
    loan_amount: 6000.0,
    interest_rate: 3.8,
    status: "applied",
    loan_type: "home",
    approval_date: "2024-05-10",
    due_date: "2025-05-10",
    duration_months: 12,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0011",
    customer_id: "2024010011",
    first_name: "Daniel",
    last_name: "White",
    contact_number: "+1234567800",
    loan_amount: 8000.0,
    interest_rate: 5.0,
    status: "paying",
    loan_type: "personal",
    approval_date: "2024-05-25",
    due_date: "2026-05-25",
    duration_months: 24,
    repayment_frequency: "quarterly",
  },
  {
    loan_id: "LN0012",
    customer_id: "2024010012",
    first_name: "Laura",
    last_name: "Harris",
    contact_number: "+1234567801",
    loan_amount: 2200.0,
    interest_rate: 6.3,
    status: "approved",
    loan_type: "education",
    approval_date: "2024-06-01",
    due_date: "2025-06-01",
    duration_months: 12,
    repayment_frequency: "quarterly",
  },
  {
    loan_id: "LN0013",
    customer_id: "2024010013",
    first_name: "Chris",
    last_name: "Martin",
    contact_number: "+1234567802",
    loan_amount: 10500.0,
    interest_rate: 6.0,
    status: "rejected",
    loan_type: "car",
    approval_date: null,
    due_date: null,
    duration_months: 18,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0014",
    customer_id: "2024010014",
    first_name: "Elizabeth",
    last_name: "Scott",
    contact_number: "+1234567803",
    loan_amount: 3500.0,
    interest_rate: 5.4,
    status: "approved",
    loan_type: "emergency",
    approval_date: "2024-07-07",
    due_date: "2025-07-07",
    duration_months: 12,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0015",
    customer_id: "2024010015",
    first_name: "Andrew",
    last_name: "Green",
    contact_number: "+1234567804",
    loan_amount: 5500.0,
    interest_rate: 5.7,
    status: "approved",
    loan_type: "personal",
    approval_date: "2024-07-15",
    due_date: "2025-07-15",
    duration_months: 12,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0016",
    customer_id: "2024010016",
    first_name: "Jessica",
    last_name: "Walker",
    contact_number: "+1234567805",
    loan_amount: 17500.0,
    interest_rate: 4.2,
    status: "paid",
    loan_type: "business",
    approval_date: "2024-08-10",
    due_date: "2026-08-10",
    duration_months: 24,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0017",
    customer_id: "2024010017",
    first_name: "Matthew",
    last_name: "Perez",
    contact_number: "+1234567806",
    loan_amount: 9000.0,
    interest_rate: 5.9,
    status: "approved",
    loan_type: "home",
    approval_date: "2024-08-20",
    due_date: "2025-08-20",
    duration_months: 12,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0018",
    customer_id: "2024010018",
    first_name: "Sarah",
    last_name: "Roberts",
    contact_number: "+1234567807",
    loan_amount: 11000.0,
    interest_rate: 5.3,
    status: "applied",
    loan_type: "car",
    approval_date: "2024-09-15",
    due_date: "2025-09-15",
    duration_months: 12,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0019",
    customer_id: "2024010019",
    first_name: "Ryan",
    last_name: "Lewis",
    contact_number: "+1234567808",
    loan_amount: 25000.0,
    interest_rate: 3.9,
    status: "reviewing",
    loan_type: "business",
    approval_date: null,
    due_date: null,
    duration_months: 36,
    repayment_frequency: "monthly",
  },
  {
    loan_id: "LN0020",
    customer_id: "2024010020",
    first_name: "Samantha",
    last_name: "King",
    contact_number: "+1234567809",
    loan_amount: 8000.0,
    interest_rate: 4.4,
    status: "approved",
    loan_type: "education",
    approval_date: "2024-10-05",
    due_date: "2025-10-05",
    duration_months: 12,
    repayment_frequency: "quarterly",
  },
];
