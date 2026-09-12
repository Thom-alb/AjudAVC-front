import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0e1f2c' 
  },

  // Conteúdo com rolagem
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
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
  toggleBtn: { 
    flex: 1, 
    paddingVertical: 8, 
    alignItems: 'center', 
    borderRadius: 8 
  },
  toggleBtnActive: { 
    backgroundColor: '#0F172A' 
  },
  toggleText: { 
    color: '#DBEAFE', 
    fontWeight: '600' 
  },
  toggleTextActive: { 
    color: '#FFFFFF', 
    fontWeight: 'bold' 
  },

  // Seletor de Semana
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  weekDayCardActive: { 
    backgroundColor: '#38BDF8' 
  },
  weekDayName: { 
    color: '#93C5FD', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  weekDayNum: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: 'bold', 
    marginTop: 2 
  },
  weekDayTextActive: { 
    color: '#0F172A' 
  },

  // Calendário do Mês - Grid 7 Colunas
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

  // Cards de Métricas e Destaque de Progresso
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  cardMetric: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  metricValue: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },

  // Card do Gráfico / Análise
  chartCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  chartTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  // Barra de Progresso Customizada
  progressBarBackground: {
    height: 10,
    backgroundColor: '#1E3A8A',
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
    marginVertical: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 5,
  },

  // Listagem de Atividades/Registros do Progresso
  listContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 80 
  },
  cardEvent: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E3A8A',
  },
  cardCompleted: { 
    opacity: 0.6,
    borderColor: '#334155',
  },
  timeBox: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#334155',
    alignItems: 'center',
  },
  dateLabel: { 
    color: '#94A3B8', 
    fontSize: 11 
  },
  timeLabel: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  checkboxIcon: { 
    marginTop: 4 
  },
  eventDetails: { 
    paddingLeft: 12, 
    flex: 1 
  },
  eventTitle: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  textCompleted: { 
    textDecorationLine: 'line-through', 
    color: '#94A3B8' 
  },
  eventDesc: { 
    color: '#CBD5E1', 
    fontSize: 12, 
    marginTop: 2 
  },
  eventMeta: { 
    color: '#94A3B8', 
    fontSize: 11, 
    marginTop: 2 
  },
  deleteBtn: { 
    padding: 6 
  },

  // Feedback Visual
  emptyContainer: { 
    alignItems: 'center', 
    marginTop: 40 
  },
  emptyText: { 
    color: '#93C5FD', 
    fontSize: 14, 
    fontWeight: '600', 
    marginTop: 8 
  },
  loadingIndicator: { 
    marginTop: 40 
  },
});

export default Styles;