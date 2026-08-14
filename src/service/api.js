import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router } from 'expo-router';

// Pega dinamicamente o IP da máquina onde o servidor/Expo está rodando
const hostUri = Constants.expoConfig?.hostUri?.split(':')[0];

// Se estiver no Expo Go / dispositivo físico na mesma rede Wi-Fi, usa o IP detectado.
// Se estiver no emulador Android do Android Studio, faz fallback para 10.0.2.2.
const localIp = hostUri ? hostUri : '10.0.2.2';

//const API_URL = `http://${localIp}:8055`;
const API_URL = 'http://10.0.10.112:8055';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUISIÇÃO: Anexa o JWT Token salvo em cada chamada
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de RESPOSTA: Trata sessão expirada / não autorizada (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Limpa o token salvo e manda o usuário de volta para o login
      await AsyncStorage.removeItem('authToken');
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;