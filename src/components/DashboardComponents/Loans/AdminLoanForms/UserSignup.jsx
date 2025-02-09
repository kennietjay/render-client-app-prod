import React, { useState } from "react";
import styles from "../LoanPayment.module.css";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import Modal from "../../../Modal";
import { Alert } from "react-bootstrap";
import { useAuth } from "../../../../context/AuthContext";

import { handleDateInput } from "../../../../../utils/handleDateInput";

function UserSignup({ isSignupOpen, onSubmit, closeSignup }) {
  const { createUser, newUser, loading } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize all form fields with default values (empty strings)
  const [formData, setFormData] = useState({
    first_name: "Jay",
    middle_name: "L",
    last_name: "Tamia",
    email: "jay4tamia@gmail.com",
    gender: "male",
    date_of_birth: "1989-01-31",
    phone: "076304506",
    password: "password",
    confirm_password: "password",
  });

  // ✅ Handle Input Changes (Allows Typing)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value || "", // Ensure value is never undefined or null
    }));
  };

  // Function to capitalize each part of a name (including hyphenated names)
  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("-");
  };

  // Function to format phone number to +232-XX-XXXXXX
  const formatPhoneNumber = (phone) => {
    let cleanedPhone = phone.replace(/\D/g, "");

    if (cleanedPhone.length === 9 && cleanedPhone.startsWith("0")) {
      cleanedPhone = cleanedPhone.slice(1); // Remove leading 0
    }

    if (/^\d{8}$/.test(cleanedPhone)) {
      return `+232-${cleanedPhone.slice(0, 2)}-${cleanedPhone.slice(2)}`;
    }

    if (/^232\d{8}$/.test(cleanedPhone)) {
      return `+232-${cleanedPhone.slice(3, 5)}-${cleanedPhone.slice(5)}`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone ||
      !formData.date_of_birth ||
      !formData.gender ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
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

    // Format the first and last names to capitalize each part (including hyphenated names)
    const formattedFirstName = capitalizeName(formData.first_name);
    const formattedLastName = capitalizeName(formData.last_name);
    const formattedMiddleName = capitalizeName(formData.middle_name || "");
    const formattedGender = capitalizeName(formData.gender || "");

    // Format email and username to lowercase
    const formattedEmail = formData.email.toLowerCase();

    const finalFormData = {
      ...formData,
      phone: formattedPhone,
      first_name: formattedFirstName,
      last_name: formattedLastName,
      middle_name: formattedMiddleName,
      email: formattedEmail,
      gender: formattedGender,
      date_of_birth: formData.date_of_birth,
    };

    // console.log("Formatted Form Data: ", finalFormData);

    const newData = {
      first_name: finalFormData.first_name,
      last_name: finalFormData.last_name,
      middle_name: finalFormData.middle_name,
      email: finalFormData.email,
      gender: finalFormData.gender,
      date_of_birth: finalFormData.date_of_birth,
      phone: finalFormData.phone,
      password: finalFormData.password,
    };

    try {
      // Save the final formatted data
      const response = await createUser(newData);

      // console.log(newUser);
      if (response.success) {
        if (onSubmit) {
          onSubmit(response, newUser);
        }

        console.log(response);

        console.log(newUser);
        // Reset form data with default values
        setFormData({
          first_name: "",
          middle_name: "",
          last_name: "",
          email: "",
          gender: "",
          date_of_birth: "",
          phone: "",
          password: "",
          confirm_password: "",
        });

        setSuccess("User created successfully!");
        setError("");
      } else {
        setError(response.error);
        console.log(response.error);
      }
    } catch (error) {
      setError(error.message || "An error occurred while creating the user.");
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
        <div className={styles.wrapper}>
          <Modal isOpen={isSignupOpen} onClose={closeSignup}>
            <div className={styles.formContainer}>
              <div>
                <form onSubmit={handleSubmit} className={styles.form}>
                  <span className={styles.closeBtn} onClick={closeSignup}>
                    X
                  </span>
                  <div className={styles.formSubHeader}>
                    <i className="fa-solid fa-user-plus"></i>
                    <p>Sign Up Customer</p>
                  </div>

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
                  {success && (
                    <Alert
                      variant="success"
                      className="warning"
                      dismissible
                      onClose={() => setSuccess("")}
                    >
                      {success}
                    </Alert>
                  )}

                  <div className={styles.inputControl}>
                    <label>First Name</label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputControl}>
                    <label>Middle Name/Initial</label>
                    <input
                      type="text"
                      id="middle_name"
                      name="middle_name"
                      value={formData.middle_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.inputControl}>
                    <label>Last Name</label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.inputControl}>
                    <label>Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputControl}>
                    <label>Gender:</label>
                    <select
                      type="text"
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className={styles.inputControl}>
                    <label>Date of Birth (DD-MM-YYYY):</label>
                    <input
                      type="text"
                      name="date_of_birth"
                      placeholder="YYYY-MM-DD"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      onBlur={(e) => handleDateInput(e, setError, setFormData)}
                    />
                  </div>
                  <div className={styles.inputControl}>
                    <label>Phone:</label>
                    <input
                      type="phone"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputControl}>
                    <label>Password:</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputControl}>
                    <label>Confirm Password:</label>
                    <input
                      type="password"
                      id="confirm_password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className={`${styles.formBtns} ${styles.userSignupBtns}`}
                  >
                    <button type="submit">Sign up</button>
                  </div>
                </form>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}

