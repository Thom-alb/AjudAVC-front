import { StyleSheet } from "react-native";

const createStyles = (colors) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  groupHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    
  },
  welcomeText: {
    marginTop: 15,
    fontSize: 14,
    color: colors.textSoft,
    fontWeight: "400",
  },
  groupNameTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.onPrimary,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  /* Card do Código de Convite */
  cardInvite: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteLabel: {
    color: colors.textSoft,
    fontSize: 13,
    marginBottom: 4,
  },
  inviteCode: {
    color: colors.onPrimary,
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  copyButton: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 6,
  },
  copyButtonText: {
    color: colors.onPrimary,
    fontSize: 14,
    fontWeight: "bold",
  },
  /* Título da Seção */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
    marginBottom: 12,
  },
  /* Cards dos Membros */
  memberCard: {
    backgroundColor: colors.primarySurface,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.onPrimary,
  },
  memberRole: {
    fontSize: 13,
    color: colors.textSoft,
    marginTop: 2,
  },
  emptyText: {
    color: colors.textSoft,
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
  // Adicione ou ajuste no seu arquivo de estilos:
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingVertical: 15,
  backgroundColor: colors.secondary,
},
editGroupButton: {
  padding: 8,
  backgroundColor: colors.onPrimarySurface,
  borderRadius: 8,
},
patientCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.surfaceAlt,
  borderColor: colors.border,
  borderWidth: 1,
  borderRadius: 12,
  padding: 14,
  marginBottom: 16,
},
patientAvatar: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: colors.dangerSurface,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
},
patientInfo: {
  flex: 1,
},
patientTag: {
  fontSize: 11,
  fontWeight: 'bold',
  color: colors.danger,
  textTransform: 'uppercase',
},
patientName: {
  fontSize: 16,
  fontWeight: 'bold',
  color: colors.text,
},
patientDetails: {
  fontSize: 13,
  color: colors.muted,
  marginTop: 2,
},
editPatientButton: {
  padding: 8,
},
permissionButton: {
  padding: 4,
},

strokeSummary: {
  flexDirection: 'row',
  gap: 8,
  marginTop: 4,
},

strokeSummaryItem: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.surfaceAlt,
  borderRadius: 8,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: colors.border,
},

strokeSummaryNumber: {
  fontSize: 20,
  fontWeight: 'bold',
  color: colors.primary,
},

strokeSummaryLabel: {
  fontSize: 11,
  color: colors.textSoft,
  marginTop: 2,
},

lastStrokeBox: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  backgroundColor: colors.background,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 8,
  padding: 12,
  marginTop: 10,
},

lastStrokeLabel: {
  fontSize: 12,
  color: colors.muted,
},

lastStrokeDate: {
  fontSize: 15,
  fontWeight: 'bold',
  color: colors.text,
  marginTop: 2,
},
});

export default createStyles;
