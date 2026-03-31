import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getUsers,
  updateUser,
  uploadUserProfileImage,
} from "@/api/SuperadminApi";

interface Props {
  userId: number;
  onCancel: () => void;
  onSaved: () => void;
}

const DEFAULT_IMAGE = "/images/default-user.jpeg";

const UserEditForm: React.FC<Props> = ({ userId, onCancel, onSaved }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // backend image path
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // UI preview
  const [preview, setPreview] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState("");

  const isValid = name.trim() !== "";

  useEffect(() => {
    loadUser();
  }, []);

  // ✅ Load user data
  const loadUser = async () => {
    try {
      const users = await getUsers();
      const user = users.find((u: any) => u.id === userId);

      if (user) {
        setName(user.name || "");
        setEmail(user.email);
        setProfileImage(user.profileImage || null);
        setPreview(user.profileImage || null);
      }
    } catch {
      setErrorMsg("Failed to load user details");
    }
  };

  // ✅ Upload image
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadUserProfileImage(userId, formData);

      setProfileImage(res.imageUrl);
    } catch (err: any) {
      const msg =
        err?.response?.data ||
        err?.response?.data?.message ||
        "Image upload failed";

      setErrorMsg(msg);
      setPreview(profileImage);
    }
  };

  // ✅ Save user
  const submit = async () => {
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Name is required");
      return;
    }

    try {
      await updateUser(String(userId), {
        name,
        profileImage,
      });

      onSaved();
    } catch (err: any) {
      const msg =
        err?.response?.data ||
        err?.response?.data?.message ||
        "Failed to update user";

      setErrorMsg(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Edit User</h2>
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

        {/* Profile Image */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <img
            src={preview || DEFAULT_IMAGE}
            className="w-24 h-24 rounded-full object-cover border shadow"
            alt="Profile"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
        </div>

        {/* Name */}
        <input
          className="w-full mb-3 px-4 py-2 border rounded-xl"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />

        {/* Email */}
        <input
          disabled
          className="w-full mb-4 px-4 py-2 border rounded-xl bg-gray-100"
          value={email}
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditForm;