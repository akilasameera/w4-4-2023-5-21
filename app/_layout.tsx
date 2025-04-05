import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform } from "react-native";
import { ThemeProvider, useTheme } from "../src/contexts/ThemeContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function NavigationRoot() {
  const { theme } = useTheme();
  const navigationTheme = theme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={({ route }) => ({
          headerShown: !route.name.startsWith("tempobook"),
        })}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="private-chat/[userId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* Auth screens kept but not included in main navigation */}
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const initTempoDevtools = async () => {
      if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
        try {
          const { TempoDevtools } = await import("tempo-devtools");
          if (TempoDevtools && typeof TempoDevtools.init === "function") {
            TempoDevtools.init();
          }
        } catch (error) {
          console.error("Failed to initialize TempoDevtools:", error);
        }
      }
    };

    initTempoDevtools();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationRoot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
