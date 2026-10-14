import React, { useMemo, useState } from "react";
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
import createStyles from "../../Estilo/groupRole";
import api from "../../src/service/api";
import { useTheme } from "../../contexts/ThemeContext";

// Enums em português exigidos pela API Java (ordem usada na UI e no payload)
const STROKE_TYPES = [
  { key: "ISQUEMICO", label: "Isquêmico" },
  { key: "HEMORRAGICO", label: "Hemorrágico" },
  { key: "ISQUEMICO_TRANSITORIO", label: "Transitório (AIT)" },
];

const INITIAL_STROKE_COUNTS = {
  ISQUEMICO: 1,
  HEMORRAGICO: 0,
  ISQUEMICO_TRANSITORIO: 0,
};

const MIN_BIRTH_DATE = new Date(1900, 0, 1);

// Converte os contadores visuais em uma lista de objetos { strokeType, strokeDate }
// no formato esperado pela API (um objeto por ocorrência).
const buildStrokesPayload = (strokeCounts, isoDate) =>
  STROKE_TYPES.flatMap(({ key }) =>
    Array.from({ length: Math.max(0, strokeCounts[key] || 0) }, () => ({
      strokeType: key,
      strokeDate: isoDate,
    }))
  );

// Chaves de sessão removidas no logout (o tema é preservado de propósito)
const SESSION_KEYS = ["authToken", "activeGroupId", "userData"];

