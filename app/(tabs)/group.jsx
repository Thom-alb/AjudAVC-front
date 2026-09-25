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
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

  // Modais
  const [patientModalVisible, setPatientModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);

  // Estados Form Paciente (Edição Completa)
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientBirthDate, setPatientBirthDate] = useState('');
  const [importantDescription, setImportantDescription] = useState('');
  const [ischemicCount, setIschemicCount] = useState('0');
  const [hemorrhagicCount, setHemorrhagicCount] = useState('0');
  const [transientCount, setTransientCount] = useState('0');
  const [savingPatient, setSavingPatient] = useState(false);

  // Estados Form Grupo
  const [groupName, setGroupName] = useState('');
  const [savingGroup, setSavingGroup] = useState(false);

  // Funções Auxiliares
  const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informada';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  };

  const getPrimaryStrokeType = (p) => {
    if (!p) return 'Tipo N/A';

    const isch = Number(p.ischemicCount || p.ischemicStrokes || 0);
    const hem = Number(p.hemorrhagicCount || p.hemorrhagicStrokes || 0);
    const trans = Number(p.transientCount || p.transientStrokes || 0);

    if (hem > 0 && hem >= isch) return 'AVC Hemorrágico';
    if (isch > 0) return 'AVC Isquêmico';
    if (trans > 0) return 'AIT (Transitório)';

    if (p.strokes && p.strokes.length > 0) {
      return p.strokes[0].strokeType;
    }

    if (p.strokeType) return p.strokeType;

    return 'Nenhum registrado';
  };

  const fetchData = async () => {
    try {
      const groupRes = await api.get('/groups/me');
      setGroup(groupRes.data);

      try {
        const patientRes = await api.get('/patients/me');
        setPatient(patientRes.data);
      } catch (patientErr) {
        if (groupRes.data && groupRes.data.patient) {
          setPatient(groupRes.data.patient);
        } else {
          setPatient(null);
        }
      }

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

  const copyInviteCode = async () => {
    if (group?.inviteCode) {
      await Clipboard.setStringAsync(group.inviteCode);
      Alert.alert(
        'Código Copiado!',
        'O código de convite foi copiado. Envie para os ajudantes entrarem no grupo.'
      );
    }
  };

  // --- GERENCIAMENTO DO GRUPO ---
  const handleOpenEditGroup = () => {
    setGroupName(group?.name || '');
    setGroupModalVisible(true);
  };

  const handleSaveGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Aviso', 'O nome do grupo não pode ficar em branco.');
      return;
    }

    setSavingGroup(true);
    try {
      const response = await api.put(`/groups/${group.id}`, { name: groupName });
      setGroup((prev) => ({ ...prev, name: response.data?.name || groupName }));
      Alert.alert('Sucesso', 'Nome do grupo atualizado com sucesso!');
      setGroupModalVisible(false);
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Falha ao atualizar o grupo.';
      Alert.alert('Erro', msg);
    } finally {
      setSavingGroup(false);
    }
  };

  // --- GERENCIAMENTO DO PACIENTE ---
  const handleOpenEditPatient = () => {
    const calculatedAge = calculateAge(patient?.birthDate);

    setPatientName(patient?.name || group?.patientName || '');
    setPatientAge(
      patient?.age !== undefined && patient?.age !== null
        ? String(patient.age)
        : calculatedAge !== null
        ? String(calculatedAge)
        : ''
    );
    setPatientBirthDate(patient?.birthDate || '');
    setImportantDescription(patient?.importantDescription || '');
    setIschemicCount(String(patient?.ischemicCount ?? patient?.ischemicStrokes ?? 0));
    setHemorrhagicCount(String(patient?.hemorrhagicCount ?? patient?.hemorrhagicStrokes ?? 0));
    setTransientCount(String(patient?.transientCount ?? patient?.transientStrokes ?? 0));

    setPatientModalVisible(true);
  };

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
        birthDate: patientBirthDate || null,
        importantDescription: importantDescription,
        ischemicCount: parseInt(ischemicCount, 10) || 0,
        hemorrhagicCount: parseInt(hemorrhagicCount, 10) || 0,
        transientCount: parseInt(transientCount, 10) || 0,
      };

      let response;
      if (patient?.id) {
        response = await api.put(`/patients/${patient.id}`, payload);
      } else {
        response = await api.post('/patients', payload);
      }

      setPatient(response.data || { ...patient, ...payload });
      Alert.alert('Sucesso', 'Informações do paciente salvas com sucesso!');
      setPatientModalVisible(false);
      fetchData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Falha ao salvar dados do paciente.';
      Alert.alert('Erro', msg);
    } finally {
      setSavingPatient(false);
    }
  };

  // --- GERENCIAMENTO DE MEMBROS ---
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

  const age = calculateAge(patient?.birthDate) ?? patient?.age ?? 'N/I';

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
          onPress={handleOpenEditGroup}
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
            {/* Card de Convite */}
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
                  {age !== 'N/I' ? `${age} anos` : 'Idade N/A'} • {getPrimaryStrokeType(patient)}
                </Text>
              </View>

              {/* Lápis: Abre a tela de Dados Completos + Edição */}
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

      {/* Modal de Edição do Grupo */}
      <Modal
        visible={groupModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGroupModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Informações do Grupo</Text>
              <TouchableOpacity onPress={() => setGroupModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={modalStyles.label}>Nome do Grupo</Text>
            <TextInput
              style={modalStyles.input}
              value={groupName}
              onChangeText={setGroupName}
              placeholder="Ex: Rede de Apoio Família Silva"
            />

            <View style={modalStyles.buttonRow}>
              <TouchableOpacity
                style={modalStyles.cancelButton}
                onPress={() => setGroupModalVisible(false)}
              >
                <Text style={modalStyles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={modalStyles.saveButton}
                onPress={handleSaveGroup}
                disabled={savingGroup}
              >
                {savingGroup ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={modalStyles.saveText}>Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Único de Dados Completos e Edição do Paciente */}
      <Modal
        visible={patientModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPatientModalVisible(false)}
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={modalStyles.header}>
                <Text style={modalStyles.title}>Dados Completos do Paciente</Text>
                <TouchableOpacity onPress={() => setPatientModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={modalStyles.label}>Nome Completo</Text>
              <TextInput
                style={modalStyles.input}
                value={patientName}
                onChangeText={setPatientName}
                placeholder="Ex: João da Silva"
              />

              <Text style={modalStyles.label}>Idade (anos)</Text>
              <TextInput
                style={modalStyles.input}
                value={patientAge}
                onChangeText={setPatientAge}
                placeholder="Ex: 68"
                keyboardType="numeric"
              />

              <Text style={modalStyles.label}>Data de Nascimento (AAAA-MM-DD)</Text>
              <TextInput
                style={modalStyles.input}
                value={patientBirthDate}
                onChangeText={setPatientBirthDate}
                placeholder="Ex: 1956-08-15"
              />

              <Text style={modalStyles.label}>Informações Relevantes / Cuidados</Text>
              <TextInput
                style={[modalStyles.input, modalStyles.textArea]}
                value={importantDescription}
                onChangeText={setImportantDescription}
                placeholder="Ex: Alérgico a medicamentos, necessita de apoio para locomoção..."
                multiline={true}
                numberOfLines={3}
              />

              <Text style={modalStyles.subSectionTitle}>Histórico de Episódios de AVC</Text>

              <Text style={modalStyles.label}>Qtd. AVC Isquêmico</Text>
              <TextInput
                style={modalStyles.input}
                value={ischemicCount}
                onChangeText={setIschemicCount}
                placeholder="0"
                keyboardType="numeric"
              />

              <Text style={modalStyles.label}>Qtd. AVC Hemorrágico</Text>
              <TextInput
                style={modalStyles.input}
                value={hemorrhagicCount}
                onChangeText={setHemorrhagicCount}
                placeholder="0"
                keyboardType="numeric"
              />

              <Text style={modalStyles.label}>Qtd. Ataque Isquêmico Transitório (AIT)</Text>
              <TextInput
                style={modalStyles.input}
                value={transientCount}
                onChangeText={setTransientCount}
                placeholder="0"
                keyboardType="numeric"
              />

              {/* Exibição das ocorrências gravadas detalhadas, caso existam */}
              {patient?.strokes && patient.strokes.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  <Text style={modalStyles.label}>Ocorrências Registradas:</Text>
                  {patient.strokes.map((stroke, index) => (
                    <View key={stroke.id || index} style={modalStyles.strokeDetailCard}>
                      <Text style={modalStyles.strokeDetailTitle}>Ocorrência #{index + 1}</Text>
                      <Text style={modalStyles.strokeDetailText}>Tipo: {stroke.strokeType}</Text>
                      <Text style={modalStyles.strokeDetailText}>Data: {formatDate(stroke.strokeDate)}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={modalStyles.buttonRow}>
                <TouchableOpacity
                  style={modalStyles.cancelButton}
                  onPress={() => setPatientModalVisible(false)}
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
                    <Text style={modalStyles.saveText}>Salvar Alterações</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    maxHeight: '90%',
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
  subSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E618E',
    marginTop: 16,
    marginBottom: 4,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
    marginBottom: 8,
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
  strokeDetailCard: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#2E618E',
  },
  strokeDetailTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  strokeDetailText: {
    fontSize: 13,
    color: '#555',
  },
});