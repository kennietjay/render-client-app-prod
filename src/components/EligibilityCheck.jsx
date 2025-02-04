import React, { useState } from "react";
import styles from "./EligibilityCheck.module.css";
import { HashLink } from "react-router-hash-link/dist/react-router-hash-link.cjs.production";
import { Alert } from "react-bootstrap";

const EligibilityCheck = ({ closeModal }) => {
  return (
    <main className={styles.checkEligibilityContainer}>
      <Hero subtitle="Answer a few questions to find out if you're eligible for a loan." />
      <QualificationForm closeModal={closeModal} />
    </main>
  );
};

export default EligibilityCheck;

//
const Hero = ({ title, subtitle }) => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        {/* <h3>{title}</h3> */}
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

//
const QualificationForm = ({ closeModal }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);

  const questions = [
    { key: "name", question: "What is your full name?", type: "text" },
    { key: "age", question: "What is your age?", type: "number" },
    { key: "phone", question: "What is your phone number?", type: "tel" },
    { key: "address", question: "What is your address?", type: "text" },
    {
      key: "employerStatus",
      question: "Are you currently employed? (Yes/No)",
      type: "text",
    },
  ];

  const employedQuestions = [
    {
      key: "employerName",
      question: "What is your employer's name?",
      type: "text",
    },
    {
      key: "salaryRange",
      question: "What is your monthly salary range?",
      type: "text",
    },
  ];

  const businessQuestions = [
    {
      key: "hasBusiness",
      question: "Do you own a business? (Yes/No)",
      type: "text",
    },
    {
      key: "businessName",
      question: "What is your business name?",
      type: "text",
    },
    {
      key: "businessCapital",
      question: "What is your business capital?",
      type: "number",
    },
    {
      key: "businessProfit",
      question: "What is your monthly profit?",
      type: "number",
    },
  ];

  const allQuestions = [
    ...questions,
    ...(formData.employerStatus?.toLowerCase() === "yes"
      ? employedQuestions
      : []),
    ...(formData.employerStatus?.toLowerCase() === "no"
      ? businessQuestions
      : []),
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleNextStep = () => {
    const currentQuestion = allQuestions[currentStep];
    const currentAnswer = formData[currentQuestion.key]?.toLowerCase();

    // Check if the user has entered a response
    if (!currentAnswer || currentAnswer.trim() === "") {
      setError("Please provide a response before proceeding.");
      return; // Prevent moving to the next question
    }

    // Save the response
    setResponses((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        answer: formData[currentQuestion.key],
      },
    ]);

    // Validate Yes/No questions
    if (
      (currentQuestion.key === "employerStatus" ||
        currentQuestion.key === "hasBusiness") &&
      currentAnswer !== "yes" &&
      currentAnswer !== "no"
    ) {
      alert("Please enter 'Yes' or 'No'");
      return;
    }

    // Stop if `hasBusiness` is "No"
    if (currentQuestion.key === "hasBusiness" && currentAnswer === "no") {
      setCurrentStep(allQuestions.length); // End the questions
      return;
    }

    // Move to the next question
    setCurrentStep((prev) => prev + 1);
  };

  const isEligible = () => {
    const { age, employerStatus, salaryRange, hasBusiness, businessCapital } =
      formData;
    if (parseInt(age) < 20 || parseInt(age) > 70) return false;
    if (
      employerStatus?.toLowerCase() === "yes" &&
      parseInt(salaryRange.replace(/[^0-9]/g, "")) >= 500
    )
      return true;
    if (
      employerStatus?.toLowerCase() === "no" &&
      hasBusiness?.toLowerCase() === "yes" &&
      parseInt(businessCapital) >= 500
    )
      return true;
    return false;
  };

  const launchApplication = () => {
    // Close the current modal
    closeModal();
  };

  return (
    <div className={styles.formSection}>
      {responses.length > 0 && (
        <div className={styles.responses}>
          {responses.map((response, index) => (
            <div key={index} className={styles.response}>
              <strong>{response.question}</strong>
              <p>{response.answer}</p>
            </div>
          ))}
        </div>
      )}
      {currentStep < allQuestions.length ? (
        <div className={styles.questionContainer}>
          <p>{allQuestions[currentStep].question}</p>
          <input
            type={allQuestions[currentStep].type}
            name={allQuestions[currentStep].key}
            value={formData[allQuestions[currentStep].key] || ""}
            onChange={handleInputChange}
            className={styles.input}
          />
          {error && (
            <Alert variant="warning" className={styles.error}>
              {error}
            </Alert>
          )}{" "}
          {/* Display error */}
          <button onClick={handleNextStep} className={styles.nextButton}>
            Next
          </button>
        </div>
      ) : (
        <div className={styles.resultContainer}>
          {isEligible() ? (
            <>
              <p>Congratulations! 🎉</p>
              <p>You are eligible to proceed with a loan application.</p>
              <HashLink
                smooth
                to="/user/signup#top"
                onClick={launchApplication}
                className={styles.ctaButton}
              >
                Continue to Application
              </HashLink>
            </>
          ) : (
            <>
              <p>Unfortunately, you do not qualify.</p>
              <p>
                Based on the provided information, you are not eligible to apply
                for a loan at this time.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