export default UserSignup;

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

// import React, { useState } from "react";
// import styles from "../LoanPayment.module.css";
// import LoadingSpinner from "../../../../components/LoadingSpinner";
// import Modal from "../../../Modal";

// import { Link } from "react-router-dom";
// import { Alert } from "react-bootstrap";
// import { useAuth } from "../../../../context/AuthContext";

// function UserSignup({ isSignupOpen, openModal, onSubmit, closeSignup }) {
//   const { createUser, loading } = useAuth();
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [formData, setFormData] = useState({
//     first_name: "Adam",
//     middle_name: "J",
//     last_name: "Doe",
//     email: "elmf.sl24@gmail.com",
//     gender: "male",
//     date_of_birth: "12-23-2000",
//     phone: "076456789",
//     password: "password123",
//     confirm_password: "password123",
//   });

//   // Format date for input[type="date"]
//   // const formatDateToInput = (date) => {
//   //   if (!date) return "";
//   //   const d = new Date(date);
//   //   return d.toISOString().split("T")[0]; // Ensures YYYY-MM-DD format
//   // };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Function to capitalize each part of a name (including hyphenated names)
//   const capitalizeName = (name) => {
//     return name
//       .toLowerCase()
//       .split("-")
//       .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
//       .join("-");
//   };

//   // Function to format phone number to +232-XX-XXXXXX
//   const formatPhoneNumber = (phone) => {
//     let cleanedPhone = phone.replace(/\D/g, "");

//     if (cleanedPhone.length === 9 && cleanedPhone.startsWith("0")) {
//       cleanedPhone = cleanedPhone.slice(1); // Remove leading 0
//     }

//     if (/^\d{8}$/.test(cleanedPhone)) {
//       return `+232-${cleanedPhone.slice(0, 2)}-${cleanedPhone.slice(2)}`;
//     }

//     if (/^232\d{8}$/.test(cleanedPhone)) {
//       return `+232-${cleanedPhone.slice(3, 5)}-${cleanedPhone.slice(5)}`;
//     }

//     return null;
//   };

//   const handleExistingCustomer = (e) => {
//     closeSignup();
//     openModal();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       !formData.first_name ||
//       !formData.last_name ||
//       !formData.email ||
//       !formData.phone ||
//       !formData.date_of_birth ||
//       !formData.gender ||
//       !formData.password ||
//       !formData.confirm_password
//     ) {
//       setError("All fields are required");
//       return;
//     }

//     if (formData.password !== formData.confirm_password) {
//       setError("Passwords do not match.");
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

//     // Format the first and last names to capitalize each part (including hyphenated names)
//     const formattedFirstName = capitalizeName(formData.first_name);
//     const formattedLastName = capitalizeName(formData.last_name);
//     const formattedMiddleName = capitalizeName(formData.middle_name || "");
//     const formattedGender = capitalizeName(formData.gender || "");

//     // Format email and username to lowercase
//     const formattedEmail = formData.email.toLowerCase();

//     const finalFormData = {
//       ...formData,
//       phone: formattedPhone,
//       first_name: formattedFirstName,
//       last_name: formattedLastName,
//       middle_name: formattedMiddleName,
//       email: formattedEmail,
//       gender: formattedGender,
//       date_of_birth: formData.date_of_birth,
//     };

//     console.log("Formatted Form Data: ", finalFormData);

//     const newUser = {
//       first_name: finalFormData.first_name,
//       last_name: finalFormData.last_name,
//       middle_name: finalFormData.middle_name,
//       email: finalFormData.email,
//       gender: finalFormData.gender,
//       date_of_birth: finalFormData.date_of_birth,
//       phone: finalFormData.phone,
//       password: finalFormData.password,
//     };

//     try {
//       // Save the final formatted data
//       const response = await createUser(newUser);

//       console.log(newUser);

//       if (onSubmit) {
//         onSubmit(response);
//       }

//       setFormData({
//         first_name: "",
//         middle_name: "",
//         last_name: "",
//         email: "",
//         gender: "",
//         date_of_birth: "",
//         phone: "",
//         password: "password123",
//       });
//       //   setSuccess(response.msg);
//       setError("");
//     } catch (error) {
//       setError(error);
//     }
//   };

//   return (
//     <>
//       {loading ? (
//         <LoadingSpinner
//           size={60}
//           className="spinner-color"
//           message="Loading data..."
//         />
//       ) : (
//         <div className={styles.wrapper}>
//           <Modal isOpen={isSignupOpen} onClose={closeSignup}>
//             <div className={styles.formContainer}>
//               <div>
//                 <form onSubmit={handleSubmit} className={styles.form}>
//                   <div className={styles.formSubHeader}>
//                     <i className="fa-solid fa-user-plus"></i>
//                     <p>Sign Up Customer</p>
//                   </div>

//                   {error && (
//                     <Alert
//                       variant="warning"
//                       className="warning"
//                       dismissible
//                       onClose={() => setError("")}
//                     >
//                       {error.msg || error}
//                     </Alert>
//                   )}
//                   {success && (
//                     <Alert
//                       variant="success"
//                       className="warning"
//                       dismissible
//                       onClose={() => setSuccess("")}
//                     >
//                       {success.msg || success}
//                     </Alert>
//                   )}

//                   <div className={styles.inputControl}>
//                     <label>First Name</label>
//                     <input
//                       type="text"
//                       id="first_name"
//                       name="first_name"
//                       value={formData.first_name || ""}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className={styles.inputControl}>
//                     <label>Middle Name/Initial</label>
//                     <input
//                       type="text"
//                       id="middle_name"
//                       name="middle_name"
//                       value={formData.middle_name || ""}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className={styles.inputControl}>
//                     <label>Last Name</label>
//                     <input
//                       type="text"
//                       id="last_name"
//                       name="last_name"
//                       value={formData.last_name || ""}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className={styles.inputControl}>
//                     <label>Email:</label>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email || ""}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className={styles.inputControl}>
//                     <label>Female:</label>
//                     <select
//                       type="text"
//                       id="gender"
//                       name="gender"
//                       value={(formData.gender || "").toLowerCase()}
//                       onChange={handleChange}
//                     >
//                       <option value="">Select</option>
//                       <option value="male">Male</option>
//                       <option value="female">Female</option>
//                     </select>
//                   </div>
//                   <div className={styles.inputControl}>
//                     <label>Date of Birth:</label>
//                     <input
//                       type="text"
//                       id="date_of_birth"
//                       name="date_of_birth"
//                       placeholder="mm/dd/yyyy"
//                       value={formData?.date_of_birth || ""}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className={styles.inputControl}>
//                     <label>Phone:</label>
//                     <input
//                       type="phone"
//                       id="phone"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className={styles.inputControl}>
//                     <label>Password:</label>
//                     <input
//                       type="password"
//                       id="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className={styles.inputControl}>
//                     <label>Confirm Password:</label>
//                     <input
//                       type="password"
//                       id="confirm_password"
//                       name="confirm_password"
//                       value={formData.confirm_password}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div
//                     className={`${styles.formBtns} ${styles.userSignupBtns}`}
//                   >
//                     <button type="submit">Sign up</button>
//                     <button type="button" onClick={handleExistingCustomer}>
//                       Existing User
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </Modal>
//         </div>
//       )}
//     </>
//   );
// }

// export default UserSignup;

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
