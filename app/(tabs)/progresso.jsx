import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import api from '../../src/service/api';
import Estilos from '../../Estilo/progresso';


const MOODS = [
  { id: 'ANIMO', label: 'Ânimo', icon: 'happy-outline' },
  { id: 'FELIZ', label: 'Feliz', icon: 'at-outline' },
  { id: 'APATIA', label: 'Apatia', icon: 'remove-circle-outline' },
  { id: 'RAIVA', label: 'Raiva', icon: 'thunderstorm-outline' },
  { id: 'TRISTE', label: 'Triste', icon: 'sad-outline' },
];

const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

export default function ProgressoScreen() {
  const [activeTab, setActiveTab] = useState('REGISTRO'); // 'REGISTRO' | 'RESUMO'

  // Estados do Formulário (Aba Registro)
  const [communication, setCommunication] = useState(5);
  const [mobility, setMobility] = useState(5);
  const [memory, setMemory] = useState(5);
  const [moodState, setMoodState] = useState('FELIZ');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Estados dos Dados e Filtro (Aba Resumo)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summaryData, setSummaryData] = useState(null);
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    if (activeTab === 'RESUMO') {
      fetchSummaryAndHistory();
    }
  }, [activeTab, selectedMonth, selectedYear]);

  const fetchSummaryAndHistory = async () => {
    setLoadingSummary(true);
    try {
      // 1. Busca o resumo mensal calculado pelo backend
      const summaryRes = await api.get(
        `/monthly-summaries/filter?month=${selectedMonth}&year=${selectedYear}`
      );
      setSummaryData(summaryRes.data);

      // 2. Busca o histórico de progressos semanais para detalhar o gráfico
      const historyRes = await api.get('/weekly-progress');
      // Filtra localmente os registros pertencentes ao mês e ano selecionados
      const filtered = historyRes.data.filter((item) => {
        const date = new Date(item.createdAt);
        return (
          date.getMonth() + 1 === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });
      setWeeklyHistory(filtered);
    } catch (error) {
      console.log('Erro ao buscar dados de resumo:', error);
      Alert.alert('Erro', 'Não foi possível carregar o resumo do mês.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      const payload = {
        communicationScore: Math.round(communication),
        mobilityScore: Math.round(mobility),
        memoryScore: Math.round(memory),
        moodState: moodState,
        description: description.trim(),
      };

      await api.post('/weekly-progress', payload);
      Alert.alert('Sucesso', 'Registro de progresso salvo com sucesso!');

      // Resetar formulário
      setCommunication(5);
      setMobility(5);
      setMemory(5);
      setMoodState('FELIZ');
      setDescription('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Erro ao salvar o progresso.';
      Alert.alert('Erro', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={Estilos.container}>
      {/* Botões Superiores (Sub-Abas Registro e Resumo) */}
      <View style={Estilos.tabSelector}>
        <TouchableOpacity
          style={[
            Estilos.tabButton,
            activeTab === 'REGISTRO' && Estilos.tabButtonActive,
          ]}
          onPress={() => setActiveTab('REGISTRO')}
        >
          <Text
            style={[
              Estilos.tabText,
              activeTab === 'REGISTRO' && Estilos.tabTextActive,
            ]}
          >
            Registro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            Estilos.tabButton,
            activeTab === 'RESUMO' && Estilos.tabButtonActive,
          ]}
          onPress={() => setActiveTab('RESUMO')}
        >
          <Text
            style={[
              Estilos.tabText,
              activeTab === 'RESUMO' && Estilos.tabTextActive,
            ]}
          >
            Resumo
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={Estilos.scrollContent}>
        {activeTab === 'REGISTRO' ? (
          /* ABA REGISTRO */
          <View style={Estilos.card}>
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
                onValueChange={setCommunication}
                minimumTrackTintColor="#38BDF8"
                maximumTrackTintColor="#334155"
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
                onValueChange={setMobility}
                minimumTrackTintColor="#38BDF8"
                maximumTrackTintColor="#334155"
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
                onValueChange={setMemory}
                minimumTrackTintColor="#38BDF8"
                maximumTrackTintColor="#334155"
                thumbTintColor="#38BDF8"
              />
            </View>

            {/* Seleção de Humor */}
            <Text style={[Estilos.label, { marginTop: 16 }]}>Humor</Text>
            <View style={Estilos.moodContainer}>
              {MOODS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[
                    Estilos.moodItem,
                    moodState === m.id && Estilos.moodItemActive,
                  ]}
                  onPress={() => setMoodState(m.id)}
                >
                  <Ionicons
                    name={m.icon}
                    size={26}
                    color={moodState === m.id ? '#0F172A' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      Estilos.moodText,
                      moodState === m.id && Estilos.moodTextActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Descrição / Observações */}
            <Text style={[Estilos.label, { marginTop: 16 }]}>Descrição</Text>
            <TextInput
              style={Estilos.textArea}
              placeholder="Digite aqui as observações sobre o dia..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />

            {/* Botão de Salvar */}
            <TouchableOpacity
              style={Estilos.saveBtn}
              onPress={handleSaveProgress}
              disabled={saving}
            >
              <Ionicons name="bookmark-outline" size={20} color="#FFF" />
              <Text style={Estilos.saveBtnText}>
                {saving ? 'Salvando...' : 'Salvar'}
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
                        selectedMonth === m.value && Estilos.monthChipTextActive,
                      ]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {loadingSummary ? (
              <ActivityIndicator size="large" color="#0a3453" style={{ marginTop: 40 }} />
            ) : (
              <View style={Estilos.card}>
                <Text style={Estilos.sectionTitle}>Resumo do Mês</Text>

                {summaryData ? (
                  <>
                    {/* Bloco de Médias dos Sliders */}
                    <View style={Estilos.metricsRow}>
                      <View style={Estilos.metricBadge}>
                        <Text style={Estilos.metricLabel}>Comunicação</Text>
                        <Text style={Estilos.metricValue}>
                          {summaryData.averageCommunication?.toFixed(1) || '0.0'}
                        </Text>
                      </View>
                      <View style={Estilos.metricBadge}>
                        <Text style={Estilos.metricLabel}>Mobilidade</Text>
                        <Text style={Estilos.metricValue}>
                          {summaryData.averageMobility?.toFixed(1) || '0.0'}
                        </Text>
                      </View>
                      <View style={Estilos.metricBadge}>
                        <Text style={Estilos.metricLabel}>Memória</Text>
                        <Text style={Estilos.metricValue}>
                          {summaryData.averageMemory?.toFixed(1) || '0.0'}
                        </Text>
                      </View>
                    </View>

                    {/* Gráfico de Barras: Contagem de Humor no Mês */}
                    <Text style={[Estilos.label, { marginTop: 24 }]}>
                      Humor total no mês
                    </Text>
                    <View style={Estilos.chartBarContainer}>
                      <View style={Estilos.barItem}>
                        <Text style={Estilos.barCount}>{summaryData.countAnimo}</Text>
                        <View
                          style={[
                            Estilos.bar,
                            { height: Math.max(summaryData.countAnimo * 12, 8) },
                          ]}
                        />
                        <Text style={Estilos.barLabel}>Ânimo</Text>
                      </View>

                      <View style={Estilos.barItem}>
                        <Text style={Estilos.barCount}>{summaryData.countFeliz}</Text>
                        <View
                          style={[
                            Estilos.bar,
                            { height: Math.max(summaryData.countFeliz * 12, 8) },
                          ]}
                        />
                        <Text style={Estilos.barLabel}>Feliz</Text>
                      </View>

                      <View style={Estilos.barItem}>
                        <Text style={Estilos.barCount}>{summaryData.countApatia}</Text>
                        <View
                          style={[
                            Estilos.bar,
                            { height: Math.max(summaryData.countApatia * 12, 8) },
                          ]}
                        />
                        <Text style={Estilos.barLabel}>Apatia</Text>
                      </View>

                      <View style={Estilos.barItem}>
                        <Text style={Estilos.barCount}>{summaryData.countRaiva}</Text>
                        <View
                          style={[
                            Estilos.bar,
                            { height: Math.max(summaryData.countRaiva * 12, 8) },
                          ]}
                        />
                        <Text style={Estilos.barLabel}>Raiva</Text>
                      </View>

                      <View style={Estilos.barItem}>
                        <Text style={Estilos.barCount}>{summaryData.countTriste}</Text>
                        <View
                          style={[
                            Estilos.bar,
                            { height: Math.max(summaryData.countTriste * 12, 8) },
                          ]}
                        />
                        <Text style={Estilos.barLabel}>Triste</Text>
                      </View>
                    </View>

                    {/* Histórico/Lista de Observações do Mês */}
                    <Text style={[Estilos.label, { marginTop: 24, marginBottom: 8 }]}>
                      Registros do Mês ({weeklyHistory.length})
                    </Text>
                    {weeklyHistory.map((item) => (
                      <View key={item.id} style={Estilos.historyCard}>
                        <View style={Estilos.historyHeader}>
                          <Text style={Estilos.historyAuthor}>{item.authorName}</Text>
                          <Text style={Estilos.historyDate}>
                            Semana {item.weekOfMonth} • {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                          </Text>
                        </View>
                        {item.description ? (
                          <Text style={Estilos.historyDesc}>{item.description}</Text>
                        ) : null}
                      </View>
                    ))}
                  </>
                ) : (
                  <Text style={Estilos.emptyText}>
                    Nenhum registro encontrado para o mês selecionado.
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

