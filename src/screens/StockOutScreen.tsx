import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

import {
  getAllProducts,
  getVariantsByProduct,
  stockOut,
} from "../api/api";

export default function StockOutScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const [form, setForm] = useState({
    quantity: "",
    finalPrice: "",
    remarks: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await getAllProducts();
    setProducts(res || []);
  };

  const handleProductSelect = async (p: any) => {
    setSelectedProduct(p);
    setShowProductDropdown(false);

    setSelectedVariant(null);
    setVariants([]);

    const res = await getVariantsByProduct(p.id);
    setVariants(res || []);
  };

  const handleVariantSelect = (v: any) => {
    setSelectedVariant(v);
    setShowVariantDropdown(false);

    setForm({
      ...form,
      finalPrice: String(v.sellingPrice),
    });
  };

  const handleSubmit = async () => {
    if (!selectedVariant) {
      return Alert.alert("Error", "Select variant");
    }

    try {
      const payload = {
        sku: selectedVariant.sku,
        quantity: Number(form.quantity),
        saleDate: new Date().toISOString(),
        remarks: form.remarks,
        finalPrice: Number(form.finalPrice),
      };

      await stockOut(payload);

      Alert.alert("Success", "Stock out recorded");
    } catch {
      Alert.alert("Error", "Failed");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Stock Out</Text>

        {/* Product */}
        <Text style={styles.label}>Product</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowProductDropdown(!showProductDropdown)}
        >
          <Text style={styles.text}>
            {selectedProduct?.name || "Select Product"}
          </Text>
        </TouchableOpacity>

        {/* Variant */}
        <Text style={styles.label}>Variant</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowVariantDropdown(!showVariantDropdown)}
        >
          <Text style={styles.text}>
            {selectedVariant?.variantLabel || "Select Variant"}
          </Text>
        </TouchableOpacity>

        {showVariantDropdown && (
          <View style={styles.dropdownWrapper}>
            <ScrollView style={styles.dropdownList}>
              {variants.map((v) => (
                <TouchableOpacity
                  key={v.variantId}
                  style={styles.option}
                  onPress={() => handleVariantSelect(v)}
                >
                  <Text style={styles.text}>
                    {v.variantLabel} ({v.sku})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* SKU */}
        <Text style={styles.label}>SKU</Text>
        <TextInput
          value={selectedVariant?.sku || ""}
          editable={false}
          style={styles.input}
        />

        {/* Stock */}
        <Text style={styles.label}>Available Stock</Text>
        <TextInput
          value={String(selectedVariant?.stockQty || "")}
          editable={false}
          style={styles.input}
        />

        {/* Final Price */}
        <Text style={styles.label}>Final Price</Text>
        <TextInput
          value={form.finalPrice}
          onChangeText={(t) => setForm({ ...form, finalPrice: t })}
          style={styles.input}
          keyboardType="numeric"
        />

        {/* Quantity */}
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          value={form.quantity}
          onChangeText={(t) => setForm({ ...form, quantity: t })}
          style={styles.input}
          keyboardType="numeric"
        />

        {/* Remarks */}
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          value={form.remarks}
          onChangeText={(t) => setForm({ ...form, remarks: t })}
          style={styles.input}
        />

        {/* Submit */}
        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Record Stock Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ✅ FLOATING PRODUCT DROPDOWN */}
      {showProductDropdown && (
        <View style={styles.dropdownWrapper}>
          <ScrollView style={styles.dropdownList}>
            {products.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.option}
                onPress={() => handleProductSelect(p)}
              >
                <Text style={styles.text}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", padding: 16 },

  title: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 16,
  },

  label: { color: "#94a3b8", marginTop: 10 },

  dropdown: {
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },

  dropdownWrapper: {
    position: "absolute",
    top: 120,
    left: 16,
    right: 16,
    zIndex: 1000,
  },

  dropdownList: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    maxHeight: 200,
  },

  option: {
    padding: 10,
  },

  text: { color: "#fff" },

  input: {
    backgroundColor: "#0f172a",
    color: "#fff",
    padding: 10,
    marginTop: 6,
    borderRadius: 8,
  },

  btn: {
    backgroundColor: "#ef4444",
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: { color: "#fff" },
});