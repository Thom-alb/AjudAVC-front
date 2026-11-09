import { StyleSheet } from 'react-native';

const createStyles = (colors) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  
  // Mês Atual no topo
  currentMonthText: {
    color: colors.onPrimary,
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
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  toggleBtnActive: { backgroundColor: colors.text },
  toggleText: { color: colors.surfaceAlt, fontWeight: '600' },
  toggleTextActive: { color: colors.onPrimary, fontWeight: 'bold' },

  // Semana
  weekContainer: {
    flexDirection: 'row',
    justify: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  weekDayCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
  },
  weekDayCardActive: { backgroundColor: colors.primary },
  weekDayName: { color: colors.secondary, fontSize: 10, fontWeight: 'bold' },
  weekDayNum: { color: colors.onPrimary, fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  weekDayTextActive: { color: colors.text },

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
    color: colors.onPrimary,
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
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayOfWeekText: {
    flex: 1,
    color: colors.secondary,
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
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayCellOtherMonth: {
    backgroundColor: 'transparent',
    opacity: 0.3,
  },
  calendarDayCellActive: {
    backgroundColor: colors.primary,
  },
  calendarDayText: {
    color: colors.onPrimary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  calendarDayTextActive: {
    color: colors.text,
  },

  // Listagem
  listContent: { paddingHorizontal: 16, paddingBottom: 80 },
  cardEvent: {
    flexDirection: 'row',
    backgroundColor: colors.text,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardCompleted: { opacity: 0.6 },
  timeBox: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: colors.textSoft,
    alignItems: 'center',
  },
  dateLabel: { color: colors.muted, fontSize: 11 },
  timeLabel: { color: colors.onPrimary, fontSize: 16, fontWeight: 'bold' },
  checkboxIcon: { marginTop: 4 },
  eventDetails: { paddingLeft: 12, flex: 1 },
  eventTitle: { color: colors.onPrimary, fontSize: 15, fontWeight: 'bold' },
  textCompleted: { textDecorationLine: 'line-through', color: colors.muted },
  eventDesc: { color: colors.border, fontSize: 12, marginTop: 2 },
  eventMeta: { color: colors.muted, fontSize: 11, marginTop: 2 },
  deleteBtn: { padding: 6 },

  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.primary, fontSize: 14, fontWeight: '600', marginTop: 8 },
  loadingIndicator: { marginTop: 40 },
});

export default createStyles;
