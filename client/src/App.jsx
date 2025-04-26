import Homepage from "./pages/Homepage";
import AppLayout from "./layouts/AppLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HotelSearchPage from "./pages/HotelSearchPage";
import FlightSearchPage from "./pages/FlightSearchPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";

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
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
