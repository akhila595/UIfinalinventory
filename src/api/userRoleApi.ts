import api from "@/api/axios";

// Get roles list
export const fetchRoles = () => api.get("/api/roles");

// Get permissions
export const fetchPermissions = () => api.get("/api/roles/permissions");

// Get all users
export const fetchUsers = () => api.get("/api/users");

// Assign roles to user
export const assignRoles = (payload: { userId: number; roleIds: number[] }) =>
  api.post("/api/users/assign-roles", payload);
