import React, { useState } from "react";
import StaffBio from "./StaffBio";
import { useStaff } from "../../../context/StaffContext";
import LoadingSpinner from "../../LoadingSpinner";

function StaffProfile({ staffProfile }) {
  const [loading, setLoading] = useState();

  return (
    <>
      {loading ? (
        <LoadingSpinner size={60} color="#FF5722" message="Loading data..." />
      ) : (
        <div className={StyleSheet.staffProfilePage}>
          <StaffBio profile={staffProfile} />
        </div>
      )}
    </>
  );
}

export default StaffProfile;
