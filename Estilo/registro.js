import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

// Fábrica de estilos do Registro: recebe a paleta ativa do ThemeContext.
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
      marginBottom: 20,
    },
    input: {
      height: 44,
      borderBottomWidth: 1,
      borderBottomColor: colors.muted,
      color: colors.text,
      fontSize: 15,
      marginBottom: 14,
      paddingHorizontal: 4,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: colors.muted,
      marginBottom: 14,
    },
    passwordInput: {
      flex: 1,
      height: 44,
      color: colors.text,
      fontSize: 15,
      paddingHorizontal: 4,
    },
    eyeIcon: {
      paddingHorizontal: 8,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 12,
      width: 280,
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
      fontSize: 13,
      color: colors.text,
      flexShrink: 1,
    },
    termsLink: {
      color: colors.primary,
      fontWeight: "bold",
      textDecorationLine: "underline",
    },
    buttonPrimary: {
      backgroundColor: colors.primary,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
      marginBottom: 12,
    },
    buttonText: {
      color: Colors.palette.white,
      fontSize: 18,
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
    linkContainer: {
      alignItems: "center",
    },
    linkText: {
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
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(220, 38, 38, 0.12)",
      borderWidth: 1,
      borderColor: danger,
      paddingHorizontal: 4,
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
    exitButton: {
      marginTop: 20,
      alignSelf: "center",
    },
    exitButtonText: {
      color: colors.text,
      fontSize: 16,
    },
  });
};

export default createStyles;