import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router } from 'expo-router';

// Pega dinamicamente o IP da máquina onde o servidor/Expo está rodando
const hostUri = Constants.expoConfig?.hostUri?.split(':')[0];

// Se estiver no Expo Go / dispositivo físico na mesma rede Wi-Fi, usa o IP detectado.
// Se estiver no emulador Android do Android Studio, faz fallback para 10.0.2.2.
const localIp = hostUri ? hostUri : '10.0.2.2';

// -------------------------------------------------------------
// OPÇÕES DE CONEXÃO (Descomente apenas a linha que for usar)
// -------------------------------------------------------------

// Local Manual (Ethernet 2)
const API_URL = 'http://10.0.7.20:8055'; 

// Local Dinâmico (Detectado pelo Expo)
// const API_URL = `http://${localIp}:8055`;

// Produção (Render)
// const API_URL = 'https://ajudavc-api.onrender.com';
// -------------------------------------------------------------

console.log(`[API Config] Conectando em: ${API_URL}`);

const api = axios.create({
  baseURL: API_URL,
  timeout: API_URL.includes('onrender.com') ? 60000 : 10000,
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
    const originalUrl = error.config?.url || '';

    // Evita redirecionar se o erro 401 ocorrer nas rotas públicas de autenticação
    if (
      error.response &&
      error.response.status === 401 &&
      !originalUrl.includes('/auth/')
    ) {
      await AsyncStorage.removeItem('authToken');
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default api;