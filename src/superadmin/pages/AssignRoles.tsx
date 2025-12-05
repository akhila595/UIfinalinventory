import React, { useEffect, useState } from "react";
import { getUsers, getRoles } from "@/api/SuperadminApi";
import axios from "@/api/axios";

export default function AssignRoles() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  // Load users
  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  // Load all roles
  const loadRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  // When user changes → load assigned roles
  const handleUserSelect = async (userId: number) => {
    setSelectedUserId(userId);

    const res = await axios.get(`/api/roles/user/${userId}`);
    const existingRoleIds = res.data.map((r: any) => r.id);

    setSelectedRoles(existingRoleIds);
  };

  // Toggle role selection
  const toggleRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  // Save assignment
  const save = async () => {
    if (!selectedUserId) return alert("Select a user");

    await axios.post("/api/roles/assign", {
      userId: selectedUserId,
      roleIds: selectedRoles,
    });

    alert("Roles updated successfully!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Assign Roles to User</h2>

      {/* USER DROPDOWN */}
      <div className="mb-4">
        <label className="font-medium block mb-1">Select User</label>
        <select
          className="border px-3 py-2 rounded-lg w-full"
          onChange={(e) => handleUserSelect(Number(e.target.value))}
        >
          <option value="">-- Choose User --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email} {u.name ? `(${u.name})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* ROLE CHECKBOXES */}
      {selectedUserId && (
        <div className="bg-white p-5 shadow rounded-xl">
          <h3 className="text-xl font-semibold mb-3">Assign Roles</h3>

          <div className="space-y-2">
            {roles.map((r) => (
              <label key={r.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(r.id)}
                  onChange={() => toggleRole(r.id)}
                />
                {r.name}
              </label>
            ))}
          </div>

          <button
            onClick={save}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
