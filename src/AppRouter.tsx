import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Normal App
import App from "./App";
import LoginPage from "@/loginflow/LoginPage";

// Super Admin Auth
import SuperAdminLoginPage from "@/superadmin/pages/SuperAdminLoginPage";
import ProtectedSuperAdminRoute from "@/superadmin/components/ProtectedSuperAdminRoute";

// Super Admin Context
import { CustomerProvider } from "@/superadmin/components/CustomerContext";

// Super Admin Pages
import SuperAdminDashboard from "@/superadmin/pages/Dashboard";
import UserList from "@/superadmin/pages/UserList";
import RolesList from "@/superadmin/pages/RoleList";
import CreateRole from "@/superadmin/pages/RoleCreate";
import EditRole from "@/superadmin/pages/RoleEdit";
import AssignPermissions from "@/superadmin/pages/AssignPermissions";
import PermissionsList from "@/superadmin/pages/PermissionList";
import CreatePermission from "@/superadmin/pages/PermissionCreate";
import EditPermission from "@/superadmin/pages/PermissionEdit";
import CustomerListPage from "@/superadmin/pages/CustomerListPage";
import CreateCustomerForm from "@/superadmin/pages/CreateCustomerForm";

export default function AppRouter() {
  return (
    <Routes>

      {/* Normal User Login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Normal App */}
      <Route path="/app/*" element={<App />} />

      {/* Super Admin Login */}
      <Route path="/admin" element={<SuperAdminLoginPage />} />

      {/* ================= SUPER ADMIN ROUTES ================= */}

      <Route
        path="/superadmin/dashboard"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <SuperAdminDashboard />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/users"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <UserList />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/roles"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <RolesList />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/roles/create"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <CreateRole />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/roles/:id/edit"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <EditRole />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/roles/:id/permissions"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <AssignPermissions />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/permissions"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <PermissionsList />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/permissions/create"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <CreatePermission />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/permissions/:id/edit"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <EditPermission />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/customers"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <CustomerListPage />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      <Route
        path="/superadmin/create-customer"
        element={
          <ProtectedSuperAdminRoute>
            <CustomerProvider>
              <CreateCustomerForm />
            </CustomerProvider>
          </ProtectedSuperAdminRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
