import Homepage from "./pages/Homepage";
import AppLayout from "./layouts/AppLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import FlightSearch from "./pages/FlightSearch";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" index element={<Homepage />} />
            <Route path="/flights" element={<p>This is flight page</p>} />
            <Route path="/hotels" element={<p>This is hotel search page</p>} />
            <Route path="/login" element={<p>This is login page</p>} />
            <Route path="/signup" element={<p>This is signup page</p>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
