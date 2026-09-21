import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Estilos from "../../Estilo/registro";
import api from "../../src/service/api";

WebBrowser.maybeCompleteAuthSession();

// Detecta se está rodando no Expo Go
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const WEB_CLIENT_ID =
    "818045939260-fim8itj3ajsogffhlmpejkbvatsrc2b0.apps.googleusercontent.com";

  // Gera URI de redirecionamento dinâmica para evitar o erro de ERR_CONNECTION_REFUSED em localhost
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  // Configuração para Expo Go
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    androidClientId: WEB_CLIENT_ID,
    redirectUri: redirectUri,
  });

  // Log para monitorar a URI gerada e cadastrá-la no Google Cloud Console
  useEffect(() => {
    if (isExpoGo) {
      console.log("Redirect URI ativa:", redirectUri);
    }
  }, [redirectUri]);

  // Configuração Nativa (Apenas para APK / Dev Build)
  useEffect(() => {
    if (!isExpoGo) {
      const configureNativeGoogle = async () => {
        try {
          const { GoogleSignin } = await import(
            "@react-native-google-signin/google-signin"
          );
          GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: false,
          });
        } catch (e) {
          console.log("Erro ao carregar o módulo nativo do Google:", e);
        }
      };
      configureNativeGoogle();
    }
  }, []);

  // Handler para resposta do Expo Go
  useEffect(() => {
    if (isExpoGo && response?.type === "success") {
      const { id_token, authentication } = response.params;
      const tokenToUse = id_token || authentication?.idToken;

      if (tokenToUse) {
        handleGoogleAuth(tokenToUse);
      } else {
        setErrorMessage("Token do Google não encontrado.");
      }
    }
  }, [response]);

  // Função centralizada para validar grupo e redirecionar
  const redirectAfterAuth = async (token) => {
    try {
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      await api.get("/groups/me");
      router.replace("/(tabs)/group");
    } catch (groupError) {
      console.log(
        "Sem grupo ou erro ao buscar grupo. Redirecionando para seleção de papel:",
        groupError.response?.data || groupError.message
      );
      router.replace("/groupRole");
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    setLoading(true);
    try {
      if (isExpoGo) {
        await promptAsync();
      } else {
        const { GoogleSignin } = await import(
          "@react-native-google-signin/google-signin"
        );
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.data?.idToken || userInfo.idToken;

        if (idToken) {
          await handleGoogleAuth(idToken);
        } else {
          setErrorMessage("Não foi possível obter o token nativo do Google.");
        }
      }
    } catch (error) {
      console.log("ERRO GOOGLE SIGNIN:", error);
      setErrorMessage("Falha ao realizar login com o Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (googleToken) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const apiResponse = await api.post("/auth/google", {
        token: googleToken,
      });

      if (apiResponse.data?.token) {
        const jwtToken = apiResponse.data.token;
        await AsyncStorage.setItem("authToken", jwtToken);
        await redirectAfterAuth(jwtToken);
      }
    } catch (error) {
      const mensagemErro =
        error.response?.data?.message || "Erro ao autenticar com o Google.";
      setErrorMessage(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setErrorMessage("");

    if (!name || !email || !password) {
      setErrorMessage("Preencha todos os campos obrigatórios.");
      return;
    }

    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setErrorMessage("Os e-mails digitados não coincidem.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas digitadas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("Você deve aceitar os termos e condições.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const token = response.data?.token;

      if (token) {
        await AsyncStorage.setItem("authToken", token);
        await redirectAfterAuth(token);
      } else {
        const loginRes = await api.post("/auth/login", {
          email: email.trim(),
          password,
        });

        if (loginRes.data?.token) {
          await AsyncStorage.setItem("authToken", loginRes.data.token);
          await redirectAfterAuth(loginRes.data.token);
        } else {
          router.replace("/login");
        }
      }
    } catch (error) {
      const menssagemErro =
        error.response?.data?.message || "Erro ao realizar o cadastro.";
      setErrorMessage(menssagemErro);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    if (errorMessage) setErrorMessage("");
  };

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#73A5C6" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={Estilos.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={Estilos.card}>
              <TouchableOpacity
                style={Estilos.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={Estilos.title}>Crie sua conta</Text>

              {/* Campo Nome */}
              <TextInput
                style={Estilos.input}
                placeholder="Nome"
                placeholderTextColor="#A0C1E5"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  clearError();
                }}
              />

              {/* Campo Email */}
              <TextInput
                style={Estilos.input}
                placeholder="Email"
                placeholderTextColor="#A0C1E5"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError();
                }}
              />

              {/* Campo Confirmar Email */}
              <TextInput
                style={Estilos.input}
                placeholder="Confirmar Email"
                placeholderTextColor="#A0C1E5"
                keyboardType="email-address"
                autoCapitalize="none"
                value={confirmEmail}
                onChangeText={(text) => {
                  setConfirmEmail(text);
                  clearError();
                }}
              />

              {/* Campo Senha */}
              <View style={Estilos.passwordContainer}>
                <TextInput
                  style={Estilos.passwordInput}
                  placeholder="Senha"
                  placeholderTextColor="#A0C1E5"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError();
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={Estilos.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#A0C1E5"
                  />
                </TouchableOpacity>
              </View>

              {/* Campo Confirmar Senha */}
              <View style={Estilos.passwordContainer}>
                <TextInput
                  style={Estilos.passwordInput}
                  placeholder="Confirmar Senha"
                  placeholderTextColor="#A0C1E5"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    clearError();
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={Estilos.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#A0C1E5"
                  />
                </TouchableOpacity>
              </View>

              {/* Checkbox Termos */}
              <View style={Estilos.checkboxContainer}>
                <TouchableOpacity
                  style={[
                    Estilos.checkbox,
                    termsAccepted && Estilos.checkboxChecked,
                  ]}
                  onPress={() => {
                    setTermsAccepted(!termsAccepted);
                    clearError();
                  }}
                  activeOpacity={0.7}
                >
                  {termsAccepted && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/term")}
                  activeOpacity={0.6}
                >
                  <Text style={Estilos.checkboxLabel}>
                    Concordo com os{" "}
                    <Text style={Estilos.termsLink}>termos e condições</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Mensagem de Erro */}
              {!!errorMessage && (
                <View style={Estilos.errorBox}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color="#FF6B6B"
                    style={Estilos.errorIcon}
                  />
                  <Text style={Estilos.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Botão Registrar */}
              <TouchableOpacity
                style={Estilos.buttonPrimary}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={Estilos.buttonText}>Registrar</Text>
                )}
              </TouchableOpacity>

              {/* Divisor OU */}
              <View style={Estilos.dividerContainer}>
                <View style={Estilos.dividerLine} />
                <Text style={Estilos.dividerText}>OU</Text>
                <View style={Estilos.dividerLine} />
              </View>

              {/* Botão Google */}
              <TouchableOpacity
                style={Estilos.googleButton}
                disabled={(isExpoGo && !request) || loading}
                onPress={handleGoogleSignIn}
              >
                <Ionicons
                  name="logo-google"
                  size={20}
                  color="#000"
                  style={Estilos.googleIcon}
                />
                <Text style={Estilos.googleButtonText}>
                  Continuar com o Google
                </Text>
              </TouchableOpacity>

              {/* Link para Login */}
              <TouchableOpacity
                onPress={() => router.push("/login")}
                style={Estilos.linkContainer}
              >
                <Text style={Estilos.linkText}>Já tem conta? entre</Text>
              </TouchableOpacity>
            </View>

            {/* Botão Sair */}
            <TouchableOpacity
              style={Estilos.exitButton}
              onPress={() => router.replace("/")}
            >
              <Text style={Estilos.exitButtonText}>Sair</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}