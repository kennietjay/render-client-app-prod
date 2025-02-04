import React, { useEffect, useState } from "react";
import styles from "./MoneyTransferForm.module.css"; // Import CSS Module
import SmallModal from "../../SmallModal";
import { useTransfer } from "../../../context/TransferContext";
import { useStaff } from "../../../context/StaffContext";
import { formatDateToInput } from "../../../../utils/formatDateToInput";

const MoneyTransferForm = ({ onSuccess, isSmallModalOpen, closeModal }) => {
  const [staff, setStaff] = useState(null);
  const { createTransfer } = useTransfer();
  const { getStaffProfile } = useStaff();
  const [formData, setFormData] = useState({
    transfer_pin: "23423232",
    transfer_medium: "Ria",
    amount: "100",
    foreign_currency: "Dollar",
    local_currency: "2430",
    transfer_date: "12/17/2024",
    sender_name: "Amara Jay",
    sender_country: "USA",
    sender_city: "Reston",
    sender_phone: "5718972041",
    sender_email: "test@gmail",
    receiver_name: "John Ama",
    receiver_country: "Sierra Leone",
    receiver_city: "Kenema",
    receiver_phone: "076889768",
    receiver_email: "test@gmail.com",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // console.log(staff);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newTransfer = {
      ...formData,
      staff_id: staff.id,
    };

    try {
      const response = "";

      await createTransfer(newTransfer);

      // console.log(formData, staff_id);
      //
      alert("Transaction Successful!");
      if (onSuccess) onSuccess(response.data);
      setFormData({
        transfer_pin: "23423232",
        transfer_medium: "Ria",
        amount: "100",
        foreign_currency: "Dollar",
        local_currency: "2430",
        transfer_date: "12/17/2024",
        sender_name: "Amara Jay",
        sender_country: "USA",
        sender_city: "Reston",
        sender_phone: "5718972041",
        sender_email: "test@gmail",
        receiver_name: "John Ama",
        receiver_country: "Sierra Leone",
        receiver_city: "Kenema",
        receiver_phone: "076889768",
        receiver_email: "test@gmail.com",
      });
    } catch (err) {
      setError("Error creating the transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SmallModal isOpen={isSmallModalOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.closeBtn}>
          <i onClick={closeModal} className="fa-solid fa-xmark"></i>
        </div>

        <h2 className={styles.title}>Money Transfer Form</h2>
        {error && <p className={styles.error}>{error}</p>}

        {/* Transaction Details */}
        <div className={styles.inputControl}>
          <label className={styles.label}>Transfer PIN:</label>
          <input
            type="text"
            name="transfer_pin"
            value={formData.transfer_pin}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputControl}>
          <label className={styles.label}>Transfer Medium:</label>
          <input
            type="text"
            name="transfer_medium"
            placeholder="e.g., Ria, Western Union"
            value={formData.transfer_medium}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputControl}>
          <label className={styles.label}>Amount (Foreign Currency):</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={styles.input}
            min={0}
            required
          />
        </div>
        <div className={styles.inputControl}>
          <label className={styles.label}>Foreign Currency Type:</label>
          <input
            type="text"
            name="foreign_currency"
            value={formData.foreign_currency}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputControl}>
          <label className={styles.label}>Equivalent Local Currency:</label>
          <input
            type="number"
            name="local_currency"
            value={formData.local_currency}
            onChange={handleChange}
            className={styles.input}
            min={0}
            required
          />
        </div>
        <div className={styles.inputControl}>
          <label className={styles.label}>Transfer Date:</label>
          <input
            type="date"
            name="transfer_date"
            value={formatDateToInput(formData.transfer_date)}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        {/* Sender Details */}
        <h3 className={styles.sectionTitle}>Sender Details</h3>
        <div className={styles.inputControl}>
          <label className={styles.label}>Sender Name:</label>
          <input
            type="text"
            name="sender_name"
            value={formData.sender_name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputControl}>
          <label className={styles.label}>Country:</label>
          <input
            type="text"
            name="sender_country"
            value={formData.sender_country}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputControl}>
          <label className={styles.label}>City:</label>
          <input
            type="text"
            name="sender_city"
            value={formData.sender_city}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputControl}>
          <label className={styles.label}>Sender Phone:</label>
          <input
            type="text"
            name="sender_phone"
            value={formData.sender_phone}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputControl}>
          <label className={styles.label}>Sender Email:</label>
          <input
            type="email"
            name="sender_email"
            value={formData.sender_email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        {/* Receiver Details */}
        <h3 className={styles.sectionTitle}>Receiver Details</h3>
        <div className={styles.inputControl}>
          <label className={styles.label}>Receiver Name:</label>
          <input
            type="text"
            name="receiver_name"
            value={formData.receiver_name}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputControl}>
          <label className={styles.label}>Country:</label>
          <input
            type="text"
            name="receiver_country"
            value={formData.receiver_country}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputControl}>
          <label className={styles.label}>City:</label>
          <input
            type="text"
            name="receiver_city"
            value={formData.receiver_city}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputControl}>
          <label className={styles.label}>Receiver Phone:</label>
          <input
            type="text"
            name="receiver_phone"
            value={formData.receiver_phone}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.inputControl}>
          <label className={styles.label}>Receiver Email:</label>
          <input
            type="email"
            name="receiver_email"
            value={formData.receiver_email}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit Transaction"}
        </button>
      </form>
    </SmallModal>
  );
};

export default MoneyTransferForm;
