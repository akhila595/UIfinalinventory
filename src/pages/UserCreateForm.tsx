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
  const [errorMsg, setErrorMsg] = useState("");

  const isValid = email && password;

  const submit = async () => {
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Email and Password are required");
      return;
    }

    try {
      await createUser({ name, email, password });
      onSaved();
    } catch (err: any) {
      // read backend error message
      const msg =
        err?.response?.data ||
        err?.response?.data?.message ||
        "Failed to create user";

      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Create User</h2>
          <button onClick={onCancel}>
            <X />
          </button>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-3 text-red-600 text-sm bg-red-50 p-2 rounded">
            {errorMsg}
          </div>
        )}

        {/* Name */}
        <input
          className="w-full mb-3 px-4 py-2 border rounded-xl"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          className="w-full mb-3 px-4 py-2 border rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          className="w-full mb-4 px-4 py-2 border rounded-xl"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={!isValid}
            className={`px-4 py-2 rounded-xl text-white ${
              isValid
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCreateForm;