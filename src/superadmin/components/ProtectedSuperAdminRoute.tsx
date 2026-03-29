import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedSuperAdminRoute({ children }: Props) {
  const token = localStorage.getItem("authToken");

  let user: any = null;
  try {
    user = JSON.parse(localStorage.getItem("userData") || "{}");
  } catch {
    user = null;
  }

  // No token → Go to Super Admin Login
  if (!token) return <Navigate to="/admin" replace />;

  // No user stored
  if (!user || !user.roles) return <Navigate to="/admin" replace />;

  // Must be valid array
  if (!Array.isArray(user.roles)) return <Navigate to="/admin" replace />;

  // Must have SUPER_ADMIN role
  if (!user.roles.includes("SUPERADMIN"))
    return <Navigate to="/app/dashboard" replace />;

  return <>{children}</>;
}
