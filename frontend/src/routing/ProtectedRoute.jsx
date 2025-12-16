import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useContext(AuthContext);

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
