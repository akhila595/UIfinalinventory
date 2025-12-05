import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Normal App
import App from "./App";
import LoginPage from "@/loginflow/LoginPage";

// Super Admin Auth
import SuperAdminLoginPage from "@/superadmin/pages/SuperAdminLoginPage";
import ProtectedSuperAdminRoute from "@/superadmin/components/ProtectedSuperAdminRoute";

// Super Admin Pages
import SuperAdminDashboard from "@/superadmin/pages/Dashboard";

// Users
import UserList from "@/superadmin/pages/UserList";

// Roles
import RolesList from "@/superadmin/pages/RoleList";
import CreateRole from "@/superadmin/pages/RoleCreate";
import EditRole from "@/superadmin/pages/RoleEdit";
import AssignPermissions from "@/superadmin/pages/AssignPermissions";

// Permissions
import PermissionsList from "@/superadmin/pages/PermissionList";
import CreatePermission from "@/superadmin/pages/PermissionCreate";
import EditPermission from "@/superadmin/pages/PermissionEdit";

export default function AppRouter() {
  return (
    <Routes>

      {/* Normal User Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Normal App */}
      <Route path="/app/*" element={<App />} />

      {/* Super Admin Login */}
      <Route path="/admin" element={<SuperAdminLoginPage />} />

      {/* Super Admin Dashboard */}
      <Route
        path="/superadmin/dashboard"
        element={
          <ProtectedSuperAdminRoute>
            <SuperAdminDashboard />
          </ProtectedSuperAdminRoute>
        }
      />

      {/* USERS */}
      <Route
        path="/superadmin/users"
        element={
          <ProtectedSuperAdminRoute>
            <UserList />
          </ProtectedSuperAdminRoute>
        }
      />

      {/* ROLES LIST */}
      <Route
        path="/superadmin/roles"
        element={
          <ProtectedSuperAdminRoute>
            <RolesList />
          </ProtectedSuperAdminRoute>
        }
      />

      {/* CREATE ROLE */}
      <Route
        path="/superadmin/roles/create"
        element={
          <ProtectedSuperAdminRoute>
            <CreateRole />
          </ProtectedSuperAdminRoute>
        }
      />

      {/* EDIT ROLE */}
      <Route
        path="/superadmin/roles/:id/edit"
        element={
          <ProtectedSuperAdminRoute>
            <EditRole />
          </ProtectedSuperAdminRoute>
        }
      />

      {/* ASSIGN PERMISSIONS */}
      <Route
        path="/superadmin/roles/:id/permissions"
        element={
          <ProtectedSuperAdminRoute>
            <AssignPermissions />
          </ProtectedSuperAdminRoute>
        }
      />

      {/* PERMISSIONS */}
      <Route
        path="/superadmin/permissions"
        element={
          <ProtectedSuperAdminRoute>
            <PermissionsList />
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/permissions/create"
        element={
          <ProtectedSuperAdminRoute>
            <CreatePermission />
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/permissions/:id/edit"
        element={
          <ProtectedSuperAdminRoute>
            <EditPermission />
          </ProtectedSuperAdminRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
