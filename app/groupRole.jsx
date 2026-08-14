import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Estilos from "../Estilo/groupRole";
import api from "../src/service/api";

export default function GroupRole() {
  const router = useRouter();

  // Estados de controle dos Modais
  const [modalHostVisible, setModalHostVisible] = useState(false);
  const [modalMemberVisible, setModalMemberVisible] = useState(false);

  // Estados dos inputs
  const [groupName, setGroupName] = useState("");
  const [patientName, setPatientName] = useState(""); // 💡 NOVO: Nome da pessoa cuidada
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Criar novo grupo (ANFITRIÃO)
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Atenção", "Por favor, digite o nome do grupo.");
      return;
    }

    setLoading(true);
    try {
      // POST /groups (envia CreateGroupDTO alinhado com o backend)
      const response = await api.post("/groups", {
        name: groupName.trim(),
        patientName: patientName.trim() || undefined,
      });

      const groupData = response.data;

      // 💡 Guarda o ID do grupo ativo
      if (groupData?.id) {
        await AsyncStorage.setItem("activeGroupId", String(groupData.id));
      }

      setModalHostVisible(false);
      setGroupName("");
      setPatientName("");

      // Redireciona diretamente para a Home
      router.replace("/home");
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao criar grupo.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Entrar em grupo existente (AJUDANTE)
  const handleJoinGroup = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Atenção", "Por favor, digite o código de convite.");
      return;
    }

    setLoading(true);
    try {
      // POST /groups/join (envia JoinGroupDTO)
      const response = await api.post("/groups/join", {
        inviteCode: inviteCode.trim(),
      });

      const groupData = response.data;

      // 💡 Guarda o ID do grupo ativo
      if (groupData?.id) {
        await AsyncStorage.setItem("activeGroupId", String(groupData.id));
      }

      setModalMemberVisible(false);
      setInviteCode("");

      // Redireciona diretamente para a Home
      router.replace("/home");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Código inválido ou não encontrado.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Ação de deslogar/sair
  const sair = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("activeGroupId");
    router.replace("/");
  };

  return (
    <View style={Estilos.container}>
      <Text style={Estilos.titulo}>Você é:</Text>

      {/* CARD ANFITRIÃO (LÍDER) */}
      <Pressable style={Estilos.card} onPress={() => setModalHostVisible(true)}>
        <Text style={Estilos.cardTitulo}>Anfitrião</Text>
        <Text style={Estilos.cardSubtitulo}>Líder de Grupo</Text>

        <View style={Estilos.usuarioIcone}>
          <View style={Estilos.cabeca} />
          <View style={Estilos.corpo} />
        </View>
      </Pressable>

      {/* OU */}
      <Text style={Estilos.ou}>Ou</Text>

      {/* CARD AJUDANTE (MEMBRO) */}
      <Pressable
        style={Estilos.card}
        onPress={() => setModalMemberVisible(true)}
      >
        <Text style={Estilos.cardTitulo}>Ajudante</Text>
        <Text style={Estilos.cardSubtitulo}>Membro de Grupo</Text>

        <View style={Estilos.grupoIcone}>
          <View style={Estilos.pessoaFundoEsquerda}>
            <View style={Estilos.cabecaPequena} />
            <View style={Estilos.corpoPequeno} />
          </View>

          <View style={Estilos.pessoaPrincipal}>
            <View style={Estilos.cabeca} />
            <View style={Estilos.corpo} />
          </View>

          <View style={Estilos.pessoaFundoDireita}>
            <View style={Estilos.cabecaPequena} />
            <View style={Estilos.corpoPequeno} />
          </View>
        </View>
      </Pressable>

      {/* SAIR */}
      <Pressable onPress={sair} style={Estilos.botaoSair}>
        <Text style={Estilos.textoSair}>Sair</Text>
      </Pressable>

      {/* MODAL 1: CRIAR GRUPO (ANFITRIÃO) */}
      <Modal visible={modalHostVisible} transparent animationType="slide">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalCard}>
            <Text style={modalStyles.modalTitle}>Criar Novo Grupo</Text>
            <Text style={modalStyles.modalSub}>
              Como Anfitrião, você gerenciará os membros e a rotina do paciente.
            </Text>

            <TextInput
              style={modalStyles.input}
              placeholder="Nome do Grupo (ex: Família Silva)"
              placeholderTextColor="#A0C1E5"
              value={groupName}
              onChangeText={setGroupName}
            />

            {/* Campo Opcional do Paciente */}
            <TextInput
              style={modalStyles.input}
              placeholder="Nome do Paciente(opcional)"
              placeholderTextColor="#A0C1E5"
              value={patientName}
              onChangeText={setPatientName}
            />

            <View style={modalStyles.buttonRow}>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.btnCancel]}
                onPress={() => setModalHostVisible(false)}
              >
                <Text style={modalStyles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.btnConfirm]}
                onPress={handleCreateGroup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={modalStyles.btnText}>Criar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: ENTRAR EM GRUPO (AJUDANTE) */}
      <Modal visible={modalMemberVisible} transparent animationType="slide">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalCard}>
            <Text style={modalStyles.modalTitle}>Entrar em um Grupo</Text>
            <Text style={modalStyles.modalSub}>
              Insira o código de convite fornecido pelo Anfitrião do grupo.
            </Text>

            <TextInput
              style={modalStyles.input}
              placeholder="Código de Convite"
              placeholderTextColor="#A0C1E5"
              autoCapitalize="characters"
              value={inviteCode}
              onChangeText={setInviteCode}
            />

            <View style={modalStyles.buttonRow}>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.btnCancel]}
                onPress={() => setModalMemberVisible(false)}
              >
                <Text style={modalStyles.btnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.btn, modalStyles.btnConfirm]}
                onPress={handleJoinGroup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={modalStyles.btnText}>Entrar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos locais auxiliares para os Modais
const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#2E618E",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    color: "#D0E1F9",
    marginBottom: 16,
    lineHeight: 18,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#A0C1E5",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: "#1E486D",
  },
  btnConfirm: {
    backgroundColor: "#73A5C6",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
};