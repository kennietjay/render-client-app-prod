import { useStaff } from "../context/StaffContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const StaffPrivateRoute = ({ element: Component, ...rest }) => {
  const { isStaffAuthenticated, loading } = useStaff();

  if (loading) {
    return (
      <LoadingSpinner
        size={60}
        className="spinner-color"
        message="Loading data..."
      />
    );
  }

  if (!isStaffAuthenticated) {
    console.warn("User is not authenticated or does not have staff access.");
    return <Navigate to="/staff/signin" replace />;
  }

  return <Component {...rest} />;
};
export default StaffPrivateRoute;
