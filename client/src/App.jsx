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
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import HotelDetails from "./components/user/hotel/HotelDetails";
import HotelBooking from "./components/user/hotel/HotelBooking";
import BookingConfirmation from "./components/user/BookingConfirmation";
import FlightDetails from "./components/user/flight/FlightDetails";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" index element={<Homepage />} />
            <Route path="/flights" element={<FlightSearchPage />} />
            <Route path="/flights/search" element={<FlightSearchPage />} />
            <Route path="/flights/:flightId" element={<FlightDetails />} />

            <Route path="/hotels" element={<HotelSearchPage />} />
            <Route path="/hotels/search" element={<HotelSearchPage />} />
            <Route path="/hotels/:hotelId" element={<HotelDetails />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected routes for booking and profile */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/booking/flight/book/:flightId" element={<p>This is protected booking page for flights</p>} />
              <Route path="/booking/hotel/book/:hotelId" element={<HotelBooking />} />
              <Route path="/booking/confirmation/:type/:id" element={<BookingConfirmation />} />
            </Route>
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" index element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
