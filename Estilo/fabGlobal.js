import { StyleSheet } from 'react-native';

const Estilos = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 998,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 130, // Fica acima da barra de Tabs
    alignItems: 'flex-end',
    zIndex: 999,
  },
  mainFab: {
    backgroundColor: '#5e8cf8',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  mainFabActive: {
    backgroundColor: '#EF4444',
  },
  optionsContainer: {
    marginBottom: 12,
    alignItems: 'flex-end',
    gap: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionIconBox: {
    backgroundColor: '#2E618E',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#F8FAFC',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F8FAFC',
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  catChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: '#2E618E',
  },
  catChipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: 'bold',
  },
  catChipTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  cancelBtnText: {
    color: '#64748B',
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#2E618E',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default Estilos;