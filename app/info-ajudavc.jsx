import React from 'react';
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
import Estilos from "../Estilo/infoajudaavc"

export default function InfoAjudavcScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#73A5C6" />

      {/* Conteúdo com Rolagem (ScrollView) */}
      <ScrollView
        contentContainerStyle={Estilos.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topo: Logo + Descrição Inicial */}
        <View style={Estilos.headerSection}>
          <Image
            source={require('../assets/images/logo.png')}
            style={Estilos.logo}
            resizeMode="contain"
          />
          <Text style={Estilos.headerText}>
            AjudAVC é um aplicativo com foco em facilitar e organizar a
            recuperação de pessoas pós AVC.
          </Text>
        </View>

        {/* Parágrafo 2 */}
        <Text style={Estilos.paragraph}>
          Auxiliando a rede de apoio com funcionalidades e acessibilidade, e
          disponibilizando um guia rápido sobre o AVC para usuários que querem
          conhecer sobre ou se precaver.
        </Text>

        {/* Seção 3: Telas Principais + Ícone de Grupo */}
        <View style={Estilos.sectionRow}>
          <View style={Estilos.textColumn}>
            <Text style={Estilos.paragraph}>
              <Text style={Estilos.boldText}>AjudAVC conta com 3 telas principais:{"\n"}</Text>
              <Text style={Estilos.boldText}>{"\n"}Grupo</Text>, onde você pode criar um grupo e/ou
              enviar um convite por email, gerenciar membros e permissões,
              enviar e responder avisos.
            </Text>
          </View>
          <Ionicons name="people-outline" size={100} color="#2E618E" style={Estilos.iconStyle} />
        </View>

        {/* Explicação Rotina */}
        <Text style={Estilos.paragraph}>
          <Text style={Estilos.boldText}>Rotina</Text>, com 3 opções: dia, semana e mês, para
          melhor visibilidade de quando e abaixo a descrição da tarefa da
          rotina com o dia e quem é responsável, junto com período e
          checagem se foi feito ou não, podendo criar uma nova atividade, ou
          assumir turno.
        </Text>

        {/* Seção 4: Progresso + Ícone de Gráfico */}
        <View style={Estilos.sectionRow}>
          <View style={Estilos.textColumn}>
            <Text style={Estilos.paragraph}>
              <Text style={Estilos.boldText}>Progresso</Text>, tem registro: onde pode ser
              marcado com certo atributos a evolução semanal do paciente:
              Comunicação, Mobilidade, Memória, Compreensão e Disposição, com uma
              seção de humor para entender como o paciente se sente, ainda em
              progresso é possível ver a seção de resumo onde será possível
              ver por gráfico a evolução semanal do paciente e um diagrama de
              resumo.
            </Text>
          </View>
          <Ionicons name="stats-chart-outline" size={100} color="#2E618E" style={Estilos.iconStyle} />
        </View>

        {/* Espaçador final para que o conteúdo role além do botão flutuante */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Botão Flutuante Translúcido (Floating Button) */}
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
