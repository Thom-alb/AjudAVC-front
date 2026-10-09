import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../../src/service/api";
import { useTheme } from "../../contexts/ThemeContext";

const USER_CACHE_KEYS = ["userData", "user", "userName", "userEmail", "authProvider", "provider", "activeGroupId", "authToken"];

export default function PerfilScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    let profile = null;

    try {
      const response = await api.get("/users/me");
      profile = response.data;
    } catch {
      try {
        const response = await api.get("/auth/me");
        profile = response.data;
      } catch {
        // Use cached profile fields when the API doesn't expose a profile endpoint.
      }
    }

    try {
      const entries = await AsyncStorage.multiGet(USER_CACHE_KEYS);
      const stored = Object.fromEntries(entries);
      let cachedUser = {};
      try {
        cachedUser = stored.userData ? JSON.parse(stored.userData) : stored.user ? JSON.parse(stored.user) : {};
      } catch {
        cachedUser = {};
      }

      setUser({
        ...cachedUser,
        ...(profile || {}),
        name: profile?.name || profile?.fullName || cachedUser.name || stored.userName || "Não informado",
        email: profile?.email || cachedUser.email || stored.userEmail || "Não informado",
        provider: profile?.provider || profile?.authProvider || cachedUser.provider || stored.authProvider || stored.provider || "Não informado",
      });
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setUser(profile || { name: "Não informado", email: "Não informado", provider: "Não informado" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Deseja realmente encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            const keys = await AsyncStorage.getAllKeys();
            const sensitiveKeys = keys.filter((key) =>
              /token|auth|user(id|data|name|email)?|provider|groupid|invitecode/i.test(key)
            );
            await AsyncStorage.multiRemove([...new Set([...sensitiveKeys, ...USER_CACHE_KEYS])]);
          } catch (error) {
            console.error("Erro ao limpar sessão:", error);
          } finally {
            setLoggingOut(false);
            router.replace("/");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 22, flexGrow: 1 }}>
        <View style={{ marginTop: 18, marginBottom: 24 }}>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: "800" }}>Meu Perfil</Text>
          <Text style={{ color: colors.muted, fontSize: 15, marginTop: 6 }}>Dados da conta conectada</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 20 }}>
            <View style={{ alignSelf: "center", width: 82, height: 82, borderRadius: 41, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
              <Ionicons name="person" size={42} color={colors.primary} />
            </View>
            <ProfileField label="Nome" value={user?.name} colors={colors} icon="person-outline" />
            <ProfileField label="E-mail" value={user?.email} colors={colors} icon="mail-outline" />
            <ProfileField label="Origem da conta" value={user?.provider} colors={colors} icon="shield-checkmark-outline" />
            <TouchableOpacity
              onPress={handleLogout}
              disabled={loggingOut}
              style={{ marginTop: 28, backgroundColor: "#B91C1C", paddingVertical: 15, borderRadius: 12, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 10 }}
            >
              {loggingOut ? <ActivityIndicator color="#FFFFFF" /> : <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />}
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>{loggingOut ? "Saindo..." : "Sair da Conta"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileField({ label, value, colors, icon }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", textTransform: "uppercase", marginBottom: 7 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text selectable style={{ flex: 1, color: colors.text, fontSize: 16 }}>{value || "Não informado"}</Text>
      </View>
      <View style={{ height: 1, backgroundColor: colors.border, marginTop: 14 }} />
    </View>
  );
}
