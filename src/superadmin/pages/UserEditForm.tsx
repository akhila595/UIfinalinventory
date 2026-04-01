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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
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
    } catch {
      setErrorMsg("Failed to load user");
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

    setErrorMsg("");

    if (loading) return;

    setLoading(true);

    try {
      await updateUser(String(userId), form);

      onSaved();

    } catch (err: any) {

      const msg =
        err?.response?.data ||
        err?.response?.data?.message ||
        "Failed to update user";

      setErrorMsg(msg);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl relative">

        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-700 hover:text-red-600"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Edit User
        </h2>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-3 text-red-600 text-sm bg-red-50 p-2 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full p-3 border rounded-xl"
            placeholder="Full Name"
            required
          />

          {/* Email */}
          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full p-3 border rounded-xl"
            placeholder="Email"
            required
          />

          {/* Password */}
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full p-3 border rounded-xl"
            placeholder="Password (leave empty to keep unchanged)"
          />

          {/* Roles */}
          <div>
            <label className="block mb-2 font-medium">
              Assign Roles
            </label>

            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => {
                const selected = form.roleNames.includes(role.name);

                return (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => toggleRole(role.name)}
                    className={`p-3 rounded-xl border flex justify-between items-center
                    ${
                      selected
                        ? "bg-purple-300 border-purple-600"
                        : "bg-white border-purple-300"
                    }`}
                  >
                    <span>{role.name}</span>

                    {selected && (
                      <CheckCircle size={20} className="text-purple-700" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
}