import React, { useCallback, useEffect, useState } from "react";
import styles from "./Staff.module.css";
import SmallModal from "../../SmallModal";

import LoadingSpinner from "../../LoadingSpinner";
import StaffTable from "./StaffTable";
import { Alert } from "react-bootstrap";
import { useStaff } from "../../../context/StaffContext";
import { formatDateToInput } from "../../../../utils/formatDateToInput";
// import AddStaff from "./AddStaff";
import { handleDateInput, convertToDBFormat } from "/utils/dateUtils.js";

function Staff({
  props,
  staff,
  selectedStaff,
  setSelectedStaff,
  handleSelectedStaff,
}) {
  const { createStaff } = useStaff();
  const [activeAction, setActiveAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "Amara",
    last_name: "Tamia",
    middle_name: "T",
    gender: "Male",
    date_of_birth: "12-12-2000",
    email: "kennie4tamia@gmail.com",
    phone: "076234567",
    second_phone: "076234567",
    role_id: "7",
    department: "Management",
    employment_date: "08-01-2024",
    password: "password",
    confirm_password: "password",
  });

  // Automatically dismiss alerts after 30 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);

        setError(null);
      }, 3000); // 30 seconds
      return () => clearTimeout(timer); // Cleanup timeout on component unmount or alert change
    }
  }, [success, error]);

  const handleActionClick = (action) => {
    setActiveAction(action);
  };

  const closeActionModal = () => setActiveAction(null);

  // Helper function to validate date
  const isValidDate = (date) => !isNaN(Date.parse(date));

  // Function to capitalize names
  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("-");
  };

  // Format phone number for Sierra Leone
  const formatPhoneNumber = (phone) => {
    let cleanedPhone = phone.replace(/\D/g, "");

    if (cleanedPhone.length === 9 && cleanedPhone.startsWith("0")) {
      cleanedPhone = cleanedPhone.slice(1);
    }

    if (/^\d{8}$/.test(cleanedPhone)) {
      return `+232-${cleanedPhone.slice(0, 2)}-${cleanedPhone.slice(2)}`;
    }

    if (/^232\d{8}$/.test(cleanedPhone)) {
      return `+232-${cleanedPhone.slice(3, 5)}-${cleanedPhone.slice(5)}`;
    }

    return null;
  };

  // ✅ Handle Input Change (Prevent Date Format Issues)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "date_of_birth" || name === "employment_date" ? value : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation checks
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirm_password ||
      !formData.date_of_birth
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    if (!isValidDate(formData.date_of_birth)) {
      setError("Please enter a valid date of birth.");
      return;
    }

    if (!isValidEmailFormat(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isRecognizedEmailDomain(formData.email)) {
      setError(
        "Please use an email from recognized domains like Gmail, Yahoo, or .org domains."
      );
      return;
    }

    const formattedPhone = formatPhoneNumber(formData.phone);
    if (!formattedPhone) {
      setError("Please enter a valid Sierra Leone phone number.");
      return;
    }

    // ✅ Convert to YYYY-MM-DD before sending
    const formattedDOB = convertToDBFormat(formData.date_of_birth);
    const formattedEmploymentDate = convertToDBFormat(formData.employment_date);

    if (!formattedDOB || !formattedEmploymentDate) {
      setError("Invalid date format. Use DD-MM-YYYY.");
      return;
    }

    // Create final data object
    const finalFormData = {
      ...formData,
      phone: formattedPhone,
      first_name: capitalizeName(formData.first_name),
      last_name: capitalizeName(formData.last_name),
      middle_name: capitalizeName(formData.middle_name),
      email: formData.email.toLowerCase(),
      department: formData.department, // Use formData directly
      employment_date: formattedEmploymentDate, // Use formData directly
    };

    const newUser = {
      ...finalFormData,
      role_id: parseInt(formData.role_id, 10),
    };

    console.log("New User:", newUser);

    // Submit to backend
    setLoading(true);
    try {
      const response = await createStaff(newUser);
      setSuccess("Staff created successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        gender: "Male",
        date_of_birth: "",
        email: "",
        phone: "",
        role_id: "",
        department: "",
        employment_date: "",
        password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error creating staff:", error);
      setError(error.response?.data?.msg || "Failed to create staff.");
    } finally {
      setLoading(false);
    }

    closeActionModal();
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={styles.staffContainer}>
          <div className={styles.staffPageHeader}>
            <h4>Staff List</h4>
            <div>
              {["Add Staff"].map((action, index) => (
                <button key={index} onClick={() => handleActionClick(action)}>
                  {action}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.staffListContainer}>
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
            <div>
              <StaffTable
                staffData={staff}
                activeAction={activeAction}
                handleSelectedStaff={handleSelectedStaff}
              />
            </div>
          </div>

          {/*  */}
          <SmallModal isOpen={!!activeAction} onClose={closeActionModal}>
            <div>
              <div>
                {activeAction === "Add Staff" && (
                  <AddStaff
                    closeActionModal={closeActionModal}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    lodaing={loading}
                    formData={formData}
                    setFormData={setFormData}
                    setError={setError}
                  />
                )}
              </div>
            </div>
          </SmallModal>
        </div>
      )}
    </>
  );
}

