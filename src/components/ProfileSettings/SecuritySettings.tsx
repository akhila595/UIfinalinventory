import React, { useState, ChangeEvent, FormEvent } from "react";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecuritySettings: React.FC = () => {

  const [form, setForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Change password request:", form);
  };

  return (
    <div className="max-w-xl">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Security Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block font-semibold text-gray-600 mb-1">
            Current Password
          </label>

          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-600 mb-1">
            New Password
          </label>

          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-600 mb-1">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
        >
          Update Password
        </button>

      </form>

    </div>
  );
};

export default SecuritySettings;