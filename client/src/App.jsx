import Homepage from "./pages/HomePage";
import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import HotelSearchPage from "./pages/HotelSearchPage";
import FlightSearchPage from "./pages/FlightSearchPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "react-hot-toast";
import FlightRecommended from "./pages/FlightRecommendedPage";
import HotelRecommended from "./pages/HotelRecommended";
import Test from "./pages/Test";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" index element={<Homepage />} />
            <Route path="/flights" element={<FlightSearchPage />} />
            <Route path="/hotels" element={<HotelSearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            {/* Protected routes for booking and profile */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/flightrecom" element={<FlightRecommended />} />
            <Route path="/hotelrecom" element={<HotelRecommended />} />
            <Route path="/test" element={<Test />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" index element={<AdminDashboard />} />
              {/* Add more admin routes here */}
            </Route>
          </Route>

          {/* 404 Route - Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
