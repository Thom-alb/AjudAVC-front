import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Estilos from "../../Estilo/infoajudaavc";

export default function InfoAjudavcScreen() {
  const router = useRouter();

  // Referência para o ScrollView principal
  const scrollViewRef = useRef(null);
  const sectionPositions = useRef({});

  // Salva a posição vertical das seções
  const handleLayout = (sectionKey) => (event) => {
    const { y } = event.nativeEvent.layout;
    sectionPositions.current[sectionKey] = y;
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

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#73A5C6" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={Estilos.scrollContent}
        showsVerticalScrollIndicator={false}
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
          style={Estilos.sectionRow} 
          onLayout={handleLayout('grupo')}
        >
          <View style={Estilos.textColumn}>
            <Text style={Estilos.sectionTitle}>1. Grupo de Apoio</Text>
            <Text style={Estilos.paragraph}>
              Centralize os cuidados em um só lugar:
            </Text>
            <Text style={Estilos.paragraph}>
              • Convite de membros por e-mail (cuidadores, familiares e médicos).{"\n"}
              • Controle de permissões e níveis de acesso.{"\n"}
              • Mural de avisos urgentes e recados importantes para toda a equipe.
            </Text>
          </View>
          <Ionicons name="people-outline" size={70} color="#2E618E" style={Estilos.iconStyle} />
        </View>

        {/* RECURSO 2: ROTINA */}
        <View 
          style={Estilos.sectionRow} 
          onLayout={handleLayout('rotina')}
        >
          <View style={Estilos.textColumn}>
            <Text style={Estilos.sectionTitle}>2. Gestão de Rotina</Text>
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
          <Ionicons name="calendar-outline" size={70} color="#2E618E" style={Estilos.iconStyle} />
        </View>

        {/* RECURSO 3: PROGRESSO */}
        <View 
          style={Estilos.sectionRow} 
          onLayout={handleLayout('progresso')}
        >
          <View style={Estilos.textColumn}>
            <Text style={Estilos.sectionTitle}>3. Progresso e Reabilitação</Text>
            <Text style={Estilos.paragraph}>
              Acompanhamento detalhado da evolução do paciente para apresentação médica:
            </Text>
            <Text style={Estilos.paragraph}>
              • <Text style={Estilos.boldText}>Métricas de Evolução:</Text> Registro semanal de Comunicação, Mobilidade, Memória, Compreensão e Disposição.{"\n"}
              • <Text style={Estilos.boldText}>Diário de Humor:</Text> Monitoramento do bem-estar emocional do paciente.{"\n"}
              • <Text style={Estilos.boldText}>Gráficos e Resumos:</Text> Relatórios visuais sobre a evolução para auxílio no tratamento contínuo.
            </Text>
          </View>
          <Ionicons name="stats-chart-outline" size={70} color="#2E618E" style={Estilos.iconStyle} />
        </View>

        {/* RECURSO 4: GUIA EDUCATIVO */}
        <View 
          style={Estilos.sectionRow} 
          onLayout={handleLayout('guia')}
        >
          <View style={Estilos.textColumn}>
            <Text style={Estilos.sectionTitle}>4. Guia Rápido de Emergência</Text>
            <Text style={Estilos.paragraph}>
              Um informativo integrado sobre o AVC contendo orientações de primeiros socorros (Regra SAMU), prevenções e orientações do que evitar em episódios críticos.
            </Text>
          </View>
          <Ionicons name="medical-outline" size={70} color="#2E618E" style={Estilos.iconStyle} />
        </View>

        {/* Espaçador final */}
        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Botão Flutuante */}
      <View style={Estilos.floatingButtonContainer}>
        <TouchableOpacity
          style={Estilos.floatingButton}
          activeOpacity={0.7}
          onPress={() => router.replace('/')}
        >
          <Text style={Estilos.floatingButtonText}>Voltar ao início</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}