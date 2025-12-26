import api from "@/api/axios";

/* =========================
   ROLES
========================= */

// Get roles list (customer-aware)
export const fetchRoles = () =>
  api.get("/api/roles");

// Get permissions
export const fetchPermissions = () =>
  api.get("/api/roles/permissions");

/* =========================
   USERS
========================= */

// Get all users (basic)
export const fetchUsers = () =>
  api.get("/api/users");

// ✅ Get users WITH roles (customer-aware, optimized)
export const fetchUsersWithRoles = () =>
  api.get("/api/users/users-with-roles");

/* =========================
   ROLE ASSIGNMENT
========================= */

// Assign roles to user
export const assignRoles = (payload: {
  userId: number;
  roleIds: number[];
}) =>
  api.post("/api/roles/assign", payload);
