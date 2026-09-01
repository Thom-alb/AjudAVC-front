import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Caminhos relativos corrigidos para a estrutura do projeto
import api from '../src/service/api';
import Estilos from '../Estilo/fabGlobal';

export default function FabGlobal({ onEventCreated, isDarkMode, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  // Estados do Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventCategory, setEventCategory] = useState('THERAPY');
  const [saving, setSaving] = useState(false);

  const [eventDate, setEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const handleOpenCreateModal = () => {
    setOpen(false);
    setEventDate(new Date());
    setModalVisible(true);
  };

  const handleCreateEvent = async () => {
    if (!title.trim()) {
      Alert.alert('Aviso', 'O título da atividade é obrigatório.');
      return;
    }

    const now = new Date();
    if (eventDate < now) {
      Alert.alert(
        'Atividade Retroativa',
        'Não é possível adicionar eventos que já aconteceram. Escolha data e horário futuros.'
      );
      return;
    }

    setSaving(true);
    try {
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, '0');
      const day = String(eventDate.getDate()).padStart(2, '0');
      const hours = String(eventDate.getHours()).padStart(2, '0');
      const minutes = String(eventDate.getMinutes()).padStart(2, '0');

      const payload = {
        title: title.trim(),
        description: description.trim(),
        eventDateTime: `${year}-${month}-${day}T${hours}:${minutes}:00`,
        eventCategory: eventCategory,
      };

      await api.post('/calendar-events', payload);

      Alert.alert('Sucesso', 'Atividade cadastrada com sucesso!');
      setModalVisible(false);
      setTitle('');
      setDescription('');

      if (onEventCreated) {
        onEventCreated();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Falha ao salvar a atividade.';
      Alert.alert('Erro', msg);
    } finally {
      setSaving(false);
    }
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
    <>
      {open && (
        <TouchableOpacity
          style={Estilos.backdrop}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
      )}

      <View style={Estilos.fabContainer} pointerEvents="box-none">
        {open && (
          <View style={Estilos.optionsContainer}>
            <TouchableOpacity
              style={Estilos.optionBtn}
              onPress={() => {
                setOpen(false);
                Alert.alert('Configurações', 'Tela de configurações em desenvolvimento.');
              }}
            >
              <Text style={Estilos.optionText}>Configurações</Text>
              <View style={Estilos.optionIconBox}>
                <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={Estilos.optionBtn}
              onPress={() => {
                setOpen(false);
                Alert.alert('Configurações', 'Modos em desenvolvimento.');
              }}
            >
              <Text style={Estilos.optionText}>
                {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
              </Text>
              <View style={Estilos.optionIconBox}>
                <Ionicons
                  name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                  size={20}
                  color="#FFFFFF"
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={Estilos.optionBtn} onPress={handleOpenCreateModal}>
              <Text style={Estilos.optionText}>Criar Atividade</Text>
              <View style={Estilos.optionIconBox}>
                <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[Estilos.mainFab, open && Estilos.mainFabActive]}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Ionicons name={open ? 'close' : 'add'} size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={Estilos.modalOverlay}>
          <View style={Estilos.modalContent}>
            <View style={Estilos.modalHeader}>
              <Text style={Estilos.modalTitle}>Criar Atividade</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={Estilos.label}>Título da Atividade</Text>
            <TextInput
              style={Estilos.input}
              placeholder="Ex: Fisioterapia / Medicação"
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

            {showDatePicker && (
              <DateTimePicker
                value={eventDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
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
    </>
  );
}