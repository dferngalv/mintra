import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { ThemeProvider, useTheme } from "../contexts/ThemeProvider";
import Head from "expo-router/head";

export default function RootLayout() {

  const [loaded] = useFonts({
    Roboto : require('../assets/fonts/Roboto-VariableFont_wdth,wght.ttf')
  });

  if(!loaded){
    return null;
  }

  return (

      <ThemeProvider>
          <Head>
            <title>Mintra</title>
            <meta name="description" content="App de creación y visualización de comics." />
          </Head>
        <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
          <Stack.Screen name="item" options={{headerShown: false}}/>
          <Stack.Screen name="theme" options={{title: 'Theme', headerLeft: () => null,}}/>
          <Stack.Screen name="orientationsetting" options={{title: 'OrientationSetting', headerLeft: () => null,}}/>
        </Stack>
      </ThemeProvider>
    
  );
}
