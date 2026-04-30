import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function LowStockScreen({ route }: any) {
  const { data } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Low Stock Products</Text>

      {data.map((item: any, index: number) => (
        <View key={index} style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>
              {item.productName}
            </Text>
            <Text style={styles.qty}>
              Remaining: {item.stockQty}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 16,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  name: {
    color: "#fff",
    fontSize: 14,
  },
  qty: {
    color: "#ef4444",
    fontSize: 12,
  },
});