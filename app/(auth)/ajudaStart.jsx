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
import Estilos from "../../Estilo/ajuda"

export default function AjudaScreen() {
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
          <Text style={Estilos.bulletItem}>• Tela Inicial</Text>
          <Text style={Estilos.bulletItem}>• Escolha de Papel</Text>
          <Text style={Estilos.bulletItem}>• Grupo</Text>
          <Text style={Estilos.bulletItem}>• Rotina</Text>
          <Text style={Estilos.bulletItem}>• Progresso</Text>
        </View>

        {/* --- SEÇÃO 1: TELA INICIAL --- */}
        <Text style={Estilos.sectionTitle}>Tela Inicial</Text>

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

        {/* --- SEÇÃO 2: ESCOLHA DE PAPEL --- */}
        <Text style={[Estilos.sectionTitle, { marginTop: 20 }]}>
          Escolha de Papel
        </Text>

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

        {/* --- SEÇÃO 3: GRUPO --- */}
        <Text style={[Estilos.sectionTitle, { marginTop: 20 }]}>Grupo</Text>
        <Text style={Estilos.paragraph}>
          Aqui você vê quem faz parte do grupo de apoio. É possível convidar
          novas pessoas através da URL de convite e controlar quais
          informações cada membro pode ver ou editar (Rotina, Progresso,
          Info).
        </Text>

        {/* --- SEÇÃO 4: ROTINA --- */}
        <Text style={[Estilos.sectionTitle, { marginTop: 20 }]}>Rotina</Text>
        <Text style={Estilos.paragraph}>
          Aqui ficam as atividades e cuidados do dia a dia, organizados por
          semana ou mês, com o responsável e o horário de cada tarefa. Também
          é possível preencher os dados do paciente.
        </Text>

        {/* --- SEÇÃO 5: PROGRESSO --- */}
        <Text style={[Estilos.sectionTitle, { marginTop: 20 }]}>
          Progresso
        </Text>
        <Text style={Estilos.paragraph}>
          Na aba <Text style={Estilos.boldText}>Registro</Text>, você avalia
          Comunicação, Mobilidade, Memória, Compreensão e Disposição através
          de sliders, além de registrar o humor do dia.
        </Text>
        <Text style={Estilos.paragraph}>
          Na aba <Text style={Estilos.boldText}>Resumo</Text>, você acompanha
          gráficos com a evolução semanal e o histórico de humor no mês.
        </Text>

        {/* Espaçador final para que o texto role até o fim sem cobrir o botão */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Botão Flutuante Translúcido */}
      <View style={Estilos.floatingButtonContainer}>
        <TouchableOpacity
          style={Estilos.floatingButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Text style={Estilos.floatingButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
