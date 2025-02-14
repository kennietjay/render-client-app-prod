import React, { useState, useEffect, useCallback } from "react";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";

import Staff from "../components/DashboardComponents/Staff/Staff";
import Admin from "../components/DashboardComponents/Admin/Admin";
import Reports from "../components/DashboardComponents/Reports/Reports";
import StaffProfile from "../components/DashboardComponents/Profile/StaffProfile";
import MoneyTransfer from "../components/DashboardComponents/MoneyTransfer/MoneyTransfer";
import Loans from "../components/DashboardComponents/Loans/Loans";
import Customers from "../components/DashboardComponents/Customers/Customers";
import Overview from "../components/DashboardComponents/Overview/Overview";
import LoanApplication from "../components/DashboardComponents/Loans/AdminLoanForms/LoanApplication";
import CustomerDetails from "../components/DashboardComponents/Customers/CustomerDetails";
import ProfileItems from "./ProfileItems";
import ReviewLoans from "../components/DashboardComponents/Loans/ReviewLoans";
import ActiveLoans from "../components/DashboardComponents/Loans/ActiveLoans";
import History from "../components/DashboardComponents/Loans/History";
import Payments from "../components/DashboardComponents/Loans/Payments";
import LoadingSpinner from "../components/LoadingSpinner";

import { useStaff } from "../context/StaffContext";
import { useAuth } from "../context/AuthContext";
import { useLoan } from "../context/LoanContext";
import { useTransfer } from "../context/TransferContext";
import { useTransaction } from "../context/TransactionContext";
import Approval from "../components/DashboardComponents/Loans/Approval";
import LoanDeposition from "../components/DashboardComponents/Loans/LoanDeposition";

