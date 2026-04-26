import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  getAllProducts,
  getTopSellingProducts,
  getLowStockProducts,
  getDailyReport,
} from "../api/api";

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);

  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [topSelling, setTopSelling] = useState<any[]>([]);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const today = new Date().toISOString().split("T")[0];

      // last 7 days
      const endDate = today;
      const startDateObj = new Date();
      startDateObj.setDate(startDateObj.getDate() - 7);
      const startDate = startDateObj.toISOString().split("T")[0];

      const [productsRes, lowStockRes, topSellingRes, dailyRes] =
        await Promise.all([
          getAllProducts(),
          getLowStockProducts(),
          getTopSellingProducts(startDate, endDate),
          getDailyReport(today),
        ]);

      // Set data
      setTotalProducts(productsRes.data.length);
      setLowStock(lowStockRes);
      setTopSelling(topSellingRes);

      const profitValue =
        (dailyRes.totalProfit || 0) - (dailyRes.totalLoss || 0);

      setProfit(profitValue);
    } catch (error) {
      console.log("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loading UI
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 10 }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Welcome Back 👋</Text>

      {/* Cards */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Products</Text>
          <Text style={styles.cardValue}>{totalProducts}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Low Stock</Text>
          <Text style={[styles.cardValue, { color: "#f87171" }]}>
            {lowStock.length}
          </Text>
        </View>
      </View>

      {/* Profit */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today Profit / Loss</Text>

        <View style={styles.profitBox}>
          <Text
            style={[
              styles.profitValue,
              { color: profit >= 0 ? "#22c55e" : "#ef4444" },
            ]}
          >
            ₹{profit}
          </Text>

          <Text style={styles.profitText}>
            {profit >= 0 ? "Profit Today" : "Loss Today"}
          </Text>
        </View>
      </View>

      {/* Top Selling */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Selling</Text>

        {topSelling.length === 0 ? (
          <Text style={styles.emptyText}>No data available</Text>
        ) : (
          topSelling.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemValue}>
                {item.quantitySold} sold
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Low Stock */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Low Stock ⚠️</Text>

        {lowStock.length === 0 ? (
          <Text style={styles.emptyText}>No low stock items</Text>
        ) : (
          lowStock.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={[styles.itemValue, { color: "#f87171" }]}>
                {item.stockQty} left
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>+ Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Stock In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Stock Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },

  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
  },

  cardTitle: {
    color: "#94a3b8",
    fontSize: 14,
  },

  cardValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  profitBox: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  profitValue: {
    fontSize: 24,
    fontWeight: "bold",
  },

  profitText: {
    color: "#94a3b8",
  },

  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },

  itemName: {
    color: "#fff",
  },

  itemValue: {
    color: "#38bdf8",
  },

  emptyText: {
    color: "#94a3b8",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    backgroundColor: "#3b82f6",
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});