import React, { useState } from "react";
import { createUser } from "@/api/SuperadminApi";
import { CheckCircle, X } from "lucide-react";

interface Props {
  roles: { id: number; name: string }[];
  onCancel: () => void;
  onSaved: () => void;
}

export default function UserCreateForm({ roles, onCancel, onSaved }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    roleNames: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      await createUser(form);

      onSaved();
    } catch (err: any) {
      const msg =
        err?.response?.data ||
        err?.response?.data?.message ||
        "Failed to create user";

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-xl relative">

        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-700 hover:text-red-600"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create User</h2>

        {errorMsg && (
          <div className="mb-3 text-red-600 text-sm bg-red-50 p-2 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-xl"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <div>
            <label className="block mb-2 font-medium">Assign Roles</label>

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
            {loading ? "Creating..." : "Create User"}
          </button>

        </form>
      </div>
    </div>
  );
}