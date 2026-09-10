import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import Estilos from "../../Estilo/infoajudaavc";

export default function InfoAvcScreen() {
  const router = useRouter();

  // Referência para o ScrollView principal
  const scrollViewRef = useRef(null);

  // Guardará a posição Y de cada seção
  const sectionPositions = useRef({});

  // Função para salvar a posição vertical de cada seção
  const handleLayout = (sectionKey) => (event) => {
    const { y } = event.nativeEvent.layout;
    sectionPositions.current[sectionKey] = y;
  };

  // Função para rolar até a seção desejada
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

      {/* Conteúdo com Rolagem */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={Estilos.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sumário / Links rápidos Clicáveis */}
        <View style={Estilos.summaryContainer}>
          <TouchableOpacity onPress={() => scrollToSection('sobre')}>
            <Text style={Estilos.bulletItem}>• Sobre AVC</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('sinaisAlerta')}>
            <Text style={Estilos.bulletItem}>• Sinais de Alerta Urgente</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('primeirosSocorros')}>
            <Text style={Estilos.bulletItem}>• Primeiros Socorros</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('oQueNaoFazer')}>
            <Text style={Estilos.bulletItem}>• O Que Não Fazer</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('prevencao')}>
            <Text style={Estilos.bulletItem}>• Prevenção e Riscos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => scrollToSection('sequelas')}>
            <Text style={Estilos.bulletItem}>• Sequelas Comuns</Text>
          </TouchableOpacity>
        </View>

        {/* --- SEÇÃO 1: SOBRE AVC --- */}
        <Text 
          style={Estilos.sectionTitle} 
          onLayout={handleLayout('sobre')}
        >
          Sobre AVC
        </Text>
        <Text style={Estilos.subTitle}>O que é AVC?</Text>

        <Text style={Estilos.paragraph}>
          O Acidente Vascular Cerebral (AVC) ocorre quando o fluxo de sangue para
          uma parte do cérebro é interrompido ou reduzido, privando o tecido cerebral de oxigênio e nutrientes.
        </Text>

        <Text style={Estilos.paragraph}>
          <Text style={Estilos.boldText}>• Isquêmico:</Text> Causa mais comum. Ocorre pelo entupimento ou obstrução de uma artéria.{"\n"}
          <Text style={Estilos.boldText}>• Hemorrágico:</Text> Ocorre pelo rompimento de um vaso sanguíneo no cérebro.
        </Text>

        <Text style={Estilos.paragraph}>
          <Text style={Estilos.boldText}>Ataque Isquêmico Transitório (AIT):</Text> É o bloqueio temporário do fluxo sanguíneo. Embora os sintomas desapareçam em minutos, serve como um forte aviso de risco elevado para um AVC grave. Exige atendimento médico imediato.
        </Text>

        {/* --- SEÇÃO 2: SINAIS DE ALERTA URGENTE --- */}
        <Text 
          style={[Estilos.sectionTitle, { marginTop: 20 }]} 
          onLayout={handleLayout('sinaisAlerta')}
        >
          Sinais de Alerta Urgente
        </Text>

        <Text style={Estilos.paragraph}>
          Fique atento a estes sintomas de início súbito e procure ajuda imediatamente caso perceba qualquer um deles:
        </Text>

        <View style={Estilos.listContainer}>
          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Perda de visão:</Text> Turvação ou perda de visão súbita em um ou ambos os olhos.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Tontura ou desequilíbrio:</Text> Dificuldade súbita para andar ou falta de coordenação motoras.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Dor de cabeça forte:</Text> Dor intensa, atípica e sem causa aparente surgida de forma repentina.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Formigamento:</Text> Adormecimento na face, braço ou perna, especialmente em apenas um lado do corpo.
          </Text>
        </View>

        {/* --- SEÇÃO 3: PRIMEIROS SOCORROS --- */}
        <Text 
          style={[Estilos.sectionTitle, { marginTop: 20 }]} 
          onLayout={handleLayout('primeirosSocorros')}
        >
          Primeiros Socorros
        </Text>

        <Text style={Estilos.highlightTitle}>Identificação Rápida (Regra SAMU):</Text>
        <Text style={Estilos.paragraph}>
          <Text style={Estilos.boldText}>S</Text> - <Text style={Estilos.boldText}>Sorriso:</Text> Peça para a pessoa sorrir. Veja se o rosto entorta.{"\n"}
          <Text style={Estilos.boldText}>A</Text> - <Text style={Estilos.boldText}>Abraço:</Text> Peça para erguer os dois braços. Note se um lado cai.{"\n"}
          <Text style={Estilos.boldText}>M</Text> - <Text style={Estilos.boldText}>Mensagem:</Text> Peça para repetir uma frase simples. Observe se a fala está enrolada.{"\n"}
          <Text style={Estilos.boldText}>U</Text> - <Text style={Estilos.boldText}>Urgente:</Text> Ao notar qualquer um destes sinais, ligue 192 (SAMU) na hora.
        </Text>

        <Text style={Estilos.subTitle}>O que fazer no local</Text>

        <View style={Estilos.listContainer}>
          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>1. Mantenha a calma:</Text> Tranquilize a pessoa até a chegada do resgate.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>2. Posicione com segurança:</Text> Mantenha a pessoa deitada de lado para evitar engasgos caso venha a vomitar.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>3. Afrouxe as roupas:</Text> Desabotoe golas e afrouxe cintos para facilitar a respiração.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>4. Registre o horário exato:</Text> Anote a hora exata do início dos sintomas. Essa informação determina quais medicações a equipe médica poderá aplicar.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>5. Reúna documentos:</Text> Se possível, separe a lista de remédios contínuos e documentos de identificação da pessoa para levar ao hospital.
          </Text>
        </View>

        {/* --- SEÇÃO 4: O QUE NÃO FAZER --- */}
        <Text 
          style={[Estilos.sectionTitle, { marginTop: 20 }]} 
          onLayout={handleLayout('oQueNaoFazer')}
        >
          O Que NÃO Fazer
        </Text>

        <View style={Estilos.listContainer}>
          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Não dê alimentos ou líquidos:</Text> A pessoa pode ter dificuldade de deglutição imperceptível e sofrer broncoaspiração (alimento ir para o pulmão).
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Não dê remédios para pressão:</Text> Baixar a pressão arterial de forma abrupta pode piorar a falta de oxigenação no cérebro.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Não espere os sintomas passarem:</Text> Mesmo que ocorra melhora espontânea, a ida imediata ao serviço de emergência é obrigatória.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Não Deixe a pessoa dormir:</Text> Mantenha a vítima acordada e em observação constante enquanto aguarda o socorro.
          </Text>
        </View>

        {/* --- SEÇÃO 5: PREVENÇÃO E RISCOS --- */}
        <Text 
          style={[Estilos.sectionTitle, { marginTop: 20 }]} 
          onLayout={handleLayout('prevencao')}
        >
          Prevenção e Fatores de Risco
        </Text>

        <Text style={Estilos.paragraph}>
          Cerca de 80% dos casos de AVC podem ser evitados com hábitos saudáveis e controle médico regular:
        </Text>

        <View style={Estilos.listContainer}>
          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Controle da Pressão Arterial:</Text> A hipertensão não tratada é o fator de risco mais expressivo.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Controle de Diabetes e Colesterol:</Text> Mantém os vasos sanguíneos preservados e sem placas de gordura.
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Hábitos de Vida:</Text> Evite o tabagismo, limite o consumo de bebidas alcoólicas e pratique exercícios físicos regularmente.
          </Text>
        </View>

        {/* --- SEÇÃO 6: SEQUELAS COMUNS --- */}
        <Text 
          style={[Estilos.sectionTitle, { marginTop: 20 }]} 
          onLayout={handleLayout('sequelas')}
        >
          Sequelas Comuns
        </Text>

        <View style={Estilos.listContainer}>
          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Mobilidade e Paralisia:</Text> Dificuldades motoras ou fraqueza unilateral no corpo (hemiparesia).
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Comunicação:</Text> Alterações para expressar pensamentos ou compreender a fala alheia (afasia).
          </Text>

          <Text style={Estilos.paragraph}>
            <Text style={Estilos.boldText}>• Dificuldade de Deglutição:</Text> Problemas para engolir (disfagia), exigindo acompanhamento fonoaudiológico.
          </Text>
        </View>

        {/* Espaçador final para garantir que o último tópico role adequadamente acima do botão */}
        <View style={{ height: 100 }} />
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