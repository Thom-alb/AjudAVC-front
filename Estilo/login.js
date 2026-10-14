import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

// Fábrica de estilos do Login: recebe a paleta ativa do ThemeContext.
const createStyles = (colors) => {
  const isDark = colors.background === Colors.dark.background;
  const danger = isDark ? "#FF6B6B" : Colors.palette.danger;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      paddingBottom: 40,
      paddingTop: 40,
    },
    card: {
      width: "100%",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      padding: 24,
      alignItems: "stretch",
    },
    backButton: {
      marginBottom: 8,
      alignSelf: "flex-start",
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 32,
    },
    input: {
      height: 48,
      borderBottomWidth: 1,
      borderBottomColor: colors.muted,
      color: colors.text,
      fontSize: 16,
      marginBottom: 20,
      paddingHorizontal: 4,
    },
    // --- Campo de senha com olho ---
    passwordContainer: {
      width: "100%",
      position: "relative",
      justifyContent: "center",
    },
    inputPassword: {
      height: 48,
      borderBottomWidth: 1,
      borderBottomColor: colors.muted,
      color: colors.text,
      fontSize: 16,
      marginBottom: 20,
      paddingHorizontal: 4,
      paddingRight: 40, // Espaço extra para o ícone não cobrir o texto
    },
    eyeIcon: {
      position: "absolute",
      right: 8,
      top: 10,
      padding: 4,
    },
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(220, 38, 38, 0.12)",
      borderWidth: 1,
      borderColor: danger,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 8,
      marginBottom: 12,
      width: "100%",
    },
    errorIcon: {
      marginRight: 8,
    },
    errorText: {
      color: danger,
      fontSize: 13,
      fontWeight: "600",
      flex: 1,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 12,
    },
    checkbox: {
      width: 18,
      height: 18,
      borderWidth: 1,
      borderColor: colors.muted,
      marginRight: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    checkboxLabel: {
      color: colors.text,
      fontSize: 14,
    },
    buttonPrimary: {
      backgroundColor: colors.primary,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 16,
    },
    buttonText: {
      color: Colors.palette.white,
      fontSize: 18,
      fontWeight: "bold",
    },
    forgotContainer: {
      alignItems: "flex-start",
      marginTop: 4,
    },
    forgotText: {
      color: colors.muted,
      fontSize: 13,
    },
    registerContainer: {
      alignItems: "center",
      marginTop: 20,
      paddingVertical: 6,
    },
    registerText: {
      color: colors.muted,
      fontSize: 14,
    },
    registerTextBold: {
      color: colors.primary,
      fontWeight: "bold",
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 16,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      color: colors.muted,
      marginHorizontal: 10,
      fontSize: 12,
    },
    googleButton: {
      backgroundColor: Colors.palette.white,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
      borderRadius: 8,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 16,
    },
    googleIcon: {
      marginRight: 8,
    },
    googleButtonText: {
      color: Colors.palette.black,
      fontWeight: "bold",
      fontSize: 15,
    },
    exitButton: {
      marginTop: 32,
      alignSelf: "center",
    },
    exitButtonText: {
      color: colors.text,
      fontSize: 16,
    },
  });
};

export default createStyles;