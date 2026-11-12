
import { StyleSheet } from 'react-native';

const createStyles = (colors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },

    modal: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      height: '88%',
      paddingTop: 20,
      paddingHorizontal: 18,
      paddingBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },

    handle: {
      width: 42,
      height: 5,
      borderRadius: 5,
      backgroundColor: colors.muted,
      alignSelf: 'center',
      marginBottom: 18,
      opacity: 0.6,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    },

    title: {
      fontSize: 21,
      fontWeight: '800',
      color: colors.text,
    },

    subtitle: {
      fontSize: 13,
      color: colors.muted,
      marginBottom: 18,
      lineHeight: 19,
    },

    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginBottom: 14,
      height: 46,
    },

    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 14,
      marginLeft: 9,
    },

    filters: {
      flexDirection: 'row',
      gap: 8,
      paddingBottom: 14,
    },

    filter: {
      paddingHorizontal: 13,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.input,
      borderWidth: 1,
      borderColor: colors.border,
      height: 35,
      marginBottom: 14,
    },

    filterActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    filterText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: '600',
    },

    filterTextActive: {
      color: colors.onPrimary,
    },

    card: {
      backgroundColor: colors.input,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 15,
      marginBottom: 12,
    },

    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12,
    },

    avatar: {
      width: 45,
      height: 45,
      borderRadius: 13,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },

    professionalName: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '800',
    },

    professionalFormation: {
      color: colors.muted,
      fontSize: 12,
      marginTop: 3,
    },

    areaBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primary,
      paddingHorizontal: 9,
      paddingVertical: 5,
      borderRadius: 7,
      marginBottom: 9,
    },

    areaText: {
      color: colors.onPrimary,
      fontSize: 11,
      fontWeight: '700',
    },

    description: {
      color: colors.text,
      fontSize: 13,
      lineHeight: 19,
      marginBottom: 10,
    },

    network: {
      color: colors.muted,
      fontSize: 12,
      marginBottom: 13,
    },

    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 9,
      padding: 10,
      marginTop: 7,
      gap: 9,
    },

    contactText: {
      flex: 1,
      color: colors.text,
      fontSize: 12,
    },

    copyText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: '800',
    },

    empty: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 45,
    },

    emptyText: {
      color: colors.muted,
      fontSize: 14,
      textAlign: 'center',
      marginTop: 10,
    },

    footer: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
      marginTop: 5,
    },

    footerText: {
      color: colors.muted,
      fontSize: 11,
      textAlign: 'center',
      lineHeight: 16,
    },
  });

export default createStyles;
