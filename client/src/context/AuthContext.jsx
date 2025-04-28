import { createContext, useContext, useState, useEffect } from "react";
import api from "../axiosConfig";
import toast from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const response = await api.get("/api/auth/me");
          const userData = response.data.data;
          setCurrentUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (error) {
          console.error("Authentication error:", error);
          if (error.response?.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            setCurrentUser(null);
          }
        }
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setCurrentUser(null);
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { data } = response.data;
      const { accessToken, ...userData } = data;

      if (!userData || !accessToken) {
        throw new Error("Invalid login response");
      }

      // Update localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Update state
      setCurrentUser(userData);

      toast.success("Login successful!");
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await api.post("/api/admin/login", { email, password });

      const { data } = response.data;

      const { accessToken, ...userData } = data;

      if (!userData || !accessToken) {
        throw new Error("Invalid login response");
      }

      if (userData.role !== "admin") {
        throw new Error("Not an admin user");
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setCurrentUser(userData);

      toast.success("Admin login successful!");
      return userData;
    } catch (error) {
      console.error("Admin login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setCurrentUser(null);
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const value = {
    currentUser,
    loading,
    setCurrentUser,
    login,
    adminLogin,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
