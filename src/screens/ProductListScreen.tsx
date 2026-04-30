import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { getAllProducts } from "../api/api";

const BASE_URL = "http://10.0.2.2:8080";

export default function ProductListScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>

      {/* 🔷 Add Product Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddProduct")}
      >
        <Text style={styles.addText}>+ Add Product</Text>
      </TouchableOpacity>

      {/* 🔷 Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={{ uri: `${BASE_URL}${item.imageUrl}` }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.productName}</Text>
              <Text style={styles.sub}>{item.categoryName}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", padding: 16 },
  title: { color: "#fff", fontSize: 22, marginBottom: 10 },

  addBtn: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  addText: { color: "#fff" },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#0f172a",
    padding: 10,
    borderRadius: 10,
  },
  image: { width: 45, height: 45, borderRadius: 8, marginRight: 10 },
  name: { color: "#fff", fontSize: 14 },
  sub: { color: "#94a3b8", fontSize: 12 },
});