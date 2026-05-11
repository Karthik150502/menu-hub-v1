import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PAGE_THEME, pageStyles } from '../styles';
import type { ErrorStateProps } from '../types';

/**
 * ErrorState
 *
 * Full-content replacement rendered by Page when error is non-null.
 * Provides an icon, human-readable message, and an optional retry CTA.
 *
 * Keeping this as a separate component means consuming screens can also render
 * it standalone (e.g. inside a list item section, not just full-page).
 *
 * Wrapped in React.memo — re-renders only when message/onRetry change.
 */
const ErrorState: React.FC<ErrorStateProps> = memo(({
    message = 'Something went wrong. Please try again.',
    onRetry,
    retryLabel = 'Try again',
}) => (
    <View
        style={pageStyles.errorContainer}
        accessible
        accessibilityRole="alert"
        accessibilityLabel={`Error: ${message}`}
    >
        <View style={pageStyles.errorIconWrap}>
            <Ionicons
                name="cloud-offline-outline"
                size={28}
                color={PAGE_THEME.colors.error}
            />
        </View>

        <Text style={pageStyles.errorTitle}>Oops!</Text>

        <Text style={pageStyles.errorMessage}>{message}</Text>

        {onRetry && (
            <TouchableOpacity
                onPress={onRetry}
                style={pageStyles.retryButton}
                accessibilityRole="button"
                accessibilityLabel={retryLabel}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
                <Ionicons
                    name="refresh-outline"
                    size={16}
                    color={PAGE_THEME.colors.text}
                />
                <Text style={pageStyles.retryLabel}>{retryLabel}</Text>
            </TouchableOpacity>
        )}
    </View>
));

ErrorState.displayName = 'ErrorState';
export default ErrorState;
