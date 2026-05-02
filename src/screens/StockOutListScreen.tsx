import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { getRecentStockOuts } from "../api/api";

const BASE_URL = "http://10.0.2.2:8080";

export default function StockOutListScreen({ navigation }: any) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getRecentStockOuts();
      setData(res || []);
    } catch (e) {
      console.log(e);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `${BASE_URL}${item.imageUrl}` }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.productName}</Text>
        <Text style={styles.sku}>{item.sku}</Text>
        <Text style={styles.qty}>Removed: {item.quantityRemoved}</Text>
        <Text style={styles.date}>
          {new Date(item.stockOutDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Stock Out</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("StockOut")}
        >
          <Text style={styles.btnText}>+ Add Stock Out</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", padding: 16 },

  header: {
    marginTop: 20,
    marginBottom: 20,
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },

  addBtn: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: { color: "#fff", fontWeight: "600" },

  card: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },

  name: { color: "#fff", fontWeight: "bold" },
  sku: { color: "#94a3b8" },

  qty: {
    color: "#ef4444",
    fontWeight: "bold",
  },

  date: { color: "#64748b", fontSize: 12 },
});