import Header from "@/components/Header";
import { ThemeProvider, useContextUser } from "@/contexts/ThemeProvider";
import { Stack } from "expo-router";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

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
      <Stack.Screen
        name="auth/profile"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/createseries"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="screens/createchapters"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
    </ThemeProvider>
  );
}
