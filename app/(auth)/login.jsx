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
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Estilos from "../../Estilo/login";
import api from "../../src/service/api";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const WEB_CLIENT_ID =
    "818045939260-fim8itj3ajsogffhlmpejkbvatsrc2b0.apps.googleusercontent.com";

  useEffect(() => {
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
        console.log(
          "Erro ao configurar o Google Sign-In:",
          e
        );
      }
    };

    configureNativeGoogle();
  }, []);

  const redirectAfterAuth = async (token) => {
    try {
      if (token) {
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      await api.get("/groups/me");

      router.replace("/(tabs)/group");
    } catch (groupError) {
      console.log(
        "Sem grupo ou erro ao buscar grupo:",
        groupError.response?.data ||
          groupError.message
      );

      router.replace("/groupRole");
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    setLoading(true);

    try {
      const { GoogleSignin } = await import(
        "@react-native-google-signin/google-signin"
      );

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const userInfo =
        await GoogleSignin.signIn();

      const idToken =
        userInfo.data?.idToken ||
        userInfo.idToken;

      if (idToken) {
        await handleGoogleAuth(idToken);
      } else {
        setErrorMessage(
          "Não foi possível obter o token do Google."
        );
      }
    } catch (error) {
      console.log(
        "ERRO GOOGLE SIGNIN:",
        error
      );

      if (error.code === "SIGN_IN_CANCELLED") {
        return;
      }

      if (error.code === "IN_PROGRESS") {
        setErrorMessage(
          "O login do Google já está em andamento."
        );
        return;
      }

      if (
        error.code ===
        "PLAY_SERVICES_NOT_AVAILABLE"
      ) {
        setErrorMessage(
          "O Google Play Services não está disponível neste aparelho."
        );
        return;
      }

      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Falha ao realizar login com o Google."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (googleToken) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const apiResponse = await api.post(
        "/auth/google",
        {
          token: googleToken,
        }
      );

      if (apiResponse.data?.token) {
        const jwtToken =
          apiResponse.data.token;

        await AsyncStorage.setItem(
          "authToken",
          jwtToken
        );

        await redirectAfterAuth(jwtToken);
      }
    } catch (error) {
      const mensagemErro =
        error.response?.data?.message ||
        "Erro ao autenticar com o Google.";

      setErrorMessage(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage(
        "Por favor, preencha o e-mail e a senha."
      );

      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email: email.trim(),
          password,
        }
      );

      const { token } = response.data;

      await AsyncStorage.setItem(
        "authToken",
        token
      );

      await redirectAfterAuth(token);
    } catch (error) {
      const mensagemErro =
        error.response?.data?.message ||
        "E-mail ou senha inválidos.";

      setErrorMessage(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0e1f2c"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : Platform.OS === "android"
            ? "height"
            : undefined
        }
        keyboardVerticalOffset={
          Platform.OS === "ios" ? 0 : 20
        }
      >
        <ScrollView
          contentContainerStyle={
            Estilos.scrollContainer
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={Estilos.card}>
            <TouchableOpacity
              style={Estilos.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={28}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Text style={Estilos.title}>
              Bem vindo(a)
            </Text>

            <TextInput
              style={Estilos.input}
              placeholder="Email"
              placeholderTextColor="#A0C1E5"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);

                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
            />

            <View
              style={Estilos.passwordContainer}
            >
              <TextInput
                style={Estilos.inputPassword}
                placeholder="Senha"
                placeholderTextColor="#A0C1E5"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);

                  if (errorMessage) {
                    setErrorMessage("");
                  }
                }}
              />

              <TouchableOpacity
                style={Estilos.eyeIcon}
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off"
                      : "eye"
                  }
                  size={22}
                  color="#A0C1E5"
                />
              </TouchableOpacity>
            </View>

            {!!errorMessage && (
              <View style={Estilos.errorBox}>
                <Ionicons
                  name="alert-circle-outline"
                  size={18}
                  color="#FF6B6B"
                  style={Estilos.errorIcon}
                />

                <Text
                  style={Estilos.errorText}
                >
                  {errorMessage}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={Estilos.forgotContainer}
              onPress={() =>
                Alert.alert(
                  "Recuperação",
                  "Recurso em desenvolvimento."
                )
              }
            >
              <Text
                style={Estilos.forgotText}
              >
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={Estilos.checkboxContainer}
              onPress={() =>
                setRememberLogin(
                  !rememberLogin
                )
              }
            >
              <View
                style={[
                  Estilos.checkbox,
                  rememberLogin &&
                    Estilos.checkboxChecked,
                ]}
              >
                {rememberLogin && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color="#FFFFFF"
                  />
                )}
              </View>

              <Text
                style={Estilos.checkboxLabel}
              >
                Lembrar Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={Estilos.buttonPrimary}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={Estilos.buttonText}
                >
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

            <View
              style={Estilos.dividerContainer}
            >
              <View
                style={Estilos.dividerLine}
              />

              <Text
                style={Estilos.dividerText}
              >
                OU
              </Text>

              <View
                style={Estilos.dividerLine}
              />
            </View>

            <TouchableOpacity
              style={Estilos.googleButton}
              disabled={loading}
              onPress={handleGoogleSignIn}
            >
              <Ionicons
                name="logo-google"
                size={20}
                color="#000"
                style={Estilos.googleIcon}
              />

              <Text
                style={
                  Estilos.googleButtonText
                }
              >
                Entrar com o Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={Estilos.registerContainer}
              onPress={() =>
                router.push("/register")
              }
            >
              <Text
                style={Estilos.registerText}
              >
                Não tem conta?{" "}
                <Text
                  style={
                    Estilos.registerTextBold
                  }
                >
                  Registre-se
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={Estilos.exitButton}
            onPress={() =>
              router.replace("/")
            }
          >
            <Text
              style={Estilos.exitButtonText}
            >
              Sair
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}