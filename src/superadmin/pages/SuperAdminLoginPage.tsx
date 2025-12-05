import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/SuperadminApi";
import toast from "react-hot-toast";

interface LoginResponse {
  token: string;
  name: string;
  email: string;
  roles: string[]; // backend sends "roles"
}

const SuperAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response: LoginResponse = await login({ email, password });

      // ❗ CLEAR EXISTING USER DATA
      localStorage.removeItem("user");
      localStorage.removeItem("userData");

      // Save token
      localStorage.setItem("authToken", response.token);

      // Save user data — unified key "userData"
      localStorage.setItem(
        "userData",
        JSON.stringify({
          name: response.name,
          email: response.email,
          roleNames: response.roles, // unified with normal user login
        })
      );

      // Redirect based on role
      if (response.roles.includes("SUPER_ADMIN")) {
        navigate("/superadmin/dashboard");
      } else {
        navigate("/app/dashboard");
      }

      toast.success("Login successful");
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Super Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg p-2"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-lg p-2"
              placeholder="•••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
