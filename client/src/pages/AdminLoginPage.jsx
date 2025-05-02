import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AdminNavbar from "../components/admin/AdminNavbar";
import Footer from "../components/Footer";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { adminLogin, currentUser } = useAuth();
  const navigate = useNavigate();

  // If already logged in as admin, redirect to admin dashboard
  useEffect(() => {
    if (currentUser?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminLogin(email, password);
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("admin login failed", error);
      toast.error(error.response?.data?.message || "Admin login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AdminNavbar />
      <main className="flex-grow">
        <div className="flex min-h-screen flex-col bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-16">
          <div className="container mx-auto max-w-md flex-1 py-16">
            <div className="space-y-6 rounded-lg bg-white p-12 shadow-lg">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Admin Login</h1>
                <p className="text-muted-foreground">Enter your admin credentials to access the dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email </Label>
                  <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
                </div>
                <Button type="submit" className="w-full" disabled={loading} variant="primary">
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="text-center text-sm">
                <Link to="/login" className="text-blue-600 hover:underline">
                  Back to user login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
