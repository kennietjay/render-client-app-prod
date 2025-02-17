import React, { useEffect, useState } from "react";
import styles from "../LoanForms/LoanApplication.module.css";
import Modal from "../../Modal";
import SmallModal from "../../SmallModal";
import LoadingSpinner from "../../../components/LoadingSpinner";

import { Alert } from "react-bootstrap";
import { capitalizeWords } from "../../../../utils/capitalizeWords";
import { formatDateRegular } from "../../../../utils/formatDateRegular";
import isEqual from "lodash/isEqual";

// Function to format numbers with commas
const formatNumberWithCommas = (value) => {
  if (!value) return "";
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

// Function to remove commas and convert back to a number
const removeCommas = (value) => {
  return value.replace(/,/g, "");
};

function LoanDetails({
  loan,
  isModalOpen,
  updateLoan,
  closeModal,
  customer,
  getCustomerByUserId,
}) {
  const [formData, setFormData] = useState({});
  const [hasCoDebtor, setHasCoDebtor] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [mode, setMode] = useState("view");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [warning, setWarning] = useState(null);

  const [isInnerModalOpen, setIsInnerModalOpen] = useState(false);

  const customerId = customer?.customer_id;

  // Automatically dismiss alerts after 30 seconds
  useEffect(() => {
    if (success || warning || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setWarning(null);
        setError(null);
      }, 3000); // 30 seconds
      return () => clearTimeout(timer); // Cleanup timeout on component unmount or alert change
    }
  }, [success, warning, error]);

  //
  useEffect(() => {
    if (loan) {
      setFormData({
        loan_amount: loan?.loan_amount || 0,
        interest_rate: loan?.interest_rate || 0,
        loan_period: loan?.loan_period || 1,
        ...loan,
      });
    }
  }, [loan]);

  //
  useEffect(() => {
    const loanAmount = Number(formData?.loan_amount || 0);
    const interestRate = Number(formData?.interest_rate || 0);
    const loanPeriod = Number(formData?.loan_period || 1);

    const interest = loanAmount * interestRate;
    const totalAmount = loanAmount + interest;
    const processingFee = loanAmount * 0.02; // 2% fee
    const disbursedAmount = totalAmount - processingFee;
    const calculatedPayment =
      loanPeriod > 0 ? Math.ceil(totalAmount / loanPeriod) : 0;

    setFormData((prev) => ({
      ...prev,
      total_amount: totalAmount.toFixed(2),
      processing_fee: processingFee.toFixed(2),
      disbursed_amount: disbursedAmount.toFixed(2),
      payment: calculatedPayment.toFixed(2),
    }));
  }, [formData?.loan_amount, formData?.interest_rate, formData?.loan_period]);

  //   const handleModeChange = (newMode) => setMode(newMode);
  const handleModeChange = (newMode) => {
    console.log("Changing mode to:", newMode);
    if (newMode === "edit" && loan) {
      setOriginalFormData(formData); // Save the current form data as original
    }
    setMode(newMode);
  };

  //
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked ? value : "",
      }));
    } else if (type === "radio") {
      if (name === "co_debtor") {
        setHasCoDebtor(value === "yes");
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "loan_amount" ||
          name === "interest_rate" ||
          name === "loan_period"
            ? isNaN(Number(removeCommas(value))) || value === ""
              ? 0
              : removeCommas(value)
            : value,
      }));
    }
  };

  // Inside the Business component
  const hasDataChanged = () => {
    return !isEqual(originalFormData, formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.loan_purpose || formData?.loan_purpose.length === 0) {
      setError("Please select at least one loan purpose.");
      return;
    }

    // Skip the update if no changes are detected
    if (mode === "edit" && !hasDataChanged()) {
      setWarning("No changes detected. Update skipped.");
      setMode("view");
      return;
    }

    try {
      setLoading(true);
      const updatedLoan = await updateLoan(loan?.loan_id, formData, customerId);
      setLoading(false);

      setSuccess("Loan updated successfully.");
      setFormData(updatedLoan);
      setMode("view");
    } catch (err) {
      console.error("Failed to update loan:", err);
      setError("Could not update loan.");
    } finally {
      setLoading(false);
    }
  };

  const openInnerModal = (edit) => {
    setIsInnerModalOpen(true);
    handleModeChange(edit);
  };

  const closeInnerModal = () => {
    setIsInnerModalOpen(false);
    handleModeChange(null);
    closeModal();
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <div className={styles.formContainer}>
          {mode === "view" ? (
            <>
              {/* <div className={styles.editLoanCloseBtn} onClick={closeModal}>
                <i className="fa-solid fa-x"></i>
              </div> */}
              {success && (
                <Alert variant="success" className="success">
                  {success}
                </Alert>
              )}
              {warning && (
                <Alert variant="warning" className="warning">
                  {warning}
                </Alert>
              )}
              {error && <Alert className="danger">{error}</Alert>}
              <Modal isOpen={isModalOpen}>
                <div className={styles.form}>
                  <span onClick={closeModal} className={styles.closeModalBtn}>
                    x
                  </span>
                  <h3 className={styles.sectionHeader}>Loan Details</h3>

                  <div className={styles.inputLayout}>
                    <div className={styles.inputControl}>
                      <div>Loan Type: </div>
                      <strong>{formData?.loan_type || ""}</strong>
                    </div>
                  </div>

                  {/* Loan Amount and Amount in Words */}
                  <div className={styles.inputLayout}>
                    <div className={styles.inputControl}>
                      <div>Loan Amount:</div>
                      <strong>
                        {formatNumberWithCommas(formData?.total_amount) || ""}
                      </strong>
                    </div>
                    <div className={styles.inputControl}>
                      <div>Amount In Words:</div>
                      <strong>{formData?.amount_in_words || ""}</strong>
                    </div>
                  </div>

                  {/* Interest Rate and Loan Period */}
                  <div className={`${styles.inputLayout}`}>
                    <div className={styles.inputControl}>
                      <div>Interest Rate:</div>
                      <strong>{formData?.interest_rate || ""}</strong>
                    </div>
                    <div className={styles.inputControl}>
                      <div>Loan Period (months):</div>
                      <strong>{formData?.loan_period || ""}</strong>
                    </div>
                  </div>

                  {/* Payment and Total Amount */}
                  <div className={styles.inputLayout}>
                    <div className={styles.inputControl}>
                      <div>Payment:</div>
                      <strong>
                        {formatNumberWithCommas(formData?.payment) || ""}
                      </strong>
                    </div>

                    <div className={styles.inputControl}>
                      <div>Processing fee (2%):</div>
                      <strong>
                        {formatNumberWithCommas(formData?.processing_fee) || ""}
                      </strong>
                    </div>
                  </div>
                  <div className={styles.inputLayout}>
                    <div className={styles.inputControl}>
                      <div>Total Loan Amount:</div>
                      <strong>
                        {formatNumberWithCommas(formData?.total_amount) || ""}
                      </strong>
                    </div>
                    <div className={styles.inputControl}>
                      <div>Final Disbursed Amount:</div>
                      <strong>
                        {formatNumberWithCommas(formData?.disbursed_amount) ||
                          ""}
                      </strong>
                    </div>
                    <div className={styles.inputControl}>
                      <div>Approved Amount:</div>
                      <strong>
                        {formatNumberWithCommas(formData?.approved_amount) ||
                          ""}
                      </strong>
                    </div>
                    <div className={styles.inputControl}>
                      <div>Balance:</div>
                      <strong>
                        {formatNumberWithCommas(formData?.balance) || ""}
                      </strong>
                    </div>
                  </div>

                  {/*  */}
                  <div className={styles.inputLayout}>
                    <div className={styles.inputControl}>
                      <div>Monthly Salary/Income:</div>
                      <strong>
                        {formatNumberWithCommas(formData?.monthly_salary) || ""}
                      </strong>
                    </div>
                    <div className={styles.inputControl}>
                      <div>Salary In Words:</div>
                      <strong>{formData?.salary_in_words || ""}</strong>
                    </div>
                  </div>

                  {/* Loan Purpose */}

                  <div className={styles.inputControl}>
                    <div>Loan Purpose: </div>
                    <strong>
                      {capitalizeWords(formData?.loan_purpose) || ""}
                    </strong>
                  </div>

                  {/* Co-Debtor Information */}
                  <div className={styles.sectionMargin}>
                    <p className={styles.sectionHeader}>
                      Co-Debtor Information
                    </p>

                    <div className={`${styles.inputLayout}`}>
                      <div className={styles.inputControl}>
                        <div>Co-Debtor Name:</div>
                        <strong>
                          {capitalizeWords(formData?.co_debtor_name) || ""}
                        </strong>
                      </div>
                      <div className={styles.inputControl}>
                        <div>Relationship:</div>
                        <strong>
                          {capitalizeWords(formData?.co_debtor_relation) || ""}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Loan History */}
                  <div className={styles.sectionMargin}>
                    <p className={styles.sectionHeader}>Loan History</p>
                    <div className={styles.inputControl}>
                      <div>Have you loaned before?</div>
                      <strong>
                        {capitalizeWords(formData?.prior_loan_history) || ""}
                      </strong>
                    </div>

                    <div className={styles.inputControl}>
                      <div>
                        Have you ever loaned with Easy Life Microfinance?
                      </div>
                      <strong>
                        {capitalizeWords(formData?.loaned_with_easylife) || ""}
                      </strong>
                    </div>

                    <div className={styles.inputControl}>
                      <div>
                        Do you owe any arrears with another financial
                        institution?
                      </div>
                      <strong>
                        {capitalizeWords(formData?.owe_arrears_elsewhere) || ""}
                      </strong>
                    </div>
                  </div>

                  <div className={styles.sectionMargin}>
                    <p className={styles.sectionHeader}>Consent Details</p>
                    <div className={styles.inputLayout}>
                      <div className={styles.inputControl}>
                        <label>Applicant&apos;s Full Name:</label>
                        <strong>{formData?.full_name || ""}</strong>
                      </div>
                      <div className={styles.inputControl}>
                        <label>Initial(signature):</label>
                        <strong>{formData?.applicant_initial || ""}</strong>
                      </div>
                    </div>
                    <div className={styles.inputControl}>
                      <label>Today&apos;s Date:</label>
                      <strong>
                        {formatDateRegular(formData?.submission_date) || ""}
                      </strong>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className={styles.addNavBtnContainer}>
                    {/* <button
                      onClick={() => openInnerModal("edit")}
                      className={styles.formNavBtn}
                    >
                      Edit
                    </button> */}
                  </div>
                </div>
              </Modal>
            </>
          ) : (
            // <p>Display Form</p>
            <>
              {isInnerModalOpen && (
                <EditForm
                  isInnerModalOpen={isInnerModalOpen}
                  closeInnerModal={closeInnerModal}
                  handleChange={handleChange}
                  handleModeChange={handleModeChange}
                  handleSubmit={handleSubmit}
                  formData={formData}
                  hasCoDebtor={hasCoDebtor}
                  setFormData={setFormData}
                  setHasCoDebtor={setHasCoDebtor}
                />
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default LoanDetails;

function EditForm({
  handleSubmit,
  handleChange,
  formData,
  hasCoDebtor,
  handleModeChange,
  setFormData,
  isInnerModalOpen,
  closeInnerModal,
}) {
  return (
    <div>
      <SmallModal isOpen={isInnerModalOpen}>
        <span onClick={closeInnerModal} className={styles.innerModalEdit}>
          x
        </span>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.editLoanFormHeader}>Edit Loan Form</h3>
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label>Loan Type:</label>
              <select
                name="loan_type"
                value={formData?.loan_type || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Salary Loan">Salary Loan</option>
                <option value="Personal Loan">Micro/Personal Loan</option>
                <option value="Group Loan">Group Loan</option>
                <option value="Individual Loan">
                  Individual Business Loan
                </option>
              </select>
            </div>
          </div>

          {/* Loan Amount and Amount in Words */}
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label>Loan Amount:</label>
              <input
                type="text"
                name="loan_amount"
                value={formatNumberWithCommas(formData?.loan_amount) || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputControl}>
              <label>Amount In Words:</label>
              <input
                type="text"
                name="amount_in_words"
                value={formData?.amount_in_words || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Interest Rate and Loan Period */}
          <div className={`${styles.inputLayout}`}>
            <div className={styles.inputControl}>
              <label>Interest Rate:</label>
              <select
                name="interest_rate"
                value={formData?.interest_rate || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="0.2">20%</option>
                <option value="0.25">25%</option>
                <option value="0.30">30%</option>
              </select>
            </div>
            <div className={styles.inputControl}>
              <label>Loan Period (months):</label>
              <input
                type="text"
                name="loan_period"
                value={formData?.loan_period || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Payment and Total Amount */}
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label>Payment:</label>
              <input
                type="text"
                name="payment"
                value={formatNumberWithCommas(formData?.payment) || ""}
                readOnly
                required
              />
            </div>

            <div className={styles.inputControl}>
              <label>Processing fee (2%):</label>
              <input
                type="text"
                id="processing_fee"
                name="processing_fee"
                value={formatNumberWithCommas(formData?.processing_fee) || ""}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label>Total Loan Amount:</label>
              <input
                type="text"
                name="total_amount"
                value={formatNumberWithCommas(formData?.total_amount) || ""}
                readOnly
              />
            </div>
            <div className={styles.inputControl}>
              <label>Final Disbursed Amount:</label>
              <input
                type="text"
                name="final_disbursed_amount"
                value={formatNumberWithCommas(formData?.disbursed_amount) || ""}
                readOnly
              />
            </div>
          </div>

          {/*  */}
          <div className={styles.inputLayout}>
            <div className={styles.inputControl}>
              <label>Monthly Salary/Income:</label>
              <input
                type="text"
                id="monthly_salary"
                name="monthly_salary"
                value={formatNumberWithCommas(formData?.monthly_salary) || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputControl}>
              <label>Salary In Words:</label>
              <input
                type="text"
                id="salary_in_words"
                name="salary_in_words"
                value={formData?.salary_in_words || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Loan Purpose */}
          <div className={styles.sectionMargin}>
            <div className={styles.inputLayout}>
              <div>
                <label>Loan Purpose</label>
                {[
                  "Home Improvement",
                  "Personal Expenses",
                  "Education",
                  "Medical Expenses",
                  "Business Investment",
                  "Vehicle Purchase",
                  "Others",
                ].map((purpose) => (
                  <div key={purpose}>
                    <label>
                      <input
                        type="checkbox"
                        name="loan_purpose"
                        value={purpose}
                        checked={formData?.loan_purpose?.includes(purpose)}
                        onChange={handleChange}
                      />
                      {purpose}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Co-Debtor Information */}

          {/* Co-Debtor Information */}
          <div className={styles.sectionMargin}>
            <h4>Co-Debtor Information</h4>
            <div className={styles.sectionMargin}>
              <h4>Co-Debtor Information</h4>
              <div>
                <label>Do you have a co-debtor for this loan?</label>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="co_debtor"
                      value="no"
                      checked={!hasCoDebtor}
                      onChange={handleChange}
                      required
                    />
                    No
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="co_debtor"
                      value="yes"
                      checked={hasCoDebtor}
                      onChange={handleChange}
                    />
                    Yes
                  </label>
                </div>
              </div>
            </div>

            {/* Conditionally Render Co-Debtor Fields */}
            {hasCoDebtor && (
              <div className={`${styles.inputLayout}`}>
                <div className={styles.inputControl}>
                  <label>Co-Debtor Name:</label>
                  <input
                    type="text"
                    name="co_debtor_name"
                    value={formData?.co_debtor_name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        co_debtor_name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.inputControl}>
                  <label>Relationship:</label>
                  <input
                    type="text"
                    name="co_debtor_relation"
                    value={formData?.co_debtor_relation || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        co_debtor_relation: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Loan History */}
          <div className={styles.sectionMargin}>
            <h4>Loan History</h4>
            <div>
              <label>Have you loaned before?</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="prior_loan_history" // Unique name
                    value="yes"
                    checked={formData?.prior_loan_history === "yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="prior_loan_history" // Unique name
                    value="no"
                    checked={formData?.prior_loan_history === "no"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <label>Have you ever loaned with Easy Life Microfinance?</label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="loaned_with_easylife"
                    value="yes"
                    checked={formData?.loaned_with_easylife === "yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="loaned_with_easylife"
                    value="no"
                    checked={formData?.loaned_with_easylife === "no"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <label>
                Do you owe any arrears with another financial institution?
              </label>
              <div>
                <label>
                  <input
                    type="radio"
                    name="owe_arrears_elsewhere"
                    value="yes"
                    checked={formData?.owe_arrears_elsewhere === "yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="owe_arrears_elsewhere"
                    value="no"
                    checked={formData?.owe_arrears_elsewhere === "no"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          <div className={styles.sectionMargin}>
            <div className={styles.inputLayout}>
              <div className={styles.inputControl}>
                <label>Applicant&apos;s Full Name:</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData?.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputControl}>
                <label>Initial(signature):</label>
                <input
                  type="text"
                  id="applicant_initial"
                  name="applicant_initial"
                  value={formData?.applicant_initial}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={styles.inputLayout}>
              <div className={styles.inputControl}>
                <label>Today&apos;s Date:</label>
                <input
                  type="date"
                  id="submission_date"
                  name="submission_date"
                  value={formData?.submission_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.consentInput}>
              <input
                type="checkbox"
                name="consented"
                value="Consent signed"
                checked={formData?.consented === "Consent signed"} // Track checkbox correctly
                onChange={handleChange}
                required
              />
              <label>
                I declare that all the information provided about/by me are true
                and correct at the time of submission of my application.
              </label>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className={styles.addNavBtnContainer}>
            <button type="button" onClick={() => handleModeChange("view")}>
              Cancel
            </button>
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </SmallModal>
    </div>
  );
}
