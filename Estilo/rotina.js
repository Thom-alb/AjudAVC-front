import { StyleSheet } from 'react-native';

const Estilos = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0e1f2c' 
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#2E618E',
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#0F172A' },
  toggleText: { color: '#DBEAFE', fontWeight: '600' },
  toggleTextActive: { color: '#FFFFFF', fontWeight: 'bold' },

  // Semana
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  weekDayCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  weekDayCardActive: { backgroundColor: '#38BDF8' },
  weekDayName: { color: '#93C5FD', fontSize: 10, fontWeight: 'bold' },
  weekDayNum: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  weekDayTextActive: { color: '#0F172A' },

  // Mês com quebra por semana
  monthWrapper: {
    maxHeight: 220,
    marginVertical: 12,
  },
  monthContainer: { 
    paddingHorizontal: 12,
    gap: 8,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthDayCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  monthDayCardActive: { backgroundColor: '#38BDF8' },
  monthDayName: { color: '#93C5FD', fontSize: 9, fontWeight: 'bold' },
  monthDayNum: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  monthDayTextActive: { color: '#0F172A' },

  // Listagem
  listContent: { paddingHorizontal: 16, paddingBottom: 80 },
  cardEvent: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardCompleted: { opacity: 0.6 },
  timeBox: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#334155',
    alignItems: 'center',
  },
  dateLabel: { color: '#94A3B8', fontSize: 11 },
  timeLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  checkboxIcon: { marginTop: 4 },
  eventDetails: { paddingLeft: 12, flex: 1 },
  eventTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  textCompleted: { textDecorationLine: 'line-through', color: '#94A3B8' },
  eventDesc: { color: '#CBD5E1', fontSize: 12, marginTop: 2 },
  eventMeta: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  deleteBtn: { padding: 6 },

  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#7196ee', fontSize: 14, fontWeight: '600', marginTop: 8 },
  loadingIndicator: { marginTop: 40 },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#5e8cf8',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginTop: 8, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#F8FAFC',
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  catChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  catChipActive: { backgroundColor: '#2E618E' },
  catChipText: { fontSize: 11, color: '#334155', fontWeight: 'bold' },
  catChipTextActive: { color: '#FFFFFF' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 14 },
  cancelBtnText: { color: '#64748B', fontWeight: 'bold' },
  saveBtn: {
    backgroundColor: '#2E618E',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: 'bold' },

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
});

export default Estilos;