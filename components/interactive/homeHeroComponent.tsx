import React from 'react';
import { StyleSheet, View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import HeroGreeting, { HeroGreetingProps } from './heroGreeting';
// eslint-disable-next-line import/no-named-as-default
import RestaurantLiveBadge from './restaurantLiveBadge';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HomePageHeroProps extends HeroGreetingProps {
    /** Whether the restaurant is currently open */
    isOpen: boolean;
    /** Displayed in the live badge sub-text */
    restaurantName?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const HomePageHero: React.FC<HomePageHeroProps> = ({
    name,
    isOpen,
    restaurantName,
}) => (
    <View style={styles.container}>
        <HeroGreeting name={name} />
        <RestaurantLiveBadge isOpen={isOpen} restaurantName={restaurantName} />
    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        gap: 10,
        paddingVertical: 18
    },
});

export default HomePageHero;