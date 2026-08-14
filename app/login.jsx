import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Estilos from "../Estilo/login";
import api from "../src/service/api";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Por favor, preencha o e-mail e a senha.");
      return;
    }

    setLoading(true);

    try {
      // 1. Autentica no Spring Boot
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      // 2. Extrai e armazena o token
      const { token } = response.data;
      await AsyncStorage.setItem("authToken", token);

      // 3. Checa se o usuário já possui um grupo associado
      try {
        await api.get("/groups/me");
        router.replace("/home");
      } catch (groupError) {
        router.replace("/groupRole");
      }
    } catch (error) {
      const mensagemErro =
        error.response?.data?.message || "E-mail ou senha inválidos.";
      setErrorMessage(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e1f2c" />

      {/* Card Principal */}
      <View style={Estilos.card}>
        {/* Seta Voltar */}
        <TouchableOpacity
          style={Estilos.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Título */}
        <Text style={Estilos.title}>Bem vindo(a)</Text>

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
            if (errorMessage) setErrorMessage("");
          }}
        />

        {/* Campo Senha com Ícone de Olho */}
        <View style={Estilos.passwordContainer}>
          <TextInput
            style={Estilos.inputPassword}
            placeholder="Senha"
            placeholderTextColor="#A0C1E5"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errorMessage) setErrorMessage("");
            }}
          />
          <TouchableOpacity
            style={Estilos.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#A0C1E5"
            />
          </TouchableOpacity>
        </View>

        {/* Mensagem de Erro (Exibida dinamicamente) */}
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

        {/* Esqueceu a senha */}
        <TouchableOpacity
          style={Estilos.forgotContainer}
          onPress={() =>
            Alert.alert("Recuperação", "Recurso em desenvolvimento.")
          }
        >
          <Text style={Estilos.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* Checkbox Lembrar Login */}
        <TouchableOpacity
          style={Estilos.checkboxContainer}
          onPress={() => setRememberLogin(!rememberLogin)}
        >
          <View
            style={[Estilos.checkbox, rememberLogin && Estilos.checkboxChecked]}
          >
            {rememberLogin && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            )}
          </View>
          <Text style={Estilos.checkboxLabel}>Lembrar Login</Text>
        </TouchableOpacity>

        {/* Botão Entrar */}
        <TouchableOpacity
          style={Estilos.buttonPrimary}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={Estilos.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Não tem conta? Registre-se */}
        <TouchableOpacity
          style={Estilos.registerContainer}
          onPress={() => router.push("/register")}
        >
          <Text style={Estilos.registerText}>
            Não tem conta?{" "}
            <Text style={Estilos.registerTextBold}>Registre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão Sair no rodapé */}
      <TouchableOpacity
        style={Estilos.exitButton}
        onPress={() => router.replace("/")}
      >
        <Text style={Estilos.exitButtonText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
