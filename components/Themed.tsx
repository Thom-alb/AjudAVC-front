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
  colorName: keyof typeof Colors.light
) {
  // O ThemeContext expõe `isDarkMode` (e não `theme`).
  const { isDarkMode } = useTheme();
  const activeTheme: "light" | "dark" = isDarkMode ? "dark" : "light";

  // Se o componente passou uma cor fixa por propriedade, ela tem prioridade
  const colorFromProps = props[activeTheme];
  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[activeTheme][colorName];
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}