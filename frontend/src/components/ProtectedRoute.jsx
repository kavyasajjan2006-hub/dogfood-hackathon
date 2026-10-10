
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const token = localStorage.getItem("hackhub_token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("hackhub_user") || "null");
  } catch {
    user = null;
  }

  // Require a valid local session.
  if (!token || !user || !user.role) {
    localStorage.removeItem("hackhub_token");
    localStorage.removeItem("hackhub_user");

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Restrict this route when specific roles are required.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    if (user.role === "judge") {
      return <Navigate to="/judging" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
