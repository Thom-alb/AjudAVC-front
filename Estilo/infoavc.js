import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 30,
    },
    scrollContent: {
      padding: 24,
      paddingTop: 16,
    },
    paragraph: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
      marginBottom: 16,
    },
    boldText: {
      fontWeight: "bold",
    },

    /* Sumário de Navegação Rápida */
    summaryContainer: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      borderRadius: 12,
      marginBottom: 24,
    },
    bulletItem: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.primary,
      marginVertical: 4,
    },

    /* Blocos de Conteúdo e Títulos */
    sectionBlock: {
      backgroundColor: "transparent",
      marginTop: 16,
      marginBottom: 8,
    },
    topicHeader: {
      backgroundColor: "transparent",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    topicTitle: {
      marginLeft: 10,
      marginBottom: 0,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 8,
    },
    subTitle: {
      fontSize: 17,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    spacer: {
      backgroundColor: "transparent",
      height: 110,
    },

    /* Container dos Botões Flutuantes Lado a Lado */
    floatingButtonContainer: {
      backgroundColor: "transparent",
      position: "absolute",
      bottom: 50,
      right: 20,
      flexDirection: "row", // Mantém o alinhamento horizontal lado a lado
      alignItems: "center",
      gap: 10,
      elevation: 5,
      shadowColor: colors.overlay || Colors.palette.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },

    /* Mini Botão para voltar ao topo */
    scrollTopButton: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.primary,
    },

    /* Botão principal Voltar ao home */
    floatingButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
    },
    floatingButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "600",
    },
  });

export default createStyles;
