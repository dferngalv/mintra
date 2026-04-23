import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(app)" />
      <Stack.Screen
        name="auth/login"
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen
        name="auth/register"
        options={{
          animationEnabled: true,
        }}
      />
    </Stack>
  );
}
