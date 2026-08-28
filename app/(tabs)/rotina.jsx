import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  StatusBar,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/service/api';
import Estilos from '../../Estilo/rotina';

const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

export default function RotinaScreen() {
  const [viewMode, setViewMode] = useState('semana');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados do Modal e Formulário
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventCategory, setEventCategory] = useState('THERAPY');
  const [saving, setSaving] = useState(false);

  // Estados para o DateTimePicker
  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await api.get('/calendar-events');
      setEvents(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      const msg = error.response?.data?.message || 'Erro ao carregar agenda.';
      Alert.alert('Atenção', msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, [fetchEvents]);

  // Ao abrir o modal, sincroniza a data com o dia selecionado no calendário
  const handleOpenModal = () => {
    const initialDate = new Date(selectedDate);
    const now = new Date();
    // Se a data selecionada for hoje, ajusta para o horário atual
    if (
      initialDate.getFullYear() === now.getFullYear() &&
      initialDate.getMonth() === now.getMonth() &&
      initialDate.getDate() === now.getDate()
    ) {
      initialDate.setHours(now.getHours(), now.getMinutes());
    } else {
      initialDate.setHours(14, 0); // Padrão 14:00 para outros dias
    }
    setEventDate(initialDate);
    setModalVisible(true);
  };

  const handleToggleCompletion = async (id) => {
    try {
      await api.patch(`/calendar-events/${id}/toggle`);
      setEvents((prev) =>
        prev.map((evt) => (evt.id === id ? { ...evt, completed: !evt.completed } : evt))
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar o status do evento.');
    }
  };

  const handleCreateEvent = async () => {
    if (!title.trim()) {
      Alert.alert('Aviso', 'O título do evento é obrigatório.');
      return;
    }

    // Trava para evitar agendamentos retroativos
    const now = new Date();
    if (eventDate < now) {
      Alert.alert(
        'Atividade Retroativa',
        'Não é possível adicionar eventos que já aconteceram. Escolha uma data e horário futuros.'
      );
      return;
    }

    setSaving(true);
    try {
      // Formata para YYYY-MM-DDTHH:mm:00
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, '0');
      const day = String(eventDate.getDate()).padStart(2, '0');
      const hours = String(eventDate.getHours()).padStart(2, '0');
      const minutes = String(eventDate.getMinutes()).padStart(2, '0');

      const eventDateTime = `${year}-${month}-${day}T${hours}:${minutes}:00`;

      const payload = {
        title: title.trim(),
        description: description.trim(),
        eventDateTime: eventDateTime,
        eventCategory: eventCategory,
      };

      await api.post('/calendar-events', payload);

      Alert.alert('Sucesso', 'Evento cadastrado na agenda!');
      setModalVisible(false);
      setTitle('');
      setDescription('');
      fetchEvents();
    } catch (error) {
      const msg = error.response?.data?.message || 'Falha ao salvar evento na agenda.';
      Alert.alert('Erro', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = (id) => {
    Alert.alert('Excluir Evento', 'Deseja remover este evento da agenda?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/calendar-events/${id}`);
            fetchEvents();
          } catch (err) {
            Alert.alert('Erro', 'Apenas o líder pode excluir este evento.');
          }
        },
      },
    ]);
  };

  const weekDaysList = useMemo(() => {
    const current = new Date(selectedDate);
    const dayOfWeek = current.getDay();
    const sunday = new Date(current);
    sunday.setDate(current.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [selectedDate]);

  const monthWeeksList = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const weeks = [];
    let currentWeek = [];

    for (let i = 1; i <= totalDays; i++) {
      const dayDate = new Date(year, month, i);
      currentWeek.push(dayDate);

      if (currentWeek.length === 7 || i === totalDays) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    return weeks;
  }, [selectedDate]);

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      if (!evt.eventDateTime) return false;
      const evtDate = new Date(evt.eventDateTime);
      return (
        evtDate.getFullYear() === selectedDate.getFullYear() &&
        evtDate.getMonth() === selectedDate.getMonth() &&
        evtDate.getDate() === selectedDate.getDate()
      );
    });
  }, [events, selectedDate]);

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const onChangeDate = (event, selected) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) {
      const updated = new Date(eventDate);
      updated.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      setEventDate(updated);
    }
  };

  const onChangeTime = (event, selected) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selected) {
      const updated = new Date(eventDate);
      updated.setHours(selected.getHours(), selected.getMinutes());
      setEventDate(updated);
    }
  };

  return (
    <SafeAreaView style={Estilos.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#73A5C6" />

      {/* Alternância Semana/Mês */}
      <View style={Estilos.toggleContainer}>
        <TouchableOpacity
          style={[Estilos.toggleBtn, viewMode === 'semana' && Estilos.toggleBtnActive]}
          onPress={() => setViewMode('semana')}
        >
          <Text style={[Estilos.toggleText, viewMode === 'semana' && Estilos.toggleTextActive]}>
            Semana
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[Estilos.toggleBtn, viewMode === 'mes' && Estilos.toggleBtnActive]}
          onPress={() => setViewMode('mes')}
        >
          <Text style={[Estilos.toggleText, viewMode === 'mes' && Estilos.toggleTextActive]}>
            Mês
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid Calendário */}
      {viewMode === 'semana' ? (
        <View style={Estilos.weekContainer}>
          {weekDaysList.map((dayItem, index) => {
            const active = isSameDay(dayItem, selectedDate);
            return (
              <TouchableOpacity
                key={index}
                style={[Estilos.weekDayCard, active && Estilos.weekDayCardActive]}
                onPress={() => setSelectedDate(dayItem)}
              >
                <Text style={[Estilos.weekDayName, active && Estilos.weekDayTextActive]}>
                  {DAYS_OF_WEEK[dayItem.getDay()]}
                </Text>
                <Text style={[Estilos.weekDayNum, active && Estilos.weekDayTextActive]}>
                  {dayItem.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={Estilos.monthWrapper}>
          <ScrollView contentContainerStyle={Estilos.monthContainer}>
            {monthWeeksList.map((week, weekIndex) => (
              <View key={weekIndex} style={Estilos.monthRow}>
                {week.map((dayItem, dayIndex) => {
                  const active = isSameDay(dayItem, selectedDate);
                  return (
                    <TouchableOpacity
                      key={dayIndex}
                      style={[Estilos.monthDayCard, active && Estilos.monthDayCardActive]}
                      onPress={() => setSelectedDate(dayItem)}
                    >
                      <Text style={[Estilos.monthDayName, active && Estilos.monthDayTextActive]}>
                        {DAYS_OF_WEEK[dayItem.getDay()]}
                      </Text>
                      <Text style={[Estilos.monthDayNum, active && Estilos.monthDayTextActive]}>
                        {String(dayItem.getDate()).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Lista de Atividades */}
      {loading ? (
        <ActivityIndicator size="large" color="#0F172A" style={Estilos.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={Estilos.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={() => (
            <View style={Estilos.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#2E618E" />
              <Text style={Estilos.emptyText}>Nenhuma atividade para esta data.</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const dateObj = new Date(item.eventDateTime);
            const timeFormatted = dateObj.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const dayFormatted = `${DAYS_OF_WEEK[dateObj.getDay()].toLowerCase()}/${dateObj.getDate()}`;

            return (
              <View style={[Estilos.cardEvent, item.completed && Estilos.cardCompleted]}>
                <TouchableOpacity
                  style={Estilos.timeBox}
                  onPress={() => handleToggleCompletion(item.id)}
                >
                  <Text style={Estilos.dateLabel}>{dayFormatted}</Text>
                  <Text style={Estilos.timeLabel}>{timeFormatted}</Text>
                  <Ionicons
                    name={item.completed ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={item.completed ? '#10B981' : '#94A3B8'}
                    style={Estilos.checkboxIcon}
                  />
                </TouchableOpacity>

                <View style={Estilos.eventDetails}>
                  <Text style={[Estilos.eventTitle, item.completed && Estilos.textCompleted]}>
                    {item.title}
                  </Text>
                  {!!item.description && (
                    <Text style={Estilos.eventDesc}>{item.description}</Text>
                  )}
                  <Text style={Estilos.eventMeta}>Categoria: {item.eventCategory}</Text>
                  <Text style={Estilos.eventMeta}>Criado por: {item.createdByName || 'Anfitrião'}</Text>
                </View>

                <TouchableOpacity
                  style={Estilos.deleteBtn}
                  onPress={() => handleDeleteEvent(item.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={Estilos.fab} onPress={handleOpenModal}>
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal de Agendamento */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={Estilos.modalOverlay}>
          <View style={Estilos.modalContent}>
            <View style={Estilos.modalHeader}>
              <Text style={Estilos.modalTitle}>Agendar Atividade</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={Estilos.label}>Título da Atividade</Text>
            <TextInput
              style={Estilos.input}
              placeholder="Ex: Fisioterapia - Clinica SoloSaudavel"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={Estilos.label}>Descrição / Local</Text>
            <TextInput
              style={Estilos.input}
              placeholder="Ex: Trazer exames e acompanhante"
              value={description}
              onChangeText={setDescription}
            />

            {/* Seleção de Data e Hora com Picker */}
            <View style={Estilos.pickerRow}>
              <View style={{ flex: 1 }}>
                <Text style={Estilos.label}>Data</Text>
                <TouchableOpacity
                  style={Estilos.pickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={18} color="#2E618E" />
                  <Text style={Estilos.pickerButtonText}>
                    {eventDate.toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={Estilos.label}>Horário</Text>
                <TouchableOpacity
                  style={Estilos.pickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={18} color="#2E618E" />
                  <Text style={Estilos.pickerButtonText}>
                    {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Componentes DateTimePicker Nativo */}
            {showDatePicker && (
              <DateTimePicker
                value={eventDate}
                mode="date"
                display="default"
                minimumDate={new Date()} // Trava nativa para dias passados no Android/iOS
                onChange={onChangeDate}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={eventDate}
                mode="time"
                display="default"
                is24Hour={true}
                onChange={onChangeTime}
              />
            )}

            <Text style={Estilos.label}>Categoria</Text>
            <View style={Estilos.categoryRow}>
              {['THERAPY', 'MEDICATION', 'CONSULTATION', 'OTHER'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    Estilos.catChip,
                    eventCategory === cat && Estilos.catChipActive,
                  ]}
                  onPress={() => setEventCategory(cat)}
                >
                  <Text
                    style={[
                      Estilos.catChipText,
                      eventCategory === cat && Estilos.catChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={Estilos.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={Estilos.cancelBtn}>
                <Text style={Estilos.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateEvent}
                style={Estilos.saveBtn}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={Estilos.saveBtnText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}