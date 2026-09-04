// eslint-disable-next-line import/no-named-as-default
import BackHeader from '@/components/interactive/backHeader';
import { SPACING } from '@/constants/themes/spacing';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Page from './Page';
import type { PageProps } from './types';

interface AuthPageProps extends Omit<PageProps, 'header' | 'safeArea'> {
    onBack?: () => void;
    backLabel?: string;
    headerRight?: React.ReactNode;
    /**
     * Full-width content rendered below the back header, above the scroll
     * area — e.g. a StepIndicator. Stays fixed while the page content scrolls.
     */
    headerBelow?: React.ReactNode;
    /**
     * Extra space above content when no back header is shown.
     * Stacked on top of the safe-area inset.
     * @default SPACING.xxxl (32)
     */
    paddingTop?: number;
}

const AuthPage: React.FC<AuthPageProps> = memo(({
    onBack,
    backLabel,
    headerRight,
    headerBelow,
    paddingTop = SPACING.giant,
    ...pageProps
}) => {
    const insets = useSafeAreaInsets();

    const header = (
        <>
            {onBack ? (
                <BackHeader onBack={onBack} label={backLabel} right={headerRight} paddingTop={paddingTop} />
            ) : (
                <View style={{ height: insets.top + paddingTop }} />
            )}
            {headerBelow && <View style={styles.headerBelow}>{headerBelow}</View>}
        </>
    );

    return (
        <Page
            safeArea={false}
            mobileSize
            header={header}
            {...pageProps}
        />
    );
});

AuthPage.displayName = 'AuthPage';
export default AuthPage;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    headerBelow: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
    },
});
