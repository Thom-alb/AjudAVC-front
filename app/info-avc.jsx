import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import Estilos from "../Estilo/infoajudaavc"


export default function InfoAvcScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#73A5C6" />

      {/* Conteúdo com Rolagem */}
      <ScrollView
        contentContainerStyle={Estilos.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sumário / Links rápidos */}
        <View style={Estilos.summaryContainer}>
          <Text style={Estilos.bulletItem}>• Sobre AVC</Text>
          <Text style={Estilos.bulletItem}>• Primeiros Socorros</Text>
          <Text style={Estilos.bulletItem}>• Cuidados</Text>
        </View>

        {/* --- SEÇÃO 1: SOBRE AVC --- */}
        <Text style={Estilos.sectionTitle}>Sobre AVC</Text>
        <Text style={Estilos.subTitle}>O que é AVC?</Text>

        <Text style={Estilos.paragraph}>
          AVC (Acidente Vascular Cerebral) ocorre quando o fluxo sanguíneo para
          uma parte do cérebro é interrompido, causando lesão neurológica.
        </Text>

        <Text style={Estilos.paragraph}>
          <Text style={Estilos.boldText}>Isquêmico:</Text> Vasos sanguíneos
          entupidos{"\n"}
          <Text style={Estilos.boldText}>Hemorrágico:</Text> Vasos sanguíneos
          rompidos
        </Text>

        <Text style={Estilos.paragraph}>
          Ainda existe o ataque Isquêmico transitório, onde o fluxo de sangue se
          interrompe temporariamente, nesses casos é importante buscar
          atendimento médico.
        </Text>

        {/* --- SEÇÃO 2: PRIMEIROS SOCORROS --- */}
        <Text style={[Estilos.sectionTitle, { marginTop: 20 }]}>
          Primeiros Socorros
        </Text>

        <Text style={Estilos.highlightTitle}>SAMU:</Text>
        <Text style={Estilos.paragraph}>
          verifique esses sinais:{"\n"}
          <Text style={Estilos.boldText}>S</Text> - Sorriso assimétrico.{"\n"}
          <Text style={Estilos.boldText}>A</Text> - Abraço fraco de um lado.{"\n"}
          <Text style={Estilos.boldText}>M</Text> - Mensagem/frase confusa.{"\n"}
          <Text style={Estilos.boldText}>U</Text> - Urgente: ligue 192.
        </Text>

        <Text style={Estilos.highlightTitle}>Ajuda:</Text>
        <Text style={Estilos.paragraph}>
          Vá para a unidade de saúde mais rápido possível o tempo é crucial
        </Text>

        <Text style={Estilos.subTitle}>O que fazer</Text>

        <View style={Estilos.listContainer}>
          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>1. Mantenha a calma:</Text> Tranquilize a
            vítima.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>2. Posicione com segurança:</Text> Ajude a
            pessoa a sentar ou deitar de lado (para evitar engasgos caso vomite).
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>3. Afrouxe roupas apertadas:</Text>{" "}
            Facilite a respiração.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>4. Anote a hora:</Text> Registre
            exatamente a hora em que os primeiros sintomas começaram. Isso é
            vital para a equipe médica aplicar o tratamento correto.
          </Text>
        </View>

        {/* Espaçador final para que o texto role até o fim sem cobrir o botão */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Botão Flutuante Translúcido */}
      <View style={Estilos.floatingButtonContainer}>
        <TouchableOpacity
          style={Estilos.floatingButton}
          activeOpacity={0.7}
          onPress={() => router.replace('/')}
        >
          <Text style={Estilos.floatingButtonText}>Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}