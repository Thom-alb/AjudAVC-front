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
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri } from "expo-auth-session";
import Estilos from "../../Estilo/registro";
import api from "../../src/service/api";

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const router = useRouter();

  // Estados dos inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados de controle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gera a URI web universal compatível com Web Client ID
  const redirectUri = makeRedirectUri({
    preferLocalhost: false,
  });

  // Exibe no terminal a URI que deve ser cadastrada no Google
  console.log("SUA REDIRECT URI É:", redirectUri);

  // Configuração do Google Auth Session
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "818045939260-fim8itj3ajsogffhlmpejkbvatsrc2b0.apps.googleusercontent.com",
    webClientId:
      "818045939260-fim8itj3ajsogffhlmpejkbvatsrc2b0.apps.googleusercontent.com",
    responseType: "id_token",
    redirectUri,
  });

  // Escuta o retorno da autenticação
  useEffect(() => {
    if (response?.type === "success") {
      const idToken =
        response.params?.id_token || response.authentication?.idToken;
      if (idToken) {
        handleGoogleAuth(idToken);
      }
    }
  }, [response]);

  // Envia o token para a API Spring Boot (/auth/google)
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
      console.log("STATUS ERRO GOOGLE:", error.response?.status);
      console.log("DADOS ERRO GOOGLE:", error.response?.data);
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
      console.log("STATUS DO ERRO:", error.response?.status);
      console.log("DADOS DO ERRO DO BACKEND:", error.response?.data);
      console.log("MENSAGEM:", error.message);
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
              {/* Botão de Voltar */}
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

              {/* Input Senha */}
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

              {/* Input Confirmar Senha */}
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

              {/* Checkbox Termos */}
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

              {/* Separador Visual */}
              <View style={Estilos.dividerContainer}>
                <View style={Estilos.dividerLine} />
                <Text style={Estilos.dividerText}>OU</Text>
                <View style={Estilos.dividerLine} />
              </View>

              {/* Botão Entrar com Google */}
              <TouchableOpacity
                style={Estilos.googleButton}
                disabled={!request || loading}
                onPress={() => promptAsync()}
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

              {/* Link Login */}
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