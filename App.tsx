import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import TopSellingScreen from "./src/screens/TopSellingScreen"
import LowStockScreen from "./src/screens/LowStockScreen"
import ProductListScreen from "./src/screens/ProductListScreen"
import AddProductScreen from "./src/screens/AddProductScreen"


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="TopSellingScreen" component={TopSellingScreen} />
        <Stack.Screen name="LowStockScreen" component={LowStockScreen}/>
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}