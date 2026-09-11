// As of SDK 56, expo-router vendors its own fork of react-navigation
// internals and re-exports the theming pieces directly — importing
// '@react-navigation/native' alongside it loads two copies and expo-router's
// build-time check rejects it. Pull these from 'expo-router' instead.
import { DarkTheme, DefaultTheme, SplashScreen, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import Sidebar from '@/components/global/sidebar/sidebar';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useEffect, useRef } from 'react';
import { Text, TextInput } from 'react-native';

import { BottomToastProvider } from '@/components/feedback/BottomToast';
import { ToastProvider } from '@/components/feedback/Toast';
import { me } from '@/lib/api/auth';
import { onAuthStateChange, updateUserMetadata } from '@/lib/supabase/auth';
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
  // Tracks user ids we've already attempted a backfill for, so a token
  // refresh or other benign auth event doesn't re-trigger the network call
  // every time — only once per signed-in user per app lifetime.
  const backfilledRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((session) => {
      dispatch(setSession({ session, user: session?.user ?? null }));

      // Legacy-account backfill: accounts that saved a name via nameScreen
      // before it also called updateUserMetadata have full_name in our
      // backend `profiles` row but not in Supabase Auth's user_metadata (and
      // therefore not in the JWT), so selectDisplayName falls back to
      // "Owner". Sync it once per session so existing users self-heal on
      // their next sign-in without re-entering their name.
      const userId = session?.user?.id;
      const hasName = !!session?.user?.user_metadata?.full_name;
      if (userId && !hasName && !backfilledRef.current.has(userId)) {
        backfilledRef.current.add(userId);
        me()
          .then((profile) => {
            if (profile.full_name) {
              // Fires a USER_UPDATED event, which re-enters this callback
              // with the now-populated user_metadata and re-dispatches
              // setSession — no manual dispatch needed here.
              return updateUserMetadata({ full_name: profile.full_name });
            }
          })
          .catch(() => {
            // Best-effort — leave the "Owner" fallback and retry next
            // sign-in rather than looping on a failing request.
            backfilledRef.current.delete(userId);
          });
      }
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
