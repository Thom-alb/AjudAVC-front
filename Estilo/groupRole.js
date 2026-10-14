import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

// Fábrica de estilos da tela de escolha de papel + modais de cadastro.
// Os estilos que antes viviam em `customModalStyles` (dentro do .jsx)
// agora fazem parte desta fábrica, para também respeitarem o tema.
const createStyles = (colors) => {
  const isDark = colors.background === Colors.dark.background;
  const danger = isDark ? "#FF6B6B" : Colors.palette.danger;

  return StyleSheet.create({
    // --- LAYOUT PRINCIPAL ---
    scroll: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flexGrow: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      paddingTop: 30,
      paddingBottom: 80,
    },

    titulo: {
      fontSize: 32,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 40,
    },

    // --- CARDS PRINCIPAIS / NAVEGAÇÃO ---
    card: {
      width: "70%",
      height: 270,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 32,
      alignItems: "center",
      paddingTop: 20,
      elevation: 5,
      shadowColor: Colors.palette.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },

    cardTitulo: {
      fontSize: 26,
      fontWeight: "bold",
      color: colors.text,
    },

    cardSubtitulo: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.muted,
      marginTop: 4,
    },

    ou: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.muted,
      marginVertical: 24,
    },

    // --- ÍCONES DE AVATAR E GRUPO ---
    usuarioIcone: {
      alignItems: "center",
      marginTop: 15,
    },

    cabeca: {
      width: 70,
      height: 70,
      borderRadius: 40,
      backgroundColor: colors.primary,
    },

    corpo: {
      width: 120,
      height: 50,
      backgroundColor: colors.primary,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      marginTop: 10,
    },

    grupoIcone: {
      width: 200,
      height: 100,
      position: "relative",
      marginTop: 15,
      alignItems: "center",
    },

    pessoaPrincipal: {
      position: "absolute",
      zIndex: 3,
      alignItems: "center",
    },

    pessoaFundoEsquerda: {
      position: "absolute",
      left: 10,
      top: -5,
      alignItems: "center",
      opacity: 0.7,
    },

    pessoaFundoDireita: {
      position: "absolute",
      right: 10,
      top: -5,
      alignItems: "center",
      opacity: 0.7,
    },

    cabecaPequena: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.secondary,
    },

    corpoPequeno: {
      width: 85,
      height: 45,
      backgroundColor: colors.secondary,
      borderTopLeftRadius: 35,
      borderTopRightRadius: 35,
      marginTop: 5,
    },

    botaoSair: {
      marginTop: 32,
      padding: 10,
    },

    textoSair: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "500",
    },

    // --- CARD DE CRIAÇÃO E FORMULÁRIOS ---
    cardCreate: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 24,
      alignItems: "stretch",
    },

    backButton: {
      marginBottom: 12,
      alignSelf: "flex-start",
    },

    title: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 14,
      color: colors.muted,
      textAlign: "center",
      marginBottom: 24,
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

    // --- SEÇÕES DO FORMULÁRIO ---
    sectionHeader: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 18,
      marginBottom: 8,
    },

    // --- GERENCIAMENTO DINÂMICO DE AVCs ---
    strokeHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },

    addStrokeBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },

    addStrokeText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "600",
    },

    strokeCard: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },

    strokeCardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },

    strokeCardTitle: {
      color: colors.muted,
      fontWeight: "bold",
      fontSize: 14,
    },

    label: {
      color: colors.muted,
      fontSize: 12,
      marginBottom: 6,
    },

    typeGroup: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },

    typeChip: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.primary,
    },

    typeChipActive: {
      backgroundColor: colors.primary,
    },

    typeChipText: {
      color: colors.muted,
      fontSize: 12,
    },

    typeChipTextActive: {
      color: Colors.palette.white,
      fontWeight: "bold",
    },

    // --- LISTA DE SELEÇÃO DE DOENÇAS PRÉ-EXISTENTES ---
    diseasesContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },

    diseaseRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 8,
    },

    checkboxBase: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: colors.muted,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },

    checkboxChecked: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },

    checkboxCheck: {
      color: Colors.palette.white,
      fontSize: 12,
      fontWeight: "bold",
    },

    diseaseText: {
      color: colors.text,
      fontSize: 14,
      flex: 1,
    },

    // --- BOX DE MENSAGEM DE ERRO ---
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(220, 38, 38, 0.12)",
      borderWidth: 1,
      borderColor: danger,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      marginBottom: 16,
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

    // --- BOTÕES E AÇÕES ---
    buttonPrimary: {
      backgroundColor: colors.primary,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      marginBottom: 8,
    },

    buttonText: {
      color: Colors.palette.white,
      fontSize: 18,
      fontWeight: "bold",
    },

    buttonCancelText: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "bold",
    },

    // --- MODAIS (antigo customModalStyles) ---
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalCard: {
      width: "100%",
      maxHeight: "90%",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      padding: 20,
      elevation: 5,
    },
    dateInput: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 14,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
    },
    dateTextPlaceholder: {
      color: colors.placeholder,
      fontSize: 16,
    },
    dateTextSelected: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "500",
    },
    textArea: {
      height: 80,
      textAlignVertical: "top",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 16,
    },
    btn: {
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    btnCancel: {
      flex: 1,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Contadores de AVC
    counterGroup: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    counterRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 6,
    },
    counterLabel: {
      color: colors.text,
      fontSize: 15,
    },
    counterControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    counterBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    counterBtnText: {
      color: Colors.palette.white,
      fontSize: 18,
      fontWeight: "bold",
    },
    counterValue: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "bold",
      minWidth: 20,
      textAlign: "center",
    },
  });
};

export default createStyles;