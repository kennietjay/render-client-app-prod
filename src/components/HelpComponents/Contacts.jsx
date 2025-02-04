import React, { useState, useEffect } from "react";
import styles from "../../pages/Profile.module.css";
import { useUser } from "../../contexts/UserContext";
import LoadingSpinner from "../LoadingSpinner";

function ContactForm() {
  const {
    profile,
    fetchContactsByUserId,
    createContact,
    updateContact,
    error,
    success,
  } = useUser();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    chiefdom: "",
    district: "",
    section: "",
    user_fid: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [inputError, setInputError] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("view"); // "view", "edit", or "add"

  const user_fid = profile.id;
  const [contactId, setContactId] = useState(""); // Ensure contactId is set correctly

  //
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user_fid) {
          const contactsData = await fetchContactsByUserId(user_fid);

          console.log("Contacts data in component:", contactsData);

          if (contactsData && contactsData.length > 0) {
            const firstContact = contactsData[0];
            setContact(firstContact);
            setContactId(firstContact.id); // Ensure contactId is set
            setFormData({
              address: firstContact.address || "",
              city: firstContact.city || "",
              chiefdom: firstContact.chiefdom || "",
              district: firstContact.district || "",
              section: firstContact.section || "",
            });
          } else {
            setContact(null);
            setContactId(""); // Clear contactId if no contact is found
          }
        }
      } catch (error) {
        console.error("Error fetching contacts in component:", error.message);
      } finally {
        setLoading(false);
      }
      setLoading(false);
    };

    fetchData();
  }, [fetchContactsByUserId, user_fid]);

  //
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  // Modify handleSubmit to include user_fid correctly
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.address ||
      !formData.city ||
      !formData.chiefdom ||
      !formData.district ||
      !formData.section
    ) {
      setInputError("All fields are required.");
    }
    setLoading(true);
    try {
      console.log("Submitting with formData:", formData);
      console.log("Contact ID:", contactId);
      console.log("User ID:", user_fid);

      if (mode === "edit" && contactId) {
        await updateContact({
          ...formData,
          id: contactId,
          user_fid: Number(user_fid),
        });

        fetchContactsByUserId(user_fid);
      } else if (mode === "add") {
        await createContact({ ...formData, user_fid: Number(user_fid) });

        fetchContactsByUserId(user_fid);
      }

      setMode("view");

      fetchContactsByUserId(user_fid);

      // Handle success, maybe notify the user
      setLoading(false);
    } catch (error) {
      console.log("Error updating or creating contact:", error);
    }
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
        <div>
          <div className={styles.formContainer}>
            <h4>Address Details</h4>
            {mode === "view" ? (
              <div>
                {contact ? (
                  <div key={contact.id} className={styles.trusteeForm}>
                    <div className={styles.trusteeDetails}>
                      <div className={styles.label}>Address:</div>
                      <div className={styles.value}>{contact.address}</div>
                    </div>
                    <div className={styles.trusteeDetails}>
                      <div className={styles.label}>City/Town:</div>
                      <div className={styles.value}>{contact.city}</div>
                    </div>
                    <div className={styles.trusteeDetails}>
                      <div className={styles.label}>Section:</div>
                      <div className={styles.value}>{contact.section}</div>
                    </div>
                    <div className={styles.trusteeDetails}>
                      <div className={styles.label}>Chiefdom:</div>
                      <div className={styles.value}>{contact.chiefdom}</div>
                    </div>
                    <div className={styles.trusteeDetails}>
                      <div className={styles.label}>District:</div>
                      <div className={styles.value}>{contact.district}</div>
                    </div>
                    <div className={styles.addEditBtn}>
                      <button
                        className={styles.edit}
                        onClick={() => handleModeChange("edit")}
                      >
                        <span>
                          <i className="fa-solid fa-pen-to-square"></i>Edit
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.addEditBtn}>
                    <button
                      className={styles.edit}
                      onClick={() => handleModeChange("add")}
                    >
                      Add Contact
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputControl}>
                  <label htmlFor="address">Address:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.contactDetails}>
                  <div className={styles.contactInput}>
                    <div className={styles.inputControl}>
                      <label htmlFor="city">City/Town:</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.inputControl}>
                      <label htmlFor="chiefdom">Chiefdom:</label>
                      <input
                        type="text"
                        id="chiefdom"
                        name="chiefdom"
                        value={formData.chiefdom}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className={styles.contactInput}>
                    <div className={styles.inputControl}>
                      <label htmlFor="district">District:</label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={styles.inputControl}>
                      <label htmlFor="section">Section:</label>
                      <input
                        type="text"
                        id="section"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <button type="submit">
                  {mode === "edit" ? "Save Changes" : "Add Contact"}
                </button>
                <button type="button" onClick={() => handleModeChange("view")}>
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ContactForm;
