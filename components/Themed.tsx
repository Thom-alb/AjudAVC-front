import React from "react";
import { Text as DefaultText, View as DefaultView } from "react-native";
import Colors from "../constants/Colors"; 
import { useTheme } from "../contexts/ThemeContext"; // Sincronizado para useTheme conforme declarado no seu arquivo

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: "text" | "background" | "tint" | "tabIconDefault" | "tabIconSelected"
) {
  const { theme } = useTheme(); // Atualizado para usar a função correta
  
  // Força o TypeScript a entender que 'theme' é estritamente "light" ou "dark"
  const activeTheme = theme === "dark" ? "dark" : "light";

  // Se o componente passou uma cor fixa na propriedade, usa ela. Caso contrário, busca no Colors.ts
  if (props[activeTheme]) {
    return props[activeTheme];
  }

  // Acessa com segurança as propriedades mapeadas dentro de Colors.light ou Colors.dark
  const themeColors = Colors[activeTheme] as Record<string, string>;
  return themeColors[colorName];
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
