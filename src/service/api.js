import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { router } from 'expo-router';

// Pega dinamicamente o IP da máquina onde o servidor/Expo está rodando (caso queira voltar para local)
const hostUri = Constants.expoConfig?.hostUri?.split(':')[0];
const localIp = hostUri ? hostUri : '10.0.2.2';

// -------------------------------------------------------------
// OPÇÕES DE CONEXÃO
// -------------------------------------------------------------
// Local Dinâmico (Expo Go) -> Descomente se for testar na rede local
 const API_URL = `http://${localIp}:8055`;

// Produção (Render)
// const API_URL = 'https://ajudavc-api.onrender.com';
// -------------------------------------------------------------

console.log(`[API Config] Conectando em: ${API_URL}`);

const api = axios.create({
  baseURL: API_URL,
  // Timeout estendido para 60 segundos por conta do plano gratuito do Render que entra em hibernação
  timeout: API_URL.includes('onrender.com') ? 60000 : 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUISIÇÃO: Anexa o JWT Token salvo e faz log para debug no APK
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

    // Verifica se a URL pertence a fluxos de autenticação/registro de forma ampla
    const isAuthRoute = 
      originalUrl.includes('/auth') || 
      originalUrl.includes('/login') || 
      originalUrl.includes('/register');

    // Se o erro for 401 (Unauthorized) e NÃO for uma rota de autenticação, limpa o token e redireciona
    if (
      error.response &&
      error.response.status === 401 &&
      !isAuthRoute
    ) {
      try {
        await AsyncStorage.multiRemove(['authToken', 'rememberMe']);
        router.replace('/login');
      } catch (navError) {
        console.error('Erro ao redirecionar para login:', navError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;