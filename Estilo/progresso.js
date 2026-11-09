import { StyleSheet } from 'react-native';

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    backgroundColor: colors.card,
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
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.muted,
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: '700',
  },

  // Container Principal (Card)
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.card,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },

  // Sliders (Comunicação, Mobilidade, Memória)
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
    color: colors.textSoft,
    fontSize: 14,
    fontWeight: '600',
  },
  scoreValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  // Seleção de Humor com Incremento/Decremento (+ e -)
  moodListContainer: {
    marginTop: 8,
    gap: 8,
  },
  moodItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  moodLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  moodText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  moodTextActive: {
    color: colors.text,
    fontWeight: '700',
  },

  // Controles (+ e -) do Humor Ativo
  scoreControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 6,
  },
  scoreControlBtn: {
    padding: 4,
  },
  scoreControlValue: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
    minWidth: 18,
    textAlign: 'center',
  },

  // Formulários e Ações
  textArea: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    fontSize: 14,
    marginTop: 8,
    minHeight: 90,
    borderWidth: 1,
    borderColor: colors.textSoft,
  },
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  saveBtnText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  // Mês / Chips na Aba Resumo
  monthPickerContainer: {
    marginBottom: 12,
  },
  monthChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.textSoft,
  },
  monthChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthChipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  monthChipTextActive: {
    color: colors.text,
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
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },

  // Gráfico de Barras (Contagem de Humor no Mês)
  chartBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    backgroundColor: colors.card,
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
    color: colors.muted,
    fontSize: 11,
    marginBottom: 4,
  },
  bar: {
    width: 18,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  barLabel: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },

  // Cards de Histórico de Registros
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyAuthor: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  historyDate: {
    color: colors.muted,
    fontSize: 11,
  },
  historyDesc: {
    color: colors.textSoft,
    fontSize: 13,
    marginTop: 4,
  },

  // Estado Vazio
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default createStyles;
