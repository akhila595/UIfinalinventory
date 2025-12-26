import { useState } from "react";
import { loginUser } from "@/api/authApi";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

type Props = {
  onLogin?: () => void;
};

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"login" | "register" | "forgot">("login");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Login
      const res = await loginUser({ email, password });
      const { token, name, email: userEmail, roles, permissions } = res.data;

      if (!token) {
        setError("Login successful but no token received.");
        return;
      }

      // Step 2: Store token and user info in localStorage
      localStorage.setItem("authToken", token);

      // Store user data (including roles and permissions)
      localStorage.setItem(
        "userData",
        JSON.stringify({
          name,
          email: userEmail,
          roles,
          permissions, // Store permissions here
        })
      );

      // Optionally, store permissions directly
      localStorage.setItem("permissions", JSON.stringify(permissions));

      // Trigger the onLogin callback, if provided
      onLogin?.();

      // Redirect to the app
      navigate("/app");

    } 
     catch (err: any) {
      const status = err.response?.status;
      if (status === 401) {
      setError("Invalid email or password");
        } else {
       setError("Unable to login. Please try again later.");
       }
      }
    finally {
      setLoading(false);
    }
  };

  if (view === "register") return <Register onBack={() => setView("login")} />;
  if (view === "forgot") return <ForgotPassword onBack={() => setView("login")} />;

  return (
    <div
      className="relative flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/backgroundimage1.png')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="absolute top-6 left-6 flex items-center space-x-3 z-20">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-12 w-12 object-contain rounded-full shadow-lg"
        />
        <span className="text-white text-2xl font-extrabold drop-shadow-lg">
          MyProduct
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute left-10 bottom-20 max-w-md text-white z-20 drop-shadow-lg"
      >
        <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
          Smart Inventory Manager
        </h2>
        <p className="text-lg leading-relaxed text-gray-200">
          Simplify your business management with real-time analytics,
          automated stock tracking, and an intuitive dashboard designed to boost productivity.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative bg-white/15 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-10 w-[400px] z-30 text-white"
      >
        <h2 className="text-3xl font-extrabold text-center mb-3 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-200 mb-6">
          Login to your account to continue
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-gray-200 font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-400/30 bg-white/20 text-white placeholder-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-200 font-semibold mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="border border-gray-400/30 bg-white/20 text-white placeholder-gray-300 rounded-lg w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-400 hover:opacity-90 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-lg focus:outline-none"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm text-gray-300">
          <button
            onClick={() => setView("register")}
            className="hover:text-blue-300 font-medium transition"
          >
            Create Account
          </button>
          <button
            onClick={() => setView("forgot")}
            className="hover:text-blue-300 font-medium transition"
          >
            Forgot Password?
          </button>
        </div>
      </motion.div>
    </div>
  );
}
