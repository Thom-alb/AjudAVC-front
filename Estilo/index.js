import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e1f2c',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  logoCard: {
    width: '90%',
    height: '38%',
    backgroundColor: '#244E70',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 5, 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  logo: {
    width: '80%',
    height: '80%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  primaryButton: {
   width: '90%',
    backgroundColor: '#244E70', 
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  helpButton: {
    marginTop: 4,
    padding: 8,
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  infoSection: {
    alignItems: 'center',
    gap: 6,
  },
  infoTitle: {
    color: '#EAF3FA',
    fontSize: 18,
    fontWeight: '400',
  },
  linksRow: {
    flexDirection: 'row',
    gap: 24,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exitButton: {
    marginBottom: 10,
    padding: 10,
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Styles;
