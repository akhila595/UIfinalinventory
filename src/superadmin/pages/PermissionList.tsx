import React, { useEffect, useState } from "react";
import { PlusCircle, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { getPermissions, deletePermission } from "@/api/SuperadminApi";

interface PermissionDTO {
  id: number;
  code: string;
  name: string;
  description?: string;
}

export default function PermissionList() {
  const [permissions, setPermissions] = useState<PermissionDTO[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    const data = await getPermissions();
    setPermissions(data);
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    await deletePermission(String(id));
    loadPermissions();
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button
          onClick={() => (window.location.href = "/superadmin/dashboard")}
          className="flex items-center gap-2 text-gray-700 mb-5 hover:text-gray-900 transition"
        >
          <ArrowLeft size={22} /> Back
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Permissions</h1>

          <a
            href="/superadmin/permissions/create"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            <PlusCircle size={18} /> Create Permission
          </a>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search permissions..."
          className="border border-purple-300 bg-white/60 backdrop-blur-xl px-4 py-2 rounded-xl w-64 mb-4 shadow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Glass Table */}
        <div className="bg-white/60 backdrop-blur-xl border border-purple-200 shadow-xl rounded-2xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-purple-200">
                <th className="py-2 font-semibold">Code</th>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Description</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {permissions
                .filter((p) =>
                  (p.code + " " + p.name + " " + (p.description || ""))
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((p) => (
                  <tr key={p.id} className="border-b border-purple-100 hover:bg-purple-50/40 transition">
                    <td className="py-3 font-medium">{p.code}</td>
                    <td>{p.name}</td>
                    <td className="text-sm text-gray-700">{p.description || "—"}</td>

                    <td className="text-right">
                      <div className="flex justify-end gap-4">
                        <a
                          href={`/superadmin/permissions/${p.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Edit2 size={16} /> Edit
                        </a>

                        <button
                          onClick={() => remove(p.id)}
                          className="text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
