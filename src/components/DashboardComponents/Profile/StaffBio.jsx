import { useEffect, useState } from "react";
import styles from "../../AccountComponents/ProfileStyles/ProfileHome.module.css"; // CSS module
import StaffBioForm from "./StaffBioForm";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { formatDates } from "../../../../utils/formatDateOfBirth";
import { useStaff } from "../../../context/StaffContext";
import {
  handleDateInput,
  convertToDBFormat,
} from "../../../../utils/dateUtils";

function StaffBio({ profile }) {
  const { updateStaff, getStaffProfile } = useStaff();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [warning, setWarning] = useState(null);
  const [bioFormData, setBioFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    second_phone: "",
    date_of_birth: "",
    phone: "",
    email: "",
    gender: "",
  });

  const [mode, setMode] = useState("view");
  const staff = profile ? profile : "";

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

  //
  // ✅ Handle Input Change (Prevent Date Format Issues)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date_of_birth") {
      setBioFormData((prev) => ({
        ...prev,
        date_of_birth: value, // Keep input as DD-MM-YYYY
      }));
    } else {
      setBioFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  //
  useEffect(() => {
    if (staff) {
      setBioFormData({
        first_name: staff.user?.first_name || "",
        last_name: staff.user?.last_name || "",
        middle_name: staff.user?.middle_name || "",
        phone: staff.user?.phone || "",
        second_phone: staff.user?.second_phone || "",
        email: staff.user?.email || "",
        date_of_birth: staff.user?.date_of_birth
          ? formatDates(new Date(staff.user?.date_of_birth), "yyyy-MM-dd")
          : "", // Ensure valid date format
        gender: staff.user?.gender || "",
      });
    }
  }, [staff]);

  //
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDOB = convertToDBFormat(bioFormData.date_of_birth);
    if (!formattedDOB) {
      setError("Invalid date format. Use DD-MM-YYYY.");
      return;
    }

    const updatedBioData = {
      ...bioFormData,
      date_of_birth: formattedDOB,
    };

    setLoading(true);
    try {
      if (staff) {
        // // Update the data and directly set it in bioFormData
        const updatedBio = await updateStaff(staff.id, updatedBioData);

        // // Set bioFormData directly with the updated values
        setBioFormData({
          first_name: updatedBio.first_name,
          last_name: updatedBio.last_name,
          middle_name: updatedBio.middle_name,
          phone: updatedBio.phone,
          other_phone: updatedBio.other_phone,
          email: updatedBio.email,
          date_of_birth: updatedBio.date_of_birth,
          gender: updatedBio.gender,
        });

        const response = await getStaffProfile();

        if (response) {
          setSuccess("Profile updated successfully!");
          setMode("view");
        } else {
          setError("Failed to update staff.");
        }
      } else {
        setError("Profile ID is not available.");
        console.log("Profile ID is not available.");
      }
    } catch (error) {
      setError("Failed to update staff.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      {mode === "view" ? (
        <div className={styles.bioGraphInfo}>
          <h3>Staff Bio Graph</h3>

          {/* Show error alert if there's an error */}
          {error && (
            <Alert variant="warning" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Show error alert if there's an error */}
          {warning && (
            <Alert variant="warning" onClose={() => setWarning(null)}>
              {warning}
            </Alert>
          )}

          {/* Show success alert if there's a success message */}
          {success && (
            <Alert variant="success" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          {staff && (
            <div className={`${styles.bioDetails}`}>
              <div>
                <div className={styles.bioRow}>
                  <p>
                    <span>First Name </span>: {staff.user?.first_name}
                  </p>
                </div>
                <div className={styles.bioRow}>
                  <p>
                    <span>Middle Name </span>: {staff.user?.middle_name}
                  </p>
                </div>
                <div className={styles.bioRow}>
                  <p>
                    <span>Last Name </span>: {staff.user?.last_name}
                  </p>
                </div>
                <div className={styles.bioRow}>
                  <p>
                    <span>Gender </span>: {staff.user?.gender}
                  </p>
                </div>
              </div>

              <div>
                <div className={styles.bioRow}>
                  <p>
                    <span>Birthday</span>:{" "}
                    {formatDates(staff.user?.date_of_birth)}
                  </p>
                </div>
                <div className={styles.bioRow}>
                  <p>
                    <span>Email </span>: {staff.user?.email}
                  </p>
                </div>
                <div className={styles.bioRow}>
                  <p>
                    <span>Mobile </span>: {staff.user?.phone}
                  </p>
                </div>
                <div className={styles.bioRow}>
                  <p>
                    <span>Second Phone </span>: {staff.user?.other_phone || ""}
                  </p>
                </div>
              </div>

              <div>
                <h3>Employment</h3>
                <div className={styles.bioRow}>
                  <p>
                    <span>Employee Number</span>: {staff?.id}
                  </p>
                </div>
                <div className={styles.bioRow}>
                  <p>
                    <span>Job Title </span>: {staff.position}
                  </p>
                </div>
                <div className={styles.bioRow}>
                  <p>
                    <span>Department </span>: {staff.department}
                  </p>
                </div>
                <div className={styles.bioRow}>
                  <p>
                    <span>Employment Date </span>:{" "}
                    {formatDates(staff.employment_date || "")}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className={styles.bioInfoHeading}>
            <button className={styles.edit} onClick={handleModeChange}>
              {mode.staff ? "View" : <span>Edit</span>}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.panel}>
          {staff && (
            <StaffBioForm
              handleChange={handleChange}
              handleModeChange={handleModeChange}
              handleSubmit={handleSubmit}
              bioFormData={bioFormData}
              loading={loading}
              setError={setError}
              setBioFormData={setBioFormData}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default StaffBio;
