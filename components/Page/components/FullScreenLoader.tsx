import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { PAGE_THEME } from '../styles';
import type { FullScreenLoaderProps } from '../types';

/**
 * FullScreenLoader
 *
 * Fills its parent container and centres an ActivityIndicator.
 * Rendered by Page when loading=true, replacing the content area entirely so
 * the user never sees a half-rendered screen behind a spinner.
 *
 * Wrapped in React.memo — re-renders only when color/size/bg change.
 */
const FullScreenLoader: React.FC<FullScreenLoaderProps> = memo(({
    color = PAGE_THEME.colors.accent,
    size = 'large',
    backgroundColor,
}) => (
    <View
        style={[
            styles.container,
            backgroundColor ? { backgroundColor } : undefined,
        ]}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel="Loading, please wait"
    >
        <ActivityIndicator color={color} size={size} />
    </View>
));

FullScreenLoader.displayName = 'FullScreenLoader';
export default FullScreenLoader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
