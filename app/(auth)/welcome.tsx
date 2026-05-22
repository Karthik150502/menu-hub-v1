import { WelcomeScreen } from '@/pages/auth/welcomeScreen';
import { useRouter } from 'expo-router';

export default function WelcomePage() {
    const router = useRouter();

    return (
        <WelcomeScreen
            onGetStarted={() => router.push('/(auth)/register')}
            onSignIn={() => router.replace('/login')}
        />
    );
}
