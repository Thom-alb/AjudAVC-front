import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0e1f2c",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#0e1f2c",
  },
  header: {
    backgroundColor: "#244E70",
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeText: {
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
    backgroundColor: "#244E70",
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
    backgroundColor: "#6FA4E8",
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
    backgroundColor: "#6FA4E8",
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
});

export default Styles;