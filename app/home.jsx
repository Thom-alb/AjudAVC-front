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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import api from '../src/service/api';
import Estilos from '../Estilo/home'; // Importe seu arquivo de estilos aqui

export default function HomeScreen() {
  const router = useRouter();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Busca os dados do Grupo e dos Membros
  const fetchData = async () => {
    try {
      const [groupRes, membersRes] = await Promise.all([
        api.get('/groups/me'),
        api.get('/group-members'),
      ]);

      setGroup(groupRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados da Home:', error);
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

  // Copia o código de convite para o Clipboard
  const copyInviteCode = async () => {
    if (group?.inviteCode) {
      await Clipboard.setStringAsync(group.inviteCode);
      Alert.alert(
        'Código Copiado!',
        'O código de convite foi copiado. Envie para os ajudantes entrarem no grupo.'
      );
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
        <View>
          <Text style={Estilos.welcomeText}>Rede de Apoio</Text>
          <Text style={Estilos.groupNameTitle}>
            {group?.name || 'Seu Grupo'}
          </Text>
        </View>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View style={Estilos.content}>
            {/* Card do Código de Convite */}
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
          </View>
        )}
        renderItem={({ item }) => (
          <View style={Estilos.memberCard}>
            <View style={Estilos.avatar}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <View style={Estilos.memberInfo}>
              <Text style={Estilos.memberName}>{item.name || item.userEmail}</Text>
              <Text style={Estilos.memberRole}>
                {item.role === 'LEADER' ? 'Anfitrião (Líder)' : 'Ajudante'}
              </Text>
            </View>
            {item.role === 'LEADER' && (
              <Ionicons name="star" size={18} color="#FFD700" />
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={Estilos.emptyText}>Nenhum integrante encontrado.</Text>
        )}
      />
    </SafeAreaView>
  );
}