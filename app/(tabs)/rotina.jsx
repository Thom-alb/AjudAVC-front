import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/service/api';
import Estilos from '../../Estilo/rotina';

const DAYS_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const DAYS_OF_WEEK = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

export default function RotinaScreen() {
  const [viewMode, setViewMode] = useState('week'); // 'week' ou 'month'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [displayedMonthDate, setDisplayedMonthDate] = useState(new Date());

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Navegação entre os meses
  const handlePrevMonth = () => {
    setDisplayedMonthDate(
      new Date(displayedMonthDate.getFullYear(), displayedMonthDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setDisplayedMonthDate(
      new Date(displayedMonthDate.getFullYear(), displayedMonthDate.getMonth() + 1, 1)
    );
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

  // Calcula os 7 dias da semana com base em selectedDate (Domingo a Sábado)
  const currentWeekDays = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [selectedDate]);

  // Matriz do Mês para grade de 7 colunas
  const calendarMatrix = useMemo(() => {
    const year = displayedMonthDate.getFullYear();
    const month = displayedMonthDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysCurrentMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysPrevMonth = new Date(year, month, 0).getDate();

    const matrix = [];
    let currentWeek = [];

    // Dias do mês anterior
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = totalDaysPrevMonth - i;
      const dateObj = new Date(year, month - 1, day);
      currentWeek.push({ dateObj, isCurrentMonth: false });
    }

    // Dias do mês atual
    for (let day = 1; day <= totalDaysCurrentMonth; day++) {
      const dateObj = new Date(year, month, day);
      currentWeek.push({ dateObj, isCurrentMonth: true });

      if (currentWeek.length === 7) {
        matrix.push(currentWeek);
        currentWeek = [];
      }
    }

    // Dias do próximo mês
    let nextMonthDay = 1;
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      const dateObj = new Date(year, month + 1, nextMonthDay++);
      currentWeek.push({ dateObj, isCurrentMonth: false });
    }
    if (currentWeek.length > 0) {
      matrix.push(currentWeek);
    }

    return matrix;
  }, [displayedMonthDate]);

  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Filtragem dos eventos de acordo com o modo de visualização
  const filteredEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      return new Date(a.eventDateTime) - new Date(b.eventDateTime);
    });

    if (viewMode === 'week') {
      const weekStart = new Date(currentWeekDays[0]);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(currentWeekDays[6]);
      weekEnd.setHours(23, 59, 59, 999);

      return sorted.filter((evt) => {
        const evtDate = new Date(evt.eventDateTime);
        return evtDate >= weekStart && evtDate <= weekEnd;
      });
    }

    return sorted; // Exibe todos no modo 'month'
  }, [events, viewMode, currentWeekDays]);

  const monthTitleFormatted = displayedMonthDate.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={Estilos.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#73A5C6" />

      {/* Mês Atual exibido no topo */}
      <Text style={Estilos.currentMonthText}>{monthTitleFormatted}</Text>

      {/* Seletor entre Semana e Mês */}
      <View style={Estilos.toggleContainer}>
        <TouchableOpacity
          style={[Estilos.toggleBtn, viewMode === 'week' && Estilos.toggleBtnActive]}
          onPress={() => setViewMode('week')}
        >
          <Text style={[Estilos.toggleText, viewMode === 'week' && Estilos.toggleTextActive]}>
            Semana
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[Estilos.toggleBtn, viewMode === 'month' && Estilos.toggleBtnActive]}
          onPress={() => setViewMode('month')}
        >
          <Text style={[Estilos.toggleText, viewMode === 'month' && Estilos.toggleTextActive]}>
            Mês
          </Text>
        </TouchableOpacity>
      </View>

      {/* Renderização Condicional: Semana ou Mês */}
      {viewMode === 'week' ? (
        <View style={Estilos.weekContainer}>
          {currentWeekDays.map((dateObj, idx) => {
            const active = isSameDay(dateObj, selectedDate);
            return (
              <TouchableOpacity
                key={idx}
                style={[Estilos.weekDayCard, active && Estilos.weekDayCardActive]}
                onPress={() => setSelectedDate(dateObj)}
              >
                <Text style={[Estilos.weekDayName, active && Estilos.weekDayTextActive]}>
                  {DAYS_SHORT[dateObj.getDay()]}
                </Text>
                <Text style={[Estilos.weekDayNum, active && Estilos.weekDayTextActive]}>
                  {dateObj.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={Estilos.monthWrapper}>
          <View style={Estilos.monthHeader}>
            <Text style={Estilos.monthHeaderTitle}>{monthTitleFormatted}</Text>
            <View style={Estilos.monthHeaderNav}>
              <TouchableOpacity style={Estilos.monthNavBtn} onPress={handlePrevMonth}>
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={Estilos.monthNavBtn} onPress={handleNextMonth}>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Dias da semana */}
          <View style={Estilos.daysOfWeekRow}>
            {DAYS_SHORT.map((dayName, idx) => (
              <Text key={idx} style={Estilos.dayOfWeekText}>
                {dayName}
              </Text>
            ))}
          </View>

          {/* Grid de dias do Mês */}
          <View style={Estilos.calendarGrid}>
            {calendarMatrix.map((week, weekIdx) => (
              <View key={weekIdx} style={Estilos.calendarRow}>
                {week.map((item, dayIdx) => {
                  const active = isSameDay(item.dateObj, selectedDate);
                  return (
                    <TouchableOpacity
                      key={dayIdx}
                      style={[
                        Estilos.calendarDayCell,
                        !item.isCurrentMonth && Estilos.calendarDayCellOtherMonth,
                        active && Estilos.calendarDayCellActive,
                      ]}
                      onPress={() => {
                        setSelectedDate(item.dateObj);
                        if (!item.isCurrentMonth) {
                          setDisplayedMonthDate(
                            new Date(item.dateObj.getFullYear(), item.dateObj.getMonth(), 1)
                          );
                        }
                      }}
                    >
                      <Text
                        style={[
                          Estilos.calendarDayText,
                          active && Estilos.calendarDayTextActive,
                        ]}
                      >
                        {item.dateObj.getDate()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Lista de Atividades */}
      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" style={Estilos.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={Estilos.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={() => (
            <View style={Estilos.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#2E618E" />
              <Text style={Estilos.emptyText}>Nenhuma atividade para este período.</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const dateObj = new Date(item.eventDateTime);
            const isSelectedDay = isSameDay(dateObj, selectedDate);
            const timeFormatted = dateObj.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });
            const dayFormatted = `${DAYS_OF_WEEK[dateObj.getDay()].toLowerCase()}/${dateObj.getDate()}`;

            return (
              <View
                style={[
                  Estilos.cardEvent,
                  item.completed && Estilos.cardCompleted,
                  isSelectedDay && { borderWidth: 1, borderColor: '#38BDF8' },
                ]}
              >
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
    </SafeAreaView>
  );
}