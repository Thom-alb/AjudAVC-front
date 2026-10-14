import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../../src/service/api";
import Colors from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------
const APP_VERSION = "1.0.0";

// Enquanto o endpoint DELETE /user/{id} não estiver pronto no back-end,
// a exclusão é apenas simulada (log + espera). Troque para `false` para
// disparar a chamada real.
const SIMULATE_ACCOUNT_DELETION = true;

// Endpoints usados pela tela. Ajuste aqui caso a API use outros caminhos.
const ENDPOINTS = {
  profile: ["/users/me", "/auth/me"],
  user: (id) => `/user/${id}`,
  password: (id) => `/user/${id}/password`,
  logs: "/activity-logs/me",
};

const NOTIFICATIONS_KEY = "ajudavc_notifications";
const THEME_STORAGE_KEY = "ajudavc_theme";

const USER_CACHE_KEYS = [
  "userData",
  "user",
  "userName",
  "userEmail",
  "authProvider",
  "provider",
  "activeGroupId",
  "authToken",
];

// Chaves removidas no logout (além das varridas pelo padrão abaixo)
const SESSION_KEYS = ["authToken", "rememberMe", "activeGroupId", "userData", ...USER_CACHE_KEYS];
const SESSION_KEY_PATTERN = /token|auth|user(id|data|name|email)?|provider|groupid|invitecode/i;

// Preferências que sobrevivem ao logout
const PRESERVED_KEYS = [THEME_STORAGE_KEY, NOTIFICATIONS_KEY];

const MIN_BIRTH_DATE = new Date(1900, 0, 1);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const maskEmail = (email) => {
  if (!email || !email.includes("@")) return email || "Não informado";
  const [local, domain] = email.split("@");
  const visible = local.slice(0, Math.min(2, local.length));
  const hidden = "*".repeat(Math.max(local.length - visible.length, 3));
  return `${visible}${hidden}@${domain}`;
};

const formatPhone = (value) => {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const parseISODate = (value) => {
  if (!value) return null;
  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toISODate = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toBRDate = (date) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
};

const formatLogDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("pt-BR");
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Limpa a sessão preservando preferências (tema e notificações)
const clearSession = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const dynamicKeys = allKeys.filter((key) => SESSION_KEY_PATTERN.test(key));
    const toRemove = [...new Set([...SESSION_KEYS, ...dynamicKeys])].filter(
      (key) => !PRESERVED_KEYS.includes(key)
    );
    await AsyncStorage.multiRemove(toRemove);
  } catch (error) {
    console.error("Erro ao limpar sessão:", error);
  }
  delete api.defaults.headers.common.Authorization;
};