export default Staff;

//
function AddStaff({
  closeActionModal,
  handleSubmit,
  handleChange,
  loading,
  formData,
  setFormData,
}) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  //
  if (loading) {
    <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />;
  }

  return (
    <div className={styles.updateStaff}>
      <span className={styles.closeBtn} onClick={closeActionModal}>
        x
      </span>
      <form onSubmit={handleSubmit}>
        <h3>Add New Staff</h3>

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
        <div className={styles.inputControl}>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputControl}>
          <label>Middle Name:</label>
          <input
            type="text"
            name="middle_name"
            value={formData.middle_name || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputControl}>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputControl}>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputControl}>
          <label>Date of Birth:</label>
          <input
            type="text"
            name="date_of_birth"
            placeholder="DD-MM-YYYY"
            value={formData.date_of_birth}
            onChange={handleChange}
            onBlur={(e) => handleDateInput(e, setError, setFormData)}
          />
        </div>

        {/* Gender */}
        <div className={styles.inputControl}>
          <label htmlFor="gender">Gender:</label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className={styles.inputControl}>
          <label htmlFor="role_id">Role:</label>
          <select
            name="role_id"
            value={formData.role_id || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="2">Basic</option>
            <option value="4">Cashier</option>
            <option value="5">Loan Officer</option>
            <option value="6">Finance Admin</option>
            <option value="7">Auditor</option>
            <option value="8">Manager</option>
            <option value="9">System Admin</option>
          </select>
        </div>

        <div className={styles.inputControl}>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={formData?.department || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputControl}>
          <label>Emaployment Date:</label>
          <input
            type="text"
            name="employment_date"
            placeholder="DD-MM-YYYY"
            value={formData?.employment_date}
            onChange={handleChange}
            onBlur={(e) => handleDateInput(e, setError, setFormData)}
          />
        </div>

        <div className={styles.inputControl}>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputControl}>
          <label>Other Phone:</label>
          <input
            type="tel"
            name="second_phone"
            value={formData.other_phone || ""}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className={styles.inputControl}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className={styles.inputControl}>
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Other fields */}
        <div className={styles.actionButtons}>
          <button type="button" onClick={closeActionModal} disabled={loading}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Email Validation
const recognizedEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "ymail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "zoho.com",
  "mail.com",
  "gmx.com",
  "gmx.net",
];

const isValidEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isRecognizedEmailDomain = (email) => {
  const domain = email.split("@")[1];
  return recognizedEmailDomains.includes(domain) || domain.endsWith(".org");
};

// function AddStaff({ closeActionModal }) {
//   const { createStaff } = useStaff();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [formData, setFormData] = useState({
//     first_name: "Amara",
//     last_name: "Tamia",
//     middle_name: "T",
//     gender: "Male",
//     date_of_birth: "12/12/2000",
//     email: "kennie4tamia@gmail.com",
//     phone: "076234567",
//     role_id: "7",
//     department: "Management",
//     employment_date: "12/13/2024",
//     password: "password",
//     confirm_password: "password",
//   });

//   // Automatically dismiss alerts after 30 seconds
//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         setSuccess(null);

//         setError(null);
//       }, 3000); // 30 seconds
//       return () => clearTimeout(timer); // Cleanup timeout on component unmount or alert change
//     }
//   }, [success, error]);

//   // Helper function to validate date
//   const isValidDate = (date) => !isNaN(Date.parse(date));

//   // Function to capitalize names
//   const capitalizeName = (name) => {
//     return name
//       .toLowerCase()
//       .split("-")
//       .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
//       .join("-");
//   };

//   // Format phone number for Sierra Leone
//   const formatPhoneNumber = (phone) => {
//     let cleanedPhone = phone.replace(/\D/g, "");

//     if (cleanedPhone.length === 9 && cleanedPhone.startsWith("0")) {
//       cleanedPhone = cleanedPhone.slice(1);
//     }

//     if (/^\d{8}$/.test(cleanedPhone)) {
//       return `+232-${cleanedPhone.slice(0, 2)}-${cleanedPhone.slice(2)}`;
//     }

//     if (/^232\d{8}$/.test(cleanedPhone)) {
//       return `+232-${cleanedPhone.slice(3, 5)}-${cleanedPhone.slice(5)}`;
//     }

//     return null;
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Validation checks
//     if (
//       !formData.first_name ||
//       !formData.last_name ||
//       !formData.email ||
//       !formData.phone ||
//       !formData.password ||
//       !formData.confirm_password ||
//       !formData.date_of_birth
//     ) {
//       setError("All fields are required.");
//       return;
//     }

//     if (formData.password !== formData.confirm_password) {
//       setError("Passwords do not match.");
//       return;
//     }

