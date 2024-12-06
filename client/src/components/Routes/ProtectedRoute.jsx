import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API from "../../services/API";
import { getCurrentUser } from "../../redux/features/auth/authActions";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [role, setRole] = useState(null); // User's role
  const [loading, setLoading] = useState(true); // Loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authenticated state

  const getUser = async () => {
    try {
      const { data } = await API.get("/auth/current-user");
      if (data?.success) {
        dispatch(getCurrentUser(data));
        setRole(data.user.role); // Assume role is part of the user object
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.clear(); // Clear token if invalid
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      setLoading(false); // No need to fetch user if no token
    }
  }, []);

  // Show loading spinner while fetching user data
  if (loading) {
    return <div>Loading... protected</div>;
  }

  // Handle unauthenticated users
  if (!localStorage.getItem("token")) {
    if (location.pathname.startsWith("/admin-dashboard")) {
      return <Navigate to="/admin/login" />;
    }
    return <Navigate to="/login" />;
  }

  // Handle role-based redirection
  if (isAuthenticated) {
    if (requiredRole && role !== requiredRole) {
      // If the user doesn't match the required role, redirect appropriately
      return requiredRole === "admin"
        ? <Navigate to="/admin/login" />
        : <Navigate to="/login" />;
    }

    // Render the children if all checks pass
    return children;
  }

  // Default fallback
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
