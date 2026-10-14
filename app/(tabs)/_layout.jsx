import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FabGlobal from "../../components/fabGlobal";
import { useTheme } from "../../contexts/ThemeContext";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  // O ThemeContext já entrega a paleta ativa em `colors`
  const { colors } = useTheme();

  const tabBarHeight = 60 + insets.bottom;

  const activeColor = colors.tabIconSelected || colors.tint;
  const inactiveColor = colors.tabIconDefault;
  const bgColor = colors.background;
  const borderColor = colors.border;
  const tabBgColor = colors.tabBar || colors.background;

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <Tabs
        initialRouteName="group"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: inactiveColor,
          tabBarStyle: {
            backgroundColor: tabBgColor,
            borderTopWidth: 1,
            borderTopColor: borderColor,
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
            tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="rotina"
          options={{
            title: "Rotina",
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="progresso"
          options={{
            title: "Progresso",
            tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />
      </Tabs>
      <FabGlobal />
    </View>
  );
}