import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Sidebar from '@/components/global/sidebar/sidebar';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useEffect } from 'react';
import { Text, TextInput } from 'react-native';

import { BottomToastProvider } from '@/components/feedback/BottomToast';
import { ToastProvider } from '@/components/feedback/Toast';
import { onAuthStateChange } from '@/lib/supabase/auth';
import { setSession, store, useAppDispatch } from '@/store';
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { Provider } from 'react-redux';

export const unstable_settings = {
  anchor: 'index',
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

// ─── Auth sync ────────────────────────────────────────────────────────────────
// Subscribes to Supabase auth events (sign in, sign out, token refresh — see
// lib/supabase/auth.ts) for the lifetime of the app and mirrors them into
// Redux, so `selectIsAuthenticated` (app/index.tsx) stays accurate whether the
// session came from the login screen, phone OTP, or a silent token refresh.
function AuthSync() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((session) => {
      dispatch(setSession({ session, user: session?.user ?? null }));
    });
    return () => subscription.unsubscribe();
  }, [dispatch]);

  return null;
}

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
    <Provider store={store}>
      <AuthSync />
      <ToastProvider>
        <BottomToastProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Sidebar />
            <Stack initialRouteName="index">
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </BottomToastProvider>
      </ToastProvider>
    </Provider>
  );
}
