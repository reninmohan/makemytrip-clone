import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/90 backdrop-blu sticky top-0 z-50 w-full shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-2xl font-bold text-transparent">MakeMyTrip</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}>
                {/* <NavLink to="/" className="nav-link rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-500 hover:text-white"> */}
                Home
              </NavLink>
              <NavLink to="/hotels" className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}>
                Hotels
              </NavLink>
              <NavLink to="/flights" className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}>
                Flights
              </NavLink>
              {currentUser && (
                <>
                  <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}>
                    My Profile
                  </NavLink>
                </>
              )}
            </div>
          </div>
          <div className="hidden items-center md:flex">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Hello, {currentUser?.fullName.split(" ")?.[0] || currentUser?.fullName}</span>
                <Button onClick={handleLogout} variant="destructive" className="transition-colors hover:bg-red-700" disabled={isLoggingOut}>
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-gray-200">
                  Sign In
                </Link>
                <Link to="/signup" className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-blue-700 focus:outline-none">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            <Link to="/" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/flights" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
              Flights
            </Link>
            <Link to="/hotels" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
              Hotels
            </Link>
            {currentUser && (
              <Link to="/profile" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
                My Profile
              </Link>
            )}
          </div>
          <div className="pb-5">
            {currentUser ? (
              <div className="space-y-1 px-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full rounded-md bg-red-500 px-3 py-2 text-left text-base font-medium text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-2">
                <Link to="/login" className="block rounded-md bg-white px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/signup" className="mt-1 block rounded-md bg-cyan-500 px-3 py-2 text-base font-medium text-white hover:bg-blue-600" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
