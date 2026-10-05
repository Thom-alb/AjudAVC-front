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
import Estilos from "../../Estilo/infoavc";

export default function InfoAvcScreen() {
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
        {/* Sumário de Navegação Rápida */}
        <View style={Estilos.summaryContainer}>
          <TouchableOpacity onPress={() => scrollToSection('oQueE')}>
            <Text style={Estilos.bulletItem}>• O que é o AVC</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('tipos')}>
            <Text style={Estilos.bulletItem}>• Tipos de AVC</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('sintomas')}>
            <Text style={Estilos.bulletItem}>• Sintomas e Sinais de Alerta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('primeirosSocorros')}>
            <Text style={Estilos.bulletItem}>• Primeiros Socorros (SAMU)</Text>
          </TouchableOpacity>
        </View>

        {/* SEÇÃO 1: O QUE É O AVC */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('oQueE')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="information-circle-outline" size={28} color="#2E618E" />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>O que é o AVC?</Text>
          </View>
          <Text style={Estilos.paragraph}>
            O Acidente Vascular Cerebral (AVC) ocorre quando o fornecimento de sangue para uma parte do cérebro é interrompido ou reduzido, privando o tecido cerebral de oxigênio e nutrientes.
          </Text>
        </View>

        {/* SEÇÃO 2: TIPOS DE AVC */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('tipos')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="git-branch-outline" size={28} color="#2E618E" />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>Tipos de AVC</Text>
          </View>
          <Text style={Estilos.subTitle}>1. AVC Isquêmico</Text>
          <Text style={Estilos.paragraph}>
            É o tipo mais comum. Acontece quando um vaso sanguíneo que leva sangue ao cérebro é entupido por um coágulo.
          </Text>

          <Text style={Estilos.subTitle}>2. AVC Hemorrágico</Text>
          <Text style={Estilos.paragraph}>
            Ocorre quando um vaso sanguíneo se rompe dentro ou na superfície do cérebro, causando um sangramento.
          </Text>
        </View>

        {/* SEÇÃO 3: SINTOMAS */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('sintomas')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="warning-outline" size={28} color="#2E618E" />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>Sintomas e Sinais</Text>
          </View>
          <Text style={Estilos.paragraph}>
            • Perda de força ou dormência no rosto, braço ou perna (especialmente em um lado do corpo).{"\n"}
            • Dificuldade para falar ou compreender a fala.{"\n"}
            • Alteração na visão ou tontura repentina.{"\n"}
            • Dor de cabeça forte e sem causa aparente.
          </Text>
        </View>

        {/* SEÇÃO 4: PRIMEIROS SOCORROS */}
        <View 
          style={Estilos.sectionBlock} 
          onLayout={handleLayout('primeirosSocorros')}
        >
          <View style={Estilos.topicHeader}>
            <Ionicons name="medkit-outline" size={28} color="#2E618E" />
            <Text style={[Estilos.sectionTitle, Estilos.topicTitle]}>Primeiros Socorros</Text>
          </View>
          <Text style={Estilos.paragraph}>
            Lembre-se da regra SAMU:{"\n"}
            • <Text style={Estilos.boldText}>S (Sorriso):</Text> Peça para a pessoa sorrir. O rosto está torto?{"\n"}
            • <Text style={Estilos.boldText}>A (Abraço):</Text> Peça para levantar os dois braços. Um cai?{"\n"}
            • <Text style={Estilos.boldText}>M (Música):</Text> Peça para repetir uma frase. A fala está arrastada?{"\n"}
            • <Text style={Estilos.boldText}>U (Urgência):</Text> Ligue imediatamente para o SAMU (192).
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