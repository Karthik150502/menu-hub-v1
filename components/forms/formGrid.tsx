import { SPACING } from '@/constants/themes/spacing';
import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

function getColumns(containerWidth: number): number {
    if (containerWidth >= 900) return 3;
    if (containerWidth >= 580) return 2;
    return 1;
}

export interface FormRowProps {
    children:  React.ReactNode;
    span?:     number | 'full';
    _columns?: number;
    _gap?:     number;
}

export const FormItem: React.FC<FormRowProps> = ({
    children,
    span     = 1,
    _columns = 1,
    _gap     = SPACING.md,
}) => {
    const isFull    = span === 'full' || Number(span) >= _columns;
    const spanCount = isFull ? _columns : Math.min(Number(span), _columns);
    const widthPct  = (spanCount / _columns) * 100;

    return (
        <View
            style={{
                width:        `${widthPct}%` as any,
                paddingRight: isFull ? 0 : _gap,
                flexShrink:   0,
            }}
        >
            {children}
        </View>
    );
};

interface FormGridProps {
    children: React.ReactNode;
    gap?:     number;
    columns?: number;
}

export const FormGrid: React.FC<FormGridProps> = ({
    children,
    gap     = SPACING.md,
    columns: colProp,
}) => {
    const [containerWidth, setContainerWidth] = useState(0);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
    }, []);

    const columns = colProp ?? (containerWidth > 0 ? getColumns(containerWidth) : 1);

    const injected = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if ((child.type as any) !== FormItem) return child;
        return React.cloneElement(child as React.ReactElement<FormRowProps>, {
            _columns: columns,
            _gap:     gap,
        });
    });

    return (
        <View style={styles.grid} onLayout={onLayout}>
            {containerWidth > 0 ? injected : null}
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap:      'wrap',
        alignItems:    'flex-start',
    },
});