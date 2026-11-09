import { StyleSheet } from "react-native";

// Fábrica de estilos da tela inicial: recebe a paleta ativa do ThemeContext.
// Uso: const Estilos = useMemo(() => createStyles(colors), [colors]);
const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 40,
      paddingHorizontal: 24,
    },
    logoCard: {
      width: "90%",
      height: "38%",
      // Cor de marca: o card da logo permanece azul nos dois temas
      backgroundColor: colors.primary,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      elevation: 5,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    logo: {
      width: "80%",
      height: "80%",
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
      gap: 12,
    },
    primaryButton: {
      width: "90%",
      backgroundColor: colors.primary,
      borderRadius: 25,
      paddingVertical: 14,
      alignItems: "center",
    },
    primaryButtonText: {
      color: colors.onPrimary,
      fontSize: 20,
      fontWeight: "bold",
    },
    helpButton: {
      marginTop: 4,
      padding: 8,
    },
    helpButtonText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "500",
    },
    infoSection: {
      alignItems: "center",
      gap: 6,
    },
    infoTitle: {
      color: colors.muted,
      fontSize: 18,
      fontWeight: "400",
    },
    linksRow: {
      flexDirection: "row",
      gap: 24,
    },
    linkText: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "bold",
    },
    exitButton: {
      marginBottom: 10,
      padding: 10,
    },
    exitButtonText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "500",
    },
  });

export default createStyles;
