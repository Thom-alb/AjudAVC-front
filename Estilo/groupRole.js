import { StyleSheet } from "react-native";

const Estilos = StyleSheet.create({
  // --- LAYOUT PRINCIPAL ---
  container: {
    flex: 1,
    backgroundColor: "#0e1f2c", // Fundo azul escuro principal
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 80,
  },

  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
  },

  // --- CARDS PRINCIPAIS / NAVEGAÇÃO ---
  card: {
    width: "70%",
    height: 270,
    backgroundColor: "#244E70", // Azul do card
    borderRadius: 32,
    alignItems: "center",
    paddingTop: 20,
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  cardTitulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  cardSubtitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#EAF3FA",
    marginTop: 4,
  },

  ou: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#EAF3FA",
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
    backgroundColor: "#6FA4E8", // Azul de destaque nos ícones
  },

  corpo: {
    width: 120,
    height: 50,
    backgroundColor: "#6FA4E8",
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
    backgroundColor: "#4A7BB0",
  },

  corpoPequeno: {
    width: 85,
    height: 45,
    backgroundColor: "#4A7BB0",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: 5,
  },

  botaoSair: {
    marginTop: 32,
    padding: 10,
  },

  textoSair: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },

  // --- CARD DE CRIAÇÃO E FORMULÁRIOS ---
  cardCreate: {
    width: "100%",
    backgroundColor: "#244E70",
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
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#A0C1E5",
    textAlign: "center",
    marginBottom: 24,
  },

  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#6C9BCF",
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  // --- SEÇÕES DO FORMULÁRIO ---
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    color: "#73A5C6",
    fontSize: 14,
    fontWeight: "600",
  },

  strokeCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  strokeCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  strokeCardTitle: {
    color: "#A0C1E5",
    fontWeight: "bold",
    fontSize: 14,
  },

  label: {
    color: "#A0C1E5",
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
    borderColor: "#73A5C6",
  },

  typeChipActive: {
    backgroundColor: "#73A5C6",
  },

  typeChipText: {
    color: "#A0C1E5",
    fontSize: 12,
  },

  typeChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  // --- LISTA DE SELEÇÃO DE DOENÇAS PRE-EXISTENTES ---
  diseasesContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
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
    borderColor: "#A0C1E5",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  checkboxChecked: {
    borderColor: "#6FA4E8",
    backgroundColor: "#6FA4E8",
  },

  diseaseText: {
    color: "#FFFFFF",
    fontSize: 14,
    flex: 1,
  },

  // --- BOX DE MENSAGEM DE ERRO ---
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderWidth: 1,
    borderColor: "#FF6B6B",
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
    color: "#FF6B6B",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  // --- BOTÕES E AÇÕES ---
  buttonPrimary: {
    backgroundColor: "#6FA4E8",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Estilos;