import Header from "@/components/Header";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: true, header: () => <Header /> }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="auth/login"
        options={{
          animation: "slide_from_right", headerShown: false
        }}
      />
      <Stack.Screen
        name="auth/register"
        options={{
          animation: "slide_from_right", headerShown: false
        }}
      />
    </Stack>
  );
}
