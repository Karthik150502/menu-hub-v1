import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Sidebar from '@/components/global/sidebar/sidebar';
import { SidebarProvider } from '@/components/global/sidebar/sidebar-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useEffect } from 'react';
import { Text, TextInput } from 'react-native';

import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/montserrat';

export const unstable_settings = {
  anchor: '(tabs)',
};


// ─── Force Montserrat 300 on every Text and TextInput globally ────────────────
// @ts-ignore
Text.defaultProps = Text.defaultProps ?? {};
// @ts-ignore
Text.defaultProps.style = { fontFamily: 'Montserrat_300Light' };

// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps ?? {};
// @ts-ignore
TextInput.defaultProps.style = { fontFamily: 'Montserrat_300Light' };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();


  const [fontsLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SidebarProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Sidebar />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SidebarProvider>
  );
}
