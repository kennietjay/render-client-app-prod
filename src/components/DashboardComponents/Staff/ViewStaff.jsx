import React, { useEffect, useState } from "react";
import { useStaff } from "../../../context/StaffContext";
import styles from "./ViewStaff.module.css";
import Modal from "../../Modal";
import SmallModal from "../../SmallModal";
// import UpdateStaffDetails from "./UpdateStaffDetails";
import { capitalizeWords } from "../../../../utils/capitalizeWords";
import { formatDateRegular } from "../../../../utils/formatDateRegular";
import LoadingSpinner from "../../LoadingSpinner";
import { Alert } from "react-bootstrap";

const formatDateToInput = (date) => {
  if (!date) return ""; // Handle null/undefined cases
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return ""; // Handle invalid dates
  return parsedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

const ViewStaff = ({
  staff,
  viewStaff,
  closeStaff,
  allPermissions,
  allRoles,
}) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [currentPermissions, setCurrentPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const {
    updateStaff,
    updateRole,
    getStaffPermissions,
    managePermissions,
    activateStaff,
    deactivateStaff,
  } = useStaff();

  const [editData, setEditData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    other_phone: "",
    staff: {
      staff_id: "",
      status: "",
      position: "",
      department: "",
      employment_date: "",
    },
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
  //

  // Populate editData when staff is loaded
  useEffect(() => {
    if (staff) {
      setEditData({
        user: {
          first_name: staff.user.first_name || "",
          middle_name: staff.user.middle_name || "",
          last_name: staff.user.last_name || "",
          email: staff.user.email || "",
          date_of_birth: staff.user.date_of_birth || "",
          gender: staff.user.gender || "",
          phone: staff.user.phone || "",
          other_phone: staff.user.other_phone || "",
        },
        staff: {
          staff_id: staff.id || "",
          status: staff.status || "active",
          position: staff.position || "",
          department: staff.department || "",
          employment_date: staff.employment_date || "",
        },
      });
    }
  }, [staff]);

  useEffect(() => {
    setLoading(true);
    async function fetchPermissions() {
      if (staff) {
        const respone = await getStaffPermissions(staff.id);
        setCurrentPermissions(respone); // State for current permissions
      }
      setLoading(false);
    }
    fetchPermissions();
  }, [getStaffPermissions, staff]);

  const handleActionClick = (action) => setActiveAction(action);
  const closeActionModal = () => setActiveAction(null);

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleInputChange = (objectKey, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [objectKey]: {
        ...prev[objectKey],
        [field]: value,
      },
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Validate and format the date_of_birth
    const formattedDateOfBirth = editData.user.date_of_birth
      ? new Date(editData.user.date_of_birth).toISOString().split("T")[0]
      : null;

    const updatedStaff = {
      ...editData.staff,
    };

    const updatedUser = {
      ...editData.user,
      date_of_birth: formattedDateOfBirth,
    };

    const comnbinedData = {
      ...updatedStaff,
      ...updatedUser,
    };

    console.log("Updated Staff Data:", comnbinedData);

    try {
      const response = await updateStaff(staff.id, comnbinedData);
      console.log(response);
      setSuccess(response);
      closeActionModal();
    } catch (error) {
      console.error("Update Staff Error:", error);
      setError(error);
    }
  };

  const handleRoleChange = async (e) => {
    e.preventDefault();

    console.log(selectedRole);

    try {
      const response = await updateRole(staff?.id, selectedRole);
      setSuccess(response);
      closeActionModal();
    } catch (error) {
      setError(error);
      console.error("Change Role Error:", error);
    }
  };

  const handlePermissionSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await managePermissions(staff?.id, selectedPermissions);
      console.log(response);
      setSuccess(response);
      closeActionModal();
    } catch (error) {
      setError(error);
      console.error("Assign Permissions Error:", error);
    }
  };

  const handleActivate = async () => {
    try {
      const response = await activateStaff(staff.id);
      console.log(response);
      if (response) {
        setSuccess(response);
        closeStaff();
      } else {
        console.log("Error deactivating user/staff");
      }
    } catch (error) {
      setError(error);
      console.error("Activate Staff Error:", error);
    }
  };

  const handleDeactivate = async () => {
    try {
      const response = await deactivateStaff(staff.id);
      closeStaff();
      setSuccess(response);
    } catch (error) {
      setError(error);
      console.error("Deactivate Staff Error:", error);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <Modal isOpen={!!viewStaff}>
          <div className={styles.staff}>
            <span className={styles.closeBtn} onClick={closeStaff}>
              x
            </span>

            {success && (
              <Alert variant="success" className="warning">
                {success.msg}
              </Alert>
            )}
            {error && (
              <Alert variant="warning" className="warning">
                {error.msg}
              </Alert>
            )}

            <h3>Staff Details</h3>
            {staff && (
              <div>
                <h4>Details</h4>
                <ul className={styles.staffDetailsList}>
                  {[
                    { label: "Employee Number", value: staff?.id },
                    {
                      label: "Name",
                      value: `${capitalizeWords(staff?.user?.first_name)} ${
                        capitalizeWords(staff.user?.middle_name) || ""
                      } ${capitalizeWords(staff.user?.last_name)}`,
                    },
                    {
                      label: "Date of Birth",
                      value: formatDateRegular(staff.user?.date_of_birth),
                    },
                    {
                      label: "Roles",
                      value: capitalizeWords(
                        staff?.user?.roles?.map((role) => role.name).join(", ")
                      ),
                    },
                    {
                      label: "Department",
                      value: capitalizeWords(staff?.department),
                    },
                    {
                      label: "Employment Date",
                      value: formatDateRegular(staff?.employment_date),
                    },
                    { label: "Status", value: capitalizeWords(staff?.status) },

                    {
                      label: "Email",
                      value: capitalizeWords(staff?.user?.email),
                    },
                    { label: "Phone", value: staff?.user?.phone },
                  ].map((detail, index) => (
                    <li key={index} className={styles.staffDetails}>
                      <span>{detail.label}:</span> {detail.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h4>Actions</h4>
              {[
                "Update Staff",
                "Change Role",
                "Permissions",
                "Activate Staff",
                "Deactivate Staff",
              ].map((action, index) => (
                <button key={index} onClick={() => handleActionClick(action)}>
                  {action}
                </button>
              ))}
            </div>

            <SmallModal isOpen={!!activeAction} onClose={closeActionModal}>
              <div className={styles.staffActionBtns}>
                <div>
                  {activeAction === "Update Staff" && (
                    <UpdateStaffDetails
                      editData={editData}
                      handleUpdateSubmit={handleUpdateSubmit}
                      handleInputChange={handleInputChange}
                      closeActionModal={closeActionModal}
                      loading={loading}
                    />
                  )}
                  {activeAction === "Change Role" && (
                    <ManageRoles
                      allRoles={allRoles} // List of all roles
                      currentRole={staff?.user?.roles[0]}
                      selectedRole={selectedRole}
                      setSelectedRole={setSelectedRole}
                      handleRoleChange={handleRoleChange}
                      closeActionModal={closeActionModal}
                      loading={loading}
                    />
                  )}
                  {activeAction === "Permissions" && (
                    <ManagePermissions
                      allPermissions={allPermissions}
                      selectedPermissions={selectedPermissions}
                      setSelectedPermissions={setSelectedPermissions}
                      handlePermissionToggle={handlePermissionToggle}
                      handlePermissionSubmit={handlePermissionSubmit}
                      currentPermissions={currentPermissions}
                      closeActionModal={closeActionModal}
                      loading={loading}
                    />
                  )}
                  {activeAction === "Add-Staff"}
                </div>
                <div>
                  {activeAction === "Activate Staff" && (
                    <ActivateStaff
                      editData={editData}
                      handleActivate={handleActivate}
                      closeActionModal={closeActionModal}
                      loading={loading}
                    />
                  )}
                  {activeAction === "Deactivate Staff" && (
                    <DeactivateStaff
                      editData={editData}
                      handleDeactivate={handleDeactivate}
                      closeActionModal={closeActionModal}
                      loading={loading}
                    />
                  )}
                </div>
              </div>
            </SmallModal>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ViewStaff;

// //
function ManageRoles({
  allRoles,
  loading,
  currentRole, // The current role of the user
  selectedRole,
  setSelectedRole,
  handleRoleChange,
  closeActionModal,
}) {
  // Ensure the current role is set when the component mounts
  useEffect(() => {
    if (currentRole && !selectedRole) {
      setSelectedRole(currentRole.id); // Initialize with the current role ID
    }
  }, [currentRole, selectedRole, setSelectedRole]);

  // Filter out roles that cannot be managed (e.g., 'user' and 'customer')
  const manageableRoles = allRoles.filter((role) => role.type === "staff");

  return (
    <div className={styles.rolesContainer}>
      <span className={styles.closeBtn} onClick={closeActionModal}>
        x
      </span>
      <h4>Change Staff Role</h4>

      {/* Display the current role */}
      <div className={styles.currentRole}>
        <strong>Current Roles:</strong> {currentRole?.name || "None"}
      </div>

      <form onSubmit={handleRoleChange}>
        {manageableRoles.map((role) => (
          <div key={role.id}>
            <div>
              <input
                type="radio"
                name="role"
                value={role.id}
                checked={Number(selectedRole) === role.id}
                onChange={(e) => setSelectedRole(Number(e.target.value))}
              />
              {capitalizeWords(role.name)}
            </div>
          </div>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Save"}
        </button>
      </form>
    </div>
  );
}

// function ManageRoles({
//   allRoles,
//   loading,
//   currentRole, // The current role of the user
//   selectedRole,
//   setSelectedRole,
//   handleRoleChange,
//   closeActionModal,
// }) {
//   // Ensure the current role is set when the component mounts
//   useEffect(() => {
//     if (currentRole) {
//       setSelectedRole(currentRole.id); // Initialize with the current role ID
//     }
//   }, [currentRole, setSelectedRole]);

//   return (
//     <div className={styles.rolesContainer}>
//       <span className={styles.closeBtn} onClick={closeActionModal}>
//         x
//       </span>
//       <h4>Change Staff Role</h4>
//       {/* Display the current role */}
//       <div className={styles.currentRole}>
//         <strong>Current Roles:</strong>
//       </div>
//       <form onSubmit={handleRoleChange}>
//         {allRoles?.map((role) => (
//           <div key={role.id}>
//             <div>
//               <input
//                 type="radio"
//                 name="role"
//                 value={role.id}
//                 checked={Number(selectedRole) === role.id}
//                 onChange={(e) => setSelectedRole(Number(e.target.value))}
//               />
//               {capitalizeWords(role.name)}
//             </div>
//           </div>
//         ))}
//         <button type="submit" disabled={loading}>
//           {loading ? "Processing..." : "Save"}
//         </button>
//       </form>
//     </div>
//   );
// }

//
function ManagePermissions({
  allPermissions,
  loading,
  selectedPermissions,
  handlePermissionToggle,
  handlePermissionSubmit,
  currentPermissions,
  setSelectedPermissions,
  closeActionModal,
}) {
  //

  useEffect(() => {
    // Initialize selectedPermissions with current permissions
    if (currentPermissions?.length > 0) {
      setSelectedPermissions(currentPermissions.map((perm) => perm.id));
    }
  }, [currentPermissions, setSelectedPermissions]);

  return (
    <div className={styles.permissionsContainer}>
      <span className={styles.closeBtn} onClick={closeActionModal}>
        x
      </span>
      <h4>Manage Permissions</h4>

      {/* Display current permissions */}
      <div className={styles.currentPermissions}>
        <strong>Current Permissions:</strong>{" "}
        {currentPermissions?.length > 0
          ? currentPermissions.map((perm) => perm.name).join(", ")
          : "No permissions assigned"}
      </div>

      {/* Permission selection form */}
      <form onSubmit={handlePermissionSubmit}>
        {allPermissions?.map((perm) => (
          <label key={perm.id} className={styles.permissionsInputBox}>
            <input
              type="checkbox"
              value={perm.id}
              checked={selectedPermissions?.includes(perm.id)} // Pre-check current permissions
              onChange={() => handlePermissionToggle(perm.id)}
            />
            {capitalizeWords(perm.name)}
          </label>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Save"}
        </button>
      </form>
    </div>
  );
}

//
function ActivateStaff({
  editData,
  closeActionModal,
  handleActivate,
  loading,
}) {
  return (
    <div className={styles.activateStaff}>
      <span className={styles.closeBtn} onClick={closeActionModal}>
        x
      </span>
      <div>
        <h3>Active staff</h3>
        <p>Activate staff: {editData.staff?.staff_id}</p>
        <p>
          Name: {`${editData.user?.first_name} ${editData.user?.last_name}`}
        </p>
      </div>
      <div>
        <button onClick={handleActivate} disabled={loading}>
          {loading ? "Processing..." : "Activate"}
        </button>
      </div>
    </div>
  );
}

function DeactivateStaff({
  editData,
  closeActionModal,
  handleDeactivate,
  loading,
}) {
  return (
    <div className={styles.deactivateStaff}>
      <span className={styles.closeBtn} onClick={closeActionModal}>
        x
      </span>
      <div>
        <h3>Deactive staff</h3>
        <p>Deactivate Staff: {editData.staff?.staff_id}</p>
        <p>
          Name:{" "}
          {`${capitalizeWords(editData.user?.first_name)} ${capitalizeWords(
            editData.user?.last_name
          )}`}
        </p>
      </div>
      <button onClick={handleDeactivate} disabled={loading}>
        {loading ? "Processing..." : "Deactivate"}
      </button>
    </div>
  );
}

//
function UpdateStaffDetails({
  loading,
  handleUpdateSubmit,
  editData,
  handleInputChange,
  closeActionModal,
}) {
  if (!editData) {
    <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />;
  }

  return (
    <div className={styles.updateStaff}>
      <span className={styles.closeBtn} onClick={closeActionModal}>
        x
      </span>
      <h4>
        <strong>Editing Staff: {editData.staff.staff_id}</strong>
      </h4>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page reload
          handleUpdateSubmit(e); // Call the handler
        }}
      >
        <div className={styles.inputControl}>
          <label>First Name:</label>
          <input
            type="text"
            value={editData.user?.first_name || ""}
            onChange={(e) =>
              handleInputChange("user", "first_name", e.target.value)
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Middle Name:</label>
          <input
            type="text"
            value={editData.user?.middle_name || ""}
            onChange={(e) =>
              handleInputChange("user", "middle_name", e.target.value)
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Last Name:</label>
          <input
            type="text"
            value={editData.user?.last_name || ""}
            onChange={(e) =>
              handleInputChange("user", "last_name", e.target.value)
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Email:</label>
          <input
            type="text"
            value={editData.user?.email || ""}
            onChange={(e) => handleInputChange("user", "email", e.target.value)}
          />
        </div>
        <div className={styles.inputControl}>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={formatDateToInput(editData?.user?.date_of_birth) || ""}
            onChange={(e) =>
              handleInputChange("user", "date_of_birth", e.target.value)
            }
          />
        </div>

        <div className={styles.inputControl}>
          <label>Gender:</label>
          <select
            type="text"
            value={editData?.user?.gender || ""}
            onChange={(e) =>
              handleInputChange("user", "gender", e.target.value)
            }
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className={styles.inputControl}>
          <label>Status:</label>
          <select
            type="text"
            value={editData?.staff?.status || ""}
            onChange={(e) =>
              handleInputChange("staff", "status", e.target.value)
            }
          >
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        <div className={styles.inputControl}>
          <label>Department:</label>
          <input
            type="text"
            value={editData?.staff?.department || ""}
            onChange={(e) =>
              handleInputChange("staff", "department", e.target.value)
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Emaployment Date:</label>
          <input
            type="date"
            value={formatDateToInput(editData?.staff?.employment_date) || ""}
            onChange={(e) =>
              handleInputChange("staff", "employment_date", e.target.value)
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Phone:</label>
          <input
            type="tel"
            value={editData.user?.phone || ""}
            onChange={(e) => handleInputChange("user", "phone", e.target.value)}
          />
        </div>
        <div className={styles.inputControl}>
          <label>Other Phone:</label>
          <input
            type="tel"
            value={editData.user?.other_phone || ""}
            onChange={(e) =>
              handleInputChange("user", "other_phone", e.target.value)
            }
          />
        </div>

        {/* Other fields */}
        <div className={styles.actionButtons}>
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Save Changes"}
          </button>
          <button type="button" onClick={closeActionModal} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
