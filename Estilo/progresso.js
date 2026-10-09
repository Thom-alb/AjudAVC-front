import { StyleSheet } from 'react-native';

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1F2C',
    paddingTop: 15,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Sub-abas Registro / Resumo
  tabSelector: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#38BDF8',
  },
  tabText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },

  // Container Principal (Card)
  card: {
    backgroundColor: '#0e375a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },

  // Sliders
  sliderGroup: {
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
  },
  scoreValue: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
  },

  // Seleção de Humor Ajustada
  moodListContainer: {
    marginTop: 8,
    gap: 8,
  },
  moodItem: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodItemActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  moodLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  moodText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  moodTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },

  // Controles de Incremento/Decremento (+ e -)
  scoreControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 6,
  },
  scoreControlBtn: {
    padding: 4,
  },
  scoreControlValue: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 15,
    minWidth: 18,
    textAlign: 'center',
  },

  // Formulários
  textArea: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    color: '#F8FAFC',
    fontSize: 14,
    marginTop: 8,
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#334155',
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: '#0284C7',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Mês / Chips
  monthPickerContainer: {
    marginBottom: 12,
  },
  monthChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  monthChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  monthChipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  monthChipTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },

  // Resumo: Métricas
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  metricBadge: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    color: '#38bdf8',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },

  // Gráfico de Barras (Humor)
  chartBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  barItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  barCount: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 4,
  },
  bar: {
    width: 18,
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  barLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },

  // Cards de Histórico
  historyCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyAuthor: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  historyDate: {
    color: '#64748B',
    fontSize: 11,
  },
  historyDesc: {
    color: '#CBD5E1',
    fontSize: 13,
    marginTop: 4,
  },

  // Estado Vazio
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default createStyles;