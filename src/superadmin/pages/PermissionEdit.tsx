import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { getPermissions, updatePermission } from "@/api/SuperadminApi";

export default function PermissionEdit() {
  const { id } = useParams();
  const permId = Number(id);

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPermission();
  }, []);

  const loadPermission = async () => {
    const perms = await getPermissions();
    const p = perms.find((x: any) => x.id === permId);

    if (!p) {
      alert("Permission not found");
      return;
    }

    setForm({
      code: p.code || "",
      name: p.name || "",
      description: p.description || "",
    });

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updatePermission(String(permId), form);

    alert("Permission updated successfully!");
    window.location.href = "/superadmin/permissions";
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={() => (window.location.href = "/superadmin/permissions")}
          className="flex items-center gap-2 text-gray-700 mb-5 hover:text-gray-900 transition"
        >
          <ArrowLeft size={22} /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Permission</h1>

        <div className="bg-white/60 backdrop-blur-xl border border-purple-200 shadow-xl rounded-2xl p-6">
          <form onSubmit={submit} className="space-y-4">

            {/* Code */}
            <div>
              <label className="block font-semibold mb-1">Permission Code</label>
              <input
                name="code"
                className="border border-purple-300 px-3 py-2 w-full rounded-lg bg-white/60 shadow"
                value={form.code}
                onChange={handleChange}
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="block font-semibold mb-1">Name</label>
              <input
                name="name"
                className="border border-purple-300 px-3 py-2 w-full rounded-lg bg-white/60 shadow"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea
                name="description"
                className="border border-purple-300 px-3 py-2 w-full rounded-lg bg-white/60 shadow"
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow">
              Update Permission
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
