import { SPACING } from '@/constants/themes/spacing';
import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

function getColumns(containerWidth: number): number {
    if (containerWidth >= 900) return 3;
    if (containerWidth >= 580) return 2;
    return 1;
}

export interface FormRowProps {
    children: React.ReactNode;
    span?: number | 'full';
    _columns?: number;
    _gap?: number;
    /** True when FormGrid has determined this is the last item in its
     * wrapped row — that item must not get a trailing gutter, or it leaves
     * a dead strip before the row's edge. */
    _isRowEnd?: boolean;
    /** Exact pixel width of a single column, computed by FormGrid from its
     * own measured layout width. Used (instead of a percentage) so every
     * span-1 item is exactly the same width no matter where it lands in a
     * row — a solo item, the first in a row, or the last. */
    _colWidth?: number;
}

export const FormItem: React.FC<FormRowProps> = ({
    children,
    span = 1,
    _columns = 1,
    _gap = SPACING.md,
    _isRowEnd = false,
    _colWidth,
}) => {
    const isFull = span === 'full' || Number(span) >= _columns;
    const spanCount = isFull ? _columns : Math.min(Number(span), _columns);

    // The gutter is a marginRight (outside the box), never a padding
    // (inside it) — that's what keeps every item's own content width
    // identical regardless of row position. Only skip it at a true row
    // end, or it'd leave a dead strip before the row's edge.
    const width = _colWidth != null
        ? spanCount * _colWidth + (spanCount - 1) * _gap
        : (`${(spanCount / _columns) * 100}%` as any);

    return (
        <View
            style={{
                width,
                marginRight: (isFull || _isRowEnd) ? 0 : _gap,
                flexShrink: 0,
            }}
        >
            {children}
        </View>
    );
};

interface FormGridProps {
    children: React.ReactNode;
    gap?: number;
    columns?: number;
}

export const FormGrid: React.FC<FormGridProps> = ({
    children,
    gap = SPACING.md,
    columns: colProp,
}) => {
    const [containerWidth, setContainerWidth] = useState(0);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setContainerWidth(w);
    }, []);

    const columns = colProp ?? (containerWidth > 0 ? getColumns(containerWidth) : 1);

    // Exact pixel width of one column, accounting for the (columns - 1)
    // gutters a full row spends between its items. A span-N item then
    // measures N * colWidth + (N - 1) * gap, which sums back to exactly
    // containerWidth for a full-width item — see FormItem.
    const colWidth = containerWidth > 0
        ? (containerWidth - gap * (columns - 1)) / columns
        : undefined;

    // Simulate the same wrapping flexWrap will do, so we know which item is
    // actually last in its row — that's the only one that should skip the
    // trailing gutter. (Column count / column width above is untouched —
    // this only decides which items get a marginRight.)
    const formItems = React.Children.toArray(children).filter(
        (child): child is React.ReactElement<FormRowProps> =>
            React.isValidElement(child) && (child.type as any) === FormItem,
    );

    let rowFill = 0;
    let currentRow = 0;
    const rowOfItem = formItems.map((child) => {
        const span = child.props.span ?? 1;
        const isFull = span === 'full' || Number(span) >= columns;
        const spanCount = isFull ? columns : Math.min(Number(span), columns);

        if (rowFill > 0 && rowFill + spanCount > columns) {
            currentRow += 1;
            rowFill = 0;
        }
        const row = currentRow;
        rowFill += spanCount;
        if (rowFill >= columns) {
            currentRow += 1;
            rowFill = 0;
        }
        return row;
    });

    let formItemIndex = 0;
    const injected = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if ((child.type as any) !== FormItem) return child;
        const index = formItemIndex++;
        // Undefined next-row (last item overall) also counts as a row end.
        const isRowEnd = rowOfItem[index] !== rowOfItem[index + 1];
        return React.cloneElement(child as React.ReactElement<FormRowProps>, {
            _columns: columns,
            _gap: gap,
            _isRowEnd: isRowEnd,
            _colWidth: colWidth,
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
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
});