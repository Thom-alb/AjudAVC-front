
import { StyleSheet } from 'react-native';

const createStyles = (colors) =>
  StyleSheet.create({
    // Fundo atrás do menu do FAB
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
      zIndex: 998,
    },

    fabContainer: {
      position: 'absolute',
      right: 20,
      bottom: 130,
      alignItems: 'flex-end',
      zIndex: 999,
    },

    // Botão principal
    mainFab: {
      backgroundColor: colors.primary,
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.22)',
      elevation: 8,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.28,
      shadowRadius: 5,
    },

    mainFabActive: {
      backgroundColor: colors.danger,
    },

    // Opções do menu
    optionsContainer: {
      marginBottom: 14,
      alignItems: 'flex-end',
      gap: 12,
    },

    optionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },

    optionText: {
      color: colors.text,
      fontWeight: '700',
      fontSize: 13,
      backgroundColor: colors.card,
      paddingVertical: 10,
      paddingHorizontal: 13,
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.16,
      shadowRadius: 3,
    },

    optionIconBox: {
      backgroundColor: colors.primary,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      elevation: 5,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },

    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      padding: 20,
    },

    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 12,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },

    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    modalTitle: {
      fontSize: 19,
      fontWeight: 'bold',
      color: colors.text,
    },

    label: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
      marginTop: 10,
      marginBottom: 6,
    },

    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 11,
      fontSize: 14,
      backgroundColor: colors.input,
      color: colors.text,
      minHeight: 44,
    },

    pickerRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 5,
    },

    pickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      padding: 12,
      backgroundColor: colors.input,
      minHeight: 46,
    },

    pickerButtonText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '600',
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
      borderRadius: 8,
      backgroundColor: colors.border,
    },

    catChipActive: {
      backgroundColor: colors.primary,
    },

    catChipText: {
      fontSize: 11,
      color: colors.text,
      fontWeight: 'bold',
    },

    catChipTextActive: {
      color: colors.onPrimary,
    },

    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 10,
      marginTop: 22,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },

    cancelBtn: {
      paddingVertical: 11,
      paddingHorizontal: 16,
      borderRadius: 9,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
    },

    cancelBtnText: {
      color: colors.text,
      fontWeight: '700',
      fontSize: 13,
    },

    saveBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 9,
      minWidth: 95,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
    },

    saveBtnText: {
      color: colors.onPrimary,
      fontWeight: 'bold',
      fontSize: 13,
    },
  });

export default createStyles;
