import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";

import { getTopSellingList } from "../components/topSellingService";

export default function TopSellingScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getTopSellingList();
    setData(res);
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Top Selling Products</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.sku}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: `http://10.0.2.2:8080${item.imageUrl}`,
              }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.productName}</Text>
              <Text style={styles.sub}>
                {item.attributes} • {item.sku}
              </Text>
            </View>

            <Text style={styles.qty}>
              {item.quantitySold} sold
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },

  header: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },

  name: {
    color: "#fff",
    fontWeight: "bold",
  },

  sub: {
    color: "#94a3b8",
    fontSize: 12,
  },

  qty: {
    color: "#22c55e",
    fontWeight: "bold",
  },
});