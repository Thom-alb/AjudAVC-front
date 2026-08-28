import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="ajudaStart" />
      <Stack.Screen name="createGroup" />
      <Stack.Screen name="groupRole" />
      <Stack.Screen name="info-ajudavc" />
      <Stack.Screen name="info-avc" />
      <Stack.Screen name="term" />
    </Stack>
  );
}