const Dashboard = () => {
  const { user, getAllUsers } = useAuth();
  const { getLoans, loans, loanIds, customersData } = useLoan();
  const {
    signOutStaff,
    getAllStaff,
    getRoles,
    getPermissions,
    staffData,
    staffProfile,
    getStaffProfile,
  } = useStaff();

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { fetchTransfers, transfers } = useTransfer();
  const { getPayments } = useTransaction();

  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
  const [isAutoOpen, setIsAutoOpen] = useState(window.innerWidth > 62 * 16);
  const [activeSection, setActiveSection] = useState("recent");
  const [isLoansSubmenuOpen, setLoansSubmenuOpen] = useState(false);
  const [isCustomerSubmenuOpen, setIsCustomerSubmenuOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState(""); // Debounced value
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [selectedLoan, setSelectedLoan] = useState(null);

  //Manage sidebar menu
  useEffect(() => {
    const handleResize = () => {
      setIsAutoOpen(window.innerWidth > 62 * 16);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 1000); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchText]);

  //Fetch Permissions
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const response = await getAllStaff();
        setSuccess(response);
      } catch (error) {
        setError(error);
        console.error("Error refreshing staff list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [getAllStaff]);

  //Fetch Permissions
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const response = await getPermissions();
        setSuccess(response);
      } catch (error) {
        setError(error);
        console.error("Error refreshing staff list:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [getPermissions]);

  //Fetch Roles
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const response = await getRoles();
        setSuccess(response);
      } catch (error) {
        setError(error);
        console.error("Error refreshing staff list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [getRoles]);

  useEffect(() => {
    getStaffProfile();
  }, [getStaffProfile]);

  // Fetch data when `debouncedSearchText` or `selectedStatus` changes
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        await getLoans({ query: debouncedSearchText, status: selectedStatus });
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [getLoans, debouncedSearchText, selectedStatus]);

  useEffect(() => {
    // console.log("Updated customer: ", customersData);
  }, [customersData]);

  // ✅ Memoize fetchUsers to prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await getAllUsers(); // Fetch from API
      setAllUsers(users); // ✅ Update state
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [getAllUsers]);

  // ✅ Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Now `fetchUsers` is a stable reference

  //
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchTransfers();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchTransfers]);

  //
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const payments = await getPayments();
        // console.log(payments);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getPayments]);

  const toggleSidebar = () => {
    setIsAutoOpen(!isAutoOpen);
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  //
  const handleSignout = async () => {
    try {
      setLoading(true);
      await signOutStaff();
    } catch (error) {
      console.error("Error signing out:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openSmallModal = () => setIsSmallModalOpen(true);
  const closeSmallModal = () => setIsSmallModalOpen(false);

  const handleSubMenuClick = (section, customer) => {
    setActiveSection(section);
    setSelectedCustomer(customer);
    if (section === "loans") {
      setLoansSubmenuOpen(!isLoansSubmenuOpen);
    }
  };

  const handleCustomerSubMenuClick = (section, customer) => {
    setActiveSection(section);
    setSelectedCustomer(customer);
    if (section === "customers") {
      setIsCustomerSubmenuOpen(!isCustomerSubmenuOpen);
    }
  };

  const handleCustomerUpdate = (updatedCustomer) => {
    setSelectedCustomer(updatedCustomer);
  };

  const handleSelectedStaff = (updateStaff) => {
    setSelectedCustomer(updateStaff);
  };

  const handleApproval = (approvalData) => {
    setActiveSection("loan-approval");
    setSelectedLoan(approvalData); // Pass the selected loan data
    console.log("Approval data passed:", approvalData); // Debugging log
  };

  useEffect(() => {}, [selectedCustomer, selectedStaff]);

  // Add a loading or fallback check
  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <div className={styles.container}>
          {/*  */}
          <DashboardHeader
            isAutoOpen={isAutoOpen}
            toggleSidebar={toggleSidebar}
            handleSignout={handleSignout}
            openSmallModal={openSmallModal}
          />
          <Aside
            isAutoOpen={isAutoOpen}
            activeSection={activeSection}
            handleMenuClick={handleMenuClick}
            handleSubMenuClick={handleSubMenuClick}
            isLoansSubmenuOpen={isLoansSubmenuOpen}
            handleCustomerSubMenuClick={handleCustomerSubMenuClick}
            isCustomerSubmenuOpen={isCustomerSubmenuOpen}
            handleSignout={handleSignout}
            selectedCustomer={selectedCustomer}
            selectedStaff={selectedStaff}
          />
          {/*  */}
          <DashboardMain
            isAutoOpen={isAutoOpen}
            openModal={openModal}
            user={user}
            allUsers={allUsers}
            getAllUsers={getAllUsers}
            loanData={loans}
            loanIds={loanIds}
            customers={customersData}
            loading={loading}
            activeSection={activeSection}
            searchText={searchText}
            setSearchText={setSearchText}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            debouncedSearchText={debouncedSearchText}
            setDebouncedSearchTex={setDebouncedSearchText}
            transfers={transfers}
            staffData={staffData}
            staffProfile={staffProfile}
            handleCustomerSubMenuClick={handleCustomerSubMenuClick}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            handleCustomerUpdate={handleCustomerUpdate}
            setSelectedStaff={setSelectedStaff}
            handleSelectedStaff={handleSelectedStaff}
            selectedStaff={selectedStaff}
            selectedLoan={selectedLoan}
            handleApproval={handleApproval}
            setSelectedLoan={setSelectedLoan}
          />

          <div>
            <LoanApplication
              closeModal={closeModal}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />

            <ProfileItems
              closeSmallModal={closeSmallModal}
              isSmallModalOpen={isSmallModalOpen}
              setIsSmallModalOpen={setIsSmallModalOpen}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

function DashboardHeader({
  isAutoOpen,
  toggleSidebar,
  openSmallModal,
  handleSignout,
}) {
  return (
    <div>
      <div className={styles.topNavigation}>
        <button className={styles.openbtn} onClick={toggleSidebar}>
          {isAutoOpen ? (
            <i className="fa-solid fa-circle-chevron-left"></i>
          ) : (
            <i className="fa-solid fa-bars"></i>
          )}
        </button>

        <div className={styles.notificationContainer}>
          <div className={styles.notificationIcons}>
            <Link className={styles.userIcon} onClick={openSmallModal}>
              <i className="fa-solid fa-user"></i>
            </Link>
            <Link to="/" onClick={handleSignout}>
              <i className="fa-solid fa-right-from-bracket"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardMain({
  user,
  allUsers,
  getAllUsers,
  loanData,
  loanIds,
  customers,
  isAutoOpen,
  openModal,
  activeSection,
  staffData,
  searchText,
  selectedStatus,
  setSearchText,
  debouncedSearchText,
  setDebouncedSearchText,
  setSelectedStatus,
  transfers,
  // loading,
  staffProfile,
  handleCustomerSubMenuClick,
  selectedCustomer,
  setSelectedCustomer,
  handleCustomerUpdate,

  setSelectedStaff,
  handleSelectedStaff,
  selectedStaff,

  selectedLoan,
  handleApproval,
  setSelectedLoan,
}) {
  const [users, setUsers] = useState(allUsers || []);
  const [loading, setLoading] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // ✅ Always sync users when allUsers updates
  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers]);

  // ✅ Function to manually refresh users from API
  const refreshUsers = async () => {
    setLoading(true);
    try {
      const updatedUsers = await getAllUsers(); // ✅ Fetch latest users
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error refreshing users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update UI after adding a user
  const addUser = async (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]); // Optimistic UI update
    await refreshUsers(); // Fetch latest users
  };

  // ✅ Update UI after editing a user
  const updateUserData = async (updatedUser) => {
    if (!updatedUser || !updatedUser?.id) {
      console.error("🚨 Invalid updated user data:", updatedUser);
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user?.id === updatedUser?.id ? updatedUser : user
      )
    );

    try {
      await refreshUsers(); // ✅ Fetch fresh user data
    } catch (error) {
      console.error("🚨 Error refreshing users:", error);
    }
  };

  // ✅ Update UI after removing a user
  const removeUser = async (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    await refreshUsers();
  };

  // ✅ Open and close modal
  const openAddUser = () => setIsAddUserOpen(true);
  const closeAddUser = () => setIsAddUserOpen(false);

  return (
    <div
      id="main"
      className={`${styles.mainContent} ${isAutoOpen ? styles.shifted : ""}`}
    >
      <div className={styles.content}>
        {activeSection === "recent" && (
          <div className={`${styles.dashboardOverview}`}>
            <Overview
              user={user}
              openModal={openModal}
              staff={staffData}
              loanData={loanData}
              customers={customers}
              staffProfile={staffProfile}
              transfers={transfers}
            />
          </div>
        )}

        {activeSection === "customers" && (
          <div className={styles.section}>
            <Customers
              customers={customers}
              loanIds={loanIds}
              handleCustomerSubMenuClick={(section, customer) => {
                setSelectedCustomer(customer); // Update selectedCustomer in Dashboard
                handleCustomerSubMenuClick(section, customer);
              }}
            />
          </div>
        )}

        {activeSection === "loans" && (
          <div className={styles.section}>
            <Loans
              user={user}
              getAllUsers={getAllUsers}
              openModal={openModal}
              searchText={searchText}
              selectedStatus={selectedStatus}
              loanData={loanData}
              setSearchText={setSearchText}
              debouncedSearchText={debouncedSearchText}
              setDebouncedSearchText={setDebouncedSearchText}
              setSelectedStatus={setSelectedStatus}
              handleCustomerSubMenuClick={handleCustomerSubMenuClick}
              handleApproval={handleApproval}
              selectedLoan={selectedLoan}
              isAddUserOpen={isAddUserOpen}
              openAddUser={openAddUser}
              closeAddUser={closeAddUser}
              addUser={addUser}
            />
          </div>
        )}

        {activeSection === "transfers" && (
          <div className={styles.section}>
            <MoneyTransfer transfers={transfers} loading={loading} />
          </div>
        )}

        {activeSection === "accounts" && (
          <div className={styles.section}>
            <StaffProfile user={user} staffProfile={staffProfile} />
          </div>
        )}

        {activeSection === "reports" && (
          <div className={styles.section}>
            <Reports />
          </div>
        )}

        {activeSection === "staff" && (
          <div className={styles.section}>
            <Staff
              staff={staffData}
              selectedStaff={selectedStaff}
              handleSelectedStaff={handleSelectedStaff}
              setSelectedStaff={setSelectedStaff}
            />
          </div>
        )}

        {activeSection === "admin" && (
          <div className={styles.section}>
            <Admin
              isAddUserOpen={isAddUserOpen}
              openAddUser={openAddUser}
              closeAddUser={closeAddUser}
              users={users}
              getAllUsers={getAllUsers}
              addUser={addUser}
              updateUserData={updateUserData}
              removeUser={removeUser}
            />
          </div>
        )}

        {/* Loan Subsections */}
        {activeSection === "payments" && <Payments loanData={loanData} />}

        {activeSection === "review-loans" && (
          <ReviewLoans
            loanData={loanData}
            handleCustomerSubMenuClick={handleCustomerSubMenuClick}
            handleApproval={handleApproval}
            setSelectedLoan={setSelectedLoan}
          />
        )}

        {activeSection === "active-loans" && (
          <ActiveLoans loanData={loanData} />
        )}

        {activeSection === "manage-loans" && (
          <LoanDeposition loanData={loanData} />
        )}

        {activeSection === "loan-history" && <History loanData={loanData} />}

        {activeSection === "loan-approval" && selectedLoan && (
          <Approval
            selectedLoan={selectedLoan}
            approvalData={selectedLoan} // Pass the loan data
            setApprovalData={setSelectedLoan}
            handleApproval={handleApproval}
            loading={loading}
          />
        )}

        {activeSection === "customer-details" && (
          <CustomerDetails
            customer={selectedCustomer}
            handleCustomerSubMenuClick={handleCustomerSubMenuClick}
            loanData={loanIds}
            onUpdate={handleCustomerUpdate}
          />
        )}
      </div>
    </div>
  );
}

function Aside({
  isAutoOpen,
  activeSection,
  handleMenuClick,
  handleSubMenuClick,
  isLoansSubmenuOpen,
  handleCustomerSubMenuClick,
  // isCustomerSubmenuOpen,
  // selectedCustomer,
}) {
  return (
    <aside
      className={`${styles.sidebar} ${
        isAutoOpen ? styles.open : styles.closed
      }`}
    >
      <div>
        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            <li className={activeSection === "recent" ? styles.active : ""}>
              <Link
                to="#recent"
                onClick={() => handleMenuClick("recent")}
                className={styles.navLink}
              >
                <i className="fa-solid fa-house"></i>
                <span>Overview</span>
              </Link>
            </li>

            {/* Loans Menu with Submenu */}
            <li className={activeSection === "loans" ? styles.active : ""}>
              <Link
                to="#loans"
                onClick={() => handleSubMenuClick("loans")}
                className={styles.navLink}
              >
                <i className="fa-solid fa-money-check-dollar"></i>
                <span>
                  Loans{" "}
                  <i
                    className={`fa-solid ${
                      isLoansSubmenuOpen
                        ? "fa-chevron-down"
                        : "fa-chevron-right"
                    }`}
                  ></i>
                </span>
              </Link>

              {/* Loans Submenu */}
              {isLoansSubmenuOpen && (
                <ul className={styles.subMenu}>
                  <li
                    className={
                      activeSection === "review-loans" ? styles.active : ""
                    }
                  >
                    <Link
                      to="#review-loans"
                      className={styles.navSubLink}
                      onClick={() => handleMenuClick("review-loans")}
                    >
                      <i className="fa-solid fa-bars-staggered"></i>
                      <span>Review Loans</span>
                    </Link>
                  </li>
                  <li
                    className={
                      activeSection === "payments" ? styles.active : ""
                    }
                  >
                    <Link
                      to="#payments"
                      className={styles.navSubLink}
                      onClick={() => handleMenuClick("payments")}
                    >
                      <i className="fa-regular fa-money-bill-1"></i>
                      <span>Pay Loan</span>
                    </Link>
                  </li>
                  <li
                    className={
                      activeSection === "manage-loans" ? styles.active : ""
                    }
                  >
                    <Link
                      to="#manage-loans"
                      className={styles.navSubLink}
                      onClick={() => handleMenuClick("manage-loans")}
                    >
                      <i className="fa-solid fa-check-to-slot"></i>
                      <span>Manage Loans</span>
                    </Link>
                  </li>
                  <li
                    className={
                      activeSection === "loan-history" ? styles.active : ""
                    }
                  >
                    <Link
                      to="#loan-history"
                      className={styles.navSubLink}
                      onClick={() => handleMenuClick("loan-history")}
                    >
                      <i className="fa-regular fa-bookmark"></i>
                      <span>History </span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={activeSection === "customers" ? styles.active : ""}>
              <Link
                to="#customers"
                onClick={() => handleCustomerSubMenuClick("customers")}
                className={styles.navLink}
              >
                <i className="fa-solid fa-people-group"></i>
                {/* <span>Customers</span> */}
                <span>Customers </span>
              </Link>
            </li>

            <li className={activeSection === "transfers" ? styles.active : ""}>
              <Link
                to="#transfers"
                onClick={() => handleMenuClick("transfers")}
                className={styles.navLink}
              >
                <i className="fa-solid fa-money-bill-transfer"></i>
                <span>Money Transfer</span>
              </Link>
            </li>

            <li className={activeSection === "accounts" ? styles.active : ""}>
              <Link
                to="#accounts"
                onClick={() => handleMenuClick("accounts")}
                className={styles.navLink}
              >
                <i className="fa-solid fa-circle-user"></i>
                <span>Profile</span>
              </Link>
            </li>

            <li className={activeSection === "reports" ? styles.active : ""}>
              <Link
                to="#reports"
                onClick={() => handleMenuClick("reports")}
                className={styles.navLink}
              >
                <i className="fa-solid fa-file-lines"></i>
                <span>Reports</span>
              </Link>
            </li>

            <li className={activeSection === "staff" ? styles.active : ""}>
              <Link
                to="#staff"
                onClick={() => handleMenuClick("staff")}
                className={styles.navLink}
              >
                <i className="fa-solid fa-users-line"></i>
                <span>Staff</span>
              </Link>
            </li>

            <li className={activeSection === "admin" ? styles.active : ""}>
              <Link
                to="#admin"
                onClick={() => handleMenuClick("admin")}
                className={styles.navLink}
              >
                <i className="fa-solid fa-user-gear"></i>
                <span>Admin</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
