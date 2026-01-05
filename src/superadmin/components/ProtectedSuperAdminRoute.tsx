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

  // 🔒 Not logged in → Super Admin Login
  if (!token) return <Navigate to="/admin" replace />;

  if (!user || !Array.isArray(user.roleNames))
    return <Navigate to="/admin" replace />;

  const roles = user.roleNames.map((r: string) => r.toUpperCase());

  // 🔒 Logged in but NOT super admin → normal app
  if (!roles.includes("SUPERADMIN"))
    return <Navigate to="/app/dashboard" replace />;

  return <>{children}</>;
}
