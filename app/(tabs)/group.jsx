import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import api from "../../src/service/api";
import createEstilos from "../../Estilo/group";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../contexts/ThemeContext";

const DISEASE_OPTIONS = [
  { key: "HIPERTENSAO", label: "Hipertensão" },
  { key: "COLESTEROL_ALTO", label: "Colesterol Alto" },
  { key: "DIABETES_TIPO_1", label: "Diabetes Tipo 1" },
  { key: "DIABETES_TIPO_2", label: "Diabetes Tipo 2" },
  { key: "OBESIDADE", label: "Obesidade" },
  { key: "HIPOTIREOIDISMO", label: "Hipotireoidismo" },
  { key: "OSTEOARTRITE", label: "Osteoartrite" },
  { key: "OSTEOPOROSE", label: "Osteoporose" },
  { key: "ANSIEDADE", label: "Ansiedade" },
  { key: "DEPRESSAO", label: "Depressão" },
  { key: "ALZHEIMER", label: "Alzheimer" },
  { key: "INFARTO_AGUDO_DO_MIOCARDIO", label: "Infarto Agudo do Miocárdio" },
  { key: "DPOC", label: "DPOC" },
  { key: "DEMENCIA", label: "Demência" },
  { key: "CANCER", label: "Câncer" },
];

