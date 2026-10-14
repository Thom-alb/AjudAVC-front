import React, { useMemo, useRef, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '../../components/Themed';
import { useTheme } from '../../contexts/ThemeContext';
import createStyles from "../../Estilo/infoajudaavc";

export default function InfoAjudavcScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const Estilos = useMemo(() => createStyles(colors), [colors]);

  // Estado para controlar a visibilidade do botão de topo
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Referência para o ScrollView principal
  const scrollViewRef = useRef(null);
  const sectionPositions = useRef({});

  // Salva a posição vertical das seções
  const handleLayout = (sectionKey) => (event) => {
    const { y } = event.nativeEvent.layout;
    sectionPositions.current[sectionKey] = y;
  };

  // Monitora a rolagem do ScrollView
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 150) {
      if (!showScrollTop) setShowScrollTop(true);
    } else {
      if (showScrollTop) setShowScrollTop(false);
    }
  };

  // Rola suavemente até a seção
  const scrollToSection = (sectionKey) => {
    const yPosition = sectionPositions.current[sectionKey];
    if (yPosition !== undefined && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: yPosition,
        animated: true,
      });
    }
  };

  // Rola suavemente até o topo da própria página
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: 0,
        animated: true,
      });
    }
  };

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
      />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={Estilos.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Topo: Logo e Visão Geral */}
        <View style={Estilos.headerSection}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={Estilos.logo}
            resizeMode="contain"
          />
          <Text style={Estilos.headerText}>
            O <Text style={Estilos.boldText}>AjudAVC</Text> é uma plataforma desenvolvida para organizar, acompanhar e facilitar o processo de reabilitação de pacientes pós-AVC.
          </Text>
        </View>

        <Text style={Estilos.paragraph}>
          Nosso objetivo é fortalecer a integração da rede de apoio — reunindo cuidadores, familiares e profissionais de saúde em um ambiente acessível e intuitivo.
        </Text>

        {/* Sumário de Navegação Rápida (Smooth Scroll) */}
        <View style={Estilos.summaryContainer}>
          <TouchableOpacity onPress={() => scrollToSection('grupo')}>
            <Text style={Estilos.bulletItem}>• Redes de Apoio (Grupo)</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('rotina')}>
            <Text style={Estilos.bulletItem}>• Gestão de Rotina</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('progresso')}>
            <Text style={Estilos.bulletItem}>• Acompanhamento e Progresso</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('guia')}>
            <Text style={Estilos.bulletItem}>• Guia Educativo do AVC</Text>
          </TouchableOpacity>
        </View>

        {/* RECURSO 1: GRUPO */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('grupo')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="people-outline" size={28} color={colors.primary} />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>1. Grupo de Apoio</Text>
          </View>

          <Text style={Estilos.paragraph}>
            Centralize os cuidados em um só lugar:
          </Text>
          <Text style={Estilos.paragraph}>
            • Convite de membros por e-mail (cuidadores, familiares e médicos).{"\n"}
            • Controle de permissões e níveis de acesso.{"\n"}
            • Mural de avisos urgentes e recados importantes para toda a equipe.
          </Text>
        </View>

        {/* RECURSO 2: ROTINA */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('rotina')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="calendar-outline" size={28} color={colors.primary} />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>2. Gestão de Rotina</Text>
          </View>

          <Text style={Estilos.paragraph}>
            Organização diária, semanal e mensal para não perder prazos de medicamentos ou terapias:
          </Text>
          <Text style={Estilos.paragraph}>
            • Visualização por dia, semana ou mês.{"\n"}
            • Detalhes das tarefas com indicação do responsável, horário e turno.{"\n"}
            • Marcação de conclusão de tarefas em tempo real.{"\n"}
            • Opção de assumir ou trocar turnos entre cuidadores.
          </Text>
        </View>

        {/* RECURSO 3: PROGRESSO */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('progresso')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="stats-chart-outline" size={28} color={colors.primary} />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>3. Progresso e Reabilitação</Text>
          </View>

          <Text style={Estilos.paragraph}>
            Acompanhamento detalhado da evolução do paciente para apresentação médica:
          </Text>
          <Text style={Estilos.paragraph}>
            • <Text style={Estilos.boldText}>Métricas de Evolução:</Text> Registro semanal de Comunicação, Mobilidade, Memória, Compreensão e Disposição.{"\n"}
            • <Text style={Estilos.boldText}>Diário de Humor:</Text> Monitoramento do bem-estar emocional do paciente.{"\n"}
            • <Text style={Estilos.boldText}>Gráficos e Resumos:</Text> Relatórios visuais sobre a evolução para auxílio no tratamento contínuo.
          </Text>
        </View>

        {/* RECURSO 4: GUIA EDUCATIVO */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('guia')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="medical-outline" size={28} color={colors.primary} />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>4. Guia Rápido de Emergência</Text>
          </View>

          <Text style={Estilos.paragraph}>
            Um informativo integrado sobre o AVC contendo orientações de primeiros socorros (Regra SAMU), prevenções e orientações do que evitar em episódios críticos.
          </Text>
        </View>

        {/* Espaçador final */}
        <View style={Estilos.spacer} />
      </ScrollView>

      {/* Container dos Botões Flutuantes Sincronizados com Seta à Direita */}
      <View style={Estilos.floatingButtonContainer}>
        {/* 1º ELEMENTO: Botão principal Voltar ao home (Fica fixo no lado esquerdo) */}
        <TouchableOpacity
          style={[Estilos.floatingButton, { backgroundColor: colors.primary, borderColor: colors.border }]}
          activeOpacity={0.7}
          onPress={() => router.replace('/')}
        >
          <Text style={[Estilos.floatingButtonText, { color: '#FFFFFF' }]}>Voltar</Text>
        </TouchableOpacity>

        {/* 2º ELEMENTO: Mini Botão Voltar ao Topo (Surge dinamicamente no lado DIREITO) */}
        {showScrollTop && (
          <TouchableOpacity
            style={[Estilos.scrollTopButton, { borderColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={scrollToTop}
          >
            <Ionicons name="arrow-up" size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
