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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Estilos from "../../Estilo/registro";
import api from "../../src/service/api";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [termsAccepted, setTermsAccepted] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  const WEB_CLIENT_ID =
    "818045939260-fim8itj3ajsogffhlmpejkbvatsrc2b0.apps.googleusercontent.com";

useEffect(() => {
  const configureNativeGoogle = async () => {
    try {
      const GoogleSigninModule = await import(
        "@react-native-google-signin/google-signin"
      );
      
      const GoogleSignin = GoogleSigninModule.GoogleSignin || GoogleSigninModule.default?.GoogleSignin;

      if (GoogleSignin && typeof GoogleSignin.configure === "function") {
        GoogleSignin.configure({
          webClientId: WEB_CLIENT_ID,
          offlineAccess: false,
        });
      } else {
        console.log("Google Sign-In não suportado no ambiente atual (ex: Expo Go).");
      }
    } catch (e) {
      console.log("Erro ao configurar o Google Sign-In:", e);
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
        "Sem grupo ou erro ao buscar grupo. Redirecionando para seleção de papel:",
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
          "Falha ao realizar cadastro com o Google."
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

const handleRegister = async () => {
  setErrorMessage("");

  if (!name.trim() || !email.trim() || !password) {
    setErrorMessage("Preencha todos os campos obrigatórios.");
    return;
  }

  if (
    email.trim().toLowerCase() !==
    confirmEmail.trim().toLowerCase()
  ) {
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
    setErrorMessage(
      "Você deve aceitar os termos e condições."
    );
    return;
  }

  setLoading(true);

  try {
    await api.post("/auth/register", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    
    router.replace("/login");
  } catch (error) {
    console.log("STATUS DO CADASTRO:", error.response?.status);
    console.log("DADOS DO CADASTRO:", error.response?.data);
    console.log("ERRO DO CADASTRO:", error.message);

    const mensagemErro =
      error.response?.data?.message ||
      error.response?.data ||
      "Erro ao realizar o cadastro.";

    setErrorMessage(
      typeof mensagemErro === "string"
        ? mensagemErro
        : "Erro ao realizar o cadastro."
    );
  } finally {
    setLoading(false);
  }
};

  const clearError = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#73A5C6"
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
              Crie sua conta
            </Text>

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

            <View
              style={Estilos.passwordContainer}
            >
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
                onPress={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={Estilos.eyeIcon}
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

            <View
              style={Estilos.passwordContainer}
            >
              <TextInput
                style={Estilos.passwordInput}
                placeholder="Confirmar Senha"
                placeholderTextColor="#A0C1E5"
                secureTextEntry={
                  !showConfirmPassword
                }
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  clearError();
                }}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                style={Estilos.eyeIcon}
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? "eye-off"
                      : "eye"
                  }
                  size={22}
                  color="#A0C1E5"
                />
              </TouchableOpacity>
            </View>

            <View
              style={Estilos.checkboxContainer}
            >
              <TouchableOpacity
                style={[
                  Estilos.checkbox,
                  termsAccepted &&
                    Estilos.checkboxChecked,
                ]}
                onPress={() => {
                  setTermsAccepted(
                    !termsAccepted
                  );
                  clearError();
                }}
                activeOpacity={0.7}
              >
                {termsAccepted && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color="#FFFFFF"
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.push("/term")
                }
                activeOpacity={0.6}
              >
                <Text
                  style={
                    Estilos.checkboxLabel
                  }
                >
                  Concordo com os{" "}
                  <Text
                    style={Estilos.termsLink}
                  >
                    termos e condições & políticas de privacidade
                  </Text>
                </Text>
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
              style={Estilos.buttonPrimary}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={Estilos.buttonText}
                >
                  Registrar
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
                style={Estilos.googleButtonText}
              >
                Continuar com o Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push("/login")
              }
              style={Estilos.linkContainer}
            >
              <Text
                style={Estilos.registerText}
              >
                Já tem conta?{" "}
                <Text
                  style={
                    Estilos.registerTextBold
                  }
                >
                  entre
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