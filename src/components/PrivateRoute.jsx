import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { isAuthenticated, loading, user } = useAuth(); // Assume `user` has role info

  if (loading)
    return (
      <LoadingSpinner
        size={60}
        className="spinner-color"
        message="Loading data..."
      />
    ); // Optional loading indicator

  // Redirect based on role
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to={user?.role === "staff" ? "/staff/signin" : "/user/signin"} />
  );
};

export default PrivateRoute;
