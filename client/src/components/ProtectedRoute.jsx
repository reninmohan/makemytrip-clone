// src/components/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SpinnerFullPage from "./Spinner";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
