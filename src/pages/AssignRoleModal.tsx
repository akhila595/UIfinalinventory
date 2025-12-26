import React, { useEffect, useState } from "react";
import {
  fetchUsersWithRoles,
  fetchRoles,
  assignRoles,
} from "@/api/userRoleApi";

interface Props {
  onClose: () => void;
}

interface UserDTO {
  id: number;
  name: string;
  email: string;
  roleNames: string[];
}

interface RoleDTO {
  id: number;
  name: string;
}

const AssignRoleModal: React.FC<Props> = ({ onClose }) => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | "">("");
  const [selectedRole, setSelectedRole] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [u, r] = await Promise.all([
        fetchUsersWithRoles(), // ✅ customer-aware
        fetchRoles(),
      ]);

      setUsers(u.data || []);
      setRoles(r.data || []);
    } catch (err) {
      console.error("Failed to load users/roles", err);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      setLoading(true);
      await assignRoles({
        userId: selectedUser,
        roleIds: [selectedRole],
      });
      onClose();
    } catch (err) {
      console.error("Role assignment failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[420px] shadow-2xl p-6">
        <h2 className="text-xl font-semibold mb-5 text-indigo-700">
          Assign Role
        </h2>

        {/* USER */}
        <label className="block text-sm text-gray-600 mb-1">User</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedUser}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        {/* ROLE */}
        <label className="block text-sm text-gray-600 mb-1">Role</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedRole}
          onChange={(e) => setSelectedRole(Number(e.target.value))}
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={!selectedUser || !selectedRole || loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoleModal;
