import { BORDER_RADIUS, DIMENSIONS } from '@/constants/themes/dimensions';
import { FONT_SIZES, FONT_WEIGHTS, TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// eslint-disable-next-line import/no-named-as-default
import AppButton from '../custom/AppButton';
import Text from '../custom/appText';
import TimeSelector from './TimeSelector';


// ─── Types ────────────────────────────────────────────────────────────────────

export type DatePickerMode = 'date' | 'datetime' | 'range' | 'rangeAndTime';

export interface DateConstraint {
    type: 'past' | 'future' | 'all-time' | 'range';
    /** Required when type="range". Start date in "dd-mm-yyyy" format. */
    from?: string;
    /** Required when type="range". End date in "dd-mm-yyyy" format. */
    to?: string;
}

export interface DatePickerProps {
    value?: Date | null;
    onChange?: (date: Date) => void;
    onClear?: () => void;
    mode?: DatePickerMode;
    /** Range mode: called on Apply with the two selected dates */
    onRangeChange?: (from: Date, to: Date | null) => void;
    dateConstraint?: DateConstraint;
    /** Overridden by dateConstraint when provided */
    minDate?: Date;
    /** Overridden by dateConstraint when provided */
    maxDate?: Date;
    label?: string;
    placeholder?: string;
    style?: ViewStyle;
    disabled?: boolean;
    yearStart?: number;
    yearEnd?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
}

function isBefore(a: Date, b: Date) {
    return a < b && !sameDay(a, b);
}

function isAfter(a: Date, b: Date) {
    return a > b && !sameDay(a, b);
}

function formatDate(date: Date, mode: DatePickerMode): string {
    const d = date.getDate();
    const m = MONTHS[date.getMonth()];
    const y = date.getFullYear();
    if (mode === 'date') return `${d} ${m} ${y}`;

    let h = date.getHours();
    const min = String(date.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${d} ${m} ${y} · ${h}:${min} ${ampm}`;
}

function parseDDMMYYYY(s: string): Date | null {
    const [dd, mm, yyyy] = s.split('-').map(Number);
    if (!dd || !mm || !yyyy || isNaN(dd) || isNaN(mm) || isNaN(yyyy)) return null;
    return new Date(yyyy, mm - 1, dd);
}

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

// ─── Year picker ──────────────────────────────────────────────────────────────

const YEAR_COL = 3;
const YEAR_ITEM_H = 40;
const DEFAULT_YEAR_START = 1900;
const DEFAULT_YEAR_END = 2100;

const YearPicker: React.FC<{
    selected: number;
    onSelect: (year: number) => void;
    yearStart: number;
    yearEnd: number;
}> = ({ selected, onSelect, yearStart, yearEnd }) => {
    const scrollRef = useRef<ScrollView>(null);

    const years = useMemo(
        () => Array.from({ length: yearEnd - yearStart + 1 }, (_, i) => yearStart + i),
        [yearStart, yearEnd],
    );

    useEffect(() => {
        const rowIndex = Math.floor((selected - yearStart) / YEAR_COL);
        const targetY = Math.max(0, rowIndex * YEAR_ITEM_H - YEAR_ITEM_H * 2);

        const anim = new Animated.Value(0);
        const listenerId = anim.addListener(({ value }) => {
            scrollRef.current?.scrollTo({ y: value, animated: false });
        });

        const t = setTimeout(() => {
            Animated.timing(anim, {
                toValue: targetY,
                duration: 900,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false,
            }).start();
        }, 50);

        return () => {
            clearTimeout(t);
            anim.removeListener(listenerId);
        };
    }, []);

    return (
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
            <View style={yp.grid}>
                {years.map(year => (
                    <TouchableOpacity
                        key={year}
                        style={[yp.cell, year === selected && yp.cellSelected]}
                        onPress={() => onSelect(year)}
                        activeOpacity={0.7}
                    >
                        <Text style={[yp.text, year === selected && yp.textSelected]}>
                            {year}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const yp = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SPACING.sm,
    },
    cell: {
        width: `${100 / YEAR_COL}%` as any,
        height: YEAR_ITEM_H,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: FONT_SIZES.base,
        padding: SPACING.xs,
    },
    cellSelected: {
        borderWidth: 1.25,
        borderColor: DESIGN_TOKENS.primaryBright,
        backgroundColor: "transparent",
    },
    text: {
        ...TYPOGRAPHY.body,
        color: DESIGN_TOKENS.unavailableText,
    },
    textSelected: {
        color: DESIGN_TOKENS.primaryBright,
        fontWeight: FONT_WEIGHTS.semibold,
        fontSize: FONT_SIZES.base,
    },
});

// ─── Calendar grid ────────────────────────────────────────────────────────────

const CalendarGrid: React.FC<{
    year: number;
    month: number;
    selected?: Date | null;
    rangeFrom?: Date | null;
    rangeTo?: Date | null;
    minDate?: Date;
    maxDate?: Date;
    onSelect: (d: Date) => void;
}> = ({ year, month, selected, rangeFrom, rangeTo, minDate, maxDate, onSelect }) => {
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrev = getDaysInMonth(year, month - 1);
    const today = new Date();

    const cells: { date: Date; current: boolean }[] = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({
            date: new Date(year, month - 1, daysInPrev - i),
            current: false,
        });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ date: new Date(year, month, d), current: true });
    }
    // Pad to always fill exactly 6 rows (42 cells) so modal height never changes
    const target = 42;
    let nextDay = 1;
    while (cells.length < target) {
        cells.push({ date: new Date(year, month + 1, nextDay++), current: false });
    }

    return (
        <View style={cg.grid}>
            {cells.map(({ date, current }, i) => {
                const isSelected = !!selected && sameDay(date, selected);
                const isRangeFrom = !!rangeFrom && sameDay(date, rangeFrom);
                const isRangeTo = !!rangeTo && sameDay(date, rangeTo);
                const isEndpoint = isRangeFrom || isRangeTo;

                const inRange = !!rangeFrom && !!rangeTo &&
                    !sameDay(date, rangeFrom) && !sameDay(date, rangeTo) &&
                    date.getTime() > new Date(rangeFrom.getFullYear(), rangeFrom.getMonth(), rangeFrom.getDate()).getTime() &&
                    date.getTime() < new Date(rangeTo.getFullYear(), rangeTo.getMonth(), rangeTo.getDate()).getTime();

                const showLeftTrack = inRange || (isRangeTo && !!rangeFrom);
                const showRightTrack = inRange || (isRangeFrom && !!rangeTo);

                const isToday = sameDay(date, today);
                const isDisabled = (minDate && isBefore(date, minDate)) ||
                    (maxDate && isAfter(date, maxDate));

                return (
                    <TouchableOpacity
                        key={i}
                        style={cg.cell}
                        onPress={() => !isDisabled && onSelect(date)}
                        activeOpacity={0.7}
                        disabled={!!isDisabled}
                        accessibilityRole="button"
                        accessibilityLabel={`${date.getDate()} ${MONTHS[date.getMonth()]}`}
                        accessibilityState={{ selected: isSelected || isEndpoint, disabled: !!isDisabled }}
                    >
                        {showLeftTrack && <View style={cg.trackLeft} />}
                        {showRightTrack && <View style={cg.trackRight} />}
                        <View style={[
                            cg.cellInner,
                            (isSelected || isEndpoint) && cg.cellSelected,
                            isToday && !isSelected && !isEndpoint && cg.cellToday,
                        ]}>
                            <Text
                                style={[
                                    cg.cellText,
                                    !current && cg.cellTextOther,
                                    isToday && !isSelected && !isEndpoint && cg.cellTextToday,
                                    (isSelected || isEndpoint) && cg.cellTextSelected,
                                    inRange && cg.cellTextInRange,
                                    isDisabled && cg.cellTextDisabled,
                                ]}
                            >
                                {date.getDate()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const CELL = 38;
const cg = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.sm,
        paddingBottom: SPACING.md,
    },
    cell: {
        width: `${100 / 7}%` as any,
        height: CELL,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellInner: {
        width: CELL,
        height: CELL,
        borderRadius: CELL / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trackLeft: {
        position: 'absolute',
        top: 6,
        bottom: 6,
        left: 0,
        right: '50%',
        backgroundColor: 'rgba(148,0,171,0.18)',
    },
    trackRight: {
        position: 'absolute',
        top: 6,
        bottom: 6,
        left: '50%',
        right: 0,
        backgroundColor: 'rgba(148,0,171,0.18)',
    },
    cellSelected: {
        backgroundColor: DESIGN_TOKENS.accentDefault,
    },
    cellToday: {
        borderWidth: 1.5,
        borderColor: 'rgba(148,0,171,0.40)',
    },
    cellText: {
        fontSize: 13,
        fontWeight: '500',
        color: DESIGN_TOKENS.textPrimary,
    },
    cellTextOther: {
        color: 'rgba(255,255,255,0.20)',
    },
    cellTextToday: {
        color: DESIGN_TOKENS.primaryBright,
        fontWeight: '700',
    },
    cellTextSelected: {
        color: '#fff',
        fontWeight: '700',
    },
    cellTextInRange: {
        color: 'rgba(255,255,255,0.90)',
        fontWeight: '600',
    },
    cellTextDisabled: {
        color: 'rgba(255,255,255,0.15)',
    },
});

// ─── Main DatePicker ──────────────────────────────────────────────────────────

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    onClear,
    mode = 'date',
    onRangeChange,
    dateConstraint,
    minDate,
    maxDate,
    label,
    placeholder = 'Select date',
    style,
    disabled = false,
    yearStart = DEFAULT_YEAR_START,
    yearEnd = DEFAULT_YEAR_END,
}) => {
    const insets = useSafeAreaInsets();
    const isRange = mode === 'range' || mode === 'rangeAndTime';
    const isRangeAndTime = mode === 'rangeAndTime';

    const today = useMemo(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }, []);

    const effectiveMinDate = useMemo(() => {
        if (dateConstraint?.type === 'all-time') return undefined;
        if (dateConstraint?.type === 'future') return today;
        if (dateConstraint?.type === 'range' && dateConstraint.from) return parseDDMMYYYY(dateConstraint.from) ?? minDate;
        return minDate;
    }, [dateConstraint, minDate, today]);

    const effectiveMaxDate = useMemo(() => {
        if (dateConstraint?.type === 'all-time') return undefined;
        if (dateConstraint?.type === 'past') return today;
        if (dateConstraint?.type === 'range' && dateConstraint.to) return parseDDMMYYYY(dateConstraint.to) ?? maxDate;
        return maxDate;
    }, [dateConstraint, maxDate, today]);

    const [open, setOpen] = useState(false);
    const [yearPickerOpen, setYearPickerOpen] = useState(false);

    // Internal draft state — edited inside modal, committed on Apply
    const [draft, setDraft] = useState<Date>(() => value ?? new Date());
    const [draftFrom, setDraftFrom] = useState<Date | null>(() => null);
    const [draftTo, setDraftTo] = useState<Date | null>(() => null);
    // Committed range — drives the trigger label after Apply
    const [appliedFrom, setAppliedFrom] = useState<Date | null>(() => null);
    const [appliedTo, setAppliedTo] = useState<Date | null>(() => null);
    const [viewYear, setVY] = useState((isRange ? (new Date()) : (value ?? new Date())).getFullYear());
    const [viewMonth, setVM] = useState((isRange ? (new Date()) : (value ?? new Date())).getMonth());

    // Time state (datetime mode)
    const [hour12, setHour12] = useState(() => {
        const h = (value ?? new Date()).getHours() % 12 || 12;
        return String(h).padStart(2, '0');
    });
    const [minute, setMinute] = useState(() =>
        String((value ?? new Date()).getMinutes()).padStart(2, '0')
    );
    const [ampm, setAmpm] = useState<'AM' | 'PM'>(() =>
        (value ?? new Date()).getHours() >= 12 ? 'PM' : 'AM'
    );

    // Time state (rangeAndTime mode — from/to)
    const [fromHour12, setFromHour12] = useState(() => {
        const h = (appliedFrom ?? new Date()).getHours() % 12 || 12;
        return String(h).padStart(2, '0');
    });
    const [fromMinute, setFromMinute] = useState(() =>
        String((appliedFrom ?? new Date()).getMinutes()).padStart(2, '0')
    );
    const [fromAmpm, setFromAmpm] = useState<'AM' | 'PM'>(() =>
        (appliedFrom ?? new Date()).getHours() >= 12 ? 'PM' : 'AM'
    );
    const [toHour12, setToHour12] = useState(() => {
        const h = (appliedTo ?? new Date()).getHours() % 12 || 12;
        return String(h).padStart(2, '0');
    });
    const [toMinute, setToMinute] = useState(() =>
        String((appliedTo ?? new Date()).getMinutes()).padStart(2, '0')
    );
    const [toAmpm, setToAmpm] = useState<'AM' | 'PM'>(() =>
        (appliedTo ?? new Date()).getHours() >= 12 ? 'PM' : 'AM'
    );

    const handleYearSelect = useCallback((year: number) => {
        setVY(year);
        setYearPickerOpen(false);
    }, []);

    const openPicker = () => {
        setYearPickerOpen(false);
        if (isRange) {
            setDraftFrom(appliedFrom);
            setDraftTo(appliedTo);
            const base = appliedFrom ?? new Date();
            setVY(base.getFullYear());
            setVM(base.getMonth());
            if (isRangeAndTime) {
                const fh = (appliedFrom ?? new Date()).getHours();
                setFromHour12(String(fh % 12 || 12).padStart(2, '0'));
                setFromMinute(String((appliedFrom ?? new Date()).getMinutes()).padStart(2, '0'));
                setFromAmpm(fh >= 12 ? 'PM' : 'AM');
                const th = (appliedTo ?? new Date()).getHours();
                setToHour12(String(th % 12 || 12).padStart(2, '0'));
                setToMinute(String((appliedTo ?? new Date()).getMinutes()).padStart(2, '0'));
                setToAmpm(th >= 12 ? 'PM' : 'AM');
            }
        } else {
            let base = value ?? new Date();
            if (effectiveMaxDate && isAfter(base, effectiveMaxDate)) base = new Date(effectiveMaxDate);
            if (effectiveMinDate && isBefore(base, effectiveMinDate)) base = new Date(effectiveMinDate);
            setDraft(base);
            setVY(base.getFullYear());
            setVM(base.getMonth());
            const h = base.getHours() % 12 || 12;
            setHour12(String(h).padStart(2, '0'));
            setMinute(String(base.getMinutes()).padStart(2, '0'));
            setAmpm(base.getHours() >= 12 ? 'PM' : 'AM');
        }
        setOpen(true);
    };

    const prevMonth = () => {
        if (viewMonth === 0) { setVY(y => y - 1); setVM(11); }
        else setVM(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setVY(y => y + 1); setVM(0); }
        else setVM(m => m + 1);
    };

    const handleSelectDay = useCallback((date: Date) => {
        if (isRange) {
            if (!draftFrom || (draftFrom && draftTo)) {
                setDraftFrom(date);
                setDraftTo(null);
            } else if (isBefore(date, draftFrom) || sameDay(date, draftFrom)) {
                setDraftFrom(date);
                setDraftTo(null);
            } else {
                setDraftTo(date);
            }
            return;
        }
        const next = new Date(date);
        if (mode === 'datetime') {
            let h = parseInt(hour12, 10);
            if (ampm === 'PM' && h !== 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
            next.setHours(h, parseInt(minute, 10), 0, 0);
        }
        setDraft(next);
    }, [isRange, draftFrom, draftTo, mode, hour12, minute, ampm]);

    const buildDateTime = useCallback((): Date => {
        const d = new Date(draft);
        if (mode === 'datetime') {
            let h = parseInt(hour12, 10);
            if (ampm === 'PM' && h !== 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
            d.setHours(h, parseInt(minute, 10), 0, 0);
        }
        return d;
    }, [draft, mode, hour12, minute, ampm]);

    const handleApply = () => {
        if (isRange) {
            if (draftFrom) {
                let from = new Date(draftFrom);
                let to = draftTo ? new Date(draftTo) : null;
                if (isRangeAndTime) {
                    let fh = parseInt(fromHour12, 10);
                    if (fromAmpm === 'PM' && fh !== 12) fh += 12;
                    if (fromAmpm === 'AM' && fh === 12) fh = 0;
                    from.setHours(fh, parseInt(fromMinute, 10), 0, 0);
                    if (to) {
                        let th = parseInt(toHour12, 10);
                        if (toAmpm === 'PM' && th !== 12) th += 12;
                        if (toAmpm === 'AM' && th === 12) th = 0;
                        to.setHours(th, parseInt(toMinute, 10), 0, 0);
                    }
                }
                setAppliedFrom(from);
                setAppliedTo(to);
                onRangeChange?.(from, to);
            }
        } else {
            onChange?.(buildDateTime());
        }
        setOpen(false);
    };

    const handleClear = () => {
        if (isRange) {
            setAppliedFrom(null);
            setAppliedTo(null);
        }
        onClear?.();
        setOpen(false);
    };

    const rangeFormat: DatePickerMode = isRangeAndTime ? 'datetime' : 'date';
    const triggerLabel = isRange
        ? (appliedFrom && appliedTo
            ? `${formatDate(appliedFrom, rangeFormat)} → ${formatDate(appliedTo, rangeFormat)}`
            : appliedFrom
                ? `${formatDate(appliedFrom, rangeFormat)} →`
                : placeholder)
        : (value ? formatDate(value, mode) : placeholder);

    const hasValue = isRange ? !!(appliedFrom || appliedTo) : !!value;

    return (
        <>
            {/* ── Trigger field ── */}
            <View style={style}>
                {label && <Text style={styles.fieldLabel}>{label}</Text>}
                <TouchableOpacity
                    style={[
                        styles.trigger,
                        open && styles.triggerOpen,
                        disabled && styles.triggerDisabled,
                    ]}
                    onPress={openPicker}
                    disabled={disabled}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={label ?? 'Date picker'}
                    accessibilityState={{ expanded: open, disabled }}
                >
                    <Ionicons
                        name="calendar-outline"
                        size={16}
                        color={hasValue ? DESIGN_TOKENS.accentDefault : DESIGN_TOKENS.textSubtle}
                    />
                    <Text
                        style={[
                            styles.triggerText,
                            !hasValue && styles.triggerPlaceholder,
                        ]}
                        numberOfLines={1}
                    >
                        {triggerLabel}
                    </Text>
                    <Ionicons
                        name={open ? 'chevron-up-outline' : 'chevron-down-outline'}
                        size={14}
                        color={DESIGN_TOKENS.textSubtle}
                    />
                </TouchableOpacity>
            </View>

            {/* ── Picker modal ── */}
            <Modal
                visible={open}
                transparent
                animationType="slide"
                onRequestClose={() => setOpen(false)}
            >
                <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

                <View style={[styles.sheet, { paddingBottom: insets.bottom + SPACING.md }]}>

                    {/* Header */}
                    <View style={styles.pickerHeader}>
                        <TouchableOpacity
                            onPress={prevMonth}
                            style={[styles.navBtn, yearPickerOpen && styles.navBtnHidden]}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            accessibilityLabel="Previous month"
                            disabled={yearPickerOpen}
                        >
                            <Ionicons name="chevron-back-outline" size={16} color={DESIGN_TOKENS.textSubtle} />
                        </TouchableOpacity>

                        <View style={styles.monthYearGroup}>
                            <Text style={styles.monthLabel}>{MONTHS[viewMonth]}</Text>
                            {/* <TouchableOpacity
                                onPress={() => setYearPickerOpen(v => !v)}
                                style={[styles.yearPill, yearPickerOpen && styles.yearPillActive]}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                accessibilityLabel={yearPickerOpen ? 'Close year picker' : 'Select year'}
                            >
                                <Text style={styles.yearPillText}>{viewYear}</Text>
                                <Ionicons
                                    name={yearPickerOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                                    size={12}
                                    color={DESIGN_TOKENS.primaryBright}
                                />
                            </TouchableOpacity> */}

                            <AppButton
                                label={viewYear.toString()}
                                onPress={() => setYearPickerOpen(v => !v)}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                accessibilityLabel={yearPickerOpen ? 'Close year picker' : 'Select year'}
                                iconRight={yearPickerOpen ? 'chevron-up-outline' : 'chevron-down-outline'}
                                variant="outline"
                                size="base"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={nextMonth}
                            style={[styles.navBtn, yearPickerOpen && styles.navBtnHidden]}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            accessibilityLabel="Next month"
                            disabled={yearPickerOpen}
                        >
                            <Ionicons name="chevron-forward-outline" size={16} color={DESIGN_TOKENS.textSubtle} />
                        </TouchableOpacity>
                    </View>

                    {/* Calendar area — always rendered to keep modal height stable */}
                    <View style={{ position: 'relative' }}>
                        <View
                            style={{ opacity: yearPickerOpen ? 0 : 1 }}
                            pointerEvents={yearPickerOpen ? 'none' : 'auto'}
                        >
                            {/* Weekday labels */}
                            <View style={styles.weekdayRow} accessibilityElementsHidden>
                                {WEEKDAYS.map(d => (
                                    <Text key={d} style={styles.weekday}>{d}</Text>
                                ))}
                            </View>

                            {/* Range hint */}
                            {isRange && (
                                <Text style={styles.rangeHint}>
                                    {!draftFrom
                                        ? 'Select start date'
                                        : !draftTo
                                            ? 'Select end date'
                                            : 'Tap a date to start over'}
                                </Text>
                            )}

                            {/* Calendar */}
                            <CalendarGrid
                                year={viewYear}
                                month={viewMonth}
                                selected={isRange ? null : draft}
                                rangeFrom={isRange ? draftFrom : null}
                                rangeTo={isRange ? draftTo : null}
                                minDate={effectiveMinDate}
                                maxDate={effectiveMaxDate}
                                onSelect={handleSelectDay}
                            />
                        </View>

                        {/* Year picker overlay */}
                        {yearPickerOpen && (
                            <View style={[StyleSheet.absoluteFillObject, styles.yearPickerOverlay]}>
                                <YearPicker
                                    selected={viewYear}
                                    onSelect={handleYearSelect}
                                    yearStart={yearStart}
                                    yearEnd={yearEnd}
                                />
                            </View>
                        )}
                    </View>

                    {/* Time selector — datetime mode */}
                    {mode === 'datetime' && (
                        <TimeSelector
                            label="Select Time"
                            hour12={hour12}
                            onHour12Change={setHour12}
                            minute={minute}
                            onMinuteChange={setMinute}
                            ampm={ampm}
                            onAmpmToggle={() => setAmpm(a => a === 'AM' ? 'PM' : 'AM')}
                        />
                    )}

                    {/* Time selectors — rangeAndTime mode */}
                    {isRangeAndTime && (
                        <>
                            <TimeSelector
                                label="From"
                                hour12={fromHour12}
                                onHour12Change={setFromHour12}
                                minute={fromMinute}
                                onMinuteChange={setFromMinute}
                                ampm={fromAmpm}
                                onAmpmToggle={() => setFromAmpm(a => a === 'AM' ? 'PM' : 'AM')}
                            />
                            <TimeSelector
                                label="To"
                                hour12={toHour12}
                                onHour12Change={setToHour12}
                                minute={toMinute}
                                onMinuteChange={setToMinute}
                                ampm={toAmpm}
                                onAmpmToggle={() => setToAmpm(a => a === 'AM' ? 'PM' : 'AM')}
                            />
                        </>
                    )}

                    {/* Footer */}
                    <View style={styles.footer}>
                        <AppButton
                            onPress={handleClear}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            accessibilityLabel="Clear date"
                            label="Clear"
                            variant="ghostTransparent"
                            size="sm"
                        />
                        <AppButton
                            onPress={handleApply}
                            accessibilityLabel="Apply"
                            label="Apply"
                            variant="accent"
                            size="sm"
                        />
                    </View>

                </View>
            </Modal>
        </>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    fieldLabel: {
        color: DESIGN_TOKENS.textLabel,
        ...TYPOGRAPHY.label,
        letterSpacing: 1.1,
        textTransform: 'uppercase',
        marginBottom: SPACING.sm,
    },

    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        height: DIMENSIONS.inputFieldHeight,
        backgroundColor: DESIGN_TOKENS.inputBg,
        borderWidth: 1.5,
        borderColor: DESIGN_TOKENS.whiteFadeXs,
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        marginBottom: SPACING.xl
    },
    triggerOpen: {
        borderColor: 'rgba(148,0,171,0.55)',
        backgroundColor: 'rgba(148,0,171,0.05)',
    },
    triggerDisabled: {
        opacity: 0.45,
    },
    triggerText: {
        ...TYPOGRAPHY.body,
        flex: 1,
        color: DESIGN_TOKENS.textPrimary,
        fontWeight: '500',
    },
    triggerPlaceholder: {
        color: DESIGN_TOKENS.textPlaceholder,
    },
    rangeHint: {
        fontSize: 11,
        color: DESIGN_TOKENS.textSubtle,
        textAlign: 'center',
        paddingBottom: SPACING.xs,
        letterSpacing: 0.3,
    },

    // ── Modal / sheet ──────────────────────────────────────────────────────────
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
    },

    sheet: {
        backgroundColor: '#1A0B1E',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },

    pickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    navBtn: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthYearGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    monthLabel: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: DESIGN_TOKENS.textPrimary,
    },
    yearPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xsm,
        borderWidth: 1.5,
        borderColor: 'rgba(148,0,171,0.40)',
        borderRadius: BORDER_RADIUS.lg,
        paddingHorizontal: SPACING.sm + 2,
        paddingVertical: 5,
        backgroundColor: 'rgba(148,0,171,0.08)',
    },
    yearPillActive: {
        borderColor: DESIGN_TOKENS.primaryBright,
        backgroundColor: 'rgba(148,0,171,0.18)',
    },
    yearPillText: {
        fontSize: 15,
        fontWeight: '600',
        color: DESIGN_TOKENS.primaryBright,
    },
    navBtnHidden: {
        opacity: 0,
    },
    yearPickerOverlay: {
        paddingHorizontal: SPACING.sm,
        paddingBottom: SPACING.md,
    },

    weekdayRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.sm,
        paddingTop: SPACING.sm,
        paddingBottom: SPACING.xs,
    },
    weekday: {
        width: `${100 / 7}%` as any,
        textAlign: 'center',
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: 0.5,
    },

    // ── Footer ────────────────────────────────────────────────────────────────
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
    }
});

export default DatePicker;