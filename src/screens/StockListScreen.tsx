import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { getRecentStockIns } from "../api/api";

const BASE_URL = "http://10.0.2.2:8080";

export default function StockListScreen({ navigation }: any) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await getRecentStockIns();
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
        <Text style={styles.qty}>Qty: {item.quantityAdded}</Text>
        <Text style={styles.meta}>
          {item.supplierName || "No Supplier"}
        </Text>
        <Text style={styles.date}>{item.stockInDate}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔷 Header */}
        <View style={styles.header}>
           <Text style={styles.title}>Stock In</Text>
             <TouchableOpacity
             style={styles.addBtn}
             onPress={() => navigation.navigate("StockIn")}
             >
            <Text style={styles.btnText}>+ Add Stock</Text>
           </TouchableOpacity>
    </View>

      {/* 🔷 List */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },

  header: {
  marginTop: 20,              // ✅ adds space at top
  marginBottom: 20,           // ✅ gap before list
},

title: {
  color: "#fff",
  fontSize: 22,
  fontWeight: "bold",
  marginBottom: 12,           // ✅ pushes button down
},

  addBtn: {
  backgroundColor: "#3b82f6",
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: "center",
  elevation: 4,               // ✅ makes button stand out
 },

  btnText: {
  color: "#fff",
  fontWeight: "600",
  },

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

  name: {
    color: "#fff",
    fontWeight: "bold",
  },

  sku: {
    color: "#94a3b8",
    fontSize: 12,
  },

  qty: {
    color: "#22c55e",
    fontWeight: "bold",
  },

  meta: {
    color: "#94a3b8",
    fontSize: 12,
  },

  date: {
    color: "#64748b",
    fontSize: 12,
  },
});