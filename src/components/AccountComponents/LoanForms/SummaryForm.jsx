import React, { useEffect, useRef, useState } from "react";
import styles from "./LoanApplication.module.css";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useReactToPrint } from "react-to-print";

import { useLoan } from "../../../context/LoanContext";
import { capitalizeWords } from "/utils/capitalizeWords";
import { useStaff } from "../../../context/StaffContext";

function SummaryForm({ prevStep, formData, onSubmit, closeModal }) {
  const [staff, setStaff] = useState(null);
  const { getStaffProfile } = useStaff();
  const { createLoan, error } = useLoan();
  const [loading, setLoading] = useState(false);

  // Ref for the component to print
  const componentRef = useRef(); // Create the ref

  // Print function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // Reference to the content to print
  });

  useEffect(() => {
    // Fetch the staff ID associated with the logged-in user
    const fetchStaffId = async () => {
      const staffProfile = await getStaffProfile();
      console.log(staffProfile);
      setLoading(true);
      try {
        if (staffProfile?.id) {
          setStaff(staffProfile);
        } else {
          console.error("Failed to fetch staff profile:", staffProfile);
        }
      } catch (error) {
        console.error("Error fetching staff ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffId();
  }, [getStaffProfile]);

  // onSubmit function to handle form submission
  onSubmit = async (e) => {
    e.preventDefault();

    const newLoan = {
      ...formData,
      staff_id: staff?.id,
    };

    try {
      setLoading(true);
      console.log(newLoan, staff);
      await createLoan(newLoan);
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false);
    }
    closeModal();
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.formContainer}>
          <div ref={componentRef}>
            {" "}
            {/* Wrap content in the ref */}
            <form onSubmit={onSubmit} className={styles.form}>
              <button onClick={closeModal} className={styles.closeBtn}>
                X
              </button>
              <div ref={componentRef}>
                <h4>Review and Submit Application</h4>
                {error && <p>{error.message}</p>}
                <div>
                  <div className={styles.summaryStyle}>
                    <p>Customer Information</p>
                    {formData?.customer && (
                      <ul>
                        <li>
                          <span> User ID</span>: {formData.customer?.id}
                        </li>
                        <li>
                          <span>First Name </span>:{" "}
                          {capitalizeWords(formData.customer?.first_name)}
                        </li>
                        <li>
                          <span>Middle Name/Initial </span>:{" "}
                          {capitalizeWords(formData.customer?.middle_name)}
                        </li>
                        <li>
                          <span>Last Name </span>:{" "}
                          {capitalizeWords(formData.customer?.last_name)}
                        </li>
                        <li>
                          <span>Gender </span>:{" "}
                          {capitalizeWords(formData.customer?.gender)}
                        </li>
                        <li>
                          <span>Date of Birth </span>:{" "}
                          {formData.customer?.date_of_birth}
                        </li>
                        <li>
                          <span>Email </span>: {formData.customer?.email}
                        </li>
                        <li>
                          <span>Phone </span>: {formData.customer?.phone}
                        </li>
                        <li>
                          <span>Second Phone #</span>:{" "}
                          {formData.customer?.other_phone}
                        </li>
                      </ul>
                    )}
                  </div>

                  {/*  */}
                  <div className={styles.summaryStyle}>
                    <p>Customer Address</p>
                    {formData?.address && (
                      <ul>
                        <li>
                          <span>Address</span>: {formData.address?.address}
                        </li>
                        <li>
                          <span>City/Town </span>:{" "}
                          {capitalizeWords(formData.address?.city)}
                        </li>
                        <li>
                          <span>Middle Name/Initial </span>:{" "}
                          {capitalizeWords(formData.address?.section)}
                        </li>
                        <li>
                          <span>Last Name </span>:{" "}
                          {capitalizeWords(formData.address?.chiefdom)}
                        </li>
                        <li>
                          <span>Gender </span>:{" "}
                          {capitalizeWords(formData.address?.district)}
                        </li>
                      </ul>
                    )}
                  </div>

                  {/*  */}
                  <div className={styles.summaryStyle}>
                    {formData?.employment && (
                      <div>
                        <p>Employment Information</p>
                        <ul>
                          <li>
                            <span>Employing Authority</span>:{" "}
                            {capitalizeWords(
                              formData.employment?.employing_authority
                            )}
                          </li>
                          <li>
                            <span>Employer Name</span>:{" "}
                            {capitalizeWords(
                              formData.employment?.employer_name
                            )}
                          </li>
                          <li>
                            <span>Occupation </span>:{" "}
                            {capitalizeWords(formData.employment?.occupation)}
                          </li>
                          <li>
                            <span>Current Position </span>:{" "}
                            {capitalizeWords(
                              formData.employment?.current_position
                            )}
                          </li>
                          <li>
                            <span>Pin/Employee Code </span>:{" "}
                            {formData.employment?.employee_code}
                          </li>
                          <li>
                            <span>Phone </span>:{" "}
                            {formData.employment?.employer_phone}
                          </li>
                          <li>
                            <span>Email </span>:{" "}
                            {formData.employment?.employer_email}
                          </li>
                          <li>
                            <span>Address </span>:{" "}
                            {capitalizeWords(
                              formData.employment?.employer_address
                            )}
                          </li>
                          <li>
                            <span>City </span>:{" "}
                            {capitalizeWords(
                              formData.employment?.employer_city
                            )}
                          </li>
                          <li>
                            <span>Chiefdom </span>:{" "}
                            {capitalizeWords(
                              formData.employment?.employer_chiefdom
                            )}
                          </li>
                          <li>
                            <span>District </span>:{" "}
                            {capitalizeWords(
                              formData.employment?.employer_district
                            )}
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/*  */}
                  <div className={styles.summaryStyle}>
                    <p>Loan Information</p>
                    {formData.loan && (
                      <ul>
                        <li>
                          <span>Loan Type </span>:{" "}
                          {capitalizeWords(formData.loan?.loan_type)}
                        </li>

                        <li>
                          <span>Loan Amount </span>:{" "}
                          {formData.loan?.loan_amount}
                        </li>
                        <li>
                          <span>Loan Purpose </span>:{" "}
                          {capitalizeWords(formData.loan?.loan_purpose)}
                        </li>
                        <li>
                          <span>Amount in words </span>:{" "}
                          {capitalizeWords(formData.loan?.amount_in_words)}
                        </li>
                        <li>
                          <span>Loan Period </span>:{" "}
                          {formData.loan?.loan_period > 1
                            ? `${formData.loan?.loan_period} months`
                            : `${formData.loan?.loan_period} month`}
                        </li>
                        <li>
                          <span>Interest Rate</span>:{" "}
                          {formData.loan?.interest_rate === "0.2"
                            ? "20%"
                            : formData.loan?.interest_rate === "0.25"
                            ? "25%"
                            : "30%"}
                        </li>
                        <li>
                          <span>Total Amount</span>:{" "}
                          {formData.loan?.total_amount}
                        </li>
                        <li>
                          <span>Payment</span>: {formData.loan?.payment}
                        </li>
                        <li>
                          <span>Monthly Salary</span>:{" "}
                          {formData.loan?.monthly_salary}
                        </li>
                        <li>
                          <span>Salary In Words</span>:{" "}
                          {capitalizeWords(formData.loan?.salary_in_words)}
                        </li>
                        <li>
                          <span>Prior Loan History</span>:{" "}
                          {capitalizeWords(formData.loan?.prior_loan_history)}
                        </li>
                        <li>
                          <span>Loaned With Easy Life Before </span>:{" "}
                          {capitalizeWords(formData.loan?.loaned_with_easylife)}
                        </li>
                        <li>
                          <span>Owe Arrears With Any other Institution </span>:{" "}
                          {capitalizeWords(
                            formData.loan?.owe_arrears_elsewhere || ""
                          )}
                        </li>

                        <li>
                          <span>Loan Co-Debtor ?</span>:
                          {capitalizeWords(formData.loan?.co_debtor || "")}
                        </li>
                        <li>
                          <span>Co-Debtor Name</span>:
                          {capitalizeWords(formData.loan?.co_debtor_name || "")}
                        </li>
                        <li>
                          <span>Co-Debtor Relationship</span>:
                          {capitalizeWords(
                            formData.loan?.co_debtor_relation || ""
                          )}
                        </li>
                      </ul>
                    )}
                  </div>

                  {/*  */}
                  <div className={styles.summaryStyle}>
                    <p>Guarantor Information</p>
                    {formData?.guarantor && (
                      <ul>
                        <li>
                          <span>Guarantor First Name</span>:
                          {capitalizeWords(
                            formData.guarantor?.guarantor_first_name
                          )}
                        </li>
                        <li>
                          <span>Guarantor Middle Name </span>:
                          {capitalizeWords(
                            formData.guarantor?.guarantor_middle_name
                          )}
                        </li>
                        <li>
                          <span>Guarantor Last Name </span>:{" "}
                          {capitalizeWords(
                            formData.guarantor?.guarantor_last_name
                          )}
                        </li>
                        <li>
                          <span>Gender </span>:{" "}
                          {capitalizeWords(
                            formData.guarantor?.guarantor_gender
                          )}
                        </li>
                        <li>
                          <span>Occupation </span>:{" "}
                          {capitalizeWords(
                            formData.guarantor?.guarantor_occupation
                          )}
                        </li>
                        <li>
                          <span>Relationship </span>:{" "}
                          {capitalizeWords(
                            formData.guarantor?.guarantor_relationship
                          )}
                        </li>
                        <li>
                          <span>Phone</span>:{" "}
                          {formData.guarantor?.guarantor_phone}
                        </li>
                        <li>
                          <span>Email </span>:{" "}
                          {formData.guarantor?.guarantor_email}
                        </li>
                        <li>
                          <span>Address</span>:{" "}
                          {capitalizeWords(
                            formData.guarantor?.guarantor_address
                          )}
                        </li>
                        <li>
                          <span>City/Town </span>:{" "}
                          {capitalizeWords(formData.guarantor?.guarantor_city)}
                        </li>
                        <li>
                          <span>Section </span>:{" "}
                          {capitalizeWords(
                            formData.guarantor?.guarantor_section
                          )}
                        </li>
                        <li>
                          <span>Chiefdom </span>:{" "}
                          {capitalizeWords(
                            formData.guarantor?.guarantor_chiefdom
                          )}
                        </li>
                        <li>
                          <span>District </span>:{" "}
                          {capitalizeWords(
                            formData.guarantor?.guarantor_district
                          )}
                        </li>
                      </ul>
                    )}
                  </div>

                  {/*  */}
                  <div className={styles.summaryStyle}>
                    <p>Customer Bank Information</p>
                    {formData?.bank && (
                      <ul>
                        <li>
                          <span>Bank Name</span>:{" "}
                          {capitalizeWords(formData.bank?.bank_name)}
                        </li>
                        <li>
                          <span>Account Number</span>:{" "}
                          {formData.bank?.account_number}
                        </li>
                        <li>
                          <span>Account Name</span>:{" "}
                          {capitalizeWords(formData.bank?.account_name)}
                        </li>
                        <li>
                          <span>Address </span>:{" "}
                          {capitalizeWords(formData.bank?.bank_address)}
                        </li>
                        <li>
                          <span>City/Town</span>:{" "}
                          {capitalizeWords(formData.bank?.bank_city)}
                        </li>

                        <li>
                          <span>Chiefdom </span>:{" "}
                          {capitalizeWords(formData.bank?.bank_chiefdom)}
                        </li>
                        <li>
                          <span>District </span>:{" "}
                          {capitalizeWords(formData.bank?.bank_district)}
                        </li>
                      </ul>
                    )}
                  </div>

                  {/*  */}
                  <div className={styles.summaryStyle}>
                    <p>Submitted Documents:</p>
                    {formData?.files?.length > 0 ? (
                      <>
                        <ul>
                          {formData?.files.map((data) => (
                            <li key={data?.name}>{data?.name}</li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p>No documents selected.</p>
                    )}
                  </div>
                </div>

                {/*  */}
                <div className={styles.summaryStyle}>
                  <p>Signed Consent</p>
                  {formData?.consent && (
                    <ul>
                      <li>
                        <span>Full Name</span>:
                        {capitalizeWords(formData?.consent?.full_name)}
                      </li>
                      <li>
                        <span>Applicant Initial</span>:
                        {capitalizeWords(formData?.consent?.applicant_initial)}
                      </li>
                      <li>
                        <span>Consent</span>:{formData?.consent?.consent}
                      </li>
                      <li>
                        <span>Application Date</span>:
                        {formData?.consent?.submission_date}
                      </li>
                    </ul>
                  )}
                </div>

                <div>
                  <div className={styles.addNavBtnContainer}>
                    <button
                      type="button"
                      onClick={prevStep}
                      className={styles.formNavBtn}
                    >
                      Edit
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.formNavBtn}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Print button */}
          <div className={styles.printButtonContainer}>
            <button onClick={handlePrint} className={styles.printButton}>
              Print as PDF
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SummaryForm;
