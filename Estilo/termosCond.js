import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    // Sombra para Android
    elevation: 2,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    fontStyle: "italic",
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0284C7",
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#334155",
    marginBottom: 12,
    textAlign: "justify",
  },
  bold: {
    fontWeight: "700",
    color: "#0F172A",
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 10,
    paddingRight: 10,
  },
  bulletPoint: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0284C7",
    marginRight: 8,
    width: 14,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#334155",
  },
  alertBox: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: "#F87171",
    padding: 14,
    borderRadius: 6,
    marginVertical: 14,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#991B1B",
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#991B1B",
  },
  alertBold: {
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  // Adicione ou verifique em seu arquivo Estilo/termosCond.js

  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  fabBackButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 42,
    height: 42,
    borderRadius: 28,
    backgroundColor: "#FFFFFF", // Fundo branco
    borderWidth: 2,
    borderColor: "#0e1f2c", // Mesma cor da seta (#0e1f2c)
    justifyContent: "center",
    alignItems: "center",
    // Sombra para dar o efeito flutuante (FAB)
    elevation: 5, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

});

export default Styles;
