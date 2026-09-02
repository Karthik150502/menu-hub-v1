import { selectAuthStatus, useAppSelector } from '@/store';
import { Redirect } from 'expo-router';

export default function Index() {
    const status = useAppSelector(selectAuthStatus);

    // 'idle' — the first Supabase auth event (see AuthSync in app/_layout.tsx)
    // hasn't resolved yet. Render nothing rather than guessing, so we don't
    // flash the welcome screen for an already-signed-in user.
    if (status === 'idle') return null;

    return <Redirect href={status === 'authenticated' ? '/(tabs)' : '/(auth)/welcome'} />;
}
