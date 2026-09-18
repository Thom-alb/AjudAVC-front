import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
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

  const WEB_CLIENT_ID =
    "818045939260-fim8itj3ajsogffhlmpejkbvatsrc2b0.apps.googleusercontent.com";

  // Configuração apenas para Expo Go
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    androidClientId: WEB_CLIENT_ID,
    redirectUri: "http://localhost:8081",
  });

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
        Alert.alert("Erro", "Token do Google não encontrado.");
      }
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      if (isExpoGo) {
        // FLUXO EXPO GO
        await promptAsync();
      } else {
        // FLUXO APK / BUILD NATIVA (Importação Dinâmica)
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
          Alert.alert("Erro", "Não foi possível obter o token nativo do Google.");
        }
      }
    } catch (error) {
      console.log("ERRO GOOGLE SIGNIN:", error);
      Alert.alert("Erro", "Falha ao realizar login com o Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (googleToken) => {
    setLoading(true);
    try {
      const apiResponse = await api.post("/auth/google", {
        token: googleToken,
      });

      if (apiResponse.data?.token) {
        await AsyncStorage.setItem("authToken", apiResponse.data.token);
        Alert.alert("Sucesso!", "Autenticação realizada com o Google.");
        router.replace("/(tabs)/progress");
      }
    } catch (error) {
      const mensagemErro =
        error.response?.data?.message || "Erro ao autenticar com o Google.";
      Alert.alert("Erro no Google Login", mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (email !== confirmEmail) {
      Alert.alert("Atenção", "Os e-mails digitados não coincidem.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Atenção", "As senhas digitadas não coincidem.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Atenção", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (!termsAccepted) {
      Alert.alert("Atenção", "Você deve aceitar os termos e condições.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      Alert.alert("Sucesso!", "Conta criada com sucesso.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (error) {
      const menssagemErro =
        error.response?.data?.message || "Erro ao realizar o cadastro.";
      Alert.alert("Erro no Cadastro", menssagemErro);
    } finally {
      setLoading(false);
    }
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

              <TextInput
                style={Estilos.input}
                placeholder="Nome"
                placeholderTextColor="#A0C1E5"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={Estilos.input}
                placeholder="Email"
                placeholderTextColor="#A0C1E5"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={Estilos.input}
                placeholder="Confirmar Email"
                placeholderTextColor="#A0C1E5"
                keyboardType="email-address"
                autoCapitalize="none"
                value={confirmEmail}
                onChangeText={setConfirmEmail}
              />

              <View style={Estilos.passwordContainer}>
                <TextInput
                  style={Estilos.passwordInput}
                  placeholder="Senha"
                  placeholderTextColor="#A0C1E5"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
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

              <View style={Estilos.passwordContainer}>
                <TextInput
                  style={Estilos.passwordInput}
                  placeholder="Confirmar Senha"
                  placeholderTextColor="#A0C1E5"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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

              <View style={Estilos.checkboxContainer}>
                <TouchableOpacity
                  style={[
                    Estilos.checkbox,
                    termsAccepted && Estilos.checkboxChecked,
                  ]}
                  onPress={() => setTermsAccepted(!termsAccepted)}
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

              <View style={Estilos.dividerContainer}>
                <View style={Estilos.dividerLine} />
                <Text style={Estilos.dividerText}>OU</Text>
                <View style={Estilos.dividerLine} />
              </View>

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

              <TouchableOpacity
                onPress={() => router.push("/login")}
                style={Estilos.linkContainer}
              >
                <Text style={Estilos.linkText}>Já tem conta? entre</Text>
              </TouchableOpacity>
            </View>

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