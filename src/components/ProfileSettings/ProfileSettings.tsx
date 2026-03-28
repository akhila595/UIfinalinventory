import React from "react";

interface UserData {
  name: string;
  email: string;
  roles: string[];
  customerId?: number;
}

const ProfileSettings: React.FC = () => {
  const user: UserData | null = JSON.parse(
    localStorage.getItem("userData") || "null"
  );

  const field = (label: string, value: any) => (
    <div className="flex justify-between items-center border-b pb-3">
      <span className="font-semibold text-gray-600">
        {label}
      </span>

      <span className="text-gray-800">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <div className="max-w-xl">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Profile Information
      </h2>

      <div className="space-y-4">

        {field("Name", user?.name)}

        {field("Email", user?.email)}

        {field("Role", user?.roles?.join(", "))}

        {field("Customer ID", user?.customerId)}

      </div>

    </div>
  );
};

export default ProfileSettings;