export default function GroupRole() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const Estilos = useMemo(() => createStyles(colors), [colors]);
  const pickerTheme = isDarkMode ? "dark" : "light";

  // Estados dos Modais
  const [modalHostVisible, setModalHostVisible] = useState(false);
  const [modalMemberVisible, setModalMemberVisible] = useState(false);

  // Estados do formulário (Anfitrião / Líder)
  const [groupName, setGroupName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [importantDescription, setImportantDescription] = useState("");

  // Contagem de AVCs com Enums sincronizados com o Java em português
  const [strokeCounts, setStrokeCounts] = useState({ ...INITIAL_STROKE_COUNTS });

  const strokeTypeLabels = STROKE_TYPES;

  // Opções de Doenças/Comorbidades e Riscos
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

  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [strokeDate, setStrokeDate] = useState(null);
  const [birthDate, setBirthDate] = useState(null);

  const [showStrokeDatePicker, setShowStrokeDatePicker] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDateToISO = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
    setStrokeCounts({ ...INITIAL_STROKE_COUNTS });
    setSelectedDiseases([]);
    setStrokeDate(null);
    setBirthDate(null);
    setImportantDescription("");
    setShowStrokeDatePicker(false);
    setShowBirthDatePicker(false);
  };

  const handleStrokeCountChange = (type, delta) => {
    setStrokeCounts((prev) => {
      const current = prev[type] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [type]: updated };
    });
  };

  const toggleDisease = (diseaseKey) => {
    setSelectedDiseases((prev) =>
      prev.includes(diseaseKey)
        ? prev.filter((d) => d !== diseaseKey)
        : [...prev, diseaseKey]
    );
  };

  const onChangeStrokeDate = (event, selectedDate) => {
    setShowStrokeDatePicker(Platform.OS === "ios");
    if (selectedDate) setStrokeDate(selectedDate);
  };

  const onChangeBirthDate = (event, selectedDate) => {
    setShowBirthDatePicker(Platform.OS === "ios");
    if (selectedDate) setBirthDate(selectedDate);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do grupo.");
      return;
    }

    if (!patientName.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do paciente.");
      return;
    }

    const totalStrokes = Object.values(strokeCounts).reduce((acc, curr) => acc + curr, 0);
    if (totalStrokes === 0) {
      Alert.alert("Atenção", "Informe ao menos 1 ocorrência de AVC.");
      return;
    }

    if (!strokeDate || !birthDate) {
      Alert.alert("Atenção", "Por favor, selecione a data de nascimento e a data do último AVC.");
      return;
    }

    if (strokeDate < birthDate) {
      Alert.alert("Atenção", "A data do AVC não pode ser anterior à data de nascimento.");
      return;
    }

    setLoading(true);

    // Mapeia os contadores para a lista de objetos de AVC esperada pela API
    // (strokeType com os Enums: ISQUEMICO, HEMORRAGICO, ISQUEMICO_TRANSITORIO)
    const generatedStrokesList = buildStrokesPayload(
      strokeCounts,
      formatDateToISO(strokeDate)
    );

    const payload = {
      name: groupName.trim(),
      patient: {
        name: patientName.trim(),
        birthDate: formatDateToISO(birthDate),
        importantDescription: importantDescription.trim() || null,
        diseases: selectedDiseases,
        strokes: generatedStrokesList,
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

  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Atenção", "Por favor, digite o código de convite.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/groups/join", { inviteCode: inviteCode.trim() });

      if (response.data?.id) {
        await AsyncStorage.setItem("activeGroupId", String(response.data.id));
      }

      setModalMemberVisible(false);
      setInviteCode("");
      router.replace("/(tabs)/group");
    } catch (error) {
      const msg = error.response?.data?.message || "Código inválido ou não encontrado.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(SESSION_KEYS);
    } catch (error) {
      console.error("Erro ao limpar sessão:", error);
    }
    delete api.defaults.headers.common.Authorization;
    router.replace("/");
  };

  return (
    <ScrollView
      style={Estilos.scroll}
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
        <View style={Estilos.overlay}>
          <View style={Estilos.modalCard}>
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
                placeholderTextColor={colors.placeholder}
                value={groupName}
                onChangeText={setGroupName}
              />

              {/* DADOS DO PACIENTE */}
              <Text style={Estilos.sectionHeader}>Dados do Paciente</Text>
              <TextInput
                style={Estilos.input}
                placeholder="Nome do Paciente *"
                placeholderTextColor={colors.placeholder}
                value={patientName}
                onChangeText={setPatientName}
              />

              {/* CONTAGEM DE AVC POR TIPO */}
              <Text style={Estilos.label}>Ocorrências de AVC por Tipo *</Text>
              <View style={Estilos.counterGroup}>
                {strokeTypeLabels.map((item) => {
                  const count = strokeCounts[item.key] || 0;
                  return (
                    <View key={item.key} style={Estilos.counterRow}>
                      <Text style={Estilos.counterLabel}>
                        {item.label}
                      </Text>
                      <View style={Estilos.counterControls}>
                        <TouchableOpacity
                          style={Estilos.counterBtn}
                          onPress={() =>
                            handleStrokeCountChange(item.key, -1)
                          }
                        >
                          <Text style={Estilos.counterBtnText}>-</Text>
                        </TouchableOpacity>
                        <Text style={Estilos.counterValue}>
                          {count}
                        </Text>
                        <TouchableOpacity
                          style={Estilos.counterBtn}
                          onPress={() =>
                            handleStrokeCountChange(item.key, 1)
                          }
                        >
                          <Text style={Estilos.counterBtnText}>+</Text>
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
                          <Text style={Estilos.checkboxCheck}>
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
                style={Estilos.dateInput}
                onPress={() => setShowStrokeDatePicker(true)}
              >
                <Text
                  style={
                    strokeDate
                      ? Estilos.dateTextSelected
                      : Estilos.dateTextPlaceholder
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
                  themeVariant={pickerTheme}
                  minimumDate={birthDate || MIN_BIRTH_DATE}
                  maximumDate={new Date()}
                  onChange={onChangeStrokeDate}
                />
              )}

              {/* SELEÇÃO DE DATA DE NASCIMENTO */}
              <TouchableOpacity
                style={Estilos.dateInput}
                onPress={() => setShowBirthDatePicker(true)}
              >
                <Text
                  style={
                    birthDate
                      ? Estilos.dateTextSelected
                      : Estilos.dateTextPlaceholder
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
                  themeVariant={pickerTheme}
                  minimumDate={new Date(1900, 0, 1)}
                  maximumDate={new Date()}
                  onChange={onChangeBirthDate}
                />
              )}

              {/* OBSERVAÇÕES / DESCRIÇÃO */}
              <TextInput
                style={[Estilos.input, Estilos.textArea]}
                placeholder="Observações / Descrição importante"
                placeholderTextColor={colors.placeholder}
                multiline
                numberOfLines={3}
                value={importantDescription}
                onChangeText={setImportantDescription}
              />

              {/* BOTÕES DE AÇÃO */}
              <View style={Estilos.buttonRow}>
                <TouchableOpacity
                  style={[Estilos.btn, Estilos.btnCancel]}
                  onPress={() => {
                    setModalHostVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={Estilos.buttonCancelText}>Cancelar</Text>
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
        <View style={Estilos.overlay}>
          <View style={Estilos.modalCard}>
            <Text style={Estilos.title}>Entrar em um Grupo</Text>
            <Text style={Estilos.subtitle}>
              Insira o código de convite fornecido pelo Anfitrião.
            </Text>

            <TextInput
              style={Estilos.input}
              placeholder="Código de Convite"
              placeholderTextColor={colors.placeholder}
              autoCapitalize="characters"
              value={inviteCode}
              onChangeText={setInviteCode}
            />

            <View style={Estilos.buttonRow}>
              <TouchableOpacity
                style={[Estilos.btn, Estilos.btnCancel]}
                onPress={() => setModalMemberVisible(false)}
              >
                <Text style={Estilos.buttonCancelText}>Cancelar</Text>
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