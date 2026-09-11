import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e1f2c', 
    paddingTop: 30,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 16,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
    fontWeight: '500',
  },
  paragraph: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 22,
    marginBottom: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },

  /* Estilização do Sumário de Navegação Rápida */
  summaryContainer: {
    backgroundColor: '#162b3d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  bulletItem: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5ab5f1',
    marginVertical: 4,
  },

  /* Blocos de Conteúdo e Títulos com Ícones Lado a Lado */
  sectionBlock: {
    marginTop: 16,
    marginBottom: 8,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  topicTitle: {
    marginLeft: 10,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8fd2ff',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5ab5f1',
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },

  /* Estrutura Legada / Colunas */
  sectionRow: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  textColumn: {
    width: '100%',
  },
  iconStyle: {
    alignSelf: 'flex-start',
  },

  /* Estilização do Botão Flutuante */
  floatingButtonContainer: {
    position: 'absolute',
    bottom:40,
    right: 20,
    elevation: 5, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButton: {
    backgroundColor: 'rgba(46, 97, 142, 0.45)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(90, 181, 241, 0.80)',
    marginBottom: 10,
  },
  floatingButtonText: {
    color: 'rgba(255, 255, 255, 0.80)',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default Styles;