import React, { useState } from "react";
import Modal from "../../../components/Modal"; // Make sure to import your Modal component
import styles from "../../../components/DashboardComponents/Loans/LoanPayment.module.css";
import EmployerInformation from "./EmployerForm";
import LoanInformation from "./LoanForm"; // Import your Loan component
import GuarantorInformation from "./GuarantorForm";
import SummaryInformation from "./SummaryForm";
import Requirement from "./Requirement";
import BankInformation from "./BankInformation";
import FilesUpload from "./FilesUpload";
import SignConsent from "./SignConsent";
import CustomerInformation from "./CustomerForm";
import AddressInformation from "./AddressForm";

function LoanApplication({ isModalOpen, closeModal }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customer: {
      customer_id: "",
      last_name: "",
      middle_name: "T",
      first_name: "",
      gender: "",
      date_of_birth: "",
      phone: "",
      other_phone: "",
      email: "",
    },

    address: {
      address: "",
      city: "",
      section: "",
      chiefdom: "",
      district: "",
    },

    employer: {
      employing_authority: "",
      employer_name: "",
      occupation: "",
      employee_code: "",
      employer_email: "",
      employer_phone: "",
      current_position: "",
      employer_address: "",
      employer_city: "",
      employer_chiefdom: "",
      employer_district: "",
    },

    loan: {
      user_fid: "",
      customer_id: "",
      loan_type: "",
      loan_amount: "",
      loan_purpose: "",
      loan_period: "",
      approved_amount: "",
      approved_by: "",
      first_review_by: "",
      second_review_by: "",
      total_amount: "",
      payment: "",
      amount_in_words: "",
      monthly_salary: "",
      salary_in_words: "",
      interest_rate: "",
      co_debtor: "",
      co_debtor_relation: "",
      prior_loan_history: "",
      loaned_with_easylife: "",
      owe_arrears_elsewhere: "",
      status: "",
    },

    bank: {
      bank_name: "",
      account_name: "",
      account_number: "",
      bank_address: "",
      bank_city: "",
      bank_chiefdom: "",
      bank_district: "",
    },

    guarantor: {
      guarantor_first_name: "",
      guarantor_last_name: "",
      guarantor_middle_name: "",
      guarantor_phone: "",
      guarantor_email: "",
      guarantor_gender: "",
      guarantor_address: "",
      guarantor_section: "",
      guarantor_city: "",
      guarantor_chiefdom: "",
      guarantor_district: "",
      guarantor_relationship: "",
      guarantor_occupation: "",
    },

    files: [],

    consent: {
      consent: "",
      full_name: "",
      applicant_initial: "",
      submission_date: "",
    },
  });

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleFormData = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const handleCloseModal = () => {
    closeModal();
  };

  return (
    <div className={styles.loanApplicationForm}>
      <Modal isOpen={isModalOpen} onClick={handleCloseModal}>
        <div>
          {step === 1 && (
            <Requirement
              nextStep={nextStep}
              handleFormData={handleFormData}
              formData={formData.requirement}
              closeModal={handleCloseModal}
            />
          )}

          {step === 2 && (
            <CustomerInformation
              nextStep={nextStep}
              prevStep={prevStep}
              handleFormData={handleFormData}
              formData={formData.customer}
              closeModal={handleCloseModal}
            />
          )}

          {step === 3 && (
            <AddressInformation
              nextStep={nextStep}
              prevStep={prevStep}
              handleFormData={handleFormData}
              formData={formData.address}
              closeModal={handleCloseModal}
            />
          )}

          {step === 4 && (
            <EmployerInformation
              nextStep={nextStep}
              prevStep={prevStep}
              handleFormData={handleFormData}
              formData={formData.employer}
              closeModal={handleCloseModal}
            />
          )}

          {step === 5 && (
            <LoanInformation
              nextStep={nextStep}
              prevStep={prevStep}
              handleFormData={handleFormData}
              formData={formData.loan}
              closeModal={handleCloseModal}
            />
          )}

          {step === 6 && (
            <BankInformation
              nextStep={nextStep}
              prevStep={prevStep}
              handleFormData={handleFormData}
              formData={formData.bank}
              closeModal={handleCloseModal}
            />
          )}

          {step === 7 && (
            <GuarantorInformation
              nextStep={nextStep}
              prevStep={prevStep}
              handleFormData={handleFormData}
              formData={formData.guarantor}
              closeModal={handleCloseModal}
            />
          )}

          {step === 8 && (
            <FilesUpload
              nextStep={nextStep}
              prevStep={prevStep}
              handleFormData={handleFormData}
              formData={formData.files}
              closeModal={handleCloseModal}
            />
          )}

          {step === 9 && (
            <SignConsent
              nextStep={nextStep}
              prevStep={prevStep}
              handleFormData={handleFormData}
              formData={formData.consent}
              closeModal={handleCloseModal}
            />
          )}

          {step === 10 && (
            <SummaryInformation
              closeModal={handleCloseModal}
              prevStep={prevStep}
              formData={{ ...formData }}
              onSubmit={closeModal} // Handle submission here
            />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default LoanApplication;
