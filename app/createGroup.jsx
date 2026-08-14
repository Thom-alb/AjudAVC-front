import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../src/service/api';
import Estilos from '../Estilo/groupRole';

export default function CreateGroupScreen() {
  const router = useRouter();

  const [groupName, setGroupName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateGroup = async () => {
    setErrorMessage('');

    if (!groupName.trim()) {
      setErrorMessage('Por favor, informe o nome do grupo.');
      return;
    }

    setLoading(true);

    try {
      // Envia o payload de acordo com a CreateGroupDTO da API
      const response = await api.post('/groups', {
        name: groupName.trim(),
        patientName: patientName.trim() || undefined,
      });

      const groupData = response.data;

      // Armazena o ID do grupo ativo localmente
      if (groupData?.id) {
        await AsyncStorage.setItem('activeGroupId', String(groupData.id));
      }

      // Navega para a Home limpando a pilha de telas
      router.replace('/home');
    } catch (error) {
      const msg =
        error.response?.data?.message || 'Erro ao criar o grupo. Tente novamente.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e1f2c" />

      <View style={Estilos.cardCreate}>
        {/* Botão de Voltar */}
        <TouchableOpacity style={Estilos.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={Estilos.title}>Criar Grupo de Cuidado</Text>
        <Text style={Estilos.subtitle}>
          Você será o anfitrião/líder deste grupo.
        </Text>

        {/* Campo: Nome do Grupo */}
        <TextInput
          style={Estilos.input}
          placeholder="Nome do Grupo (ex: Família Silva)"
          placeholderTextColor="#A0C1E5"
          value={groupName}
          onChangeText={(text) => {
            setGroupName(text);
            if (errorMessage) setErrorMessage('');
          }}
        />

        {/* Campo: Nome do Paciente / Assistido */}
        <TextInput
          style={Estilos.input}
          placeholder="Nome da pessoa cuidada (opcional)"
          placeholderTextColor="#A0C1E5"
          value={patientName}
          onChangeText={(text) => {
            setPatientName(text);
            if (errorMessage) setErrorMessage('');
          }}
        />

        {/* Box de Exibição de Erro */}
        {!!errorMessage && (
          <View style={Estilos.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color="#FF6B6B"
              style={Estilos.errorIcon}
            />
            <Text style={Estilos.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Botão de Submissão */}
        <TouchableOpacity
          style={Estilos.buttonPrimary}
          onPress={handleCreateGroup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={Estilos.buttonText}>Avançar para a Home</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}