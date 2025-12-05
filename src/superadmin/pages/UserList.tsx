import React, { useEffect, useState } from "react";
import { Trash2, Edit2, PlusCircle, ArrowLeft } from "lucide-react";
import { getUsers, getRoles, deleteUser } from "@/api/SuperadminApi";

import UserCreateForm from "@/superadmin/pages/UserCreateForm";
import UserEditForm from "@/superadmin/pages/UserEditForm";

interface RoleDTO {
  id: number;
  name: string;
}

interface UserDTO {
  id: number;
  name: string;
  email: string;
  roleNames: string[];
}

export default function UserList() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const r = await getRoles();
    const u = await getUsers();
    setRoles(r);
    setUsers(u);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await deleteUser(String(id));
    load();
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => (window.location.href = "/superadmin/dashboard")}
          className="flex items-center gap-2 text-gray-700 mb-5 hover:text-gray-900 transition"
        >
          <ArrowLeft size={22} /> Back
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-indigo-700 transition"
          >
            <PlusCircle size={18} /> Create User
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search users..."
          className="border border-purple-300 bg-white/60 backdrop-blur-xl px-4 py-2 rounded-xl w-64 mb-4 shadow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Glass Table */}
        <div className="bg-white/60 backdrop-blur-xl border border-purple-200 shadow-xl rounded-2xl p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-purple-200">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {users
                .filter(
                  (u) =>
                    u.email.toLowerCase().includes(search.toLowerCase()) ||
                    (u.name || "").toLowerCase().includes(search.toLowerCase())
                )
                .map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-purple-100 hover:bg-purple-50/40 transition"
                  >
                    <td className="py-3">{u.name || "-"}</td>
                    <td>{u.email}</td>
                    <td className="text-sm text-gray-700">
                      {u.roleNames?.length ? u.roleNames.join(", ") : "—"}
                    </td>

                    <td className="text-right">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => setEditUserId(u.id)}
                          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <Edit2 size={16} /> Edit
                        </button>

                        <button
                          onClick={() => remove(u.id)}
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

        {/* Create Modal */}
        {showCreate && (
          <UserCreateForm
            roles={roles}
            onCancel={() => setShowCreate(false)}
            onSaved={() => {
              load();
              setShowCreate(false);
            }}
          />
        )}

        {/* Edit Modal */}
        {editUserId !== null && (
          <UserEditForm
            roles={roles}
            userId={editUserId}
            onCancel={() => setEditUserId(null)}
            onSaved={() => {
              load();
              setEditUserId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
