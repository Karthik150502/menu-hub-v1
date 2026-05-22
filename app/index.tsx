import { Redirect } from 'expo-router';

export default function Index() {
    const isAuthenticated = true; // replace with your Redux selector

    return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/welcome'} />;
}