import React, { useEffect, useState, useCallback } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import api from '../../src/service/api';
import Estilos from '../../Estilo/group';

export default function GroupScreen() {
  const router = useRouter();

  const [group, setGroup] = useState(null);
  const [patient, setPatient] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados do Modal de Edição do Paciente
  const [modalVisible, setModalVisible] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [strokeType, setStrokeType] = useState('');
  const [savingPatient, setSavingPatient] = useState(false);

  // Busca dados sincronizados com DTOs
const fetchData = async () => {
  try {
    // 1. Busca os dados do grupo do usuário logado
    const groupRes = await api.get('/groups/me');
    setGroup(groupRes.data);

    // 2. Busca o paciente (se não existir, trata o erro sem quebrar a tela)
    try {
      const patientRes = await api.get('/patients/me');
      setPatient(patientRes.data);
    } catch (patientErr) {
      setPatient(null);
    }

    // 3. Busca os membros usando o ID do grupo obtido
    if (groupRes.data?.id) {
      const membersRes = await api.get(`/group-members?groupId=${groupRes.data.id}`);
      setMembers(membersRes.data || []);
    }
  } catch (error) {
    console.error('Erro no fetchData:', error.response?.data || error.message);
    const msg =
      error.response?.data?.message || 'Não foi possível carregar as informações.';
    Alert.alert('Atenção', msg);
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

  // Copia o código de convite
  const copyInviteCode = async () => {
    if (group?.inviteCode) {
      await Clipboard.setStringAsync(group.inviteCode);
      Alert.alert(
        'Código Copiado!',
        'O código de convite foi copiado. Envie para os ajudantes entrarem no grupo.'
      );
    }
  };

  // Abre o modal e preenche com os dados existentes
  const handleOpenEditPatient = () => {
    setPatientName(patient?.name || group?.patientName || '');
    setPatientAge(patient?.age ? String(patient.age) : '');
    setStrokeType(patient?.strokeType || '');
    setModalVisible(true);
  };

  // Envia a criação ou atualização do paciente para o backend
  const handleSavePatient = async () => {
    if (!patientName.trim()) {
      Alert.alert('Aviso', 'O nome do paciente é obrigatório.');
      return;
    }

    setSavingPatient(true);
    try {
      const payload = {
        name: patientName,
        age: patientAge ? parseInt(patientAge, 10) : null,
        strokeType: strokeType,
      };

      if (patient?.id) {
        await api.put(`/patients/${patient.id}`, payload);
      } else {
        await api.post('/patients', payload);
      }

      Alert.alert('Sucesso', 'Informações do paciente salvas com sucesso!');
      setModalVisible(false);
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Falha ao salvar paciente.';
      Alert.alert('Erro', msg);
    } finally {
      setSavingPatient(false);
    }
  };

  // Gerenciamento de Membros
  const handleManagePermissions = (member) => {
    Alert.alert(
      'Gerenciar Membro',
      `O que deseja fazer com ${member.userName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Promover / Alterar Função',
          onPress: () => handleChangeRole(member),
        },
        {
          text: 'Remover do Grupo',
          style: 'destructive',
          onPress: () => handleRemoveMember(member),
        },
      ]
    );
  };

  const handleChangeRole = async (member) => {
    const newRole = member.role === 'LEADER' ? 'HELPER' : 'LEADER';
    try {
      await api.patch(`/group-members/${member.id}/role`, { role: newRole });
      Alert.alert('Sucesso', 'Papel do integrante atualizado com sucesso!');
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Falha ao alterar papel.';
      Alert.alert('Erro', msg);
    }
  };

  const handleRemoveMember = async (member) => {
    try {
      await api.delete(`/group-members/${member.id}`);
      Alert.alert('Removido', `${member.userName} foi removido do grupo.`);
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Falha ao remover membro.';
      Alert.alert('Erro', msg);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={Estilos.loadingContainer}>
        <ActivityIndicator size="large" color="#2E618E" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#73A5C6" />

      {/* Cabeçalho */}
      <View style={Estilos.header}>
        <View style={{ flex: 1 }}>
          <Text style={Estilos.welcomeText}>Rede de Apoio</Text>
          <Text style={Estilos.groupNameTitle}>
            {group?.name || 'Seu Grupo'}
          </Text>
        </View>

        <TouchableOpacity 
          style={Estilos.editGroupButton} 
          onPress={() => router.push('/createGroup')}
        >
          <Ionicons name="pencil-sharp" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View style={Estilos.content}>
            {/* Card de Código de Convite */}
            <View style={Estilos.cardInvite}>
              <View style={Estilos.inviteInfo}>
                <Text style={Estilos.inviteLabel}>Código de Convite</Text>
                <Text style={Estilos.inviteCode}>
                  {group?.inviteCode || 'N/A'}
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

            {/* Card Destacado do Paciente */}
            <View style={Estilos.patientCard}>
              <View style={Estilos.patientAvatar}>
                <Ionicons name="heart" size={24} color="#E11D48" />
              </View>

              <View style={Estilos.patientInfo}>
                <Text style={Estilos.patientTag}>Paciente Assistido</Text>
                <Text style={Estilos.patientName}>
                  {patient?.name || group?.patientName || 'Paciente não cadastrado'}
                </Text>
                <Text style={Estilos.patientDetails}>
                  {patient?.age ? `${patient.age} anos` : 'Idade N/A'} • {patient?.strokeType || 'Tipo N/A'}
                </Text>
              </View>

              {/* Botão para abrir Modal do Paciente */}
              <TouchableOpacity 
                style={Estilos.editPatientButton} 
                onPress={handleOpenEditPatient}
              >
                <Ionicons name="pencil" size={20} color="#2E618E" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={Estilos.memberCard}>
            <View style={Estilos.avatar}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>

            <View style={Estilos.memberInfo}>
              <Text style={Estilos.memberName}>{item.userName || 'Membro'}</Text>
              <Text style={Estilos.memberRole}>
                {item.role === 'LEADER' ? 'Anfitrião (Líder)' : 'Ajudante'}
              </Text>
            </View>

            <TouchableOpacity 
              style={Estilos.permissionButton}
              onPress={() => handleManagePermissions(item)}
            >
              <Ionicons name="add-circle-outline" size={26} color="#2E618E" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={Estilos.emptyText}>Nenhum integrante encontrado.</Text>
        )}
      />

      {/* Modal de Edição do Paciente */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Dados do Paciente</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={modalStyles.label}>Nome</Text>
            <TextInput
              style={modalStyles.input}
              value={patientName}
              onChangeText={setPatientName}
              placeholder="Ex: João da Silva"
            />

            <Text style={modalStyles.label}>Idade</Text>
            <TextInput
              style={modalStyles.input}
              value={patientAge}
              onChangeText={setPatientAge}
              placeholder="Ex: 68"
              keyboardType="numeric"
            />

            <Text style={modalStyles.label}>Tipo de AVC</Text>
            <TextInput
              style={modalStyles.input}
              value={strokeType}
              onChangeText={setStrokeType}
              placeholder="Ex: Isquêmico ou Hemorrágico"
            />

            <View style={modalStyles.buttonRow}>
              <TouchableOpacity
                style={modalStyles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={modalStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={modalStyles.saveButton}
                onPress={handleSavePatient}
                disabled={savingPatient}
              >
                {savingPatient ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={modalStyles.saveText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  label: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#F8FAFC',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelText: {
    color: '#64748B',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2E618E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});