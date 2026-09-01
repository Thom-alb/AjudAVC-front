import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FabGlobal from "../../components/fabGlobal";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 60 + insets.bottom;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        initialRouteName="group"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#0a3453",
          tabBarInactiveTintColor: "#8a9ab1",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E2E8F0",
            height: tabBarHeight,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            paddingTop: 8,
          },
        }}
      >
        <Tabs.Screen
          name="group"
          options={{
            title: "Grupo",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="rotina"
          options={{
            title: "Rotina",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="progresso"
          options={{
            title: "Progresso",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* FabGlobal posicionado sobre a aplicação */}
      <FabGlobal />
    </View>
  );
}
