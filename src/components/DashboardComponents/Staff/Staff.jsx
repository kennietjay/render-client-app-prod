import React, { useCallback, useEffect, useState } from "react";
import styles from "./Staff.module.css";
import SmallModal from "../../SmallModal";
import LoadingSpinner from "../../LoadingSpinner";
import StaffTable from "./StaffTable";
import { Alert } from "react-bootstrap";
import { useStaff } from "../../../context/StaffContext";

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
    first_name: "",
    last_name: "",
    middle_name: "",
    gender: "",
    date_of_birth: "",
    email: "",
    phone: "",
    second_phone: "",
    role_id: "",
    department: "",
    employment_date: "",
    password: "",
    confirm_password: "",
  });

  // Automatically dismiss alerts after 8 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleActionClick = (action) => {
    setActiveAction(action);
  };

  const closeActionModal = () => setActiveAction(null);

  // Improved date validation
  const isValidDate = (dateString) => {
    if (!dateString) return false;

    // Handle DD-MM-YYYY format
    if (dateString.includes("-")) {
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
        const year = parseInt(parts[2], 10);

        const date = new Date(year, month, day);
        return (
          date.getDate() === day &&
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      }
    }

    return !isNaN(Date.parse(dateString));
  };

  // Function to capitalize names
  const capitalizeName = (name) => {
    if (!name) return "";
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

  // Convert DD-MM-YYYY to YYYY-MM-DD for backend
  const convertToDBFormat = (dateString) => {
    if (!dateString) return "";

    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Convert from DD-MM-YYYY to YYYY-MM-DD
    if (dateString.includes("-")) {
      const parts = dateString.split("-");
      if (
        parts.length === 3 &&
        parts[0].length === 2 &&
        parts[1].length === 2 &&
        parts[2].length === 4
      ) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    return dateString;
  };

  // Handle date input with proper formatting
  const handleDateInput = (e, setError, setFormData) => {
    const { name, value } = e.target;

    if (!value) return;

    // Validate DD-MM-YYYY format
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(value)) {
      setError("Please enter date in DD-MM-YYYY format");
      return;
    }

    const parts = value.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Basic date validation
    if (
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      setError("Please enter a valid date");
      return;
    }

    setError(null);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation checks
      if (
        !formData.first_name ||
        !formData.last_name ||
        !formData.email ||
        !formData.phone ||
        !formData.password ||
        !formData.confirm_password ||
        !formData.date_of_birth ||
        !formData.employment_date ||
        !formData.role_id ||
        !formData.department
      ) {
        throw new Error("All fields are required.");
      }

      if (formData.password !== formData.confirm_password) {
        throw new Error("Passwords do not match.");
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      if (!isValidDate(formData.date_of_birth)) {
        throw new Error(
          "Please enter a valid date of birth in DD-MM-YYYY format."
        );
      }

      if (!isValidDate(formData.employment_date)) {
        throw new Error(
          "Please enter a valid employment date in DD-MM-YYYY format."
        );
      }

      if (!isValidEmailFormat(formData.email)) {
        throw new Error("Please enter a valid email address.");
      }

      if (!isRecognizedEmailDomain(formData.email)) {
        throw new Error(
          "Please use an email from recognized domains like Gmail, Yahoo, or .org domains."
        );
      }

      const formattedPhone = formatPhoneNumber(formData.phone);
      if (!formattedPhone) {
        throw new Error("Please enter a valid Sierra Leone phone number.");
      }

      // Convert dates to YYYY-MM-DD format for backend
      const formattedDOB = convertToDBFormat(formData.date_of_birth);
      const formattedEmploymentDate = convertToDBFormat(
        formData.employment_date
      );

      console.log(
        "Original DOB:",
        formData.date_of_birth,
        "Converted:",
        formattedDOB
      );
      console.log(
        "Original Employment Date:",
        formData.employment_date,
        "Converted:",
        formattedEmploymentDate
      );

      // Create final data object
      const finalFormData = {
        ...formData,
        phone: formattedPhone,
        first_name: capitalizeName(formData.first_name),
        last_name: capitalizeName(formData.last_name),
        middle_name: capitalizeName(formData.middle_name),
        email: formData.email.toLowerCase(),
        department: formData.department,
        date_of_birth: formattedDOB,
        employment_date: formattedEmploymentDate,
      };

      const newUser = {
        ...finalFormData,
        role_id: parseInt(formData.role_id, 10),
      };

      console.log("Final payload to backend:", newUser);

      // Submit to backend
      const response = await createStaff(newUser);
      setSuccess("Staff created successfully!");

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        gender: "Male",
        date_of_birth: "",
        email: "",
        phone: "",
        second_phone: "",
        role_id: "",
        department: "",
        employment_date: "",
        password: "",
        confirm_password: "",
      });
    } catch (error) {
      console.error("Error creating staff:", error);
      setError(
        error.response?.data?.msg || error.message || "Failed to create staff."
      );
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

          <SmallModal isOpen={!!activeAction} onClose={closeActionModal}>
            <div>
              <div>
                {activeAction === "Add Staff" && (
                  <AddStaff
                    closeActionModal={closeActionModal}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    formData={formData}
                    setFormData={setFormData}
                    setError={setError}
                    error={error}
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

// AddStaff Component
function AddStaff({
  closeActionModal,
  handleSubmit,
  handleChange,
  loading,
  formData,
  setFormData,
  setError,
  error,
}) {
  const [success, setSuccess] = useState(null);
  const [localError, setLocalError] = useState(null);

  // Handle date input with proper formatting
  const handleDateInput = (e) => {
    const { name, value } = e.target;

    if (!value) return;

    // Validate DD-MM-YYYY format
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!dateRegex.test(value)) {
      setLocalError(
        "Please enter date in DD-MM-YYYY format (e.g., 15-09-2025)"
      );
      return;
    }

    const parts = value.split("-");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    // Basic date validation
    if (
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1900 ||
      year > 2100
    ) {
      setLocalError("Please enter a valid date");
      return;
    }

    setLocalError(null);
  };

  if (loading) {
    return (
      <LoadingSpinner size={60} color="#FF5722" message="Creating staff..." />
    );
  }

  return (
    <div className={styles.updateStaff}>
      <span className={styles.closeBtn} onClick={closeActionModal}>
        ×
      </span>
      <form onSubmit={handleSubmit}>
        <h3>Add New Staff</h3>

        {success && (
          <Alert variant="success" className="warning">
            {success}
          </Alert>
        )}
        {(localError || error) && (
          <Alert variant="warning" className="warning">
            {localError || error}
          </Alert>
        )}

        <div className={styles.inputControl}>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ""}
            onChange={handleChange}
            required
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
            required
          />
        </div>

        <div className={styles.inputControl}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputControl}>
          <label>Date of Birth:</label>
          <input
            type="text"
            name="date_of_birth"
            placeholder="DD-MM-YYYY (e.g., 16-11-1999)"
            value={formData.date_of_birth}
            onChange={handleChange}
            onBlur={handleDateInput}
            required
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
            required
          />
        </div>

        <div className={styles.inputControl}>
          <label>Employment Date:</label>
          <input
            type="text"
            name="employment_date"
            placeholder="DD-MM-YYYY (e.g., 15-09-2025)"
            value={formData?.employment_date}
            onChange={handleChange}
            onBlur={handleDateInput}
            required
          />
        </div>

        <div className={styles.inputControl}>
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputControl}>
          <label>Other Phone:</label>
          <input
            type="tel"
            name="second_phone"
            value={formData.second_phone || ""}
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
            minLength="6"
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
            minLength="6"
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
  return recognizedEmailDomains.includes(domain) || domain?.endsWith(".org");
};

