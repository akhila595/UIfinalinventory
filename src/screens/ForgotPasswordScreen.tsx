// src/screens/ForgotPasswordScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { forgotPassword } from "../api/api";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      console.log("📡 Sending forgot password request...", email);

      const res = await forgotPassword({ email });

      console.log("✅ Response:", res.data);

      setSuccess(
        res.data?.message || "Password reset link sent successfully!"
      );

    } catch (err: any) {
      console.log("❌ Error:", err?.response || err);

      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (!err.response) {
        setError("Network error. Check your connection.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password 🔒</Text>

      <Text style={styles.subtitle}>
        Enter your email to receive reset link
      </Text>

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Success Message */}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text.trim())}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#020617",
  },

  title: {
    color: "#facc15",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    color: "#fff",
  },

  button: {
    backgroundColor: "#facc15",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#000",
    fontWeight: "bold",
  },

  error: {
    color: "#f87171",
    textAlign: "center",
    marginBottom: 10,
  },

  success: {
    color: "#4ade80",
    textAlign: "center",
    marginBottom: 10,
  },

  back: {
    color: "#60a5fa",
    textAlign: "center",
    marginTop: 15,
  },
});