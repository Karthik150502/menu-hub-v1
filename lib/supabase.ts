import { ENV } from '@/constants/env';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ─── Storage adapter ──────────────────────────────────────────────────────────
// SecureStore encrypts tokens in the device keychain on iOS/Android.
// On web, passing undefined lets Supabase fall back to its default (localStorage).

const secureStorage = {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

// ─── Supabase client ──────────────────────────────────────────────────────────
// Module-scope singleton — every import of this file shares the same instance.

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
    auth: {
        storage: Platform.OS === 'web' ? undefined : secureStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
