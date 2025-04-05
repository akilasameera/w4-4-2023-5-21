import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: typeof themes.dark;
}

const themes = {
  light: {
    background: "#f9fafb",
    card: "#ffffff",
    cardAlt: "#f3f4f6",
    text: "#111827",
    textSecondary: "#4b5563",
    textTertiary: "#6b7280",
    border: "#e5e7eb",
    primary: "#8b5cf6",
    primaryLight: "#a78bfa",
    primaryDark: "#7c3aed",
    headerBg: "#f9fafb",
    tabBarBg: "#f9fafb",
  },
  dark: {
    background: "#111112",
    card: "#202024",
    cardAlt: "#2a2a2e",
    text: "#ffffff",
    textSecondary: "#9ca3af",
    textTertiary: "#6b7280",
    border: "#1f2937",
    primary: "#8b5cf6",
    primaryLight: "#a78bfa",
    primaryDark: "#7c3aed",
    headerBg: "#111112",
    tabBarBg: "#111112",
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  colors: themes.dark,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>("dark");

  // Always use dark theme as default
  // We're keeping the useEffect but not setting the theme based on system preference

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors: themes[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
