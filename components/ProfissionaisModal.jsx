
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

import profissionais from '../data/profissionais';
import createStyles from '../Estilo/profissionaisModal';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfissionaisModal({ visible, onClose }) {
  const { colors } = useTheme();

  const styles = useMemo(
    () => createStyles(colors),
    [colors]
  );

  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todos');

  const areas = useMemo(
    () => ['Todos', ...new Set(profissionais.map((item) => item.area))],
    []
  );

  const filteredProfessionals = useMemo(() => {
    return profissionais.filter((profissional) => {
      const matchesArea =
        selectedArea === 'Todos' ||
        profissional.area === selectedArea;

      const searchText = search.trim().toLowerCase();

      const matchesSearch = [
        profissional.nome,
        profissional.formacao,
        profissional.area,
        profissional.especialidade,
        profissional.rede,
      ].some((value) =>
        value.toLowerCase().includes(searchText)
      );

      return matchesArea && matchesSearch;
    });
  }, [search, selectedArea]);

  const copyContact = async (value, label) => {
    try {
      await Clipboard.setStringAsync(value);

      Alert.alert(
        'Copiado!',
        `${label} copiado para a área de transferência.`
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível copiar o contato.');
    }
  };

  const handleClose = () => {
    setSearch('');
    setSelectedArea('Todos');
    onClose();
  };

  const renderProfessional = (profissional) => (
    <View key={profissional.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Ionicons
            name={profissional.icon}
            size={23}
            color={colors.onPrimary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.professionalName}>
            {profissional.nome}
          </Text>

          <Text style={styles.professionalFormation}>
            {profissional.formacao}
          </Text>
        </View>
      </View>

      <View style={styles.areaBadge}>
        <Text style={styles.areaText}>
          {profissional.area} • {profissional.especialidade}
        </Text>
      </View>

      <Text style={styles.description}>
        {profissional.descricao}
      </Text>

      <Text style={styles.network}>
        <Ionicons
          name="business-outline"
          size={13}
          color={colors.muted}
        />{' '}
        {profissional.rede}
      </Text>

      <TouchableOpacity
        style={styles.contactRow}
        activeOpacity={0.7}
        onPress={() =>
          copyContact(profissional.email, 'E-mail')
        }
      >
        <Ionicons
          name="mail-outline"
          size={18}
          color={colors.primary}
        />

        <Text style={styles.contactText} numberOfLines={1}>
          {profissional.email}
        </Text>

        <Text style={styles.copyText}>COPIAR</Text>

        <Ionicons
          name="copy-outline"
          size={16}
          color={colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.contactRow}
        activeOpacity={0.7}
        onPress={() =>
          copyContact(profissional.telefone, 'Telefone')
        }
      >
        <Ionicons
          name="call-outline"
          size={18}
          color={colors.primary}
        />

        <Text style={styles.contactText}>
          {profissional.telefone}
        </Text>

        <Text style={styles.copyText}>COPIAR</Text>

        <Ionicons
          name="copy-outline"
          size={16}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={{ flex: 1 }}
          onPress={handleClose}
        />

        <View style={styles.modal}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>
              Profissionais
            </Text>

            <TouchableOpacity onPress={handleClose}>
              <Ionicons
                name="close-circle"
                size={28}
                color={colors.muted}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Encontre profissionais de diferentes áreas
            relacionados à recuperação pós-AVC.
          </Text>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color={colors.muted}
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar profissional ou especialidade..."
              placeholderTextColor={colors.placeholder}
              value={search}
              onChangeText={setSearch}
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons
                  name="close-circle"
                  size={19}
                  color={colors.muted}
                />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexGrow: 0 }}
            contentContainerStyle={styles.filters}
          >
            {areas.map((area) => {
              const active = selectedArea === area;

              return (
                <TouchableOpacity
                  key={area}
                  style={[
                    styles.filter,
                    active && styles.filterActive,
                  ]}
                  onPress={() => setSelectedArea(area)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      active && styles.filterTextActive,
                    ]}
                  >
                    {area}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filteredProfessionals.length > 0 ? (
              filteredProfessionals.map(renderProfessional)
            ) : (
              <View style={styles.empty}>
                <Ionicons
                  name="search-outline"
                  size={38}
                  color={colors.muted}
                />

                <Text style={styles.emptyText}>
                  Nenhum profissional encontrado.
                  {'\n'}
                  Tente outra pesquisa ou área.
                </Text>
              </View>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Diretório demonstrativo. Os contatos e
                profissionais apresentados são fictícios.
                O AjudAVC não realiza contratação ou
                intermediação de serviços.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
