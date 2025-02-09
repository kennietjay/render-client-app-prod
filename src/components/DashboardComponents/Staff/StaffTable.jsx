import React, { useEffect, useState } from "react";
import styles from "./StaffTable.module.css";
import Pagination from "../Components/Pagination";
import ViewStaff from "./ViewStaff";
import { useStaff } from "../../../context/StaffContext";
import LoadingSpinner from "../../LoadingSpinner";
import { capitalizeWords } from "../../../../utils/capitalizeWords";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
// import AddStaff from "./AddStaff";

const StaffTable = ({ staffData, refreshStaffList, handleSelectedStaff }) => {
  const [loading, setLoading] = useState(false);
  const { getRoles, getPermissions, allRoles, allPermissions } = useStaff();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [viewStaff, setViewStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  // Compute pagination details
  const totalPages = Math.ceil(staffData?.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentStaff = staffData?.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // console.log(allRoles, allPermissions);

  const handleViewStaff = (staff) => {
    setViewStaff(true); // Open modal with selected staff member
    setSelectedStaff(staff);
    handleSelectedStaff(staff);
  };

  const closeStaffModal = () => {
    setViewStaff(null); // Close modal and reset selected staff member
    setSelectedStaff(null);
    handleSelectedStaff(null);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div>
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
          <div className={styles.tableContainer}>
            <table className={styles.tableRoot}>
              <thead className={styles.tableHead}>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.tableHeadCell}>Staff ID</th>
                  <th className={styles.tableHeadCell}>Name</th>
                  <th className={styles.tableHeadCell}>Phone</th>
                  <th className={styles.tableHeadCell}>Department</th>
                  <th className={styles.tableHeadCell}>Role</th>
                  <th className={styles.tableHeadCell}>Status</th>
                  <th className={styles.tableHeadCell}>Action</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {currentStaff?.map((staff) => (
                  <tr key={staff?.id} className={styles.tableRow}>
                    <td className={`${styles.tableCell}`}>
                      <Link
                        className={styles.staffId}
                        onClick={() => handleViewStaff(staff)}
                      >
                        {<i className="fa-solid fa-user"></i>}
                        <div>{staff?.id}</div>
                      </Link>
                    </td>
                    <td className={styles.tableCell}>{`${capitalizeWords(
                      staff?.user.first_name
                    )} ${capitalizeWords(staff?.user.last_name)}`}</td>
                    <td className={styles.tableCell}>{staff?.user?.phone}</td>
                    <td className={styles.tableCell}>
                      {capitalizeWords(staff?.department)}
                    </td>
                    <td className={styles.tableCell}>
                      {capitalizeWords(
                        staff?.user?.roles?.map((role) => role.name).join(", ")
                      )}
                    </td>
                    <td className={styles.tableCell}>
                      {capitalizeWords(staff?.status)}
                    </td>
                    <td className={styles.tableCell}>
                      <button
                        className={styles.iconButton}
                        onClick={() => handleViewStaff(staff)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="24"
                          height="24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="7" className={`${styles.paginationCell}`}>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {viewStaff && (
            <ViewStaff
              staff={selectedStaff}
              viewStaff={viewStaff}
              closeStaff={closeStaffModal} // Function to close the modal
              allRoles={allRoles}
              allPermissions={allPermissions}
              refreshStaffList={refreshStaffList}
              setSelectedStaff={setSelectedStaff}
              setError={setError}
              setSuccess={setSuccess}
              error={error}
              success={success}
            />
          )}
        </div>
      )}
    </>
  );
};

export default StaffTable;
