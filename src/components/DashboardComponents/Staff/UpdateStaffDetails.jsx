import React from "react";
import styles from "./Staff.module.css";
import { formatDateToInput } from "../../../../utils/formatDateToInput";

function UpdateStaffDetails({
  handleUpdateSubmit,
  editData,
  setEditData,
  closeActionModal,
  loading,
}) {
  return (
    <div className={styles.updateStaff}>
      <h4>Update Staff Details</h4>
      <form onSubmit={handleUpdateSubmit}>
        <div className={styles.inputControl}>
          <label>Employee Number:</label>
          <input
            type="text"
            value={editData?.id || ""}
            onChange={(e) => setEditData({ ...editData, id: e.target.value })}
            readOnly
          />
        </div>
        <div className={styles.inputControl}>
          <label>First Name:</label>
          <input
            type="text"
            value={editData.user.first_name || ""}
            onChange={(e) =>
              setEditData({ ...editData, first_name: e.target.value })
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Middle Name:</label>
          <input
            type="text"
            value={editData.user.middle_name || ""}
            onChange={(e) =>
              setEditData({ ...editData, middle_name: e.target.value })
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Last Name:</label>
          <input
            type="text"
            value={editData?.user?.last_name || ""}
            onChange={(e) =>
              setEditData({ ...editData, last_name: e.target.value })
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Email:</label>
          <input
            type="text"
            value={editData?.user?.email || ""}
            onChange={(e) =>
              setEditData({
                ...editData,
                email: e.target.value,
              })
            }
            readOnly
          />
        </div>
        <div className={styles.inputControl}>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={formatDateToInput(editData?.user?.date_of_birth) || ""}
            onChange={(e) =>
              setEditData({
                ...editData,
                date_of_birth: e.target.value,
              })
            }
            readOnly
          />
        </div>

        <div className={styles.inputControl}>
          <label>Gender:</label>
          <select
            type="text"
            value={editData?.user?.gender || ""}
            onChange={(e) =>
              setEditData({ ...editData, gender: e.target.value })
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
            value={editData?.status || ""}
            onChange={(e) =>
              setEditData({ ...editData, status: e.target.value })
            }
          >
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        <div className={styles.inputControl}>
          <label>Position:</label>
          <select
            type="text"
            value={editData?.staff?.position || ""}
            onChange={(e) =>
              setEditData({ ...editData, position: e.target.value })
            }
          >
            <option value="">Select</option>
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
            value={editData?.staff?.department || ""}
            onChange={(e) =>
              setEditData({ ...editData, department: e.target.value })
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Emaployment Date:</label>
          <input
            type="text"
            value={formatDateToInput(editData?.staff?.employment_date) || ""}
            name="employment_date"
            onChange={(e) =>
              setEditData({
                ...editData,
                employment_date: e.target.value,
              })
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Phone:</label>
          <input
            type="tel"
            value={editData.phone || ""}
            onChange={(e) =>
              setEditData({ ...editData, phone: e.target.value })
            }
          />
        </div>
        <div className={styles.inputControl}>
          <label>Second Phone:</label>
          <input
            type="tel"
            value={editData.second_phone || ""}
            onChange={(e) =>
              setEditData({ ...editData, second_phone: e.target.value })
            }
          />
        </div>
        <div className={styles.actionButtons}>
          <button type="submit">{loading ? "Processing..." : "Save"}</button>
          <button type="button" onClick={closeActionModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateStaffDetails;
