import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

export default function AdminLayout() {
  const { currentUser } = useAuth();

  // Check if user is admin
  if (!currentUser || currentUser.role !== "admin") {
    toast.error("Unauthorized access. Admin access only.");
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
