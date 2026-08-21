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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Estilos from "../Estilo/groupRole";
import api from "../src/service/api";

export default function GroupRole() {
  const router = useRouter();

  // Estados dos Modais
  const [modalHostVisible, setModalHostVisible] = useState(false);
  const [modalMemberVisible, setModalMemberVisible] = useState(false);

  // Estados dos dados do formulário
  const [groupName, setGroupName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [strokeType, setStrokeType] = useState("ISCHEMIC");
  const [importantDescription, setImportantDescription] = useState("");
  // Opções disponíveis
  const strokeTypeOptions = [
    { label: "Isquêmico", value: "ISCHEMIC" },
    { label: "Hemorrágico", value: "HEMORRHAGIC" },
    { label: "Transitório (AIT)", value: "TRANSIENT_ISCHEMIC" },
  ];
  // Estados para as datas (Objetos Date)
  const [strokeDate, setStrokeDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);

  // Estados de controle dos Pickers
  const [showStrokeDatePicker, setShowStrokeDatePicker] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  // Código de convite e loading
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Função utilitária para formatar Date em "YYYY-MM-DD" para o Spring Boot
  const formatDateToISO = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Função utilitária para exibir a data no formato brasileiro "DD/MM/AAAA" na UI
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
    setStrokeType("ISCHEMIC");
    setStrokeDate(null);
    setBirthDate(null);
    setImportantDescription("");
    setShowStrokeDatePicker(false);
    setShowBirthDatePicker(false);
  };

  // Handler de alteração da Data do AVC
  const onChangeStrokeDate = (event, selectedDate) => {
    setShowStrokeDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setStrokeDate(selectedDate);
    }
  };

  // Handler de alteração da Data de Nascimento
  const onChangeBirthDate = (event, selectedDate) => {
    setShowBirthDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  // Criar grupo
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do grupo.");
      return;
    }

    if (!strokeDate || !birthDate) {
      Alert.alert(
        "Atenção",
        "Por favor, selecione as datas de nascimento e do AVC.",
      );
      return;
    }

    if (!patientName.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do paciente.");
      return;
    }

    setLoading(true);

    const payload = {
      name: groupName.trim(),
      patient: {
        name: patientName.trim(),
        strokeType: strokeType,
        strokeDate: formatDateToISO(strokeDate),
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
      router.replace("/group");
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao criar grupo.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  // Entrar em grupo
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
      router.replace("/group");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Código inválido ou não encontrado.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  const sair = async () => {
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
      <Pressable style={Estilos.card} onPress={() => setModalHostVisible(true)}>
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

      <Pressable onPress={sair} style={Estilos.botaoSair}>
        <Text style={Estilos.textoSair}>Sair</Text>
      </Pressable>

      {/* MODAL 1: CRIAR GRUPO */}
      <Modal visible={modalHostVisible} transparent animationType="slide">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={modalStyles.modalTitle}>Criar Novo Grupo</Text>
              <Text style={modalStyles.modalSub}>
                Preencha os dados do grupo e do paciente.
              </Text>

              <Text style={modalStyles.sectionLabel}>Dados do Grupo</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="Nome do Grupo *"
                placeholderTextColor="#A0C1E5"
                value={groupName}
                onChangeText={setGroupName}
              />

              <Text style={modalStyles.sectionLabel}>Dados do Paciente</Text>
              <TextInput
                style={modalStyles.input}
                placeholder="Nome do Paciente *"
                placeholderTextColor="#A0C1E5"
                value={patientName}
                onChangeText={setPatientName}
              />

              {/* SELEÇÃO DO TIPO DE AVC EM ESTILO CHECKBOX */}
              <Text style={modalStyles.fieldLabel}>Tipo de AVC *</Text>
              <View style={modalStyles.checkboxGroup}>
                {strokeTypeOptions.map((option) => {
                  const isSelected = strokeType === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={modalStyles.checkboxContainer}
                      onPress={() => setStrokeType(option.value)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          modalStyles.checkbox,
                          isSelected && modalStyles.checkboxSelected,
                        ]}
                      >
                        {isSelected && (
                          <View style={modalStyles.checkboxInner} />
                        )}
                      </View>
                      <Text style={modalStyles.checkboxLabel}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* CAMPO DE SELEÇÃO: DATA DO AVC */}
              <TouchableOpacity
                style={modalStyles.dateInput}
                onPress={() => setShowStrokeDatePicker(true)}
              >
                <Text
                  style={
                    strokeDate
                      ? modalStyles.dateTextSelected
                      : modalStyles.dateTextPlaceholder
                  }
                >
                  {strokeDate
                    ? `Data do AVC: ${formatDateToBR(strokeDate)}`
                    : "Selecionar Data do AVC"}
                </Text>
              </TouchableOpacity>

              {showStrokeDatePicker && (
                <DateTimePicker
                  value={strokeDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()} // Impede selecionar data futura
                  onChange={onChangeStrokeDate}
                />
              )}

              {/* CAMPO DE SELEÇÃO: DATA DE NASCIMENTO */}
              <TouchableOpacity
                style={modalStyles.dateInput}
                onPress={() => setShowBirthDatePicker(true)}
              >
                <Text
                  style={
                    birthDate
                      ? modalStyles.dateTextSelected
                      : modalStyles.dateTextPlaceholder
                  }
                >
                  {birthDate
                    ? `Nascimento: ${formatDateToBR(birthDate)}`
                    : "Selecionar Data de Nascimento"}
                </Text>
              </TouchableOpacity>

              {showBirthDatePicker && (
                <DateTimePicker
                  value={birthDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  maximumDate={new Date()} // Impede selecionar data futura
                  onChange={onChangeBirthDate}
                />
              )}

              <TextInput
                style={[modalStyles.input, modalStyles.textArea]}
                placeholder="Observações / Descrição importante"
                placeholderTextColor="#A0C1E5"
                multiline
                numberOfLines={3}
                value={importantDescription}
                onChangeText={setImportantDescription}
              />

              <View style={modalStyles.buttonRow}>
                <TouchableOpacity
                  style={[modalStyles.btn, modalStyles.btnCancel]}
                  onPress={() => {
                    setModalHostVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={modalStyles.btnText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[modalStyles.btn, modalStyles.btnConfirm]}
                  onPress={handleCreateGroup}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={modalStyles.btnText}>Criar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: ENTRAR EM GRUPO */}
      <Modal visible={modalMemberVisible} transparent animationType="slide">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalCard}>
            <Text style={modalStyles.modalTitle}>Entrar em um Grupo</Text>
            <Text style={modalStyles.modalSub}>
              Insira o código de convite fornecido pelo Anfitrião.
            </Text>

            <TextInput
              style={modalStyles.input}
              placeholder="Código de Convite"
              placeholderTextColor="#A0C1E5"
              autoCapitalize="characters"
              value={inviteCode}
              onChangeText={setInviteCode}
            />

            <View style={modalStyles.buttonRow}>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.btnCancel]}
                onPress={() => setModalMemberVisible(false)}
              >
                <Text style={modalStyles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.btnConfirm]}
                onPress={handleJoinGroup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={modalStyles.btnText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#2E618E",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 14,
    color: "#D0E1F9",
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#73A5C6",
    marginTop: 8,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  fieldLabel: {
    fontSize: 14,
    color: "#D0E1F9",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#A0C1E5",
  },
  dateInput: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#A0C1E5",
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
  enumContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  enumButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A0C1E5",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  enumButtonSelected: {
    backgroundColor: "#73A5C6",
    borderColor: "#FFFFFF",
  },
  enumText: {
    color: "#A0C1E5",
    fontWeight: "600",
  },
  enumTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#1E486D",
  },
  btnConfirm: {
    backgroundColor: "#73A5C6",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },

  checkboxGroup: {
    gap: 10,
    marginBottom: 16,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(160, 193, 229, 0.3)",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#A0C1E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxSelected: {
    borderColor: "#73A5C6",
    backgroundColor: "rgba(115, 165, 198, 0.2)",
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  checkboxLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
};
