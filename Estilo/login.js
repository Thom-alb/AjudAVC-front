import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1f2c", // Azul do fundo principal
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#244E70", // Azul do card
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
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 32,
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
  // --- Estilos para o campo de senha com olho ---
  passwordContainer: {
    width: "100%",
    position: "relative",
    justifyContent: "center",
  },
  inputPassword: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#6C9BCF",
    color: "#FFFFFF",
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
  // --- Estilos para o Box de Erro ---
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderWidth: 1,
    borderColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
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
  // --- Restante dos componentes ---
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#6FA4E8",
    borderColor: "#6FA4E8",
  },
  checkboxLabel: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  buttonPrimary: {
    backgroundColor: "#6FA4E8",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotContainer: {
    alignItems: "flex-start",
    marginTop: 4,
  },
  forgotText: {
    color: "#E0E0E0",
    fontSize: 13,
  },
  registerContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 6,
  },
  registerText: {
    color: "#E0E0E0",
    fontSize: 14,
  },
  registerTextBold: {
    color: "#6FA4E8",
    fontWeight: "bold",
  },
  exitButton: {
    marginTop: 32,
  },
  exitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default Styles;