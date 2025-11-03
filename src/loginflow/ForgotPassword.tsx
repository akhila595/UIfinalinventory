import React, { useState } from "react";
import { forgotPassword } from "@/api/authApi";
import { motion } from "framer-motion";

export default function ForgotPassword({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await forgotPassword({ email });
      setSuccess(
        response.data.message || "✅ Password reset link sent successfully!"
      );
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("❌ Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/backgroundimage1.png')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* --- Top Left Logo --- */}
      <div className="absolute top-6 left-6 flex items-center space-x-3 z-10">
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-12 w-12 object-contain rounded-full shadow-md"
        />
        <span className="text-white text-2xl font-bold drop-shadow-lg select-none">
          MyProduct
        </span>
      </div>

      {/* --- Product Text --- */}
      <div className="absolute left-6 bottom-12 max-w-sm text-white drop-shadow-lg z-10 px-4 sm:px-0">
        <h2
          className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent select-none"
          style={{ WebkitBackgroundClip: "text" }}
        >
          Forgot Your Password?
        </h2>
        <p className="text-lg leading-relaxed text-gray-200">
          No worries! Enter your registered email below, and we’ll send you a
          secure password reset link right away.
        </p>
      </div>

      {/* --- Forgot Password Card --- */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white/20 backdrop-blur-lg shadow-2xl border border-white/30"
      >
        <h2
          className="text-3xl font-extrabold text-center mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent select-none"
          style={{ WebkitBackgroundClip: "text" }}
        >
          Forgot Password 🔒
        </h2>
        <p className="text-center text-gray-300 mb-6 select-none">
          We’ll help you reset your password quickly
        </p>

        {error && (
          <div className="bg-red-100 bg-opacity-30 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 bg-opacity-30 border border-green-400 text-green-700 px-4 py-2 rounded mb-4 text-sm text-center backdrop-blur-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label className="block text-gray-200 font-semibold mb-1 select-none">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white/30 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-sm transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-70 text-white py-3 rounded-lg font-semibold transition duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-blue-400 hover:underline font-medium select-none"
          >
            ← Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
