import { TYPOGRAPHY } from '@/constants/themes/font';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroGreetingProps {
    name: string;
}

// ─── Time logic ───────────────────────────────────────────────────────────────

interface GreetingConfig {
    salutation: string;
    emoji: string;
}

function getGreeting(hour: number): GreetingConfig {
    if (hour >= 5 && hour < 12) return { salutation: 'Good morning', emoji: '☀️' };
    if (hour >= 12 && hour < 17) return { salutation: 'Good afternoon', emoji: '👋' };
    if (hour >= 17 && hour < 21) return { salutation: 'Good evening', emoji: '🌆' };
    return { salutation: 'Good night', emoji: '🌙' };
}

// ─── Component ────────────────────────────────────────────────────────────────

export const HeroGreeting: React.FC<HeroGreetingProps> = ({ name }) => {
    const [greeting, setGreeting] = useState<GreetingConfig>(() =>
        getGreeting(new Date().getHours()),
    );

    const greetings = [
        "Hello",
        "Hi",
        "Hey there",
        "Hiya",
        "Greetings",
        "Yo",
        "Sup",
        "Wassup",
        "Howdy",
        "Hi there",
        "Hey buddy",
        "How you doin?",
    ];
    const greetingWord = greetings[Math.floor(Math.random() * greetings.length)];

    // Re-check every minute in case the user crosses a time boundary
    useEffect(() => {
        const id = setInterval(
            () => setGreeting(getGreeting(new Date().getHours())),
            60_000,
        );
        return () => clearInterval(id);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.salutation}>
                {greeting.salutation.toUpperCase()}
            </Text>
            <View style={styles.nameRow}>
                <Text style={styles.greetings}>{greetingWord}, </Text>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.emoji}> {greeting.emoji}</Text>
            </View>
        </View>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { gap: 6 },
    salutation: {
        ...TYPOGRAPHY.label,
        color: DESIGN_TOKENS.textSectionTitle,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
    },
    greetings: {
        ...TYPOGRAPHY.h3_bold,
        color: DESIGN_TOKENS.textPrimary,
    },
    name: {
        ...TYPOGRAPHY.h3_bold,
        color: DESIGN_TOKENS.accentDefault,
    },
    emoji: { fontSize: 20 },
});

export default HeroGreeting;