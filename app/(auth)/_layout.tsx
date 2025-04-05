import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../../src/contexts/ThemeContext";

export default function AuthLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
