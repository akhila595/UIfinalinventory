import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "@/api/axios";
import { getPermissions } from "@/api/SuperadminApi";

export default function AssignPermissions() {
  const { id } = useParams(); // role ID from URL
  const roleId = Number(id);

  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<any[]>([]);
  const [assigned, setAssigned] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoleDetails();
    loadPermissionsList();
  }, []);

  // Get role details + assigned permissions
  const loadRoleDetails = async () => {
    const res = await axios.get(`/api/roles/${roleId}`);
    setRoleName(res.data.name);

    const permRes = await axios.get(`/api/roles/${roleId}/permissions`);
    setAssigned(permRes.data.map((p: any) => p.id));
  };

  // Get all permissions
  const loadPermissionsList = async () => {
    const data = await getPermissions();
    setPermissions(data);
    setLoading(false);
  };

  const togglePermission = (permId: number) => {
    setAssigned((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const selectAll = () => {
    setAssigned(permissions.map((p) => p.id));
  };

  const clearAll = () => {
    setAssigned([]);
    setSearch("");
  };

  const save = async () => {
    await axios.post(`/api/roles/${roleId}/permissions`, {
      permissionIds: assigned,
    });

    alert("Permissions updated successfully!");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Assign Permissions</h1>
      <p className="text-gray-600 mb-4">Role: <b>{roleName}</b></p>

      {/* Search */}
      <input
        type="text"
        className="border px-3 py-2 rounded-lg w-full mb-4"
        placeholder="Search permissions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Select / Clear All */}
      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={selectAll}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Select All
        </button>

        <button
          type="button"
          onClick={clearAll}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg"
        >
          Clear All
        </button>
      </div>

      {/* Permissions List */}
      <div className="border rounded-lg p-4 bg-gray-50 max-h-[400px] overflow-auto">

        {permissions
          .filter(
            (p) =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.code.toLowerCase().includes(search.toLowerCase())
          )
          .map((p) => (
            <label key={p.id} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={assigned.includes(p.id)}
                onChange={() => togglePermission(p.id)}
              />
              <span className="font-medium">{p.name}</span>
              <span className="text-sm text-gray-500">({p.code})</span>
            </label>
          ))}
      </div>

      {/* Save Button */}
      <button
        onClick={save}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Save Changes
      </button>
    </div>
  );
}
