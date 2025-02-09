import React, { useEffect, useState } from "react";
import styles from "./LoanPage.module.css";
import LoadingSpinner from "../../LoadingSpinner";
import LoanTable from "./LoanTable";
import LoanApplication from "./AdminLoanForms/LoanApplication";
import UserSignup from "./AdminLoanForms/UserSignup";
import SignupResponse from "../../../pages/SignupResponse";

function Loans({
  loanData,
  searchText,
  setSearchText,
  selectedStatus,
  setSelectedStatus,
  handleCustomerSubMenuClick,
  handleApproval,
  selectedLoan,
}) {
  const [allLoans, setAllLoans] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignupOpen, setIsSigupOpen] = useState(false);
  const [isSignupResponse, setSignupResponse] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useState(() => {
    console.log("Reloaded... ");
    setAllLoans(loanData);
  }, [loanData]);

  // console.log(allLoans);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value); // Update search text immediately
  };

  const handleFilterChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSignup = () => {
    setIsSigupOpen(true);
  };
  const closeSignup = () => setIsSigupOpen(false);

  //
  const handleSignupSubmit = (response, user) => {
    console.log(response, user);

    if (response.success) {
      setSignupResponse(true);
      setNewUser(user);
      closeSignup();
      // setSuccess(true);
    } else {
      setError(response.error || "Signup failed.");
    }
  };

  const closeResponse = () => {
    setSignupResponse(false);
    closeModal();
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.loanPage}>
          <div>
            <div className={styles.btns}>
              <h3>Loans Maintenance</h3>
              <div className={styles.btns}>
                <button className={styles.apply} onClick={openSignup}>
                  New Customer
                </button>
                <button className={styles.apply} onClick={openModal}>
                  Add Loan
                </button>
              </div>
            </div>

            <div>
              <SearchBar
                searchText={searchText}
                handleSearchChange={handleSearchChange}
                handleFilterChange={handleFilterChange}
                selectedStatus={selectedStatus}
              />

              <LoansList
                loanData={loanData}
                searchResults={loanData}
                handleCustomerSubMenuClick={handleCustomerSubMenuClick}
                handleApproval={handleApproval}
              />
            </div>
            <LoanApplication
              closeModal={closeModal}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
            <UserSignup
              isSignupOpen={isSignupOpen}
              setIsSigupOpen={setIsSigupOpen}
              closeSignup={closeSignup}
              onSubmit={handleSignupSubmit}
              openModal={openModal}
            />
            <SignupResponse
              isSignupResponse={isSignupResponse}
              closeResponse={closeResponse}
              openModal={openModal}
              newUser={newUser}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Loans;

function SearchBar({
  searchText,
  handleSearchChange,
  handleFilterChange,
  selectedStatus,
}) {
  return (
    <div className={styles.searchBar}>
      <div className={styles.controlIcons}>
        <div className={styles.inputField}>
          <input
            type="text"
            placeholder="Search by loan or customer Id."
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
        <div className={styles.displayToggle}>
          <div className={styles.listIcon}>
            <i className="fa-solid fa-list"></i>
          </div>
        </div>
      </div>
      <div className={styles.filter}>
        <i className="fa-solid fa-sliders"></i>
        <select value={selectedStatus} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="processing">Processing</option>
          <option value="paying">Paying</option>
          <option value="processed">Processed</option>
          <option value="rejected">Rejected</option>
          <option value="closed">Closed</option>
          <option value="applied">Applied</option>
        </select>
      </div>
    </div>
  );
}

function LoansList({
  loanData,
  searchResults,
  handleCustomerSubMenuClick,
  handleApproval,
}) {
  return (
    <div className={styles.loanListContainer}>
      <LoanTable
        loanData={loanData}
        handleApproval={handleApproval}
        searchResults={searchResults}
        handleCustomerSubMenuClick={handleCustomerSubMenuClick}
      />
    </div>
  );
}
