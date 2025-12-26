import React, { useEffect, useState } from "react";
import { Trash2, Edit2, PlusCircle } from "lucide-react";
import { getUsers, deleteUser } from "@/api/SuperadminApi";
import UserCreateForm from "./UserCreateForm";
import UserEditForm from "./UserEditForm";

/* =======================
   Types
======================= */
interface UserDTO {
  id: number;
  name: string;
  email: string;
}

/* =======================
   Permission Helper
======================= */
const hasPermission = (perm: string) => {
  try {
    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    return Array.isArray(user.permissions) && user.permissions.includes(perm);
  } catch {
    return false;
  }
};

const UserList: React.FC = () => {
  const canView = hasPermission("USER_VIEW");
  const canCreate = hasPermission("USER_CREATE");
  const canEdit = hasPermission("USER_EDIT");
  const canDelete = hasPermission("USER_DELETE");

  const [users, setUsers] = useState<UserDTO[]>([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editUserId, setEditUserId] = useState<number | null>(null);

  useEffect(() => {
    if (canView) loadUsers();
  }, [canView]);

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data || []);
  };

  const removeUser = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await deleteUser(String(id));
    loadUsers();
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        You do not have permission to view users.
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-500">Manage application users</p>
          </div>

          {canCreate && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700"
            >
              <PlusCircle size={18} />
              New User
            </button>
          )}
        </div>

        {/* Search */}
        <input
          className="mb-4 px-4 py-2 border rounded-xl w-72"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(
                  (u) =>
                    u.name?.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase())
                )
                .map((u: UserDTO) => (
                  <tr key={u.id} className="border-t hover:bg-indigo-50">
                    <td className="px-6 py-4">{u.name || "—"}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-4">
                        {canEdit && (
                          <button
                            onClick={() => setEditUserId(u.id)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => removeUser(u.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {showCreate && (
          <UserCreateForm
            onCancel={() => setShowCreate(false)}
            onSaved={() => {
              loadUsers();
              setShowCreate(false);
            }}
          />
        )}

        {editUserId !== null && (
          <UserEditForm
            userId={editUserId}
            onCancel={() => setEditUserId(null)}
            onSaved={() => {
              loadUsers();
              setEditUserId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserList;