// ---------------------------------------------------------------------------
// Tela
// ---------------------------------------------------------------------------
export default function PerfilScreen() {
  const router = useRouter();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const dangerColor = isDarkMode ? "#F87171" : Colors.palette.danger;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revealEmail, setRevealEmail] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Modal: Dados Pessoais
  const [personalVisible, setPersonalVisible] = useState(false);
  const [draftEmail, setDraftEmail] = useState("");
  const [draftPhone, setDraftPhone] = useState("");
  const [draftBirth, setDraftBirth] = useState(null);
  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);

  // Modal: Alterar Senha
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Modal: Logs de Uso
  const [logsVisible, setLogsVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState("");

  // -------------------------------------------------------------------------
  // Carregamento do perfil (API -> fallback no cache do AsyncStorage)
  // -------------------------------------------------------------------------
  const loadProfile = useCallback(async () => {
    setLoading(true);
    let profile = null;

    for (const endpoint of ENDPOINTS.profile) {
      try {
        const response = await api.get(endpoint);
        profile = response.data;
        break;
      } catch {
        // tenta o próximo endpoint; se nenhum responder, usa o cache local
      }
    }

    try {
      const entries = await AsyncStorage.multiGet([...USER_CACHE_KEYS, NOTIFICATIONS_KEY]);
      const stored = Object.fromEntries(entries);

      let cachedUser = {};
      try {
        cachedUser = stored.userData ? JSON.parse(stored.userData) : stored.user ? JSON.parse(stored.user) : {};
      } catch {
        cachedUser = {};
      }

      const merged = {
        ...cachedUser,
        ...(profile || {}),
        id: profile?.id ?? profile?.userId ?? cachedUser.id ?? cachedUser.userId ?? null,
        name: profile?.name || profile?.fullName || cachedUser.name || stored.userName || "Não informado",
        email: profile?.email || cachedUser.email || stored.userEmail || "",
        phone: profile?.phone || cachedUser.phone || "",
        birthDate: profile?.birthDate || cachedUser.birthDate || null,
        provider:
          profile?.provider ||
          profile?.authProvider ||
          cachedUser.provider ||
          stored.authProvider ||
          stored.provider ||
          "",
      };

      setUser(merged);
      setNotificationsEnabled(stored[NOTIFICATIONS_KEY] !== "off");

      // Mantém o cache local atualizado quando a API respondeu
      if (profile) {
        AsyncStorage.setItem("userData", JSON.stringify(merged)).catch(() => {});
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setUser(profile || { name: "Não informado", email: "", provider: "" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const persistUser = async (nextUser) => {
    setUser(nextUser);
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(nextUser));
    } catch (error) {
      console.error("Erro ao salvar dados locais:", error);
    }
  };

  // -------------------------------------------------------------------------
  // Dados Pessoais
  // -------------------------------------------------------------------------
  const openPersonal = () => {
    setDraftEmail(user?.email || "");
    setDraftPhone(formatPhone(user?.phone));
    setDraftBirth(parseISODate(user?.birthDate));
    setShowBirthPicker(false);
    setPersonalVisible(true);
  };

  const savePersonal = async () => {
    const email = draftEmail.trim();
    if (!isValidEmail(email)) {
      Alert.alert("Atenção", "Informe um e-mail válido.");
      return;
    }

    const phoneDigits = draftPhone.replace(/\D/g, "");
    if (phoneDigits && phoneDigits.length < 10) {
      Alert.alert("Atenção", "Informe um telefone com DDD.");
      return;
    }

    const payload = {
      email,
      phone: phoneDigits || null,
      birthDate: toISODate(draftBirth),
    };

    setSavingPersonal(true);
    let synced = false;
    try {
      if (user?.id) {
        await api.put(ENDPOINTS.user(user.id), payload);
        synced = true;
      }
    } catch (error) {
      console.log("Falha ao sincronizar dados pessoais:", error.response?.data || error.message);
    }

    await persistUser({ ...user, ...payload });
    setSavingPersonal(false);
    setPersonalVisible(false);

    Alert.alert(
      synced ? "Dados atualizados" : "Salvo no aparelho",
      synced
        ? "Seus dados pessoais foram atualizados."
        : "Não foi possível sincronizar com o servidor agora. Os dados foram salvos apenas neste aparelho."
    );
  };

  // -------------------------------------------------------------------------
  // Alterar Senha
  // -------------------------------------------------------------------------
  const openPassword = () => {
    if (/google/i.test(user?.provider || "")) {
      Alert.alert(
        "Conta Google",
        "Sua conta usa o login do Google. A senha deve ser alterada diretamente na sua conta Google."
      );
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswords(false);
    setPasswordVisible(true);
  };

  const savePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Atenção", "A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Atenção", "A confirmação não coincide com a nova senha.");
      return;
    }
    if (newPassword === currentPassword) {
      Alert.alert("Atenção", "A nova senha deve ser diferente da atual.");
      return;
    }
    if (!user?.id) {
      Alert.alert("Erro", "Não foi possível identificar o usuário. Faça login novamente.");
      return;
    }

    setSavingPassword(true);
    try {
      await api.put(ENDPOINTS.password(user.id), { currentPassword, newPassword });
      setPasswordVisible(false);
      Alert.alert("Senha alterada", "Sua senha foi redefinida com sucesso.");
    } catch (error) {
      const message =
        error.response?.data?.message || "Não foi possível alterar a senha. Verifique a senha atual.";
      Alert.alert("Erro", message);
    } finally {
      setSavingPassword(false);
    }
  };

  // -------------------------------------------------------------------------
  // Excluir Conta (DELETE /user/{id} simulado)
  // -------------------------------------------------------------------------
  const performDeleteAccount = async () => {
    setDeleting(true);
    try {
      const endpoint = ENDPOINTS.user(user?.id ?? "me");
      if (SIMULATE_ACCOUNT_DELETION) {
        console.log(`[SIMULAÇÃO] DELETE ${endpoint}`);
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        await api.delete(endpoint);
      }
      await clearSession();
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.message || "Não foi possível excluir a conta.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir conta",
      "Esta ação apaga seus dados definitivamente e não pode ser desfeita. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir definitivamente", style: "destructive", onPress: performDeleteAccount },
      ]
    );
  };

  // -------------------------------------------------------------------------
  // Preferências
  // -------------------------------------------------------------------------
  const handleToggleNotifications = async (value) => {
    setNotificationsEnabled(value);
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, value ? "on" : "off");
    } catch (error) {
      console.error("Erro ao salvar preferência de notificações:", error);
    }
  };

  // -------------------------------------------------------------------------
  // Logs de uso
  // -------------------------------------------------------------------------
  const openLogs = async () => {
    setLogsVisible(true);
    setLogsLoading(true);
    setLogsError("");
    try {
      const response = await api.get(ENDPOINTS.logs);
      const data = Array.isArray(response.data) ? response.data : response.data?.content || [];
      setLogs(data);
    } catch (error) {
      setLogs([]);
      setLogsError(
        error.response?.status === 404
          ? "O histórico de atividades ainda não está disponível."
          : "Não foi possível carregar o histórico agora."
      );
    } finally {
      setLogsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Logout
  // -------------------------------------------------------------------------
  const handleLogout = () => {
    Vibration.vibrate(30);
    Alert.alert("Sair da conta", "Deseja realmente encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await clearSession();
          } finally {
            setLoggingOut(false);
            router.replace("/");
          }
        },
      },
    ]);
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  const displayEmail = user?.email
    ? revealEmail
      ? user.email
      : maskEmail(user.email)
    : "E-mail não informado";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
        ) : (
          <>
            {/* Categoria 1: Identificação */}
            <View style={styles.header}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={48} color={colors.primary} />
              </View>
              <Text style={styles.userName} numberOfLines={2}>
                {user?.name}
              </Text>
              <TouchableOpacity
                style={styles.emailRow}
                onPress={() => setRevealEmail((current) => !current)}
                activeOpacity={0.7}
                disabled={!user?.email}
              >
                <Text style={styles.userEmail} numberOfLines={1}>
                  {displayEmail}
                </Text>
                {!!user?.email && (
                  <Ionicons
                    name={revealEmail ? "eye-off-outline" : "eye-outline"}
                    size={16}
                    color={colors.muted}
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Categoria 2: Conta e Segurança */}
            <Section title="Conta e segurança" styles={styles}>
              <Row
                icon="person-circle-outline"
                label="Dados pessoais"
                subtitle="E-mail, telefone e nascimento"
                onPress={openPersonal}
                styles={styles}
                colors={colors}
              />
              <Row
                icon="key-outline"
                label="Alterar senha"
                subtitle="Redefina suas credenciais"
                onPress={openPassword}
                styles={styles}
                colors={colors}
              />
              <Row
                icon="trash-outline"
                label="Excluir conta"
                subtitle="Apaga seus dados definitivamente"
                onPress={handleDeleteAccount}
                disabled={deleting}
                danger
                dangerColor={dangerColor}
                right={deleting ? <ActivityIndicator color={dangerColor} /> : undefined}
                last
                styles={styles}
                colors={colors}
              />
            </Section>

            {/* Categoria 3: Preferências */}
            <Section title="Preferências" styles={styles}>
              <Row
                icon="notifications-outline"
                label="Notificações"
                subtitle="Alertas de medicação e avisos do grupo"
                right={
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={handleToggleNotifications}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="#FFFFFF"
                  />
                }
                styles={styles}
                colors={colors}
              />
              <Row
                icon={isDarkMode ? "moon" : "sunny-outline"}
                label="Aparência"
                subtitle={isDarkMode ? "Modo escuro ativado" : "Modo claro ativado"}
                onPress={toggleTheme}
                right={
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="#FFFFFF"
                  />
                }
                last
                styles={styles}
                colors={colors}
              />
            </Section>

            {/* Categoria 4: Histórico e Atividade */}
            <Section title="Histórico e atividade" styles={styles}>
              <Row
                icon="list-outline"
                label="Meus logs de uso"
                subtitle="Ações realizadas por você no grupo"
                onPress={openLogs}
                last
                styles={styles}
                colors={colors}
              />
            </Section>

            {/* Categoria 5: Suporte, Legal e Saída */}
            <Section title="Suporte e legal" styles={styles}>
              <Row
                icon="help-circle-outline"
                label="Central de ajuda / FAQ"
                onPress={() => router.push("/ajudaStart")}
                styles={styles}
                colors={colors}
              />
              <Row
                icon="document-text-outline"
                label="Termos de uso"
                onPress={() => router.push("/term")}
                last
                styles={styles}
                colors={colors}
              />
            </Section>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              disabled={loggingOut}
              activeOpacity={0.8}
            >
              {loggingOut ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
              )}
              <Text style={styles.logoutText}>{loggingOut ? "Saindo..." : "Sair (Log Out)"}</Text>
            </TouchableOpacity>

            <Text style={styles.version}>Versão v{APP_VERSION}</Text>
          </>
        )}
      </ScrollView>

      {/* Modal: Dados Pessoais */}
      <FormModal
        visible={personalVisible}
        title="Dados pessoais"
        onClose={() => setPersonalVisible(false)}
        styles={styles}
      >
        <Text style={styles.fieldLabel}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={draftEmail}
          onChangeText={setDraftEmail}
          placeholder="seuemail@exemplo.com"
          placeholderTextColor={colors.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.fieldLabel}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={draftPhone}
          onChangeText={(text) => setDraftPhone(formatPhone(text))}
          placeholder="(00) 00000-0000"
          placeholderTextColor={colors.placeholder}
          keyboardType="phone-pad"
        />

        <Text style={styles.fieldLabel}>Data de nascimento</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowBirthPicker(true)} activeOpacity={0.7}>
          <Text style={{ color: draftBirth ? colors.text : colors.placeholder, fontSize: 16 }}>
            {draftBirth ? toBRDate(draftBirth) : "Selecionar data"}
          </Text>
        </TouchableOpacity>

        {showBirthPicker && (
          <DateTimePicker
            value={draftBirth || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            themeVariant={isDarkMode ? "dark" : "light"}
            minimumDate={MIN_BIRTH_DATE}
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowBirthPicker(Platform.OS === "ios");
              if (selectedDate) setDraftBirth(selectedDate);
            }}
          />
        )}

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonSecondary]}
            onPress={() => setPersonalVisible(false)}
          >
            <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonPrimary]}
            onPress={savePersonal}
            disabled={savingPersonal}
          >
            {savingPersonal ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.modalButtonPrimaryText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      </FormModal>

      {/* Modal: Alterar Senha */}
      <FormModal
        visible={passwordVisible}
        title="Alterar senha"
        onClose={() => setPasswordVisible(false)}
        styles={styles}
      >
        <Text style={styles.fieldLabel}>Senha atual</Text>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showPasswords}
          placeholder="Senha atual"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="none"
        />

        <Text style={styles.fieldLabel}>Nova senha</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showPasswords}
          placeholder="Mínimo de 6 caracteres"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="none"
        />

        <Text style={styles.fieldLabel}>Confirmar nova senha</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPasswords}
          placeholder="Repita a nova senha"
          placeholderTextColor={colors.placeholder}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.showPasswordRow}
          onPress={() => setShowPasswords((current) => !current)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPasswords ? "checkbox" : "square-outline"}
            size={20}
            color={colors.primary}
          />
          <Text style={styles.showPasswordText}>Mostrar senhas</Text>
        </TouchableOpacity>

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonSecondary]}
            onPress={() => setPasswordVisible(false)}
          >
            <Text style={styles.modalButtonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonPrimary]}
            onPress={savePassword}
            disabled={savingPassword}
          >
            {savingPassword ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.modalButtonPrimaryText}>Alterar</Text>
            )}
          </TouchableOpacity>
        </View>
      </FormModal>

      {/* Modal: Logs de Uso */}
      <FormModal
        visible={logsVisible}
        title="Meus logs de uso"
        onClose={() => setLogsVisible(false)}
        styles={styles}
      >
        {logsLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 30 }} />
        ) : logsError ? (
          <Text style={styles.emptyText}>{logsError}</Text>
        ) : logs.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma atividade registrada até o momento.</Text>
        ) : (
          logs.map((item, index) => (
            <View
              key={String(item.id ?? index)}
              style={[styles.logItem, index < logs.length - 1 && styles.rowDivider]}
            >
              <Text style={styles.logAction}>
                {item.action || item.status || item.category || "Ação registrada"}
              </Text>
              <Text style={styles.logDate}>
                {item.title || "Atividade sem título"}
              </Text>
              {!!item.description && (
                <Text style={styles.logDate}>{item.description}</Text>
              )}
              <Text style={styles.logDate}>
                {formatLogDate(item.createdAt || item.activityDate || item.timestamp || item.date)}
              </Text>
            </View>
          ))
        )}

        <TouchableOpacity
          style={[styles.modalButton, styles.modalButtonSecondary, { marginTop: 16 }]}
          onPress={() => setLogsVisible(false)}
        >
          <Text style={styles.modalButtonSecondaryText}>Fechar</Text>
        </TouchableOpacity>
      </FormModal>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Componentes auxiliares
