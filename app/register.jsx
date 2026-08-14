import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Estilos from '../Estilo/registro';
import api from '../src/service/api';

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validações de formulário
    if (!name || !email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (email !== confirmEmail) {
      Alert.alert('Atenção', 'Os e-mails digitados não coincidem.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas digitadas não coincidem.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Atenção', 'Você deve aceitar os termos e condições.');
      return;
    }

    setLoading(true);

    try {
      // 2. Envia os dados para a API Spring Boot (/auth/register)
      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      Alert.alert('Sucesso!', 'Conta criada com sucesso.', [
        { text: 'OK', onPress: () => router.replace('/login') },
      ]);
    } catch (error) {
      const menssagemErro =
        error.response?.data?.message || 'Erro ao realizar o cadastro.';
      Alert.alert('Erro no Cadastro', menssagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={Estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#73A5C6" />

      <View style={Estilos.card}>
        {/* Botão de Voltar */}
        <TouchableOpacity
          style={Estilos.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={Estilos.title}>Crie sua conta</Text>

        <TextInput
          style={Estilos.input}
          placeholder="Nome"
          placeholderTextColor="#A0C1E5"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={Estilos.input}
          placeholder="Email"
          placeholderTextColor="#A0C1E5"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={Estilos.input}
          placeholder="Confirmar Email"
          placeholderTextColor="#A0C1E5"
          keyboardType="email-address"
          autoCapitalize="none"
          value={confirmEmail}
          onChangeText={setConfirmEmail}
        />

        <TextInput
          style={Estilos.input}
          placeholder="Senha"
          placeholderTextColor="#A0C1E5"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={Estilos.input}
          placeholder="Confirmar Senha"
          placeholderTextColor="#A0C1E5"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Checkbox de Termos */}
        <TouchableOpacity
          style={Estilos.checkboxContainer}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <View
            style={[
              Estilos.checkbox,
              termsAccepted && Estilos.checkboxChecked,
            ]}
          >
            {termsAccepted && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            )}
          </View>
          <Text style={Estilos.checkboxLabel}>
            Concordo com termos e condições
          </Text>
        </TouchableOpacity>

        {/* Botão de Registro */}
        <TouchableOpacity
          style={Estilos.buttonPrimary}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={Estilos.buttonText}>Registrar</Text>
          )}
        </TouchableOpacity>

        {/* Link para Ir ao Login */}
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={Estilos.linkContainer}
        >
          <Text style={Estilos.linkText}>Já tem conta? entre</Text>
        </TouchableOpacity>
      </View>

      {/* Botão Sair / Voltar ao Início */}
      <TouchableOpacity
        style={Estilos.exitButton}
        onPress={() => router.replace('/')}
      >
        <Text style={Estilos.exitButtonText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}