//     if (!isValidDate(formData.date_of_birth)) {
//       setError("Please enter a valid date of birth.");
//       return;
//     }

//     if (!isValidEmailFormat(formData.email)) {
//       setError("Please enter a valid email address.");
//       return;
//     }

//     if (!isRecognizedEmailDomain(formData.email)) {
//       setError(
//         "Please use an email from recognized domains like Gmail, Yahoo, or .org domains."
//       );
//       return;
//     }

//     const formattedPhone = formatPhoneNumber(formData.phone);
//     if (!formattedPhone) {
//       setError("Please enter a valid Sierra Leone phone number.");
//       return;
//     }

//     // Create final data object
//     const finalFormData = {
//       ...formData,
//       phone: formattedPhone,
//       first_name: capitalizeName(formData.first_name),
//       last_name: capitalizeName(formData.last_name),
//       middle_name: capitalizeName(formData.middle_name),
//       email: formData.email.toLowerCase(),
//       department: formData.department, // Use formData directly
//       employment_date: formData.employment_date, // Use formData directly
//     };

//     const newUser = {
//       ...finalFormData,
//       role_id: parseInt(formData.role_id, 10),
//     };

//     console.log("New User:", newUser);

//     // Submit to backend
//     setLoading(true);
//     try {
//       const response = await createStaff(newUser);
//       setSuccess("Staff created successfully!");
//       setFormData({
//         first_name: "",
//         last_name: "",
//         middle_name: "",
//         gender: "Male",
//         date_of_birth: "",
//         email: "",
//         phone: "",
//         role_id: "",
//         department: "",
//         employment_date: "",
//         password: "",
//         confirm_password: "",
//       });
//     } catch (error) {
//       console.error("Error creating staff:", error);
//       setError(error.response?.data?.msg || "Failed to create staff.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
//       ) : (
//         <div>
//           <form className={styles.form} onSubmit={handleSubmit}>
//             <div className={styles.closeBtn}>
//               <i onClick={closeActionModal} className="fa-solid fa-xmark"></i>
//             </div>
//             {success && (
//               <Alert variant="success" className="warning">
//                 {success}
//               </Alert>
//             )}

//             {error && (
//               <Alert variant="warning" className="warning">
//                 {error}
//               </Alert>
//             )}
//             <h4 className={styles.title}>Add a Staff</h4>

//             <div className={styles.formGroup}>
//               {/* First Name */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="first_name">First Name:</label>
//                 <input
//                   type="text"
//                   name="first_name"
//                   value={formData.first_name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Middle Name */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="middle_name">Middle Name:</label>
//                 <input
//                   type="text"
//                   name="middle_name"
//                   value={formData.middle_name}
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Last Name */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="last_name">Last Name:</label>
//                 <input
//                   type="text"
//                   name="last_name"
//                   value={formData.last_name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Gender */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="gender">Gender:</label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                 </select>
//               </div>

//               {/* Date of Birth */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="date_of_birth">Date of Birth:</label>
//                 <input
//                   type="date"
//                   name="date_of_birth"
//                   value={formData.date_of_birth}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="email">Email:</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Phone Number */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="phone">Phone Number:</label>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Role */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="role_id">Role:</label>
//                 <select
//                   name="role_id"
//                   value={formData.role_id}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select Role</option>
//                   <option value="2">Basic</option>
//                   <option value="4">Cashier</option>
//                   <option value="5">Loan Officer</option>
//                   <option value="6">Finance Admin</option>
//                   <option value="7">Auditor</option>
//                   <option value="8">Manager</option>
//                   <option value="9">System Admin</option>
//                 </select>
//               </div>

//               {/* Department */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="department">Department:</label>
//                 <input
//                   type="text"
//                   name="department"
//                   value={formData.department}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Employment Date */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="employment_date">Employment Date:</label>
//                 <input
//                   type="date"
//                   name="employment_date"
//                   value={formData.employment_date}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Password */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="password">Password:</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Confirm Password */}
//               <div className={styles.inputControl}>
//                 <label htmlFor="confirm_password">Confirm Password:</label>
//                 <input
//                   type="password"
//                   name="confirm_password"
//                   value={formData.confirm_password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className={styles.buttonContainer}>
//               <button
//                 type="submit"
//                 className={styles.submitButton}
//                 disabled={loading}
//               >
//                 {loading ? "Processing..." : "Submit"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </>
//   );
// }

// // Email Validation
// const recognizedEmailDomains = [
//   "gmail.com",
//   "yahoo.com",
//   "ymail.com",
//   "outlook.com",
//   "hotmail.com",
//   "live.com",
//   "icloud.com",
//   "me.com",
//   "mac.com",
//   "aol.com",
//   "protonmail.com",
//   "zoho.com",
//   "mail.com",
//   "gmx.com",
//   "gmx.net",
// ];

// const isValidEmailFormat = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// const isRecognizedEmailDomain = (email) => {
//   const domain = email.split("@")[1];
//   return recognizedEmailDomains.includes(domain) || domain.endsWith(".org");
// };
