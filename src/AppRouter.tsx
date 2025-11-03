import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import components
import App from "./App"; // Main Dashboard
import LoginPage from "@/loginflow/LoginPage"; // Login Page component

const AppRouter: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if the user is authenticated by checking for an auth token
    return !!localStorage.getItem("authToken");
  });

  // Sync authentication status if it changes (e.g., across tabs)
  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/app" replace />
            ) : (
              <LoginPage onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />

        {/* Application Dashboard Route */}
        <Route
          path="/app/*"
          element={
            isAuthenticated ? (
              <App />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default Route - Redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
