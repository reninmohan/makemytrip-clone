"use client";

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  const register = (userData) => {
    // In a real app, you would make an API call to register the user
    // For this example, we'll just store the user in localStorage
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      bookings: [],
    };

    // Get existing users or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // Add new user
    existingUsers.push(newUser);

    // Save back to localStorage
    localStorage.setItem("users", JSON.stringify(existingUsers));

    // Log in the user
    login(newUser);

    return newUser;
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
