import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getUsers, updateUser, uploadUserProfileImage } from "@/api/SuperadminApi";

interface Props {
  userId: number;
  onCancel: () => void;
  onSaved: () => void;
}

const DEFAULT_IMAGE = "/images/default-user.jpeg";

const UserEditForm: React.FC<Props> = ({ userId, onCancel, onSaved }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // 🔑 Backend image URL (this is what we send)
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 👀 UI preview (blob or backend URL)
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  // ✅ Load user data
  const loadUser = async () => {
    const users = await getUsers();
    const user = users.find((u: any) => u.id === userId);

    if (user) {
      setName(user.name || "");
      setEmail(user.email);
      setProfileImage(user.profileImage || null);
      setPreview(user.profileImage || null);
    }
  };

  // ✅ Upload image → backend decides URL
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 👀 Show preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 🔥 REAL upload API (must exist in backend)
      const res = await uploadUserProfileImage(userId, formData);

      // ✅ Save backend URL ONLY
      setProfileImage(res.imageUrl);
    } catch (error) {
      console.error("Profile image upload failed", error);
      alert("Image upload failed. Please try again.");
      setPreview(profileImage); // rollback
    }
  };

  // ✅ Save user
  const submit = async () => {
    await updateUser(String(userId), {
      name,
      profileImage, // 🔑 REAL backend path
    });
    onSaved();
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

        {/* Email (readonly) */}
        <input
          disabled
          className="w-full mb-4 px-4 py-2 border rounded-xl bg-gray-100"
          value={email}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-xl"
          >
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