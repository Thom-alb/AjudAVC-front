import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Estilos from "../../Estilo/ajuda";

export default function AjudaScreen() {
  const router = useRouter();

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
      <StatusBar barStyle="light-content" backgroundColor="#73A5C6" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={Estilos.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Sumário / Links rápidos Clicáveis */}
        <View style={Estilos.summaryContainer}>
          <TouchableOpacity onPress={() => scrollToSection('telaInicial')}>
            <Text style={Estilos.bulletItem}>• Tela Inicial</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('escolhaPapel')}>
            <Text style={Estilos.bulletItem}>• Escolha de Papel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('grupo')}>
            <Text style={Estilos.bulletItem}>• Grupo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('rotina')}>
            <Text style={Estilos.bulletItem}>• Rotina</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('progresso')}>
            <Text style={Estilos.bulletItem}>• Progresso</Text>
          </TouchableOpacity>
        </View>

        {/* --- SEÇÃO 1: TELA INICIAL --- */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('telaInicial')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="home-outline" size={28} color="#2E618E" />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>Tela Inicial</Text>
          </View>

          <Text style={Estilos.subTitle}>Botão Login</Text>
          <Text style={Estilos.paragraph}>
            Use este botão se você já tem uma conta no AjudAVC. Ao tocar aqui,
            digite seu e-mail e senha para entrar e acessar seus grupos, rotinas
            e registros de progresso.
          </Text>

          <Text style={Estilos.subTitle}>Botão Registro</Text>
          <Text style={Estilos.paragraph}>
            Use este botão se é a primeira vez que você usa o AjudAVC. Você vai
            criar uma conta com seu nome, e-mail e senha para depois entrar em
            um grupo já existente ou criar o seu.
          </Text>

          <Text style={Estilos.subTitle}>Botão Saiba Mais</Text>
          <Text style={Estilos.paragraph}>
            Aqui você encontra informações sobre o que é o AVC (tipos, sintomas,
            primeiros socorros e cuidados) e também sobre o projeto AjudAVC.
            Não é necessário estar logado para acessar.
          </Text>
        </View>

        {/* --- SEÇÃO 2: ESCOLHA DE PAPEL --- */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('escolhaPapel')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="person-add-outline" size={28} color="#2E618E" />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>Escolha de Papel</Text>
          </View>

          <Text style={Estilos.subTitle}>Anfitrião / Líder de Grupo</Text>
          <Text style={Estilos.paragraph}>
            Escolha essa opção se você é quem vai organizar os cuidados: você
            cria o grupo, convida outras pessoas e controla as permissões de
            cada uma.
          </Text>

          <Text style={Estilos.subTitle}>Ajudante / Membro</Text>
          <Text style={Estilos.paragraph}>
            Escolha essa opção se alguém já te convidou para um grupo. Você
            entra usando o link de convite recebido.
          </Text>
        </View>

        {/* --- SEÇÃO 3: GRUPO --- */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('grupo')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="people-outline" size={28} color="#2E618E" />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>Grupo</Text>
          </View>
          <Text style={Estilos.paragraph}>
            Aqui você vê quem faz parte do grupo de apoio. É possível convidar
            novas pessoas através da URL de convite e controlar quais
            informações cada membro pode ver ou editar (Rotina, Progresso, Info).
          </Text>
        </View>

        {/* --- SEÇÃO 4: ROTINA --- */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('rotina')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="calendar-outline" size={28} color="#2E618E" />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>Rotina</Text>
          </View>
          <Text style={Estilos.paragraph}>
            Aqui ficam as atividades e cuidados do dia a dia, organizados por
            semana ou mês, com o responsável e o horário de cada tarefa. Também
            é possível preencher os dados do paciente.
          </Text>
        </View>

        {/* --- SEÇÃO 5: PROGRESSO --- */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('progresso')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="stats-chart-outline" size={28} color="#2E618E" />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>Progresso</Text>
          </View>
          <Text style={Estilos.paragraph}>
            Na aba <Text style={Estilos.boldText}>Registro</Text>, você avalia
            Comunicação, Mobilidade, Memória, Compreensão e Disposição através
            de sliders, além de registrar o humor do dia.
          </Text>
          <Text style={Estilos.paragraph}>
            Na aba <Text style={Estilos.boldText}>Resumo</Text>, você acompanha
            gráficos com a evolução semanal e o histórico de humor no mês.
          </Text>
        </View>

        {/* Espaçador final */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Botões Flutuantes Lado a Lado */}
      <View style={Estilos.floatingButtonContainer}>
        {/* Mini Botão Voltar ao Topo */}
        {showScrollTop && (
          <TouchableOpacity
            style={Estilos.scrollTopButton}
            activeOpacity={0.7}
            onPress={scrollToTop}
          >
            <Ionicons name="arrow-up" size={18} color="#5ab5f1" />
          </TouchableOpacity>
        )}

        {/* Botão Voltar ao Home */}
        <TouchableOpacity
          style={Estilos.floatingButton}
          activeOpacity={0.7}
          onPress={() => router.replace('/')}
        >
          <Text style={Estilos.floatingButtonText}>Voltar ao home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}