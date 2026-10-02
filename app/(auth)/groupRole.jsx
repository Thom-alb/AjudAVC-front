import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Estilos from "../../Estilo/groupRole";
import api from "../../src/service/api";

export default function GroupRole() {
  const router = useRouter();

  // Estados dos Modais
  const [modalHostVisible, setModalHostVisible] = useState(false);
  const [modalMemberVisible, setModalMemberVisible] = useState(false);

  // Estados do formulário (Anfitrião / Líder)
  const [groupName, setGroupName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [importantDescription, setImportantDescription] = useState("");

  // Contagem de AVCs por tipo
  const [strokeCounts, setStrokeCounts] = useState({
    ISCHEMIC: 1,
    HEMORRHAGIC: 0,
    TRANSIENT_ISCHEMIC: 0,
  });

  const strokeTypeLabels = [
    { key: "ISCHEMIC", label: "Isquêmico" },
    { key: "HEMORRHAGIC", label: "Hemorrágico" },
    { key: "TRANSIENT_ISCHEMIC", label: "Transitório (AIT)" },
  ];

  // Opções de Doenças/Comorbidades e Riscos conforme solicitado
  const diseaseOptions = [
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

  // Doenças selecionadas
  const [selectedDiseases, setSelectedDiseases] = useState([]);

  // Estados das Datas (Objetos Date)
  const [strokeDate, setStrokeDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);

  // Controle dos Pickers
  const [showStrokeDatePicker, setShowStrokeDatePicker] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  // Código de convite e loading
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Formata Date -> "YYYY-MM-DD" para a API
  const formatDateToISO = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Formata Date -> "DD/MM/AAAA" para exibição no app
  const formatDateToBR = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const resetForm = () => {
    setGroupName("");
    setPatientName("");
    setStrokeCounts({
      ISCHEMIC: 1,
      HEMORRHAGIC: 0,
      TRANSIENT_ISCHEMIC: 0,
    });
    setSelectedDiseases([]);
    setStrokeDate(null);
    setBirthDate(null);
    setImportantDescription("");
    setShowStrokeDatePicker(false);
    setShowBirthDatePicker(false);
  };

  // Incrementa / Decrementa contador de AVC
  const handleStrokeCountChange = (type, delta) => {
    setStrokeCounts((prev) => {
      const current = prev[type] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [type]: updated };
    });
  };

  // Alterna seleção de comorbidade
  const toggleDisease = (diseaseKey) => {
    setSelectedDiseases((prev) =>
      prev.includes(diseaseKey)
        ? prev.filter((d) => d !== diseaseKey)
        : [...prev, diseaseKey]
    );
  };

  // Handlers para Pickers de Data
  const onChangeStrokeDate = (event, selectedDate) => {
    setShowStrokeDatePicker(Platform.OS === "ios");
    if (selectedDate) setStrokeDate(selectedDate);
  };

  const onChangeBirthDate = (event, selectedDate) => {
    setShowBirthDatePicker(Platform.OS === "ios");
    if (selectedDate) setBirthDate(selectedDate);
  };

  // Handler para criar novo grupo com paciente em chamada única
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do grupo.");
      return;
    }

    if (!patientName.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do paciente.");
      return;
    }

    const totalStrokes = Object.values(strokeCounts).reduce(
      (acc, curr) => acc + curr,
      0
    );

    if (totalStrokes === 0) {
      Alert.alert("Atenção", "Informe ao menos 1 ocorrência de AVC.");
      return;
    }

    if (!strokeDate || !birthDate) {
      Alert.alert(
        "Atenção",
        "Por favor, selecione a data de nascimento e a data do último AVC."
      );
      return;
    }

    setLoading(true);

    const payload = {
      name: groupName.trim(),
      patient: {
        name: patientName.trim(),
        strokeCounts: Object.entries(strokeCounts).map(([type, count]) => ({
          strokeType: type,
          count: count,
        })),
        diseases: selectedDiseases,
        lastStrokeDate: formatDateToISO(strokeDate),
        birthDate: formatDateToISO(birthDate),
        importantDescription: importantDescription.trim() || null,
      },
    };

    try {
      const response = await api.post("/groups", payload);
      const groupData = response.data;

      if (groupData?.id) {
        await AsyncStorage.setItem("activeGroupId", String(groupData.id));
      }

      setModalHostVisible(false);
      resetForm();
      router.replace("/(tabs)/group");
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao criar grupo.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  // Handler para entrar em um grupo existente (Ajudante)
  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Atenção", "Por favor, digite o código de convite.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/groups/join", {
        inviteCode: inviteCode.trim(),
      });

      if (response.data?.id) {
        await AsyncStorage.setItem("activeGroupId", String(response.data.id));
      }

      setModalMemberVisible(false);
      setInviteCode("");
      router.replace("/(tabs)/group");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Código inválido ou não encontrado.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("activeGroupId");
    router.replace("/");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0e1f2c" }}
      contentContainerStyle={Estilos.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={Estilos.titulo}>Você é:</Text>

      {/* CARD ANFITRIÃO */}
      <Pressable
        style={Estilos.card}
        onPress={() => setModalHostVisible(true)}
      >
        <Text style={Estilos.cardTitulo}>Anfitrião</Text>
        <Text style={Estilos.cardSubtitulo}>Líder de Grupo</Text>
        <View style={Estilos.usuarioIcone}>
          <View style={Estilos.cabeca} />
          <View style={Estilos.corpo} />
        </View>
      </Pressable>

      <Text style={Estilos.ou}>Ou</Text>

      {/* CARD AJUDANTE */}
      <Pressable
        style={Estilos.card}
        onPress={() => setModalMemberVisible(true)}
      >
        <Text style={Estilos.cardTitulo}>Ajudante</Text>
        <Text style={Estilos.cardSubtitulo}>Membro de Grupo</Text>
        <View style={Estilos.grupoIcone}>
          <View style={Estilos.pessoaFundoEsquerda}>
            <View style={Estilos.cabecaPequena} />
            <View style={Estilos.corpoPequeno} />
          </View>
          <View style={Estilos.pessoaPrincipal}>
            <View style={Estilos.cabeca} />
            <View style={Estilos.corpo} />
          </View>
          <View style={Estilos.pessoaFundoDireita}>
            <View style={Estilos.cabecaPequena} />
            <View style={Estilos.corpoPequeno} />
          </View>
        </View>
      </Pressable>

      <Pressable onPress={handleLogout} style={Estilos.botaoSair}>
        <Text style={Estilos.textoSair}>Sair</Text>
      </Pressable>

      {/* MODAL LÍDER: CRIAR GRUPO E PACIENTE NO MESMO FORMULÁRIO */}
      <Modal visible={modalHostVisible} transparent animationType="slide">
        <View style={customModalStyles.overlay}>
          <View style={customModalStyles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={Estilos.title}>Criar Grupo e Cadastrar Paciente</Text>
              <Text style={Estilos.subtitle}>
                Preencha as informações do grupo e do paciente assistido.
              </Text>

              {/* DADOS DO GRUPO */}
              <Text style={Estilos.sectionHeader}>Dados do Grupo</Text>
              <TextInput
                style={Estilos.input}
                placeholder="Nome do Grupo *"
                placeholderTextColor="#A0C1E5"
                value={groupName}
                onChangeText={setGroupName}
              />

              {/* DADOS DO PACIENTE */}
              <Text style={Estilos.sectionHeader}>Dados do Paciente</Text>
              <TextInput
                style={Estilos.input}
                placeholder="Nome do Paciente *"
                placeholderTextColor="#A0C1E5"
                value={patientName}
                onChangeText={setPatientName}
              />

              {/* CONTAGEM DE AVC POR TIPO */}
              <Text style={Estilos.label}>Ocorrências de AVC por Tipo *</Text>
              <View style={customModalStyles.counterGroup}>
                {strokeTypeLabels.map((item) => {
                  const count = strokeCounts[item.key] || 0;
                  return (
                    <View key={item.key} style={customModalStyles.counterRow}>
                      <Text style={customModalStyles.counterLabel}>
                        {item.label}
                      </Text>
                      <View style={customModalStyles.counterControls}>
                        <TouchableOpacity
                          style={customModalStyles.counterBtn}
                          onPress={() =>
                            handleStrokeCountChange(item.key, -1)
                          }
                        >
                          <Text style={customModalStyles.counterBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={customModalStyles.counterValue}>
                          {count}
                        </Text>
                        <TouchableOpacity
                          style={customModalStyles.counterBtn}
                          onPress={() =>
                            handleStrokeCountChange(item.key, 1)
                          }
                        >
                          <Text style={customModalStyles.counterBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* LISTA DE DOENÇAS PREEXISTENTES / RISCOS */}
              <Text style={Estilos.label}>Doenças Preexistentes / Riscos</Text>
              <View style={Estilos.diseasesContainer}>
                {diseaseOptions.map((disease) => {
                  const isChecked = selectedDiseases.includes(disease.key);
                  return (
                    <TouchableOpacity
                      key={disease.key}
                      style={Estilos.diseaseRow}
                      onPress={() => toggleDisease(disease.key)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          Estilos.checkboxBase,
                          isChecked && Estilos.checkboxChecked,
                        ]}
                      >
                        {isChecked && (
                          <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "bold" }}>
                            ✓
                          </Text>
                        )}
                      </View>
                      <Text style={Estilos.diseaseText}>{disease.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* SELEÇÃO DE DATA DO ÚLTIMO AVC */}
              <TouchableOpacity
                style={customModalStyles.dateInput}
                onPress={() => setShowStrokeDatePicker(true)}
              >
                <Text
                  style={
                    strokeDate
                      ? customModalStyles.dateTextSelected
                      : customModalStyles.dateTextPlaceholder
                  }
                >
                  {strokeDate
                    ? `Data do Último AVC: ${formatDateToBR(strokeDate)}`
                    : "Selecionar Data do Último AVC *"}
                </Text>
              </TouchableOpacity>

              {showStrokeDatePicker && (
                <DateTimePicker
                  value={strokeDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  onChange={onChangeStrokeDate}
                />
              )}

              {/* SELEÇÃO DE DATA DE NASCIMENTO */}
              <TouchableOpacity
                style={customModalStyles.dateInput}
                onPress={() => setShowBirthDatePicker(true)}
              >
                <Text
                  style={
                    birthDate
                      ? customModalStyles.dateTextSelected
                      : customModalStyles.dateTextPlaceholder
                  }
                >
                  {birthDate
                    ? `Nascimento: ${formatDateToBR(birthDate)}`
                    : "Selecionar Data de Nascimento *"}
                </Text>
              </TouchableOpacity>

              {showBirthDatePicker && (
                <DateTimePicker
                  value={birthDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()}
                  onChange={onChangeBirthDate}
                />
              )}

              {/* OBSERVAÇÕES / DESCRIÇÃO */}
              <TextInput
                style={[Estilos.input, customModalStyles.textArea]}
                placeholder="Observações / Descrição importante"
                placeholderTextColor="#A0C1E5"
                multiline
                numberOfLines={3}
                value={importantDescription}
                onChangeText={setImportantDescription}
              />

              {/* BOTÕES DE AÇÃO */}
              <View style={customModalStyles.buttonRow}>
                <TouchableOpacity
                  style={[customModalStyles.btn, customModalStyles.btnCancel]}
                  onPress={() => {
                    setModalHostVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={Estilos.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[Estilos.buttonPrimary, { flex: 1, marginTop: 0 }]}
                  onPress={handleCreateGroup}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={Estilos.buttonText}>Cadastrar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: ENTRAR EM GRUPO (AJUDANTE) */}
      <Modal visible={modalMemberVisible} transparent animationType="slide">
        <View style={customModalStyles.overlay}>
          <View style={customModalStyles.modalCard}>
            <Text style={Estilos.title}>Entrar em um Grupo</Text>
            <Text style={Estilos.subtitle}>
              Insira o código de convite fornecido pelo Anfitrião.
            </Text>

            <TextInput
              style={Estilos.input}
              placeholder="Código de Convite"
              placeholderTextColor="#A0C1E5"
              autoCapitalize="characters"
              value={inviteCode}
              onChangeText={setInviteCode}
            />

            <View style={customModalStyles.buttonRow}>
              <TouchableOpacity
                style={[customModalStyles.btn, customModalStyles.btnCancel]}
                onPress={() => setModalMemberVisible(false)}
              >
                <Text style={Estilos.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[Estilos.buttonPrimary, { flex: 1, marginTop: 0 }]}
                onPress={handleJoinGroup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={Estilos.buttonText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const customModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#244E70",
    borderRadius: 24,
    padding: 20,
    elevation: 5,
  },
  dateInput: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#6C9BCF",
    justifyContent: "center",
  },
  dateTextPlaceholder: {
    color: "#A0C1E5",
    fontSize: 16,
  },
  dateTextSelected: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  btn: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },

  // Contadores de AVC
  counterGroup: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  counterLabel: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  counterControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6FA4E8",
    justifyContent: "center",
    alignItems: "center",
  },
  counterBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  counterValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
});