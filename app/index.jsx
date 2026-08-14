import React from "react";
import { View, Text, Image, BackHandler, Platform, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Estilos from "../Estilo/index";

export default function WelcomeScreen() {
  const router = useRouter();

  // Função para fechar/sair da aplicação no Android
  const handleExitApp = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    } else {
      console.log("Botão sair clicado");
    }
  };

  return (
    <View style={Estilos.container}>
      
      {/* Container da Logo */}
      <View style={Estilos.logoCard}>
        <Image 
          source={require("../assets/images/logo.png")} 
          style={Estilos.logo} 
          resizeMode="contain" 
        />
      </View>

      {/* Seção de Botões Principais */}
      <View style={Estilos.buttonContainer}>
        
        {/* Botão Entrar */}
        <TouchableOpacity 
          style={Estilos.primaryButton} 
          activeOpacity={0.8} 
          onPress={() => router.push("/login")}
        >
          <Text style={Estilos.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Botão Registrar */}
        <TouchableOpacity 
          style={Estilos.primaryButton} 
          activeOpacity={0.8} 
          onPress={() => router.push("/register")}
        >
          <Text style={Estilos.primaryButtonText}>Registrar</Text>
        </TouchableOpacity>

        {/* Botão Ajuda */}
        <TouchableOpacity style={Estilos.helpButton} onPress={() => router.push("/ajuda")}>
          <Text style={Estilos.helpButtonText}>Ajuda</Text>
        </TouchableOpacity>
      </View>

      {/* Rodapé de Informações */}
      <View style={Estilos.infoSection}>
        <Text style={Estilos.infoTitle}>Saiba mais:</Text>
        <View style={Estilos.linksRow}>
          <TouchableOpacity onPress={() => router.push("/info-avc")}>
            <Text style={Estilos.linkText}>AVC</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/info-ajudavc")}>
            <Text style={Estilos.linkText}>AjudAVC</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botão Sair */}
      <TouchableOpacity style={Estilos.exitButton} onPress={handleExitApp}>
        <Text style={Estilos.exitButtonText}>Sair</Text>
      </TouchableOpacity>
      
    </View>
  );
}
