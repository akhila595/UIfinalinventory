import React, { useEffect, useState } from "react";
import {
  getRoles,
  getPermissions,
  getRolePermissions,
  assignPermissionsToRole,
} from "@/api/SuperadminApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Role = { id: number; name: string; description?: string };
type Permission = { id: number; key: string; label?: string };

export default function RolePermissionAssign() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [assignedIds, setAssignedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const r = await getRoles();
        const p = await getPermissions();
        setRoles(r?.data || r || []);
        setPermissions(p?.data || p || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load roles/permissions");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (selectedRoleId == null) {
      setAssignedIds(new Set());
      return;
    }
    const loadRolePerms = async () => {
      try {
        const res = await getRolePermissions(selectedRoleId);
        const list = res?.data || res || [];
        const ids = new Set<number>(list.map((x: any) => Number(x.id)));
        setAssignedIds(ids);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load role permissions");
      }
    };
    loadRolePerms();
  }, [selectedRoleId]);

  const togglePermission = (permId: number) => {
    setAssignedIds((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) next.delete(permId);
      else next.add(permId);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedRoleId) {
      toast.error("Select a role first");
      return;
    }
    setSaving(true);
    try {
      await assignPermissionsToRole(selectedRoleId, Array.from(assignedIds));
      toast.success("Permissions saved");
      // optional: navigate or refresh
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign permissions");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-gray-600">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assign Permissions to Role</h1>
        <div>
          <button
            onClick={() => navigate("/superadmin/roles")}
            className="px-3 py-1 border rounded text-sm"
          >
            Back to Roles
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Role</label>
          <select
            value={selectedRoleId ?? ""}
            onChange={(e) => setSelectedRoleId(Number(e.target.value))}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select Role --</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Permissions</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {permissions.map((perm) => (
              <label
                key={perm.id}
                className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={assignedIds.has(perm.id)}
                  onChange={() => togglePermission(perm.id)}
                />
                <div>
                  <div className="text-sm font-medium">{perm.label || perm.key}</div>
                  <div className="text-xs text-gray-500">{perm.key}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !selectedRoleId}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => {
              // reload permissions for role
              if (selectedRoleId) {
                setSelectedRoleId(selectedRoleId); // triggers effect
              }
            }}
            className="px-4 py-2 border rounded"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
