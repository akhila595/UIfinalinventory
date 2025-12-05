import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getPermissions, createRole } from "@/api/SuperadminApi";

export default function CreateRole() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    permissionIds: [] as number[],
  });

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const data = await getPermissions();
      setPermissions(data);
    } catch (err) {
      console.error("Permission load error", err);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePermission = (permId: number) => {
    setForm((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permId)
        ? prev.permissionIds.filter((id) => id !== permId)
        : [...prev.permissionIds, permId],
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Role name is required");
      return;
    }

    await createRole(form);

    alert("Role created successfully!");
    window.location.href = "/superadmin/roles";
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button onClick={() => (window.location.href = "/superadmin/roles")} className="flex items-center gap-2 text-gray-700 mb-5 hover:text-gray-900 transition">
          <ArrowLeft size={22} /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Role</h1>

        <div className="bg-white/60 backdrop-blur-xl border border-purple-200 shadow-xl p-6 rounded-2xl">
          <form onSubmit={submit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block font-semibold mb-1">Role Name</label>
              <input
                name="name"
                className="border border-purple-300 px-3 py-2 w-full rounded-lg bg-white/60"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. ADMIN, MANAGER"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                className="border border-purple-300 px-3 py-2 w-full rounded-lg bg-white/60"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Short description (optional)"
              />
            </div>

            {/* Permissions */}
            <div>
              <label className="block font-semibold mb-2">Assign Permissions</label>
              <div className="max-h-64 overflow-auto border border-purple-200 rounded-lg p-3 bg-white/40">
                {permissions.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 mb-2 p-1">
                    <input type="checkbox" checked={form.permissionIds.includes(p.id)} onChange={() => togglePermission(p.id)} />
                    <span className="font-medium">{p.name}</span>
                    <span className="text-sm text-gray-500">({p.code})</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow">
              Create Role
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
