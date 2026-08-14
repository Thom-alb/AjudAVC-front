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
    marginBottom: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textColumn: {
    flex: 1,
    paddingRight: 10,
  },
  iconStyle: {
    marginLeft: 4,
    alignSelf: 'center',
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
  bulletItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3483d2', // Azul bem escuro para destaque no topo
    marginBottom: 4,
  },
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
});
export default Styles;
