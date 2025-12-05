import React, { useEffect, useState } from "react";
import { Menu, User } from "lucide-react";

// Props for Topbar
type TopbarProps = {
  toggleSidebar: () => void;
  title?: string;
};

export default function Topbar({ toggleSidebar, title = "Super Admin Panel" }: TopbarProps) {
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Replace with real API
        const mockProfile = {
          name: "Super Admin",
          email: "superadmin@example.com",
        };
        setProfile(mockProfile);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="w-full h-16 bg-white border-b shadow-sm flex items-center justify-between px-4">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        {profile ? (
          <div className="flex items-center gap-2 text-gray-700">
            <User size={20} />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium">{profile.name}</span>
              <span className="text-xs text-gray-500">{profile.email}</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-sm">Loading...</div>
        )}
      </div>
    </header>
  );
}
