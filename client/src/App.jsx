import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./layouts/AppLayout.jsx";

import AdminLayout from "./layouts/AdminLayout.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import HotelSearchPage from "./pages/HotelSearchPage.jsx";
import FlightSearchPage from "./pages/FlightSearchPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import HotelDetails from "./components/user/hotel/HotelDetails.jsx";
import HotelBooking from "./components/user/hotel/HotelBooking.jsx";
import BookingConfirmation from "./components/user/BookingConfirmation.jsx";
import FlightDetails from "./components/user/flight/FlightBooking.jsx";
import Homepage from "./pages/Homepage.jsx";
import FlightBooking from "./components/user/flight/FlightBooking.jsx";
import HotelRecommended from "./pages/HotelRecommended.jsx";
import FlightRecommended from "./pages/FlightRecommendedPage.jsx";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" index element={<Homepage />} />
            <Route path="/flights" element={<FlightRecommended />} />
            <Route path="/flights/search" element={<FlightSearchPage />} />
            <Route path="/flights/:flightId" element={<FlightDetails />} />

            <Route path="/hotels" element={<HotelRecommended />} />
            <Route path="/hotels/search" element={<HotelSearchPage />} />
            <Route path="/hotels/:hotelId" element={<HotelDetails />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected routes for booking and profile */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/booking/flight/book/:flightId" element={<FlightBooking />} />
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
