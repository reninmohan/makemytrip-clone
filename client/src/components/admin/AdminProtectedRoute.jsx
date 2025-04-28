import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SpinnerFullPage from "../../components/Spinner";

const AdminProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <SpinnerFullPage />;
  }

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
