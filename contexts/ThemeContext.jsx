import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "ajudavc_theme";

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((savedTheme) => {
        if (mounted) setIsDarkMode(savedTheme === "dark");
      })
      .catch((error) => console.warn("Não foi possível carregar o tema:", error))
      .finally(() => {
        if (mounted) setReady(true);
      });
    return () => { mounted = false; };
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((current) => !current);
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "dark" : "light").catch((error) =>
      console.warn("Não foi possível salvar o tema:", error)
    );
  }, [isDarkMode, ready]);

  const value = useMemo(() => ({
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? Colors.dark : Colors.light,
    ready,
  }), [isDarkMode, toggleTheme, ready]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  }
  return context;
}
