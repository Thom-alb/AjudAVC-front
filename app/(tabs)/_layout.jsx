import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FabGlobal from "../../components/fabGlobal";
import { useTheme } from "../../contexts/ThemeContext";
import Colors from "../../constants/Colors"; 

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme(); 
  
  // Determina o tema ativo de forma simples
  const activeTheme = theme === "dark" ? "dark" : "light";
  
  // Busca a paleta de cores direto do objeto do Colors.ts
  const currentColors = Colors[activeTheme] || {};
  const tabBarHeight = 60 + insets.bottom;

  // Fallbacks seguros de cores caso alguma chave não esteja mapeada no seu Colors.ts
  const activeColor = currentColors.tabIconSelected || currentColors.tint || "#0a3453";
  const inactiveColor = currentColors.tabIconDefault || "#8a9ab1";
  const bgColor = currentColors.background || "#FFFFFF";
  const borderColor = currentColors.border || "#E2E8F0";
  const tabBgColor = currentColors.tabBar || currentColors.background || "#FFFFFF";

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
