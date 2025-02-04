import React, { useEffect, useState } from "react";
import styles from "./CustomerTable.module.css";
import Pagination from "../Components/Pagination";
import { Link } from "react-router-dom";
import { useLoan } from "../../../context/LoanContext";

const CustomerTable = ({ customers, handleCustomerSubMenuClick }) => {
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { getLoans, customersData, loanIds } = useLoan();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getLoans();
      } catch (error) {
        console.log("Something went wrong", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getLoans]);

  console.log(customersData, loanIds);

  const openDetails = (customer) => {
    setIsDetailsOpen(true);

    handleCustomerSubMenuClick("customer-details", customer);
    console.log(customer);
  };

  const closeSidebar = () => {
    setIsDetailsOpen(false);
  };

  //
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  const totalPages = Math.ceil(customers?.length / customersPerPage);
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers?.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  return (
    <div className={styles.tableContainer}>
      <table className={styles.tableRoot}>
        <thead className={styles.tableHead}>
          <tr className={styles.tableHeadRow}>
            <th className={styles.tableHeadCell}>Icon</th>
            <th className={styles.tableHeadCell}>Name</th>
            <th className={styles.tableHeadCell}>ID</th>
            <th className={styles.tableHeadCell}>Phone</th>
            <th className={styles.tableHeadCell}>Institution</th>
            <th className={styles.tableHeadCell}>Address</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {currentCustomers?.map((customer) => (
            <tr key={customer?.customer_id} className={styles.tableRow}>
              <td className={`${styles.tableCell}`}>
                <div className={styles.avatar}>
                  <i className="fa-solid fa-user"></i>
                </div>
              </td>
              <td
                className={styles.tableCell}
                onClick={() => openDetails(customer)}
              >
                <Link>
                  {`${customer?.user?.first_name || "Unknown"} ${
                    customer?.user?.last_name || ""
                  }`}
                </Link>
              </td>
              <td className={styles.tableCell}>
                {customer?.customer_id || "N/A"}
              </td>
              <td className={styles.tableCell}>
                {customer?.user?.phone || "N/A"}
              </td>
              <td className={styles.tableCell}>
                {customer?.employer?.employer_name || "N/A"}
              </td>
              <td className={styles.tableCell}>
                {typeof customer?.address === "object"
                  ? `${customer.address?.address || ""}, ${
                      customer.address?.city || ""
                    }`
                  : customer.address || "N/A"}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="6" className={`${styles.paginationCell}`}>
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
  );
};

export default CustomerTable;
