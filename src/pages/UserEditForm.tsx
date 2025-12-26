import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getUsers, updateUser } from "@/api/SuperadminApi";

interface Props {
  userId: number;
  onCancel: () => void;
  onSaved: () => void;
}

const UserEditForm: React.FC<Props> = ({ userId, onCancel, onSaved }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const users = await getUsers();
    const user = users.find((u: any) => u.id === userId);
    if (user) {
      setName(user.name || "");
      setEmail(user.email);
    }
  };

  const submit = async () => {
    await updateUser(String(userId), { name });
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit User</h2>
          <button onClick={onCancel}><X /></button>
        </div>

        <input
          className="w-full mb-3 px-4 py-2 border rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          disabled
          className="w-full mb-4 px-4 py-2 border rounded-xl bg-gray-100"
          value={email}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded-xl">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditForm;
