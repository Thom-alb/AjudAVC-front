import { StyleSheet } from 'react-native';

const Estilos = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0e1f2c' 
  },
  
  // Mês Atual no topo
  currentMonthText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    textTransform: 'capitalize',
  },

  // Seletor Semana / Mês
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
    justify: 'space-between',
    paddingHorizontal: 16,
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

  // Mês - Grid 7 Colunas Expandido
  monthWrapper: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  monthHeaderNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthNavBtn: {
    padding: 6,
    backgroundColor: '#1E3A8A',
    borderRadius: 6,
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayOfWeekText: {
    flex: 1,
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  calendarGrid: {
    gap: 6,
  },
  calendarRow: {
    flexDirection: 'row',
    gap: 4,
  },
  calendarDayCell: {
    flex: 1,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayCellOtherMonth: {
    backgroundColor: 'transparent',
    opacity: 0.3,
  },
  calendarDayCellActive: {
    backgroundColor: '#38BDF8',
  },
  calendarDayText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  calendarDayTextActive: {
    color: '#0F172A',
  },

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
});

export default Estilos;