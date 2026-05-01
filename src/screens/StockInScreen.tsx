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
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  getAllProducts,
  getProductAttributes,
  getAttributeValues,
  stockIn,
} from "../api/api";

export default function StockInScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [attributeValues, setAttributeValues] = useState<any>({});
  const [selectedValues, setSelectedValues] = useState<any>({});

  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");

  // ✅ DATE PICKER STATES
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const [formData, setFormData] = useState<any>({
    productId: null,
    attributeValueIds: [],
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    taxPerUnit: "",
    transportPerUnit: "",
    purchaseDate: "",
    supplierName: "",
    remarks: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getAllProducts();
      console.log("Backend API RESPONSE Products :", res);
      setProducts(res || []);
    } catch {
      Alert.alert("Error", "Failed to load products");
    }
  };

  const handleProductSelect = async (productId: number, name: string) => {
    setFormData({ ...formData, productId });
    setSelectedProductName(name);
    setShowProductDropdown(false);

    setAttributes([]);
    setAttributeValues({});
    setSelectedValues({});

    try {
      const attrs = await getProductAttributes(productId);
      setAttributes(attrs);

      const valuesMap: any = {};

      for (const attr of attrs) {
        const values = await getAttributeValues(attr.id);
        valuesMap[attr.id] = values;
      }

      setAttributeValues(valuesMap);
    } catch {
      Alert.alert("Error", "Failed to load attributes");
    }
  };

  const handleAttributeSelect = (attrId: number, valueId: number) => {
    const updated = {
      ...selectedValues,
      [attrId]: valueId,
    };

    setSelectedValues(updated);

    const ids = Object.values(updated);
    setFormData({ ...formData, attributeValueIds: ids });
  };

  const handleSubmit = async () => {
    if (!formData.productId) {
      return Alert.alert("Error", "Select product");
    }

    if (formData.attributeValueIds.length !== attributes.length) {
      return Alert.alert("Error", "Select all attribute values");
    }

    if (!formData.quantity || !formData.costPrice || !formData.sellingPrice) {
      return Alert.alert("Error", "Fill required fields");
    }

    try {
      await stockIn(formData);
      Alert.alert("Success", "Stock added successfully");
    } catch {
      Alert.alert("Error", "Failed to add stock");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Stock In</Text>

        {/* 🔷 Product Dropdown */}
        <Text style={styles.label}>Select Product *</Text>

        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowProductDropdown(!showProductDropdown)}
        >
          <Text style={styles.text}>
            {selectedProductName || "Select Product"}
          </Text>
        </TouchableOpacity>

        {/* 🔷 Attributes */}
        {attributes.map((attr) => (
          <View key={attr.id}>
            <Text style={styles.label}>{attr.name} *</Text>

            {attributeValues[attr.id]?.map((v: any) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.option,
                  selectedValues[attr.id] === v.id && styles.selected,
                ]}
                onPress={() =>
                  handleAttributeSelect(attr.id, v.id)
                }
              >
                <Text style={styles.text}>{v.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* 🔷 Inputs (EXCEPT DATE) */}
        {[
          "quantity",
          "costPrice",
          "sellingPrice",
          "taxPerUnit",
          "transportPerUnit",
          "supplierName",
          "remarks",
        ].map((field) => (
          <TextInput
            key={field}
            placeholder={field}
            placeholderTextColor="#94a3b8"
            value={formData[field]}
            onChangeText={(t) =>
              setFormData({ ...formData, [field]: t })
            }
            style={styles.input}
          />
        ))}

        {/* ✅ DATE PICKER FIELD */}
        <Text style={styles.label}>Purchase Date *</Text>

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: "#fff" }}>
            {formData.purchaseDate || "Select Date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);

              if (selectedDate) {
                setDate(selectedDate);

                const formatted = selectedDate
                  .toISOString()
                  .split("T")[0];

                setFormData({
                  ...formData,
                  purchaseDate: formatted,
                });
              }
            }}
          />
        )}

        {/* 🔷 Submit */}
        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Save Stock</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 🔥 FLOATING DROPDOWN */}
      {showProductDropdown && (
        <View style={styles.dropdownWrapper}>
          <ScrollView style={styles.dropdownList}>
            {products.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.option}
                onPress={() =>
                  handleProductSelect(p.id, p.name)
                }
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
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 12,
  },

  label: {
    color: "#94a3b8",
    marginTop: 10,
  },

  dropdown: {
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#334155",
  },

  dropdownWrapper: {
    position: "absolute",
    top: 110,
    left: 16,
    right: 16,
    zIndex: 1000,
  },

  dropdownList: {
    backgroundColor: "#1e293b",
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#334155",
  },

  option: {
    backgroundColor: "#334155",
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
  },

  selected: {
    backgroundColor: "#3b82f6",
  },

  text: {
    color: "#ffffff",
    fontSize: 14,
  },

  input: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },

  btn: {
    backgroundColor: "#22c55e",
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
  },
});