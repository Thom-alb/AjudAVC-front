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
  header: {
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
    color: "#EAF3FA",
    fontWeight: "400",
  },
  groupNameTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteLabel: {
    color: "#EAF3FA",
    fontSize: 13,
    marginBottom: 4,
  },
  inviteCode: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  copyButton: {
    backgroundColor: colors.primaryLight,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    gap: 6,
  },
  copyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  /* Título da Seção */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  /* Cards dos Membros */
  memberCard: {
    backgroundColor: "rgba(36, 78, 112, 0.6)",
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
    backgroundColor: colors.primaryLight,
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
    color: "#FFFFFF",
  },
  memberRole: {
    fontSize: 13,
    color: "#EAF3FA",
    marginTop: 2,
  },
  emptyText: {
    color: "#EAF3FA",
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
  backgroundColor: '#73A5C6',
},
editGroupButton: {
  padding: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: 8,
},
patientCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#EFF6FF',
  borderColor: '#BFDBFE',
  borderWidth: 1,
  borderRadius: 12,
  padding: 14,
  marginBottom: 16,
},
patientAvatar: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: '#FFE4E6',
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
  color: '#E11D48',
  textTransform: 'uppercase',
},
patientName: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#1E293B',
},
patientDetails: {
  fontSize: 13,
  color: '#64748B',
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
  backgroundColor: '#F1F5F9',
  borderRadius: 8,
  paddingVertical: 10,
  borderWidth: 1,
  borderColor: '#E2E8F0',
},

strokeSummaryNumber: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#2E618E',
},

strokeSummaryLabel: {
  fontSize: 11,
  color: '#475569',
  marginTop: 2,
},

lastStrokeBox: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  backgroundColor: '#F8FAFC',
  borderWidth: 1,
  borderColor: '#CBD5E1',
  borderRadius: 8,
  padding: 12,
  marginTop: 10,
},

lastStrokeLabel: {
  fontSize: 12,
  color: '#64748B',
},

lastStrokeDate: {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#0F172A',
  marginTop: 2,
},
});

export default createStyles;