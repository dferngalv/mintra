import Header from "@/components/Header";
import "@/contexts/i18n";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Stack } from "expo-router";
import Head from "expo-router/head";

function RootNavigator() {
  const colors = useThemeColors();

  return (
    <>
      <Head>
        <title>Mintra</title>
        <meta name="description" content="Comic format app for read and upload images in comic format." />
      </Head>
      <Stack
        screenOptions={{
          headerShown: true,
          header: () => <Header />,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="SearchScreen" options={{ title: "Buscar series" }} />
        <Stack.Screen name="series/[seriesId]" options={{ title: "Detalles de la serie" }} />
        <Stack.Screen name="auth/login" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="auth/register" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="auth/profile" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="screens/createseries" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="screens/createchapters" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="screens/createchapter" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="screens/adminpanelseries" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="screens/adminpanelusers" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="screens/creatorpanel" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="screens/creatorworkviewer" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="screens/editwork" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="screens/chapterreader" options={{ animation: "slide_from_right" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
