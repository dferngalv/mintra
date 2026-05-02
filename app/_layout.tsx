import Header from "@/components/Header";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
    <Stack
      screenOptions={{ headerShown: true, header: () => <Header /> }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="auth/login"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="auth/register"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
    </ThemeProvider>
  );
}
