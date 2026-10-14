import React, { useEffect, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../src/service/api";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

function RootNavigator() {
  const { isDarkMode, colors } = useTheme();
  const router = useRouter();
  const autoLoginChecked = useRef(false);

  useEffect(() => {
    if (autoLoginChecked.current) return;
    autoLoginChecked.current = true;

    let active = true;
    const restoreSession = async () => {
      try {
        const [token, rememberMe] = await Promise.all([
          AsyncStorage.getItem("authToken"),
          AsyncStorage.getItem("rememberMe"),
        ]);

        if (!active || !token || rememberMe !== "true") return;

        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        await api.get("/groups/me");

        if (active) {
          router.replace("/(tabs)/group");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem("authToken");
          await AsyncStorage.removeItem("rememberMe");
          delete api.defaults.headers.common.Authorization;
        }
      }
    };

    restoreSession();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}