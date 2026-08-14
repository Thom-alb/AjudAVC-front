import { StyleSheet } from "react-native";

const Estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e1f2c", // Fundo azul escuro principal
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 40,
  },

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

  cardCreate: {
    width: '100%',
    backgroundColor: '#244E70', 
    borderRadius: 24,
    padding: 24,
    alignItems: 'stretch',
  },
  backButton: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0C1E5',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#6C9BCF',
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  // --- Box de Mensagem de Erro ---
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  // --- Botões e Ações ---
  buttonPrimary: {
    backgroundColor: '#6FA4E8',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default Estilos;