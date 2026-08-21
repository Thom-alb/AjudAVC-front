import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Estilos from '../Estilo/termosCond';

export default function TermsAndConditionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={Estilos.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView
        contentContainerStyle={Estilos.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={Estilos.card}>
          {/* Cabeçalho */}
          <View style={Estilos.header}>
            <Text style={Estilos.title}>
              Termos de Uso e Condições de Serviço
            </Text>
            <Text style={Estilos.subtitle}>
              AjudAVC — Última atualização: 2026
            </Text>
          </View>

          <Text style={Estilos.paragraph}>
            Bem-vindo ao <Text style={Estilos.bold}>AjudAVC</Text>. Ao acessar,
            cadastrar-se ou utilizar nossa plataforma web e aplicativo, você
            concorda com estes{' '}
            <Text style={Estilos.bold}>Termos de Uso e Condições de Serviço</Text>
            . Recomendamos a leitura atenta deste documento antes de utilizar o
            sistema.
          </Text>

          {/* Seção 1 */}
          <Text style={Estilos.sectionHeader}>1. Sobre o AjudAVC</Text>
          <Text style={Estilos.paragraph}>
            O <Text style={Estilos.bold}>AjudAVC</Text> é uma plataforma digital
            desenvolvida para auxiliar cuidadores, familiares e redes de apoio no
            acompanhamento da rotina, histórico médico básico e evolução de
            pacientes acometidos por Acidente Vascular Cerebral (AVC).
          </Text>

          {/* Alerta de Aviso Médico */}
          <View style={Estilos.alertBox}>
            <Text style={Estilos.alertTitle}>AVISO IMPORTANTE:</Text>
            <Text style={Estilos.alertText}>
              O AjudAVC é uma ferramenta de organização, apoio e gestão de
              rotina. O aplicativo{' '}
              <Text style={Estilos.alertBold}>
                não fornece diagnósticos médicos, prescrições ou tratamentos
                hospitalares
              </Text>
              . As informações contidas na plataforma não substituem a consulta,
              o acompanhamento ou a orientação de profissionais de saúde
              qualificados.
            </Text>
          </View>

          {/* Seção 2 */}
          <Text style={Estilos.sectionHeader}>
            2. Cadastro e Contas de Usuário
          </Text>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              <Text style={Estilos.bold}>Requisitos:</Text> Para utilizar o
              AjudAVC, o usuário deve criar uma conta fornecendo dados
              verdadeiros, atualizados e completos.
            </Text>
          </View>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              <Text style={Estilos.bold}>Segurança da Conta:</Text> A senha e as
              credenciais de acesso são de responsabilidade exclusiva do
              usuário. Caso identifique qualquer uso não autorizado de sua conta,
              notifique a equipe do AjudAVC imediatamente.
            </Text>
          </View>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              <Text style={Estilos.bold}>Perfil do Paciente:</Text> O cadastro
              dos dados do paciente (como tipo de AVC, datas relevantes, dados
              de nascimento e observações importantes) deve ser realizado por um
              responsável autorizado ou cuidador líder.
            </Text>
          </View>

          {/* Seção 3 */}
          <Text style={Estilos.sectionHeader}>
            3. Grupos de Cuidado e Código de Convite
          </Text>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              <Text style={Estilos.bold}>Liderança do Grupo:</Text> O usuário que
              cria o grupo de cuidado assume o papel de{' '}
              <Text style={Estilos.bold}>Líder/Anfitrião</Text> e é responsável por
              convidar ou autorizar a entrada de novos membros na rede de apoio
              do paciente.
            </Text>
          </View>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              <Text style={Estilos.bold}>Entrada no Grupo (Código de Convite):</Text>{' '}
              A entrada em um grupo de cuidado é realizada mediante um{' '}
              <Text style={Estilos.bold}>código de convite único</Text> gerado
              pelo sistema.
            </Text>
          </View>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              <Text style={Estilos.bold}>Responsabilidade pelo Compartilhamento:</Text>{' '}
              O código de convite concede acesso às informações do paciente e à
              rotina do grupo. Cabe ao líder e aos membros compartilhar o
              código exclusivamente com pessoas de confiança da rede de apoio do
              paciente.
            </Text>
          </View>

          {/* Seção 4 */}
          <Text style={Estilos.sectionHeader}>4. Uso Adequado da Plataforma</Text>
          <Text style={Estilos.paragraph}>
            Ao utilizar o AjudAVC, o usuário se compromete a:
          </Text>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>1.</Text>
            <Text style={Estilos.bulletText}>
              Não inserir conteúdos falsos, difamatórios, ofensivos ou ilegais
              no registro de diários, tarefas ou dados do paciente.
            </Text>
          </View>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>2.</Text>
            <Text style={Estilos.bulletText}>
              Respeitar a privacidade do paciente e dos demais membros
              cadastrados no grupo de cuidado.
            </Text>
          </View>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>3.</Text>
            <Text style={Estilos.bulletText}>
              Não tentar burlar a segurança da API, praticar engenharia reversa
              ou acessar dados de outros grupos aos quais não pertença.
            </Text>
          </View>

          {/* Seção 5 */}
          <Text style={Estilos.sectionHeader}>
            5. Privacidade e Proteção de Dados (LGPD)
          </Text>
          <Text style={Estilos.paragraph}>
            O AjudAVC preza pelo tratamento transparente e seguro dos seus
            dados e dos dados do paciente:
          </Text>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              <Text style={Estilos.bold}>Dados Sensíveis de Saúde:</Text>{' '}
              Informações como tipo de AVC, histórico e diário de atividades do
              paciente são tratadas como dados sensíveis de saúde e utilizadas
              exclusivamente para a prestação dos serviços do sistema aos membros
              do grupo autorizados.
            </Text>
          </View>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              <Text style={Estilos.bold}>Compartilhamento:</Text> Seus dados não
              serão vendidos ou repassados a terceiros para fins comerciais.
            </Text>
          </View>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              <Text style={Estilos.bold}>Armazenamento Seguro:</Text> As senhas são
              criptografadas e a comunicação com nossos servidores é feita via
              conexões seguras (HTTPS/SSL).
            </Text>
          </View>

          {/* Seção 6 */}
          <Text style={Estilos.sectionHeader}>
            6. Limitação de Responsabilidade
          </Text>
          <Text style={Estilos.paragraph}>
            O AjudAVC busca garantir alta disponibilidade e precisão no
            gerenciamento das informações, porém:
          </Text>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              Não nos responsabilizamos por falhas na rotina de cuidados
              resultantes do esquecimento ou falhas humanas no preenchimento
              do aplicativo por parte dos cuidadores.
            </Text>
          </View>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              Não nos responsabilizamos por indisponibilidades temporárias do
              sistema decorrentes de manutenções técnicas, falhas na rede de
              internet do usuário ou eventos de força maior.
            </Text>
          </View>
          <View style={Estilos.bulletItem}>
            <Text style={Estilos.bulletPoint}>•</Text>
            <Text style={Estilos.bulletText}>
              Emergências médicas devem ser tratadas diretamente pelos serviços
              públicos ou privados de saúde (como o SAMU — 192).
            </Text>
          </View>

          {/* Seção 7 */}
          <Text style={Estilos.sectionHeader}>7. Alterações nos Termos</Text>
          <Text style={Estilos.paragraph}>
            O AjudAVC reserva-se o direito de alterar estes Termos de Uso a
            qualquer momento para refletir melhorias no sistema ou adequações
            legais. O uso continuado da plataforma após as alterações constituirá
            aceitação dos novos termos.
          </Text>
        </View>
      </ScrollView>

      {/* Botão Flutuante (FAB) de Voltar */}
      <TouchableOpacity
        style={Estilos.fabBackButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={26} color="#0e1f2c" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}