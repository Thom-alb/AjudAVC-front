import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function ProgressoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Progresso e Evolução</Text>
        <Text style={styles.subtitle}>
          Registros diários/semanais e relatórios/gráficos mensais.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
});