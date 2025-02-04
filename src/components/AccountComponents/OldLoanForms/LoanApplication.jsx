import React, { useState } from "react";

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
      last_name: "Amadu",
      middle_name: "T",
      first_name: "Mary",
      gender: "male",
      date_of_birth: "",
      phone: "077657890",
      other_phone: "077657811",
      email: "4jayamara@gmail.com",
    },

    address: {
      address: "10 Koroma Street",
      city: "Kenema",
      section: "Central",
      chiefdom: "Nongowa",
      district: "Kenema",
    },

    employer: {
      employing_authority: "Ministry of edu",
      employer_name: "Islamic Mission",
      occupation: "Teacher",
      employee_code: "32456",
      employer_email: "teach@mail.com",
      employer_phone: "+232-33-456789",
      current_position: "bosser",
      employer_address: "1 Test drive",
      employer_city: "Kenema",
      employer_chiefdom: "Nongowa",
      employer_district: "Kenema",
    },

    loan: {
      user_fid: "",
      customer_id: "",
      loan_type: "Salary Loan",
      loan_amount: "10000",
      loan_purpose: "Education",
      loan_period: "8",
      approved_amount: "",
      approved_by: "",
      first_review_by: "",
      second_review_by: "",
      total_amount: "12000",
      monthly_payment: "",
      amount_in_words: "test",
      monthly_salary: "1300",
      salary_in_words: "test",
      interest_rate: "0.2",
      co_debtor: "Mariama Jalloh",
      co_debtor_relation: "Sister",
      prior_loan_history: "no",
      loaned_with_easylife: "no",
      owe_arrears_elsewhere: "no",
      status: "applied",
    },

    bank: {
      bank_name: "Zenith Bank",
      account_name: "My Savings",
      account_number: "234-23145689",
      bank_address: "1 Dama Road",
      bank_city: "Kenema",
      bank_chiefdom: "Nongowa",
      bank_district: "Kenema",
    },

    guarantor: {
      guarantor_first_name: "Mary",
      guarantor_last_name: "Thomas",
      guarantor_middle_name: "B",
      guarantor_phone: "+23276869078",
      guarantor_email: "test@gmail.com",
      guarantor_gender: "female",
      guarantor_address: "1 Test drive",
      guarantor_section: "IDA",
      guarantor_city: "Kenema",
      guarantor_chiefdom: "Nongowa",
      guarantor_district: "Kenema",
      guarantor_relationship: "Sister",
      guarantor_occupation: "Trader",
    },

    files: [],

    consent: {
      consent: "",
      full_name: "Hannah Kamara",
      applicant_initial: "HK",
      submission_date: "2024-10-18",
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
    <Modal isOpen={isModalOpen} onClose={closeModal}>
      <div>
        {step === 1 && (
          <Requirement
            nextStep={nextStep}
            handleFormData={handleFormData}
            formData={formData.requirement}
          />
        )}

        {step === 2 && (
          <CustomerInformation
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormData={handleFormData}
            formData={formData.customer}
          />
        )}

        {step === 3 && (
          <AddressInformation
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormData={handleFormData}
            formData={formData.address}
          />
        )}

        {step === 4 && (
          <EmployerInformation
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormData={handleFormData}
            formData={formData.employer}
          />
        )}

        {step === 5 && (
          <LoanInformation
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormData={handleFormData}
            formData={formData.loan}
          />
        )}

        {step === 6 && (
          <BankInformation
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormData={handleFormData}
            formData={formData.bank}
          />
        )}

        {step === 7 && (
          <GuarantorInformation
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormData={handleFormData}
            formData={formData.guarantor}
          />
        )}

        {step === 8 && (
          <FilesUpload
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormData={handleFormData}
            formData={formData.files}
          />
        )}

        {step === 9 && (
          <SignConsent
            nextStep={nextStep}
            prevStep={prevStep}
            handleFormData={handleFormData}
            formData={formData.consent}
          />
        )}

        {step === 10 && (
          <SummaryInformation
            handleCloseModal={handleCloseModal}
            prevStep={prevStep}
            formData={{ ...formData }}
            onSubmit={closeModal} // Handle submission here
          />
        )}
      </div>
    </Modal>
  );
}

export default LoanApplication;
