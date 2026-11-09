import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import api from "../../src/service/api";
import createEstilos from "../../Estilo/progresso";
import { useTheme } from "../../contexts/ThemeContext";

const MOODS = [
  { id: "ANIMO", label: "Ânimo", icon: "flame-outline" },
  { id: "FELIZ", label: "Feliz", icon: "happy-outline" },
  { id: "APATIA", label: "Apatia", icon: "remove-circle-outline" },
  { id: "RAIVA", label: "Raiva", icon: "thunderstorm-outline" },
  { id: "TRISTE", label: "Triste", icon: "sad-outline" },
];

const MONTHS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export default function ProgressoScreen() {
  const { colors, isDarkMode } = useTheme();
  const Estilos = useMemo(() => createEstilos(colors), [colors]);
  const [activeTab, setActiveTab] = useState("REGISTRO"); // 'REGISTRO' | 'RESUMO'

  // Estados do Formulário (Aba Registro)
  const [communication, setCommunication] = useState(5);
  const [mobility, setMobility] = useState(5);
  const [memory, setMemory] = useState(5);

  // Notas de 1 a 10 para cada humor na matriz de linhas
  const [moodScores, setMoodScores] = useState({
    ANIMO: 5,
    FELIZ: 5,
    APATIA: 5,
    RAIVA: 5,
    TRISTE: 5,
  });

  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // Estados para o Double-Check (Modais)
  const [isFirstModalVisible, setIsFirstModalVisible] = useState(false);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);

  // Estados dos Dados e Filtro (Aba Resumo)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summaryData, setSummaryData] = useState(null);
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (activeTab === "RESUMO") {
      fetchSummaryAndHistory();
    }
  }, [activeTab, selectedMonth, selectedYear]);

  const fetchSummaryAndHistory = async () => {
    setLoadingSummary(true);
    try {
      const summaryRes = await api.get(
        `/monthly-summaries/filter?month=${selectedMonth}&year=${selectedYear}`,
      );
      setSummaryData(summaryRes.data);

      const historyRes = await api.get("/weekly-progress");
      const filtered = (historyRes.data || []).filter((item) => {
        const date = new Date(item.createdAt);
        return (
          date.getMonth() + 1 === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });
      setWeeklyHistory(filtered);
    } catch (error) {
      console.log("Erro ao buscar dados de resumo:", error);
      Alert.alert("Erro", "Não foi possível carregar o resumo do mês.");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Função para atualizar a nota de um humor específico na matriz
  const handleMoodScoreChange = (moodId, value) => {
    setMoodScores((prev) => ({
      ...prev,
      [moodId]: value,
    }));
  };

  // Função que retorna a cor do gradiente amarelo para os botões de 1 a 10
  const getGradientButtonStyle = (num, isSelected) => {
    const gradientPalette = {
      1: "#B45309",
      2: "#D97706",
      3: "#F59E0B",
      4: "#FBBF24",
      5: "#FCD34D",
      6: "#FDE047",
      7: "#FEF08A",
      8: "#FEF08A",
      9: "#FEF9C3",
      10: "#FEFCE8",
    };

    if (isSelected) {
      return "#0F172A";
    }
    return gradientPalette[num] || "#FCD34D";
  };

  const handleInitialSubmitPress = () => {
    setIsFirstModalVisible(true);
  };

  const handleFirstModalContinue = () => {
    setIsFirstModalVisible(false);
    setIsSecondModalVisible(true);
  };

  const handleExecuteSave = async () => {
    setIsSecondModalVisible(false);
    setSaving(true);
    try {
      const payload = {
        communicationScore: Math.round(communication),
        mobilityScore: Math.round(mobility),
        memoryScore: Math.round(memory),
        countAnimo: Math.round(moodScores.ANIMO),
        countFeliz: Math.round(moodScores.FELIZ),
        countApatia: Math.round(moodScores.APATIA),
        countRaiva: Math.round(moodScores.RAIVA),
        countTriste: Math.round(moodScores.TRISTE),
        description: description.trim(),
      };

      await api.post("/weekly-progress", payload);
      Alert.alert("Sucesso", "Registro de progresso salvo com sucesso!");

      setCommunication(5);
      setMobility(5);
      setMemory(5);
      setMoodScores({ ANIMO: 5, FELIZ: 5, APATIA: 5, RAIVA: 5, TRISTE: 5 });
      setDescription("");
      void fetchSummaryAndHistory();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Erro ao salvar o progresso.";
      Alert.alert("Erro", msg);
    } finally {
      setSaving(false);
    }
  };

  // Validação auxiliar para verificar se o resumo tem dados válidos
  const hasValidSummary =
    summaryData &&
    (summaryData.averageCommunication > 0 ||
      summaryData.averageMobility > 0 ||
      summaryData.averageMemory > 0 ||
      summaryData.countAnimo > 0 ||
      summaryData.countFeliz > 0 ||
      summaryData.countApatia > 0 ||
      summaryData.countRaiva > 0 ||
      summaryData.countTriste > 0);

  return (
    <View style={[Estilos.container, { backgroundColor: colors.background }]}>
      {/* Botões Superiores (Sub-Abas Registro e Resumo) */}
      <View style={Estilos.tabSelector}>
        <TouchableOpacity
          style={[
            Estilos.tabButton,
            activeTab === "REGISTRO" && Estilos.tabButtonActive,
          ]}
          onPress={() => setActiveTab("REGISTRO")}
        >
          <Text
            style={[
              Estilos.tabText,
              activeTab === "REGISTRO" && Estilos.tabTextActive,
            ]}
          >
            Registro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            Estilos.tabButton,
            activeTab === "RESUMO" && Estilos.tabButtonActive,
          ]}
          onPress={() => setActiveTab("RESUMO")}
        >
          <Text
            style={[
              Estilos.tabText,
              activeTab === "RESUMO" && Estilos.tabTextActive,
            ]}
          >
            Resumo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={Estilos.scrollContent}>
        {activeTab === "REGISTRO" ? (
          /* ABA REGISTRO */
          <View style={Estilos.card}>
            <View
              style={{
                backgroundColor: isDarkMode ? "#1E293B" : "#FEF3C7",
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color="#D97706"
                style={{ marginTop: 2 }}
              />
              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  lineHeight: 18,
                  color: isDarkMode ? "#FDE68A" : "#92400E",
                  fontWeight: "500",
                }}
              >
                Recomendamos que o registro seja feito semanalmente
                (preferencialmente todo domingo ou toda segunda-feira),
                avaliando o comportamento e a evolução do paciente nos últimos 7
                dias.
              </Text>
            </View>

            <Text style={Estilos.sectionTitle}>Avalie de 1 a 10</Text>

            {/* Slider: Comunicação */}
            <View style={Estilos.sliderGroup}>
              <View style={Estilos.sliderHeader}>
                <Text style={Estilos.label}>Comunicação</Text>
                <Text style={Estilos.scoreValue}>{Math.round(communication)}</Text>
              </View>
              <Slider
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={communication}
                onValueChange={(val) => setCommunication(Math.round(val))}
                minimumTrackTintColor="#38BDF8"
                maximumTrackTintColor="#96e8e6"
                thumbTintColor="#38BDF8"
              />
            </View>

            {/* Slider: Mobilidade */}
            <View style={Estilos.sliderGroup}>
              <View style={Estilos.sliderHeader}>
                <Text style={Estilos.label}>Mobilidade</Text>
                <Text style={Estilos.scoreValue}>{Math.round(mobility)}</Text>
              </View>
              <Slider
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={mobility}
                onValueChange={(val) => setMobility(Math.round(val))}
                minimumTrackTintColor="#38BDF8"
                maximumTrackTintColor="#96e8e6"
                thumbTintColor="#38BDF8"
              />
            </View>

            {/* Slider: Memória */}
            <View style={Estilos.sliderGroup}>
              <View style={Estilos.sliderHeader}>
                <Text style={Estilos.label}>Memória</Text>
                <Text style={Estilos.scoreValue}>{Math.round(memory)}</Text>
              </View>
              <Slider
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={memory}
                onValueChange={(val) => setMemory(Math.round(val))}
                minimumTrackTintColor="#38BDF8"
                maximumTrackTintColor="#96e8e6"
                thumbTintColor="#38BDF8"
              />
            </View>

            {/* SEÇÃO DE HUMOR: Matriz em Linhas com Colunas de 1 a 10 */}
            <Text style={[Estilos.label, { marginTop: 16, marginBottom: 12 }]}>
              Humor e Estados Comportamentais
            </Text>

            <View style={{ gap: 16, marginBottom: 10 }}>
              {MOODS.map((m) => {
                const currentScore = moodScores[m.id];
                return (
                  <View
                    key={m.id}
                    style={{
                      backgroundColor: isDarkMode ? "#1E293B" : "#0B273F",
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Ionicons name={m.icon} size={18} color="#38BDF8" />
                        <Text
                          style={[
                            Estilos.label,
                            { color: "#F8FAFC", fontWeight: "bold" },
                          ]}
                        >
                          {m.label}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#38BDF8",
                          fontWeight: "bold",
                        }}
                      >
                        Nota: {currentScore}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 3,
                      }}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (num) => {
                          const isSelected = currentScore === num;
                          const bgColor = getGradientButtonStyle(
                            num,
                            isSelected,
                          );

                          return (
                            <TouchableOpacity
                              key={num}
                              activeOpacity={0.8}
                              onPress={() => handleMoodScoreChange(m.id, num)}
                              style={{
                                flex: 1,
                                height: 36,
                                backgroundColor: isSelected
                                  ? "#38BDF8"
                                  : bgColor,
                                borderRadius: 6,
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: isSelected ? 2 : 0,
                                borderColor: "#F8FAFC",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  color: isSelected
                                    ? "#0F172A"
                                    : num <= 3
                                      ? "#FFF"
                                      : "#1E293B",
                                }}
                              >
                                {num}
                              </Text>
                            </TouchableOpacity>
                          );
                        },
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Descrição / Observações */}
            <Text style={[Estilos.label, { marginTop: 16 }]}>Descrição</Text>
            <TextInput
              style={Estilos.textArea}
              placeholder="Digite aqui as observações sobre a semana..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />

            {/* Botão de Finalizar Registro */}
            <TouchableOpacity
              style={Estilos.saveBtn}
              onPress={handleInitialSubmitPress}
              disabled={saving}
            >
              <Ionicons name="checkmark-done-outline" size={20} color="#FFF" />
              <Text style={Estilos.saveBtnText}>
                {saving ? "Enviando..." : "Finalizar Registro"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ABA RESUMO */
          <View>
            {/* Seletor do Mês */}
            <View style={Estilos.monthPickerContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {MONTHS.map((m) => (
                  <TouchableOpacity
                    key={m.value}
                    style={[
                      Estilos.monthChip,
                      selectedMonth === m.value && Estilos.monthChipActive,
                    ]}
                    onPress={() => setSelectedMonth(m.value)}
                  >
                    <Text
                      style={[
                        Estilos.monthChipText,
                        selectedMonth === m.value &&
                          Estilos.monthChipTextActive,
                      ]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {loadingSummary ? (
              <ActivityIndicator
                size="large"
                color="#38BDF8"
                style={{ marginTop: 40 }}
              />
            ) : (
              <View style={Estilos.card}>
                <Text style={Estilos.sectionTitle}>Resumo do Mês</Text>

                {hasValidSummary ? (
                  <>
                    <View style={Estilos.metricsRow}>
                      <View style={Estilos.metricBadge}>
                        <Text style={Estilos.metricLabel}>Comunicação</Text>
                        <Text style={Estilos.metricValue}>
                          {summaryData.averageCommunication?.toFixed(1) ||
                            "0.0"}
                        </Text>
                      </View>
                      <View style={Estilos.metricBadge}>
                        <Text style={Estilos.metricLabel}>Mobilidade</Text>
                        <Text style={Estilos.metricValue}>
                          {summaryData.averageMobility?.toFixed(1) || "0.0"}
                        </Text>
                      </View>
                      <View style={Estilos.metricBadge}>
                        <Text style={Estilos.metricLabel}>Memória</Text>
                        <Text style={Estilos.metricValue}>
                          {summaryData.averageMemory?.toFixed(1) || "0.0"}
                        </Text>
                      </View>
                    </View>

                    {/* Gráfico de Barras: Contagem de Humor no Mês */}
                    <Text style={[Estilos.label, { marginTop: 24 }]}>
                      Humor total no mês
                    </Text>
                    <View style={Estilos.chartBarContainer}>
                      {[
                        { label: 'Ânimo', val: summaryData.countAnimo || 0 },
                        { label: 'Feliz', val: summaryData.countFeliz || 0 },
                        { label: 'Apatia', val: summaryData.countApatia || 0 },
                        { label: 'Raiva', val: summaryData.countRaiva || 0 },
                        { label: 'Triste', val: summaryData.countTriste || 0 },
                      ].map((item, idx) => (
                        <View key={idx} style={Estilos.barItem}>
                          <Text style={Estilos.barCount}>{item.val}</Text>
                          <View
                            style={[
                              Estilos.bar,
                              { height: Math.max(item.val * 12, 8) },
                            ]}
                          />
                          <Text style={Estilos.barLabel}>{item.label}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Histórico */}
                    <Text
                      style={[
                        Estilos.label,
                        { marginTop: 24, marginBottom: 8 },
                      ]}
                    >
                      Registros do Mês ({weeklyHistory.length})
                    </Text>
                    {weeklyHistory.length > 0 ? (
                      weeklyHistory.map((item) => (
                        <View
                          key={item.id}
                          style={[
                            Estilos.historyCard,
                            {
                              backgroundColor: colors.card,
                              borderColor: colors.border,
                              borderWidth: 1,
                            },
                          ]}
                        >
                          <View style={Estilos.historyHeader}>
                            <Text
                              style={[
                                Estilos.historyAuthor,
                                { color: colors.text },
                              ]}
                            >
                              {item.authorName || "Cuidador"}
                            </Text>
                            <Text
                              style={[
                                Estilos.historyDate,
                                { color: colors.muted },
                              ]}
                            >
                              - Semana {item.weekOfMonth || 1} -{" "}
                              {new Date(item.createdAt).toLocaleDateString(
                                "pt-BR",
                              )}
                            </Text>
                          </View>
                          {item.description ? (
                            <Text
                              style={[
                                Estilos.historyDesc,
                                { color: colors.muted, marginTop: 4 },
                              ]}
                            >
                              {item.description}
                            </Text>
                          ) : null}
                        </View>
                      ))
                    ) : (
                      <Text style={[Estilos.emptyText, { textAlign: 'center', marginTop: 12 }]}>
                        Nenhum detalhe histórico listado.
                      </Text>
                    )}
                  </>
                ) : (
                  <View style={{ alignItems: "center", paddingVertical: 35 }}>
                    <Ionicons name="stats-chart-outline" size={48} color="#64748B" />
                    <Text style={[Estilos.emptyText, { marginTop: 12, textAlign: 'center' }]}>
                      Nenhum registro encontrado para o mês selecionado.
                    </Text>
                    <Text style={{ color: '#64748B', fontSize: 13, textAlign: 'center', marginTop: 4 }}>
                      Conclua o envio de registros na aba 'Registro' para gerar os gráficos consolidados.
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* --- MODAIS DO DOUBLE-CHECK --- */}

      {/* 1️⃣ Primeiro Modal */}
      <Modal
        visible={isFirstModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFirstModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: colors.card || "#FFF",
              borderRadius: 16,
              padding: 22,
              width: "100%",
              maxWidth: 360,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <Ionicons name="help-circle-outline" size={24} color="#2563EB" />
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}
              >
                Confirmar Envio
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: colors.muted || "#475569",
                lineHeight: 20,
                marginBottom: 20,
              }}
            >
              Tem certeza que deseja enviar o registro do progresso agora?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setIsFirstModalVisible(false)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: isDarkMode ? "#334155" : "#F1F5F9",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFirstModalContinue}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: "#2563EB",
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#FFF" }}
                >
                  Continuar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2️⃣ Segundo Modal */}
      <Modal
        visible={isSecondModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSecondModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: colors.card || "#FFF",
              borderRadius: 16,
              padding: 22,
              width: "100%",
              maxWidth: 360,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <Ionicons name="alert-circle-outline" size={24} color="#D97706" />
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}
              >
                Atenção ao Período Avaliado
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: colors.muted || "#475569",
                lineHeight: 20,
                marginBottom: 20,
              }}
            >
              Lembre-se: os registros devem ser preenchidos com base no
              progresso consolidado de uma semana inteira. Deseja prosseguir com
              o salvamento?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setIsSecondModalVisible(false)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: isDarkMode ? "#334155" : "#F1F5F9",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                  }}
                >
                  Revisar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleExecuteSave}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: "#16A34A",
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#FFF" }}
                >
                  Sim, Enviar Registro
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}