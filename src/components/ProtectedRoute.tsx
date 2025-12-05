import React from "react";
import { Navigate } from "react-router-dom";
import { hasAnyPermission } from "@/lib/permissionUtils";

const ProtectedRoute = ({
  permissions,
  children,
}: {
  permissions: string[];
  children: React.ReactNode;
}) => {
  if (!hasAnyPermission(permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
