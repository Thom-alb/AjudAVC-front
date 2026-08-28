import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Renderiza o grupo de autenticação */}
        <Stack.Screen name="(auth)" />
        
        {/* Renderiza a área logada com as abas */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}