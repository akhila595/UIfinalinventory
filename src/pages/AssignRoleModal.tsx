import React, { useEffect, useState } from "react";
import { fetchUsers, fetchRoles, assignRoles } from "@/api/userRoleApi";

interface Props {
  onClose: () => void;
}

const AssignRoleModal: React.FC<Props> = ({ onClose }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const u = await fetchUsers();
    const r = await fetchRoles();
    setUsers(u.data);
    setRoles(r.data);
  };

  const handleAssign = async () => {
    if (!selectedUser || !selectedRole) return;
    await assignRoles({ userId: selectedUser, roleIds: [selectedRole] });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Assign Role</h2>

        <select
          className="w-full border p-2 rounded mb-3"
          value={selectedUser ?? ""}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.userId} value={u.userId}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <select
          className="w-full border p-2 rounded mb-4"
          value={selectedRole ?? ""}
          onChange={(e) => setSelectedRole(Number(e.target.value))}
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2" onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRoleModal;
