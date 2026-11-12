
import { StyleSheet } from "react-native";

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 10,
    },

    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 40,
    },

    // Abas Registro / Resumo
    tabSelector: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 14,
      backgroundColor: colors.card,
      borderRadius: 14,
      padding: 5,
      borderWidth: 1,
      borderColor: colors.border,
    },

    tabButton: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 10,
    },

    tabButtonActive: {
      backgroundColor: colors.primary,
    },

    tabText: {
      color: colors.muted,
      fontWeight: "600",
      fontSize: 14,
    },

    tabTextActive: {
      color: colors.onPrimary || "#FFFFFF",
      fontWeight: "700",
    },

    // Cartão principal
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 17,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 5,
    },

    sectionTitle: {
      color: colors.text,
      fontSize: 19,
      fontWeight: "700",
      marginBottom: 18,
    },

    // Sliders
    sliderGroup: {
      marginBottom: 18,
      padding: 12,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },

    sliderHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
    },

    label: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
    },

    scoreValue: {
      color: colors.primary,
      fontSize: 17,
      fontWeight: "800",
    },

    // Cartões de humor
    moodCard: {
      backgroundColor: colors.surfaceAlt,
      padding: 12,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: colors.border,
    },

    moodHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },

    moodLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    moodName: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "700",
    },

    moodScore: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "800",
    },

    moodNumbers: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 4,
    },

    moodNumber: {
      flex: 1,
      height: 36,
      backgroundColor: colors.card,
      borderRadius: 7,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    moodNumberSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      borderWidth: 2,
    },

    moodNumberText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "700",
    },

    moodNumberTextSelected: {
      color: colors.onPrimary || "#FFFFFF",
    },

    // Campo de descrição
    textArea: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: 12,
      padding: 13,
      color: colors.text,
      fontSize: 14,
      marginTop: 8,
      minHeight: 105,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Botão salvar
    saveBtn: {
      flexDirection: "row",
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 15,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 22,
      gap: 8,
      elevation: 2,
    },

    saveBtnText: {
      color: colors.onPrimary || "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
    },

    // Seletor de mês
    monthPickerContainer: {
      marginBottom: 14,
    },

    monthChip: {
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    monthChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    monthChipText: {
      color: colors.muted,
      fontSize: 13,
      fontWeight: "600",
    },

    monthChipTextActive: {
      color: colors.onPrimary || "#FFFFFF",
      fontWeight: "700",
    },

    // Métricas
    metricsRow: {
      flexDirection: "row",
      gap: 8,
      marginVertical: 8,
    },

    metricBadge: {
      flex: 1,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 13,
      paddingVertical: 15,
      paddingHorizontal: 5,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },

    metricLabel: {
      color: colors.muted,
      fontSize: 11,
      fontWeight: "700",
      textAlign: "center",
    },

    metricValue: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: "800",
      marginTop: 5,
    },

    // Gráfico
    chartBarContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "flex-end",
      height: 150,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 13,
      padding: 12,
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },

    barItem: {
      alignItems: "center",
      justifyContent: "flex-end",
      flex: 1,
    },

    barCount: {
      color: colors.text,
      fontSize: 11,
      fontWeight: "700",
      marginBottom: 5,
    },

    bar: {
      width: 20,
      backgroundColor: colors.primary,
      borderRadius: 6,
    },

    barLabel: {
      color: colors.muted,
      fontSize: 10,
      fontWeight: "700",
      marginTop: 7,
    },

    // Histórico
    historyCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 13,
      marginBottom: 9,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },

    historyHeader: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: 5,
      marginBottom: 4,
    },

    historyAuthor: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "800",
    },

    historyDate: {
      color: colors.muted,
      fontSize: 11,
    },

    historyDesc: {
      color: colors.textSoft,
      fontSize: 13,
      lineHeight: 19,
      marginTop: 5,
    },

    // Estado vazio
    emptyText: {
      color: colors.muted,
      fontSize: 14,
      textAlign: "center",
      lineHeight: 21,
      marginVertical: 20,
    },
  });

export default createStyles;
