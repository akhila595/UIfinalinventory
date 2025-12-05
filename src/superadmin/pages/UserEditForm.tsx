import React, { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { updateUser, getUsers } from "@/api/SuperadminApi";

interface Props {
  userId: number;
  roles: { id: number; name: string }[];
  onCancel: () => void;
  onSaved: () => void;
}

export default function UserEditForm({ userId, roles, onCancel, onSaved }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleNames: [] as string[],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const users = await getUsers();
    const user = users.find((u: any) => u.id === userId);

    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        roleNames: user.roleNames || [],
      });
    }
  };

  const toggleRole = (roleName: string) => {
    setForm((prev) => ({
      ...prev,
      roleNames: prev.roleNames.includes(roleName)
        ? prev.roleNames.filter((r) => r !== roleName)
        : [...prev.roleNames, roleName],
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUser(String(userId), form);
      onSaved();
    } catch (err) {
      console.error("Update user error:", err);
      alert("Failed to update user");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/70 border border-purple-200 backdrop-blur-xl shadow-2xl p-8 rounded-2xl w-full max-w-lg relative">

        {/* Close */}
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-700 hover:text-red-600">
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit User</h2>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-purple-300 bg-white/60 shadow-sm outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-xl border border-purple-300 bg-white/60 shadow-sm outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password (leave empty to keep unchanged)</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 rounded-xl border border-purple-300 bg-white/60 shadow-sm outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Assign Roles</label>

            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => {
                const selected = form.roleNames.includes(role.name);
                return (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => toggleRole(role.name)}
                    className={`p-3 rounded-xl border shadow-sm flex justify-between items-center transition
                      ${selected ? "bg-purple-300 border-purple-600" : "bg-white/60 border-purple-300 hover:bg-purple-100"}`}
                  >
                    <span>{role.name}</span>
                    {selected && <CheckCircle size={20} className="text-purple-700" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