export default Staff;

// import React, { useCallback, useEffect, useState } from "react";
// import styles from "./Staff.module.css";
// import SmallModal from "../../SmallModal";

// import LoadingSpinner from "../../LoadingSpinner";
// import StaffTable from "./StaffTable";
// import { Alert } from "react-bootstrap";
// import { useStaff } from "../../../context/StaffContext";
// // import AddStaff from "./AddStaff";
// import { handleDateInput, convertToDBFormat } from "/utils/dateUtils.js";

// function Staff({
//   props,
//   staff,
//   selectedStaff,
//   setSelectedStaff,
//   handleSelectedStaff,
// }) {
//   const { createStaff } = useStaff();
//   const [activeAction, setActiveAction] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     middle_name: "",
//     gender: "",
//     date_of_birth: "",
//     email: "",
//     phone: "",
//     second_phone: "",
//     role_id: "",
//     department: "",
//     employment_date: "",
//     password: "",
//     confirm_password: "",
//   });

//   // Automatically dismiss alerts after 30 seconds
//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         setSuccess(null);

//         setError(null);
//       }, 8000); // 30 seconds
//       return () => clearTimeout(timer); // Cleanup timeout on component unmount or alert change
//     }
//   }, [success, error]);

//   const handleActionClick = (action) => {
//     setActiveAction(action);
//   };

//   const closeActionModal = () => setActiveAction(null);

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

//   // ✅ Handle Input Change (Prevent Date Format Issues)
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]:
//         name === "date_of_birth" || name === "employment_date" ? value : value,
//     }));
//   };

//   console.log("Form Data:", formData);

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

//     // ✅ Convert to YYYY-MM-DD before sending
//     const formattedDOB = convertToDBFormat(formData.date_of_birth);
//     const formattedEmploymentDate = convertToDBFormat(formData.employment_date);

//     if (!formattedDOB || !formattedEmploymentDate) {
//       setError("Invalid date format. Use DD-MM-YYYY.");
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
//       employment_date: formattedEmploymentDate, // Use formData directly
//     };

//     const newUser = {
//       ...finalFormData,
//       role_id: parseInt(formData.role_id, 10),
//     };

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

//     closeActionModal();
//   };

