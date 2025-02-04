import React, { useState } from "react";
import styles from "./HelpCenter.module.css";
import { Alert } from "react-bootstrap";
import { useContact } from "../context/ContactContext";
import LoadingSpinner from "../components/LoadingSpinner";

const HelpCenter = () => {
  return (
    <div className={styles.helpCenter}>
      <div className={`${"container"} ${styles.helpCenterContent}`}>
        <Hero
          title="Help Center"
          subtitle="Find answers to your questions and get the support you need."
        />
        <ContactSupport />
        <FAQSection />
        <ContactForm />
      </div>
    </div>
  );
};

export default HelpCenter;

const Hero = ({ title, subtitle }) => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I apply for a loan?",
      answer:
        "You can apply for a loan by visiting our loan application page, filling out the required information, and submitting the necessary documents.",
    },
    {
      question: "What documents are required for loan applications?",
      answer:
        "You will need to provide proof of income, a valid ID, two passport photos, and additional documents depending on the type of loan.",
    },
    {
      question: "How can I pay my utility bills?",
      answer:
        "You can pay your utility bills through our secure platform by visiting our office or using our mobile application.",
    },
    {
      question: "What are the available money transfer options?",
      answer:
        "We provide money transfer services through Western Union, MoneyGram, and Ria. Visit our office to access these services.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.faqSection}>
      <h3>Frequently Asked Questions</h3>
      <div className={styles.faqContainer}>
        {faqs.map((faq, index) => (
          <div key={index} className={styles.faqItem}>
            <div
              className={styles.question}
              onClick={() => toggleAccordion(index)}
            >
              {faq.question}
              <span className={styles.icon}>
                {activeIndex === index ? "-" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <div className={styles.answer}>{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

//
const ContactSupport = () => {
  return (
    <div className={styles.contactSupport}>
      <h3>Need More Help?</h3>
      <p>
        If you couldn&apos;t find the answer you were looking for, our support
        team is here to assist you.
      </p>
      <ul>
        <li>
          <strong>Email:</strong> support@easylifesl.com
        </li>
        <li>
          <strong>Phone:</strong> +232-123-4567
        </li>
        <li>
          <strong>Visit:</strong> Kenema Shopping Plaza Ave, Kenema, Sierra
          Leone
        </li>
      </ul>
    </div>
  );
};

const ContactForm = () => {
  const { createMessage, loading } = useContact();
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Form submission logic

    const newMessage = {
      full_name: formData.full_name,
      email: formData.email,
      message: formData.message,
    };

    const response = await createMessage(newMessage);
    if (success) {
      setSuccess(response.msg);
    }

    setError("");
    setFormData({ full_name: "", email: "", message: "" });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {loading ? (
        <LoadingSpinner
          size={60}
          className="spinner-color"
          message="Loading data..."
        />
      ) : (
        <div className={styles.helpContactForm}>
          <h3>Contact us</h3>
          <p>
            You can submit a support question or issue and we would love the
            privilege to provide the service for you.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            {success && (
              <Alert dismissible variant="success">
                {success}
              </Alert>
            )}

            {error && (
              <Alert
                variant="warning"
                className="warning"
                dismissible
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <h2 className={styles.title}>Report an issue</h2>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Details</label>
              <textarea
                id="message"
                name="message"
                placeholder="Write your message here"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
              ></textarea>
            </div>
            <button disabled={loading} type="submit" className={styles.button}>
              Submit Issue
            </button>
          </form>
        </div>
      )}
    </>
  );
};
