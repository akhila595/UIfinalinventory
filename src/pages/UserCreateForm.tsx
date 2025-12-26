import React, { useState } from "react";
import { X } from "lucide-react";
import { createUser } from "@/api/SuperadminApi";

interface Props {
  onCancel: () => void;
  onSaved: () => void;
}

const UserCreateForm: React.FC<Props> = ({ onCancel, onSaved }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    if (!email || !password) return alert("Email & password required");
    await createUser({ name, email, password });
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Create User</h2>
          <button onClick={onCancel}><X /></button>
        </div>

        <input
          className="w-full mb-3 px-4 py-2 border rounded-xl"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-3 px-4 py-2 border rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 px-4 py-2 border rounded-xl"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded-xl">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCreateForm;
