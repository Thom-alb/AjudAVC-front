import React from "react";
import { Text as DefaultText, View as DefaultView } from "react-native";
import Colors from "../constants/Colors"; 
import { useTheme } from "../contexts/ThemeContext"; 

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
  const { theme } = useTheme(); 
  
  // Garante estritamente que a chave será "light" ou "dark"
  const activeTheme: "light" | "dark" = theme === "dark" ? "dark" : "light";

  // Se o componente passou uma cor fixa por propriedade, usa ela
  const colorFromProps = props[activeTheme];
  if (colorFromProps) {
    return colorFromProps;
  }

  // Busca a cor mapeada dentro de Colors.light ou Colors.dark com segurança de tipo
  const themeColors = Colors[activeTheme];
  
  // Faz um fallback seguro caso a propriedade específica não exista no objeto interno
  return (themeColors as Record<string, string>)[colorName] || "#000000";
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