// ---------------------------------------------------------------------------
function Section({ title, children, styles }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Row({
  icon,
  label,
  subtitle,
  onPress,
  right,
  danger,
  dangerColor,
  disabled,
  last,
  styles,
  colors,
}) {
  const tint = danger ? dangerColor : colors.primary;
  const rightContent =
    right !== undefined ? (
      right
    ) : onPress ? (
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    ) : null;

  return (
    <TouchableOpacity
      style={[styles.row, !last && styles.rowDivider]}
      onPress={onPress}
      disabled={!onPress || disabled}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View
        style={[
          styles.rowIcon,
          danger && { backgroundColor: "rgba(220, 38, 38, 0.12)" },
        ]}
      >
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <View style={styles.rowTexts}>
        <Text style={[styles.rowLabel, danger && { color: dangerColor }]}>{label}</Text>
        {!!subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
      {rightContent}
    </TouchableOpacity>
  );
}

function FormModal({ visible, title, onClose, children, styles }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Estilos (fábrica baseada na paleta ativa)
// ---------------------------------------------------------------------------
const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 16,
      // espaço extra para o FAB global não cobrir o rodapé
      paddingBottom: 120,
    },

    // Cabeçalho / identificação
    header: {
      alignItems: "center",
      marginTop: 8,
      marginBottom: 28,
    },
    avatar: {
      width: 104,
      height: 104,
      borderRadius: 52,
      backgroundColor: colors.card,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    userName: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "800",
      textAlign: "center",
    },
    emailRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 6,
      maxWidth: "90%",
    },
    userEmail: {
      color: colors.muted,
      fontSize: 15,
      flexShrink: 1,
    },

    // Seções e linhas
    section: {
      marginBottom: 22,
    },
    sectionTitle: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 8,
      marginLeft: 6,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 16,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 14,
      gap: 12,
    },
    rowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowIcon: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    rowTexts: {
      flex: 1,
    },
    rowLabel: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },
    rowSubtitle: {
      color: colors.muted,
      fontSize: 12,
      marginTop: 2,
    },

    // Logout e versão
    logoutButton: {
      backgroundColor: Colors.palette.danger,
      paddingVertical: 15,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      marginTop: 4,
    },
    logoutText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    version: {
      color: colors.muted,
      fontSize: 12,
      textAlign: "center",
      marginTop: 16,
    },

    // Modais
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      padding: 20,
    },
    modalCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 20,
      padding: 20,
      maxHeight: "85%",
    },
    modalTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 16,
    },
    fieldLabel: {
      color: colors.muted,
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.input,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 10,
      color: colors.text,
      fontSize: 16,
      paddingHorizontal: 12,
      paddingVertical: 12,
      marginBottom: 16,
      justifyContent: "center",
    },
    showPasswordRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 4,
    },
    showPasswordText: {
      color: colors.text,
      fontSize: 14,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 16,
    },
    modalButton: {
      flex: 1,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    modalButtonPrimary: {
      backgroundColor: colors.primary,
    },
    modalButtonPrimaryText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
    modalButtonSecondary: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
    },
    modalButtonSecondaryText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
    },

    // Logs
    logItem: {
      paddingVertical: 12,
    },
    logAction: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
    },
    logDate: {
      color: colors.muted,
      fontSize: 12,
      marginTop: 2,
    },
    emptyText: {
      color: colors.muted,
      fontSize: 14,
      textAlign: "center",
      marginVertical: 24,
    },
  });