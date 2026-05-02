import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { getMonthlyReport } from "../api/api";
import { getTotalProducts } from "../components/productService";
import { getLowStockList } from "../components/lowStockService";
import { getTopSellingList } from "../components/topSellingService";
import { Image } from "react-native";

const BASE_URL_Images = "http://10.0.2.2:8080";
const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen({ navigation }: any) {
  const [data, setData] = useState<any>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [topSelling, setTopSelling] = useState<any[]>([]);
  const [showAllTop, setShowAllTop] = useState(false); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const now = new Date();

      const report = await getMonthlyReport(
        now.getFullYear(),
        now.getMonth() + 1
      );

      const count = await getTotalProducts();
      setTotalProducts(count);

      const topSellingRes = await getTopSellingList();
      setTopSelling(topSellingRes);

      const lowStockRes = await getLowStockList();
      setLowStock(lowStockRes);

      setData({
        totalSalesQty: report.totalQuantitySold || 0,
        totalProfit: report.totalProfit || 0,
        totalLoss: report.totalLoss || 0,
        salesOverview:
          report.productSales?.map((p: any) => ({
            name: p.productName,
            qty: p.quantity,
          })) || [],
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!data) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  const total = data.totalProfit + data.totalLoss;

  const profitPercent =
    total === 0 ? 0 : (data.totalProfit / total) * 100;

  const lossPercent =
    total === 0 ? 0 : (data.totalLoss / total) * 100;

  const pieData = [
    {
      name: `Profit ${profitPercent.toFixed(1)}%`,
      population: profitPercent,
      color: "#22c55e",
      legendFontColor: "#fff",
      legendFontSize: 12,
    },
    {
      name: `Loss ${lossPercent.toFixed(1)}%`,
      population: lossPercent === 0 ? 1 : lossPercent,
      color: lossPercent === 0 ? "#334155" : "#ef4444",
      legendFontColor: "#fff",
      legendFontSize: 12,
    },
  ];

  const barData = {
    labels: data.salesOverview.map((i: any) =>
      i.name.substring(0, 6)
    ),
    datasets: [
      {
        data: data.salesOverview.map((i: any) => i.qty),
      },
    ],
  };

  const visibleTopSelling = showAllTop
    ? topSelling
    : topSelling.slice(0, 4); // ✅ FIXED

     return (
       <ScrollView style={styles.container}>
         <Text style={styles.title}>Dashboard</Text>
          <View style={styles.headerRow}>
         <Text style={styles.title}>Dashboard</Text>

         <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.profileBtn}
          >
          <Text style={styles.profileText}>👤</Text>
          </TouchableOpacity>
         </View>
      {/* 🔷 Cards */}
      <View style={styles.cardRow}>
        <Card title="Total Products" value={totalProducts} />
        <Card title="Sales (This Month)" value={data.totalSalesQty} />
      </View>

      {/* 🔷 Profit vs Loss */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Profit vs Loss</Text>

        <PieChart
          data={pieData}
          width={screenWidth - 32}
          height={200}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          absolute
        />
      </View>

      {/* 🔷 Sales Overview */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sales Overview</Text>

        <BarChart
          data={barData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#0f172a",
            backgroundGradientTo: "#0f172a",
            decimalPlaces: 0,
            color: (opacity = 1) =>
              `rgba(59,130,246,${opacity})`,
            labelColor: () => "#cbd5f5",
            propsForBackgroundLines: {
              stroke: "#1e293b",
              strokeDasharray: "",
            },
            propsForLabels: {
              fontSize: 10,
            },
            fillShadowGradient: "#3b82f6",
            fillShadowGradientOpacity: 1,
          }}
          fromZero
          withInnerLines={true}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          showValuesOnTopOfBars
          style={{
            borderRadius: 12,
            marginVertical: 8,
          }}
          yAxisLabel=""
          yAxisSuffix=""
        />
      </View>

      {/* 🔷 Low Stock */}
        <View style={styles.card}>
          <       Text style={styles.cardTitle}>Low Stock</Text>

           {lowStock.length === 0 ? (
          <Text style={{ color: "#94a3b8" }}>
           No low stock items
           </Text>
           ) : (
           <>
         {lowStock.slice(0, 2).map((item: any, index: number) => (
            <View key={index} style={{ marginBottom: 12 }}>
             <View style={styles.row}>
             <Text style={styles.productName}>
              {item.productName}
              </Text>
             <Text style={styles.qty}>
              Remaining: {item.stockQty}
             </Text>
             </View>

               <View style={styles.progressBg}>
                 <View
                  style={[
                   styles.progressFillLow,
                   {
                  width: `${Math.min(
                    item.stockQty * 10,
                    100
                  )}%`,
                },
              ]}
            />
          </View>
        </View>
      ))}

      {/* ✅ View All button */}
      {lowStock.length > 2 && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("LowStockScreen", {
              data: lowStock,
            })
          }
        >
          <Text style={styles.showAll}>View All →</Text>
        </TouchableOpacity>
      )}
    </>
  )}
</View>

      {/* 🔷 Top Selling */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Selling</Text>

        {topSelling.length === 0 ? (
          <Text style={{ color: "#94a3b8" }}>No data</Text>
        ) : (
          <>
            {visibleTopSelling.map((item: any, index: number) => {

            return (
             <View key={index} style={styles.topItem}>
              <Image
               source={{ uri: `${BASE_URL_Images}${item.imageUrl}` }}
               style={styles.image}
               />

               <View style={{ flex: 1 }}>
               <Text style={styles.productName}>
               {item.productName}
               </Text>

                <Text style={[styles.qty, { color: "#22c55e" }]}>
                Sold: {item.quantitySold}
               </Text>
               </View>
               </View>
               );
            })}

            {topSelling.length > 4 && (
              <TouchableOpacity
                 onPress={() =>
                   navigation.navigate("TopSellingScreen", {
                   data: topSelling,
                  })
                  }
                 >
                 <Text style={styles.showAll}>View All →</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* 🔷 Actions */}
      <View style={styles.actions}>
        <ActionBtn
          title="Add Product"
          onPress={() => navigation.navigate("ProductList")}
        />
        <ActionBtn
          title="Stock In"
          onPress={() => navigation.navigate("StockList")}
        />
        <ActionBtn
          title="Stock Out"
          onPress={() => navigation.navigate("StockOutList")}
        />
      </View>
    </ScrollView>
  );
}

/* 🔷 Card */
const Card = ({ title, value }: any) => (
  <View style={styles.cardSmall}>
    <Text style={styles.cardLabel}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

/* 🔷 Action Button */
const ActionBtn = ({ title, onPress }: any) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <Text style={styles.actionText}>{title}</Text>
  </TouchableOpacity>
);

/* 🔷 Styles */
const styles = StyleSheet.create({
  progressFillTop: {
    backgroundColor: "#22c55e",
    height: 6,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },
  loading: {
    color: "#fff",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardSmall: {
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 10,
    width: "48%",
  },
  cardLabel: {
    color: "#94a3b8",
    fontSize: 12,
  },
  cardValue: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 8,
    width: "30%",
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
  },
  card: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    color: "#fff",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    color: "#fff",
    fontSize: 14,
  },
  qty: {
    color: "#94a3b8",
    fontSize: 12,
  },
  progressBg: {
    backgroundColor: "#334155",
    height: 6,
    borderRadius: 10,
    marginTop: 5,
  },
  progressFillLow: {
    backgroundColor: "#ef4444",
    height: 6,
    borderRadius: 10,
  },
  topItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
  width: 45,
  height: 45,
  borderRadius: 8,
  marginRight: 10,
  backgroundColor: "#1e293b",
  },
  imageBox: {
    width: 45,
    height: 45,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
},

  profileBtn: {
   backgroundColor: "#1e293b",
   padding: 10,
   borderRadius: 20,
  },

  profileText: {
   fontSize: 18,
  },
  showAll: {
    color: "#3b82f6",
    marginTop: 8,
    fontSize: 12,
  },
});

const chartConfig = {
  backgroundGradientFrom: "#0f172a",
  backgroundGradientTo: "#0f172a",
  color: () => "#3b82f6",
  labelColor: () => "#94a3b8",
};