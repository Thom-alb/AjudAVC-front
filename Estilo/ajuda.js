import { StyleSheet } from "react-native";

const Estilos = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0e1f2c',
    paddingTop: 30,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
  },

  /* Sumário / links rápidos do topo */
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(52, 131, 210, 0.3)',
  },
  bulletItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3483d2',
    marginBottom: 4,
  },

  /* Títulos e texto */
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8fd2ff',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5ab5f1',
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },

  listContainer: {
    marginTop: 4,
    marginBottom: 10,
  },

  /* Estilização do Botão Flutuante */
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    elevation: 5, // Sombra Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButton: {
    backgroundColor: 'rgba(46, 97, 142, 0.30)', // Azul escuro com transparência (82%)
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2E618E',
    marginBottom: 30,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Estilos;
