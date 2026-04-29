import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../api/api";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter email and password");
    return;
  }

  try {
    setLoading(true);

    console.log("🔥 Login button clicked");
    console.log("📡 Sending request...", { email });

    const res = await loginUser({ email, password });

    console.log("✅ API Response:", res.data);

    const {
      token,
      name,
      email: userEmail,
      roles,
      permissions,
      customerId,
      profileImage,
    } = res.data;

    if (!token) {
      Alert.alert("Error", "No token received from server");
      return;
    }

    // ✅ Store token
    await AsyncStorage.setItem("authToken", token);

    // ✅ Store user data
    await AsyncStorage.setItem(
      "userData",
      JSON.stringify({
        name,
        email: userEmail,
        roles,
        permissions,
        profileImage,
      })
    );
     await AsyncStorage.setItem(
      "selectedCustomerId",
      String(customerId)
      );
    // ✅ Store permissions separately (optional)
    await AsyncStorage.setItem(
      "permissions",
      JSON.stringify(permissions)
    );

    console.log("💾 Token stored successfully");

    Alert.alert("Success", "Login successful");

    // ✅ Navigate to Dashboard
    navigation.replace("Dashboard");

  } catch (err: any) {
    console.log("❌ Login Error Full:", err);
    console.log("❌ Status:", err?.response?.status);
    console.log("❌ Data:", err?.response?.data);

    const status = err?.response?.status;

    if (status === 401) {
      Alert.alert("Login Failed", "Invalid email or password");
    } else if (status === 404) {
      Alert.alert("Error", "API not found");
    } else if (!err.response) {
      Alert.alert("Network Error", "Check your server or internet");
    } else {
      Alert.alert("Error", "Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>

      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#94a3b8"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Enter your password"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
         onPress={() => navigation.navigate("ForgotPassword")}
>
          <Text style={styles.forgot}>Forgot Password?</Text>
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
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
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
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  forgot: {
  color: "#60a5fa",
  textAlign: "center",
  marginTop: 15,
  },
});