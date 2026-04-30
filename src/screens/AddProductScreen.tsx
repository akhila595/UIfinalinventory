import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import {
  getBrands,
  getCategories,
  getAttributes,
  createProduct,
  uploadProductImage,
} from "../api/api";

const BASE_URL = "http://10.0.2.2:8080";

export default function AddProductScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    brandId: null as number | null,
    categoryId: null as number | null,
    attributeIds: [] as number[],
  });

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // 🔹 Load master data
  useEffect(() => {
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const [b, c, a] = await Promise.all([
        getBrands(),
        getCategories(),
        getAttributes(),
      ]);

      setBrands(Array.isArray(b) ? b : []);
      setCategories(Array.isArray(c) ? c : []);
      setAttributes(Array.isArray(a) ? a : []);
    } catch (e) {
      console.log("META ERROR:", e);
      Alert.alert("Error", "Failed to load dropdown data");
    }
  };

  // 🔹 Image picker + upload
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const file = result.assets[0];

      const formDataUpload = new FormData();
      formDataUpload.append("file", {
        uri: file.uri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      try {
        setUploading(true);

        const res = await uploadProductImage(formDataUpload);

        setFormData((prev) => ({
          ...prev,
          imageUrl: res.tempPath,
        }));

        Alert.alert("Success", "Image uploaded");
      } catch (e) {
        console.log("UPLOAD ERROR:", e);
        Alert.alert("Error", "Image upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  // 🔹 Toggle attributes
  const toggleAttribute = (id: number) => {
    setFormData((prev) => {
      const exists = prev.attributeIds.includes(id);

      return {
        ...prev,
        attributeIds: exists
          ? prev.attributeIds.filter((a) => a !== id)
          : [...prev.attributeIds, id],
      };
    });
  };

  // 🔹 Save product
  const handleSave = async () => {
    if (!formData.name)
      return Alert.alert("Error", "Product name required");

    if (!formData.brandId)
      return Alert.alert("Error", "Select brand");

    if (!formData.categoryId)
      return Alert.alert("Error", "Select category");

    if (!formData.imageUrl)
      return Alert.alert("Error", "Upload image");

    try {
      await createProduct(formData);

      Alert.alert("Success", "Product created");
      navigation.goBack();
    } catch (e) {
      console.log("SAVE ERROR:", e);
      Alert.alert("Error", "Failed to create product");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      {/* 🔹 Product Name */}
      <Text style={styles.label}>Product Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        placeholderTextColor="#94a3b8"
        value={formData.name}
        onChangeText={(text) =>
          setFormData({ ...formData, name: text })
        }
      />

      {/* 🔹 Brand */}
      <Text style={styles.label}>Select Brand *</Text>
      {Array.isArray(brands) &&
        brands.map((b) => (
          <TouchableOpacity
            key={b.id}
            style={[
              styles.option,
              formData.brandId === b.id && styles.selected,
            ]}
            onPress={() =>
              setFormData({ ...formData, brandId: b.id })
            }
          >
            <Text style={styles.optionText}>{b.brand}</Text>
          </TouchableOpacity>
        ))}

      {/* 🔹 Category */}
      <Text style={styles.label}>Select Category *</Text>
      {Array.isArray(categories) &&
        categories.map((c) => (
          <TouchableOpacity
            key={c.categoryId}
            style={[
              styles.option,
              formData.categoryId === c.categoryId &&
                styles.selected,
            ]}
            onPress={() =>
              setFormData({
                ...formData,
                categoryId: c.categoryId,
              })
            }
          >
            <Text style={styles.optionText}>
              {c.categoryName}
            </Text>
          </TouchableOpacity>
        ))}

      {/* 🔹 Attributes */}
      <Text style={styles.label}>Attributes</Text>
      <View style={styles.attrWrap}>
        {Array.isArray(attributes) &&
          attributes.map((a) => (
            <TouchableOpacity
              key={a.id}
              style={[
                styles.attrChip,
                formData.attributeIds.includes(a.id) &&
                  styles.attrSelected,
              ]}
              onPress={() => toggleAttribute(a.id)}
            >
              <Text style={styles.attrText}>{a.name}</Text>
            </TouchableOpacity>
          ))}
      </View>

      {/* 🔹 Upload Image */}
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        <Text style={styles.btnText}>
          {uploading ? "Uploading..." : "Upload Image *"}
        </Text>
      </TouchableOpacity>

      {formData.imageUrl ? (
        <Image
          source={{ uri: `${BASE_URL}${formData.imageUrl}` }}
          style={styles.preview}
        />
      ) : null}

      {/* 🔹 Save */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.btnText}>Save Product</Text>
      </TouchableOpacity>
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
  label: {
    color: "#94a3b8",
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#0f172a",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  option: {
    padding: 10,
    backgroundColor: "#0f172a",
    borderRadius: 8,
    marginTop: 6,
  },
  selected: {
    backgroundColor: "#3b82f6",
  },
  optionText: {
    color: "#fff",
  },
  attrWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  attrChip: {
    padding: 8,
    backgroundColor: "#0f172a",
    borderRadius: 20,
    margin: 4,
  },
  attrSelected: {
    backgroundColor: "#22c55e",
  },
  attrText: {
    color: "#fff",
    fontSize: 12,
  },
  uploadBtn: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  saveBtn: {
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
});