//   return (
//     <>
//       {loading ? (
//         <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
//       ) : (
//         <div className={styles.staffContainer}>
//           <div className={styles.staffPageHeader}>
//             <h4>Staff List</h4>
//             <div>
//               {["Add Staff"].map((action, index) => (
//                 <button key={index} onClick={() => handleActionClick(action)}>
//                   {action}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className={styles.staffListContainer}>
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
//             <div>
//               <StaffTable
//                 staffData={staff}
//                 activeAction={activeAction}
//                 handleSelectedStaff={handleSelectedStaff}
//               />
//             </div>
//           </div>

//           {/*  */}
//           <SmallModal isOpen={!!activeAction} onClose={closeActionModal}>
//             <div>
//               <div>
//                 {activeAction === "Add Staff" && (
//                   <AddStaff
//                     closeActionModal={closeActionModal}
//                     handleChange={handleChange}
//                     handleSubmit={handleSubmit}
//                     lodaing={loading}
//                     formData={formData}
//                     setFormData={setFormData}
//                     setError={setError}
//                   />
//                 )}
//               </div>
//             </div>
//           </SmallModal>
//         </div>
//       )}
//     </>
//   );
// }
// //
// export default Staff;

// //
// function AddStaff({
//   closeActionModal,
//   handleSubmit,
//   handleChange,
//   loading,
//   formData,
//   setFormData,
// }) {
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   //
//   if (loading) {
//     <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />;
//   }

//   return (
//     <div className={styles.updateStaff}>
//       <span className={styles.closeBtn} onClick={closeActionModal}>
//         x
//       </span>
//       <form onSubmit={handleSubmit}>
//         <h3>Add New Staff</h3>

//         {success && (
//           <Alert variant="success" className="warning">
//             {success}
//           </Alert>
//         )}
//         {error && (
//           <Alert variant="warning" className="warning">
//             {error}
//           </Alert>
//         )}
//         <div className={styles.inputControl}>
//           <label>First Name:</label>
//           <input
//             type="text"
//             name="first_name"
//             value={formData.first_name || ""}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.inputControl}>
//           <label>Middle Name:</label>
//           <input
//             type="text"
//             name="middle_name"
//             value={formData.middle_name || ""}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.inputControl}>
//           <label>Last Name:</label>
//           <input
//             type="text"
//             name="last_name"
//             value={formData.last_name || ""}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.inputControl}>
//           <label>Email:</label>
//           <input
//             type="text"
//             name="email"
//             value={formData.email || ""}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.inputControl}>
//           <label>Date of Birth:</label>
//           <input
//             type="text"
//             name="date_of_birth"
//             placeholder="DD-MM-YYYY"
//             value={formData.date_of_birth}
//             onChange={handleChange}
//             onBlur={(e) => handleDateInput(e, setError, setFormData)}
//           />
//         </div>

//         {/* Gender */}
//         <div className={styles.inputControl}>
//           <label htmlFor="gender">Gender:</label>
//           <select
//             name="gender"
//             value={formData.gender || ""}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select</option>
//             <option value="Male">Male</option>
//             <option value="Female">Female</option>
//           </select>
//         </div>

//         <div className={styles.inputControl}>
//           <label htmlFor="role_id">Role:</label>
//           <select
//             name="role_id"
//             value={formData.role_id || ""}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Role</option>
//             <option value="2">Basic</option>
//             <option value="4">Cashier</option>
//             <option value="5">Loan Officer</option>
//             <option value="6">Finance Admin</option>
//             <option value="7">Auditor</option>
//             <option value="8">Manager</option>
//             <option value="9">System Admin</option>
//           </select>
//         </div>

//         <div className={styles.inputControl}>
//           <label>Department:</label>
//           <input
//             type="text"
//             name="department"
//             value={formData?.department || ""}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.inputControl}>
//           <label>Emaployment Date:</label>
//           <input
//             type="text"
//             name="employment_date"
//             placeholder="DD-MM-YYYY"
//             value={formData?.employment_date}
//             onChange={handleChange}
//             onBlur={(e) => handleDateInput(e, setError, setFormData)}
//           />
//         </div>

//         <div className={styles.inputControl}>
//           <label>Phone:</label>
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone || ""}
//             onChange={handleChange}
//           />
//         </div>

//         <div className={styles.inputControl}>
//           <label>Other Phone:</label>
//           <input
//             type="tel"
//             name="second_phone"
//             value={formData.other_phone || ""}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Password */}
//         <div className={styles.inputControl}>
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password || ""}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         {/* Confirm Password */}
//         <div className={styles.inputControl}>
//           <label htmlFor="confirm_password">Confirm Password:</label>
//           <input
//             type="password"
//             name="confirm_password"
//             value={formData.confirm_password || ""}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         {/* Other fields */}
//         <div className={styles.actionButtons}>
//           <button type="button" onClick={closeActionModal} disabled={loading}>
//             Cancel
//           </button>
//           <button type="submit" disabled={loading}>
//             {loading ? "Processing..." : "Save Changes"}
//           </button>
//         </div>
//       </form>
//     </div>
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
