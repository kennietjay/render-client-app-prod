import React, { useEffect, useState } from "react";
import styles from "./LoanPage.module.css";
import LoadingSpinner from "../../LoadingSpinner";
import LoanTable from "./LoanTable";
import LoanApplication from "./AdminLoanForms/LoanApplication";
import SignupResponse from "../../../pages/SignupResponse";
import AddUser from "../../AddUser";
import { Alert } from "react-bootstrap";

function Loans({
  loanData,
  searchText,
  setSearchText,
  selectedStatus,
  setSelectedStatus,
  handleCustomerSubMenuClick,
  handleApproval,
  selectedLoan,

  isAddUserOpen,
  openAddUser,
  closeAddUser,
  addUser,
}) {
  const [allLoans, setAllLoans] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignupResponse, setSignupResponse] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Automatically dismiss alerts after 5 seconds
  useEffect(() => {
    if (success || error) {
      console.log("Displaying Alert:", success || error);
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [success, error]);

  // useState(() => {
  //   console.log("Reloaded... ");
  //   setAllLoans(loanData);
  // }, [loanData]);

  useEffect(() => {
    if (loanData) {
      console.log("Updating loan list:", loanData);
      setAllLoans([...loanData]); // Spread to force re-render
    }
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
                <button className={styles.apply} onClick={openAddUser}>
                  New Customer
                </button>
                <button className={styles.apply} onClick={openModal}>
                  Add Loan
                </button>
              </div>
            </div>

            {success && (
              <Alert variant="success" className="warning">
                {success}
              </Alert>
            )}

            {error && (
              <Alert variant="warning" className="warning">
                {error}
              </Alert>
            )}

            {/*  */}
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
              error={error}
              success={success}
              setError={setError}
              setSuccess={setSuccess}
            />
            <AddUser
              isAddUserOpen={isAddUserOpen}
              closeAddUser={closeAddUser}
              addUser={addUser}
            />
            <SignupResponse
              isSignupResponse={isSignupResponse}
              closeResponse={closeResponse}
              openModal={openModal}
              newUser={createdUser}
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