export default function GroupScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const Estilos = useMemo(() => createEstilos(colors), [colors]);

  const [group, setGroup] = useState(null);
  const [patient, setPatient] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedMemberId, setExpandedMemberId] = useState(null);

  const [patientModalVisible, setPatientModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [memberActionsVisible, setMemberActionsVisible] = useState(false);
  const [permissionsSaving, setPermissionsSaving] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [savingGroup, setSavingGroup] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientBirthDate, setPatientBirthDate] = useState("");
  const [importantDescription, setImportantDescription] = useState("");
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [strokesList, setStrokesList] = useState([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(new Date());

  const [newStrokeType, setNewStrokeType] = useState("ISQUEMICO");
  const [newStrokeDate, setNewStrokeDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [showStrokeDatePicker, setShowStrokeDatePicker] = useState(false);
  const [strokeDatePickerValue, setStrokeDatePickerValue] = useState(
    new Date(),
  );

  const [groupName, setGroupName] = useState("");
  const [savingPatient, setSavingPatient] = useState(false);

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informada";

    const parts = dateString.split("-");

    if (parts.length !== 3) return dateString;

    const [year, month, day] = parts;

    return `${day}/${month}/${year}`;
  };

  const getStrokeCounts = (strokes) => {
    const counts = {
      ISCHEMIC: 0,
      HEMORRHAGIC: 0,
      TRANSIENT: 0,
    };

    if (!Array.isArray(strokes)) {
      return counts;
    }

    strokes.forEach((stroke) => {
      const type =
        typeof stroke === "string"
          ? stroke
          : stroke?.strokeType || stroke?.type;

      if (counts[type] !== undefined) {
        counts[type]++;
      }
    });

    return counts;
  };

  const getLastStrokeDate = (strokes) => {
    if (!Array.isArray(strokes) || strokes.length === 0) {
      return "";
    }

    const validStrokes = strokes.filter((stroke) => stroke?.strokeDate);

    if (validStrokes.length === 0) {
      return "";
    }

    const sortedStrokes = [...validStrokes].sort(
      (a, b) =>
        new Date(b.strokeDate).getTime() - new Date(a.strokeDate).getTime(),
    );

    return sortedStrokes[0].strokeDate;
  };

  const populateFormWithPatientData = (patientData) => {
    if (!patientData) return;
    setPatientName(patientData.name || "");
    const birth = patientData.birthDate || "";
    setPatientBirthDate(birth);

    if (birth) {
      const parsedDate = new Date(birth);
      if (!isNaN(parsedDate.getTime())) {
        setDatePickerValue(parsedDate);
      }
      const computedAge = calculateAge(birth);
      setPatientAge(computedAge !== null ? String(computedAge) : "");
    }

    setImportantDescription(
      patientData.importantDescription || patientData.observations || "",
    );

    // Mapeamento robusto para extrair o tipo da doença e normalizar
    if (Array.isArray(patientData.diseases)) {
      const normalizedDiseases = patientData.diseases
        .map((disease) => {
          if (!disease) return null;
          if (typeof disease === "string") return disease.trim().toUpperCase();
          return (
            disease?.type ||
            disease?.diseaseType ||
            disease?.key ||
            disease?.name ||
            ""
          )
            .toString()
            .trim()
            .toUpperCase();
        })
        .filter(Boolean);

      setSelectedDiseases(normalizedDiseases);
    } else {
      setSelectedDiseases([]);
    }

    // Mapeamento dos AVCs
    if (Array.isArray(patientData.strokes)) {
      const normalizedStrokes = patientData.strokes.map((stroke) => ({
        id: stroke?.id || null,
        strokeType: stroke?.strokeType || stroke?.type || "ISQUEMICO",
        strokeDate: stroke?.strokeDate || stroke?.date || null,
      }));
      setStrokesList(normalizedStrokes);
    } else {
      setStrokesList([]);
    }
  };

  const toggleMemberPermissions = (memberId) => {
    setExpandedMemberId((current) => (current === memberId ? null : memberId));
  };

  const handleAgeChange = (textAge) => {
    setPatientAge(textAge);

    const numericAge = parseInt(textAge, 10);

    if (!isNaN(numericAge) && numericAge >= 0 && numericAge <= 120) {
      const currentYear = new Date().getFullYear();
      const calculatedBirthYear = currentYear - numericAge;

      let monthDay = "01-01";

      if (patientBirthDate && patientBirthDate.includes("-")) {
        const parts = patientBirthDate.split("-");

        if (parts.length === 3) {
          monthDay = `${parts[1]}-${parts[2]}`;
        }
      }

      setPatientBirthDate(`${calculatedBirthYear}-${monthDay}`);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      setDatePickerValue(selectedDate);

      const isoDate = selectedDate.toISOString().split("T")[0];

      setPatientBirthDate(isoDate);

      const calculatedAge = calculateAge(isoDate);

      if (calculatedAge !== null) {
        setPatientAge(String(calculatedAge));
      }
    }
  };

  const handleStrokeDateChange = (event, selectedDate) => {
    setShowStrokeDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      setStrokeDatePickerValue(selectedDate);

      const isoDate = selectedDate.toISOString().split("T")[0];

      setNewStrokeDate(isoDate);
    }
  };

  const getPrimaryStrokeType = (patientData, localStrokes) => {
    const list =
      localStrokes && localStrokes.length > 0
        ? localStrokes
        : patientData?.strokes;
    if (!Array.isArray(list) || list.length === 0) {
      return "Sem registro";
    }

    const counts = { ISQUEMICO: 0, HEMORRAGICO: 0, ISQUEMICO_TRANSITORIO: 0 };
    list.forEach((s) => {
      const type = s?.strokeType || s?.type;
      if (counts[type] !== undefined) counts[type]++;
    });

    const total = list.length;
    let parts = [];
    if (counts.ISQUEMICO > 0) parts.push(`${counts.ISQUEMICO} Isquêmico(s)`);
    if (counts.HEMORRAGICO > 0)
      parts.push(`${counts.HEMORRAGICO} Hemorrágico(s)`);
    if (counts.ISQUEMICO_TRANSITORIO > 0)
      parts.push(`${counts.ISQUEMICO_TRANSITORIO} AIT`);

    return parts.length > 0 ? parts.join(", ") : `${total} Registrado(s)`;
  };

  const fetchData = async () => {
    try {
      console.log("[GROUP DEBUG] Buscando grupo...");

      const groupRes = await api.get("/groups/me");

      console.log("[GROUP DEBUG] Resposta /groups/me:", groupRes.data);

      const groupData = groupRes.data;

      setGroup(groupData);
      setGroupName(groupData?.name || "");

      try {
        const userRes = await api.get("/users/me");

        console.log("[USER DEBUG] /users/me:", userRes.data);

        setCurrentUser(userRes.data);
      } catch (errorUsers) {
        console.log("[USER DEBUG] Erro /users/me:", {
          status: errorUsers.response?.status,
          data: errorUsers.response?.data,
          message: errorUsers.message,
        });

        try {
          const userRes = await api.get("/auth/me");

          console.log("[USER DEBUG] Usuário autenticado:", userRes.data);

          setCurrentUser(userRes.data);
        } catch (error) {
          console.error("[USER DEBUG] Erro ao consultar usuário:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
          });

          setCurrentUser(null);
        }
      }

      let fetchedPatient = null;

      if (groupData?.patient) {
        fetchedPatient = groupData.patient;
      } else {
        try {
          const patientRes = await api.get("/patients/me");
          fetchedPatient = patientRes.data;
        } catch (patientErr) {
          console.log("Paciente ainda não cadastrado para este grupo.");
          fetchedPatient = null;
        }
      }
      setPatient(fetchedPatient);

      if (groupData?.id) {
        const membersRes = await api.get(
          `/group-members?groupId=${groupData.id}`,
        );
        setMembers(membersRes.data || []);
      }
    } catch (error) {
      console.error("========== ERRO FETCH DATA ==========");
      console.error("Mensagem:", error.message);
      console.error("Status HTTP:", error.response?.status);
      console.error("Resposta backend:", error.response?.data);
      console.error("URL:", error.config?.url);
      console.error("=====================================");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const copyInviteCode = async () => {
    if (group?.inviteCode) {
      await Clipboard.setStringAsync(group.inviteCode);

      Alert.alert(
        "Código Copiado!",
        "Código copiado para a área de transferência.",
      );
    }
  };

  const handleOpenEditPatient = () => {
    populateFormWithPatientData(patient);

    setPatientModalVisible(true);
  };

  const toggleDisease = (diseaseType) => {
    setSelectedDiseases((prev) => {
      const upperType = String(diseaseType).trim().toUpperCase();
      if (prev.includes(upperType)) {
        return prev.filter(
          (item) => String(item).trim().toUpperCase() !== upperType,
        );
      } else {
        return [...prev, upperType];
      }
    });
  };

  const handleAddStroke = () => {
    if (!newStrokeDate) {
      Alert.alert("Aviso", "Selecione a data do AVC.");
      return;
    }

    const newEntry = {
      id: null,
      strokeType: newStrokeType,
      strokeDate: newStrokeDate,
    };

    setStrokesList([...strokesList, newEntry]);
  };

  const handleRemoveStroke = (index) => {
    const updated = [...strokesList];

    updated.splice(index, 1);

    setStrokesList(updated);
  };

  const handleSavePatient = async () => {
    if (!patientName.trim()) {
      Alert.alert("Aviso", "O nome do paciente é obrigatório.");
      return;
    }

    setSavingPatient(true);

    try {
      const payload = {
        name: patientName.trim(),
        birthDate: patientBirthDate || null,
        importantDescription: importantDescription.trim(),
        diseases: selectedDiseases.map((d) => String(d).trim().toUpperCase()),
        strokes: strokesList.map((stroke) => ({
          strokeType: stroke.strokeType,
          strokeDate: stroke.strokeDate,
        })),
      };

      let response;
      if (patient?.id) {
        response = await api.put(`/patients/${patient.id}`, payload);
      } else {
        response = await api.post("/patients", payload);
      }

      const updatedPatient = response.data || payload;
      setPatient(updatedPatient);
      Alert.alert("Sucesso", "Informações salvas com sucesso!");
      setPatientModalVisible(false);
      await fetchData();
    } catch (error) {
      console.error(
        "Erro ao salvar paciente:",
        error.response?.data || error.message,
      );
      const msg =
        error.response?.data?.message || "Falha ao salvar dados do paciente.";
      Alert.alert("Erro", msg);
    } finally {
      setSavingPatient(false);
    }
  };

  const isLeader = Boolean(
    currentUser?.id &&
    members.some(
      (member) =>
        member.role === "LEADER" &&
        String(member.userId) === String(currentUser.id),
    ),
  );

  console.log("========== DEBUG GRUPO ==========");
  console.log("É líder?", isLeader);
  console.log("Usuário atual:", currentUser);
  console.log("Líder do grupo:", group?.leader);
  console.log("Integrantes:", JSON.stringify(members, null, 2));
  console.log("=================================");

  const handleOpenMemberActions = (member) => {
    if (!isLeader || member.role === "LEADER") return;
    setSelectedMember(member);
    setMemberActionsVisible(true);
  };

  const handleTransferLeadership = (member) => {
    if (!isLeader) {
      Alert.alert(
        "Acesso negado",
        "Somente o líder pode transferir a liderança.",
      );
      return;
    }

    if (member.role === "LEADER") {
      Alert.alert("Atenção", "Este integrante já é o líder.");
      return;
    }

    Alert.alert(
      "Transferir liderança",
      `Deseja realmente transferir a liderança para ${member.userName}?\n\nVocê deixará de ser o líder do grupo.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Transferir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.put(`/group-members/${member.id}/transfer-leadership`);

              Alert.alert("Sucesso", "A liderança foi transferida.");

              await fetchData();
            } catch (error) {
              console.error(
                "[GROUP] Erro ao transferir liderança:",
                error.response?.data || error.message,
              );

              Alert.alert(
                "Erro",
                error.response?.data?.message ||
                  "Não foi possível transferir a liderança.",
              );
            }
          },
        },
      ],
    );
  };

  const handleTogglePermission = async (member, permission, value) => {
    if (!member?.id || !isLeader || permissionsSaving) return;

    const previous = {
      canEditRoutine: Boolean(member.canEditRoutine),
      canEditProgress: Boolean(member.canEditProgress),
    };

    const next = {
      ...previous,
      [permission]: value,
    };

    setPermissionsSaving(true);

    // Atualização otimista: o switch muda imediatamente.
    setMembers((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, ...next } : item,
      ),
    );

    try {
      const response = await api.put(
        `/group-members/${member.id}/permissions`,
        next,
      );

      const updated = response.data;

      if (updated) {
        setMembers((current) =>
          current.map((item) =>
            item.id === member.id ? { ...item, ...updated } : item,
          ),
        );
      }
    } catch (error) {
      // Se a API falhar, restaura os valores anteriores.
      setMembers((current) =>
        current.map((item) =>
          item.id === member.id ? { ...item, ...previous } : item,
        ),
      );

      console.error(
        "[GROUP] Erro ao atualizar permissões:",
        error.response?.status,
        error.response?.data || error.message,
      );

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível atualizar as permissões.",
      );
    } finally {
      setPermissionsSaving(false);
    }
  };

  const handleChangeMemberRole = async (role) => {
    if (!selectedMember?.id || !isLeader) return;
    try {
      await api.put(`/group-members/${selectedMember.id}/role`, { role });
      setMemberActionsVisible(false);
      setSelectedMember(null);
      await fetchData();
      Alert.alert("Sucesso", "Função do integrante atualizada.");
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          "Não foi possível alterar a função do integrante.",
      );
    }
  };

  const handleRemoveMember = () => {
    if (!selectedMember?.id || !isLeader) return;
    Alert.alert(
      "Remover ajudante",
      `Deseja remover ${selectedMember.name || selectedMember.userName || "este integrante"} da rede de apoio?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/group-members/${selectedMember.id}`);
              setMemberActionsVisible(false);
              setSelectedMember(null);
              await fetchData();
              Alert.alert("Sucesso", "Integrante removido da rede de apoio.");
            } catch (error) {
              Alert.alert(
                "Erro",
                error.response?.data?.message ||
                  "Não foi possível remover o integrante.",
              );
            }
          },
        },
      ],
    );
  };

  const handleSaveGroupName = async () => {
    const normalizedName = groupName.trim();
    if (!normalizedName) {
      Alert.alert("Atenção", "Informe o nome do grupo.");
      return;
    }
    if (!group?.id || !isLeader) return;
    setSavingGroup(true);
    try {
      const response = await api.put(`/groups/${group.id}`, {
        name: normalizedName,
      });
      setGroup((previous) => ({
        ...previous,
        ...(response.data || {}),
        name: response.data?.name || normalizedName,
      }));
      setGroupModalVisible(false);
      Alert.alert("Sucesso", "Nome do grupo atualizado.");
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Não foi possível atualizar o grupo.",
      );
    } finally {
      setSavingGroup(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={Estilos.loadingContainer}>
        <ActivityIndicator size="large" color="#2E618E" />
      </SafeAreaView>
    );
  }

  const ageDisplay =
    calculateAge(patient?.birthDate) ?? (patient?.age || "N/I");

  const strokeCounts = getStrokeCounts(strokesList);

  const lastStrokeDate = getLastStrokeDate(strokesList);

  return (
    <SafeAreaView
      style={[Estilos.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.primary}
      />

      <View style={[Estilos.header, { backgroundColor: colors.primary }]}>
        <View style={{ flex: 1 }}>
          <Text style={Estilos.welcomeText}>Rede de Apoio</Text>

          <Text style={Estilos.groupNameTitle}>
            {group?.name || "Seu Grupo"}
          </Text>
        </View>

        {isLeader && (
          <TouchableOpacity
            style={Estilos.editGroupButton}
            accessibilityLabel="Editar nome do grupo"
            onPress={() => {
              setGroupName(group?.name || "");
              setGroupModalVisible(true);
            }}
          >
            <Ionicons name="pencil-sharp" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View style={Estilos.content}>
            <View style={Estilos.cardInvite}>
              <View style={Estilos.inviteInfo}>
                <Text style={Estilos.inviteLabel}>Código de Convite</Text>

                <Text style={Estilos.inviteCode}>
                  {group?.inviteCode || "N/A"}
                </Text>
              </View>

              <TouchableOpacity
                style={Estilos.copyButton}
                onPress={copyInviteCode}
              >
                <Ionicons name="copy-outline" size={20} color="#FFFFFF" />

                <Text style={Estilos.copyButtonText}>Copiar</Text>
              </TouchableOpacity>
            </View>

            <Text style={Estilos.sectionTitle}>Integrantes do Grupo</Text>

            <View style={Estilos.patientCard}>
              <View style={Estilos.patientAvatar}>
                <Ionicons name="heart" size={24} color="#E11D48" />
              </View>

              <View style={Estilos.patientInfo}>
                <Text style={Estilos.patientTag}>Paciente Assistido</Text>
                <Text style={Estilos.patientName}>
                  {patient?.name || "Paciente não cadastrado"}
                </Text>
                <Text style={Estilos.patientDetails}>
                  {patient?.birthDate &&
                  calculateAge(patient.birthDate) !== null
                    ? `${calculateAge(patient.birthDate)} anos`
                    : patient?.age
                      ? `${patient.age} anos`
                      : "Idade N/I"}{" "}
                  • {getPrimaryStrokeType(patient, strokesList)}
                </Text>
              </View>

              <TouchableOpacity
                style={Estilos.editPatientButton}
                onPress={handleOpenEditPatient}
              >
                <Ionicons name="pencil" size={20} color="#2E618E" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        renderItem={({ item }) => {
          const isExpanded = expandedMemberId === item.id;
          const isMemberLeader = item.role === "LEADER";

          const permissions = [
            {
              key: "canEditRoutine",
              label: "Editar rotina",
              description: "Criar, alterar e organizar atividades da rotina.",
              allowed: Boolean(item.canEditRoutine),
            },
            {
              key: "canEditProgress",
              label: "Editar progresso",
              description: "Registrar e alterar métricas de progresso.",
              allowed: Boolean(item.canEditProgress),
            },
          ];

          return (
            <View
              style={{
                marginHorizontal: 20,
                marginBottom: 12,
                borderRadius: 16,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                overflow: "hidden",
              }}
            >
              {/* CARTÃO DO INTEGRANTE */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 14,
                }}
              >
                <TouchableOpacity
                  activeOpacity={isLeader && !isMemberLeader ? 0.75 : 1}
                  onPress={() => handleOpenMemberActions(item)}
                  disabled={!isLeader || isMemberLeader}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={[
                      Estilos.avatar,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Ionicons name="person" size={20} color="#FFFFFF" />
                  </View>

                  <View style={Estilos.memberInfo}>
                    <Text style={[Estilos.memberName, { color: colors.text }]}>
                      {item.name ||
                        item.userName ||
                        item.user?.name ||
                        "Membro"}
                    </Text>

                    <Text style={[Estilos.memberRole, { color: colors.muted }]}>
                      {isMemberLeader ? "Anfitrião (Líder)" : "Ajudante"}
                    </Text>
                  </View>

                  {isLeader && !isMemberLeader && (
                    <Ionicons
                      name="ellipsis-vertical"
                      size={20}
                      color={colors.muted}
                    />
                  )}
                </TouchableOpacity>

                {/* BOTÃO EXPANDIR PERMISSÕES */}
                {isLeader && !isMemberLeader && (
                  <TouchableOpacity
                    onPress={() => toggleMemberPermissions(item.id)}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isExpanded
                        ? "Ocultar permissões"
                        : "Visualizar permissões"
                    }
                    style={{
                      marginLeft: 8,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: colors.primary,
                    }}
                  >
                    <Ionicons
                      name={isExpanded ? "remove" : "add"}
                      size={24}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* ÁREA EXPANSÍVEL DE PERMISSÕES */}
              {/* ÁREA EXPANSÍVEL DE PERMISSÕES */}
              {isExpanded && isLeader && !isMemberLeader && (
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    backgroundColor: colors.background,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: colors.text,
                      marginBottom: 12,
                    }}
                  >
                    Permissões do integrante
                  </Text>

                  {/* PERMISSÃO DE ROTINA */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: 14,
                          fontWeight: "600",
                        }}
                      >
                        Editar rotina
                      </Text>

                      <Text
                        style={{
                          color: colors.muted,
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        Permite criar, editar e excluir atividades da agenda.
                      </Text>
                    </View>

                    <Switch
                      value={Boolean(item.canEditRoutine)}
                      onValueChange={(value) =>
                        handleTogglePermission(item, "canEditRoutine", value)
                      }
                      disabled={permissionsSaving}
                      trackColor={{
                        false: colors.border,
                        true: colors.primary,
                      }}
                      thumbColor={
                        Platform.OS === "android" ? colors.card : undefined
                      }
                      ios_backgroundColor={colors.border}
                      accessibilityLabel={`Permitir edição de rotina para ${item.userName || item.name || "integrante"}`}
                    />
                  </View>

                  {/* PERMISSÃO DE PROGRESSO */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 12,
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 12 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontSize: 14,
                          fontWeight: "600",
                        }}
                      >
                        Editar progresso
                      </Text>

                      <Text
                        style={{
                          color: colors.muted,
                          fontSize: 12,
                          marginTop: 3,
                        }}
                      >
                        Permite registrar e alterar métricas de progresso.
                      </Text>
                    </View>

                    <Switch
                      value={Boolean(item.canEditProgress)}
                      onValueChange={(value) =>
                        handleTogglePermission(item, "canEditProgress", value)
                      }
                      disabled={permissionsSaving}
                      trackColor={{
                        false: colors.border,
                        true: colors.primary,
                      }}
                      thumbColor={
                        Platform.OS === "android" ? colors.card : undefined
                      }
                      ios_backgroundColor={colors.border}
                      accessibilityLabel={`Permitir edição de progresso para ${item.userName || item.name || "integrante"}`}
                    />
                  </View>

                  {permissionsSaving && (
                    <ActivityIndicator
                      color={colors.primary}
                      size="small"
                      style={{ marginTop: 8 }}
                    />
                  )}
                </View>
              )}
            </View>
          );
        }}
      />

      <Modal
        visible={groupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <View
          style={[modalStyles.overlay, { backgroundColor: colors.overlay }]}
        >
          <View
            style={[modalStyles.container, { backgroundColor: colors.card }]}
          >
            <View style={modalStyles.header}>
              <Text style={[modalStyles.title, { color: colors.text }]}>
                Editar Grupo
              </Text>
              <TouchableOpacity
                onPress={() => setGroupModalVisible(false)}
                accessibilityLabel="Fechar edição"
              >
                <Ionicons name="close" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>
            <Text style={[modalStyles.label, { color: colors.text }]}>
              Nome do grupo
            </Text>
            <TextInput
              style={[
                modalStyles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                },
              ]}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Nome do grupo"
              placeholderTextColor={colors.placeholder}
              maxLength={100}
              autoFocus
            />
            <View style={modalStyles.buttonRow}>
              <TouchableOpacity
                style={modalStyles.cancelButton}
                onPress={() => setGroupModalVisible(false)}
              >
                <Text style={modalStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.saveButton}
                onPress={handleSaveGroupName}
                disabled={savingGroup}
              >
                {savingGroup ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={modalStyles.saveText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={memberActionsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMemberActionsVisible(false)}
      >
        <View
          style={[modalStyles.overlay, { backgroundColor: colors.overlay }]}
        >
          <View
            style={[modalStyles.container, { backgroundColor: colors.card }]}
          >
            <View style={modalStyles.header}>
              <Text style={[modalStyles.title, { color: colors.text }]}>
                Gerenciar ajudante
              </Text>
              <TouchableOpacity onPress={() => setMemberActionsVisible(false)}>
                <Ionicons name="close" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.muted, marginBottom: 18 }}>
              {selectedMember?.name ||
                selectedMember?.userName ||
                selectedMember?.user?.name ||
                "Integrante"}
            </Text>
            <TouchableOpacity
              style={[
                modalStyles.saveButton,
                { marginBottom: 10, alignItems: "center" },
              ]}
              onPress={() =>
                handleChangeMemberRole(
                  selectedMember?.role === "LEADER" ? "MEMBER" : "LEADER",
                )
              }
            >
              <Text style={modalStyles.saveText}>
                {selectedMember?.role === "LEADER"
                  ? "Definir como ajudante"
                  : "Promover a líder"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#B91C1C",
                padding: 12,
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={handleRemoveMember}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
                Remover da rede de apoio
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                modalStyles.cancelButton,
                { alignSelf: "center", marginTop: 8 },
              ]}
              onPress={() => setMemberActionsVisible(false)}
            >
              <Text style={modalStyles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL GERENCIAR PACIENTE */}
      <Modal
        visible={patientModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPatientModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 16,
          }}
          activeOpacity={1}
          onPress={() => setPatientModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: colors.background,
              borderRadius: 12,
              maxHeight: "90%",
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <SafeAreaView>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: colors.text,
                  }}
                >
                  Editar Paciente
                </Text>
                <TouchableOpacity onPress={() => setPatientModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text
                  style={{
                    color: colors.text,
                    marginBottom: 8,
                    fontWeight: "600",
                  }}
                >
                  Nome do Paciente *
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.input,
                    color: colors.text,
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                  value={patientName}
                  onChangeText={setPatientName}
                  placeholder="Nome completo"
                  placeholderTextColor={colors.placeholder}
                />

                <Text
                  style={{
                    color: colors.text,
                    marginBottom: 8,
                    fontWeight: "600",
                  }}
                >
                  Data de Nascimento
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    backgroundColor: colors.input,
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ color: colors.text }}>
                    {patientBirthDate ? patientBirthDate : "Selecione a data"}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={datePickerValue}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}

                <Text
                  style={{
                    color: colors.text,
                    marginBottom: 8,
                    fontWeight: "600",
                  }}
                >
                  Observações / Informações Importantes
                </Text>
                <TextInput
                  style={{
                    backgroundColor: colors.input,
                    color: colors.text,
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                    minHeight: 80,
                  }}
                  value={importantDescription}
                  onChangeText={setImportantDescription}
                  placeholder="Detalhes médicos relevantes..."
                  placeholderTextColor={colors.placeholder}
                  multiline
                />

                {/* DOENÇAS PRÉ-EXISTENTES (Corrigido para puxar os dados corretamente) */}
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    marginVertical: 12,
                    fontSize: 16,
                  }}
                >
                  Doenças Pré-existentes
                </Text>
                {DISEASE_OPTIONS.map((disease) => {
                  const isSelected = selectedDiseases.some(
                    (d) =>
                      String(d).trim().toUpperCase() ===
                      String(disease.key).trim().toUpperCase(),
                  );

                  return (
                    <TouchableOpacity
                      key={disease.key}
                      onPress={() => toggleDisease(disease.key)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 8,
                      }}
                    >
                      <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={22}
                        color={colors.primary}
                        style={{ marginRight: 10 }}
                      />
                      <Text style={{ color: colors.text, fontSize: 14 }}>
                        {disease.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {/* HISTÓRICO DE AVCs (Mantido no padrão antigo) */}
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    marginTop: 20,
                    marginBottom: 12,
                    fontSize: 16,
                  }}
                >
                  Histórico de AVCs
                </Text>

                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 12,
                      marginBottom: 6,
                    }}
                  >
                    Tipo de AVC
                  </Text>
                  <View
                    style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}
                  >
                    {[
                      { key: "ISQUEMICO", label: "Isquêmico" },
                      { key: "HEMORRAGICO", label: "Hemorrágico" },
                      { key: "ISQUEMICO_TRANSITORIO", label: "AIT" },
                    ].map((typeItem) => (
                      <TouchableOpacity
                        key={typeItem.key}
                        onPress={() => setNewStrokeType(typeItem.key)}
                        style={{
                          flex: 1,
                          paddingVertical: 8,
                          paddingHorizontal: 4,
                          borderRadius: 6,
                          borderWidth: 1,
                          borderColor:
                            newStrokeType === typeItem.key
                              ? colors.primary
                              : colors.border,
                          backgroundColor:
                            newStrokeType === typeItem.key
                              ? colors.primary
                              : colors.input,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color:
                              newStrokeType === typeItem.key
                                ? "#FFF"
                                : colors.text,
                            fontSize: 11,
                            fontWeight: "600",
                          }}
                        >
                          {typeItem.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text
                    style={{
                      color: colors.muted,
                      fontSize: 12,
                      marginBottom: 6,
                    }}
                  >
                    Data do Evento
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowStrokeDatePicker(true)}
                    style={{
                      backgroundColor: colors.input,
                      padding: 12,
                      borderRadius: 8,
                      marginBottom: 10,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <Text style={{ color: colors.text }}>{newStrokeDate}</Text>
                  </TouchableOpacity>

                  {showStrokeDatePicker && (
                    <DateTimePicker
                      value={strokeDatePickerValue}
                      mode="date"
                      display="default"
                      onChange={handleStrokeDateChange}
                      maximumDate={new Date()}
                    />
                  )}

                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.primary,
                      padding: 10,
                      borderRadius: 8,
                      alignItems: "center",
                    }}
                    onPress={handleAddStroke}
                  >
                    <Text style={{ color: colors.primary, fontWeight: "600" }}>
                      + Adicionar AVC ao Histórico
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Lista de AVCs Adicionados */}
                {strokesList.map((stroke, index) => {
                  let labelType = "Isquêmico";
                  if (stroke.strokeType === "HEMORRAGICO") {
                    labelType = "Hemorrágico";
                  } else if (stroke.strokeType === "ISQUEMICO_TRANSITORIO") {
                    labelType = "AIT (Isquêmico Transitório)";
                  }

                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: colors.input,
                        padding: 10,
                        borderRadius: 8,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: colors.border,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: colors.text,
                            fontWeight: "600",
                            fontSize: 13,
                          }}
                        >
                          {labelType}
                        </Text>
                        <Text style={{ color: colors.muted, fontSize: 11 }}>
                          Data: {stroke.strokeDate}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveStroke(index)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#6b5ae8"
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}

                <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    padding: 16,
                    borderRadius: 10,
                    alignItems: "center",
                    marginTop: 24,
                    marginBottom: 40,
                  }}
                  onPress={handleSavePatient}
                  disabled={savingPatient}
                >
                  {savingPatient ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Salvar Alterações
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },

  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    flex: 1,
    marginRight: 10,
  },

  subSectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2E618E",
    marginTop: 18,
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
  },

  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F8FAFC",
  },

  datePickerText: {
    fontSize: 15,
    color: "#0F172A",
  },

  textArea: {
    height: 70,
    textAlignVertical: "top",
  },

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F1F5F9",
  },

  chipSelected: {
    backgroundColor: "#2E618E",
    borderColor: "#2E618E",
  },

  chipText: {
    fontSize: 13,
    color: "#475569",
  },

  chipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  strokeSummary: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },

  strokeSummaryItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  strokeSummaryNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E618E",
  },

  strokeSummaryLabel: {
    fontSize: 11,
    color: "#475569",
    marginTop: 2,
  },

  lastStrokeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },

  lastStrokeLabel: {
    fontSize: 12,
    color: "#64748B",
  },

  lastStrokeDate: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 2,
  },

  strokeDetailCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#2E618E",
  },

  strokeDetailTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },

  strokeDetailText: {
    fontSize: 13,
    color: "#555",
  },

  addStrokeBox: {
    backgroundColor: "#F1F5F9",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  typeBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
  },

  typeBtnActive: {
    backgroundColor: "#2E618E",
    borderColor: "#2E618E",
  },

  typeBtnText: {
    fontSize: 12,
    color: "#333",
  },

  typeBtnTextActive: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "bold",
  },

  addStrokeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E618E",
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    gap: 4,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    marginBottom: 8,
    gap: 12,
  },

  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  cancelText: {
    color: "#64748B",
    fontWeight: "bold",
  },

  saveButton: {
    backgroundColor: "#2E618E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  saveText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
