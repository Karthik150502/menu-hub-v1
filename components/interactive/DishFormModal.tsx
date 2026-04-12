import { CATEGORIES } from '@/constants/mock-data';
import { FONT_SIZES } from '@/constants/themes/font';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { dishSchema } from '@/types/zod/validations/dish';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef } from 'react';
import {
    Controller,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
    useWatch,
} from 'react-hook-form';
import {
    Animated,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Field, { fieldStyles } from '../custom/inputField';
import ToggleRow from '../custom/ToggleRow';
import { useBottomToast } from '../feedback/BottomToast';
import { Dish } from './dishes';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
    key: string;
    label: string;
}

export interface DishFormValues {
    name: string;
    description: string;
    price: string;
    currency: string;
    category: string;
    imageUrl?: string;
    available: boolean;
    veg: boolean;
    showInMenu?: boolean;
}

export interface DishFormModalProps {
    visible: boolean;
    onClose: () => void;
    defaultValues?: Partial<Dish>;
    onSubmit: (dish: Omit<Dish, 'key'>) => void;
    submitLabel?: string;
    isSubmitting?: boolean;
}

// ─── Theme tokens (local aliases for readability) ─────────────────────────────
// All color values come from @/constants/theme/theme — zero hardcoded hex here.

const T = {
    // Surfaces
    screenBg: DESIGN_TOKENS.background_1,
    inputBg: DESIGN_TOKENS.inputBg,
    inputBorder: DESIGN_TOKENS.inputBorder,

    // Accent
    accent: DESIGN_TOKENS.accentDefault,
    accentFaint: DESIGN_TOKENS.accentFaint,

    // Text
    textPrimary: DESIGN_TOKENS.primaryText,
    textSecondary: DESIGN_TOKENS.secondaryText,
    textLabel: DESIGN_TOKENS.textLabel,
    textPlaceholder: DESIGN_TOKENS.textPlaceholder,
    textMuted: DESIGN_TOKENS.textMuted,
    textHint: DESIGN_TOKENS.textHint,
    textSubtle: DESIGN_TOKENS.textSubtle,
    textSectionTitle: DESIGN_TOKENS.textSectionTitle,

    // UI chrome
    divider: DESIGN_TOKENS.divider,
    closeBtn: DESIGN_TOKENS.chromeBtnBg,
    closeBtnText: DESIGN_TOKENS.textDismiss,
    dragPill: DESIGN_TOKENS.dragPill,

    // Price field
    currencyBadgeBg: DESIGN_TOKENS.currencyBadgeBg,
    currencyText: DESIGN_TOKENS.accentDefault,
    priceDivider: DESIGN_TOKENS.inputBorder,
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function dishToFormValues(dish?: Partial<Dish>): Partial<DishFormValues> {
    if (!dish) return {};
    return {
        name: dish.name ?? '',
        description: dish.description ?? '',
        price: dish.price != null ? String(dish.price) : '',
        currency: dish.currency ?? '₹',
        category: dish.category ?? '',
        imageUrl: dish.imageUrl ?? '',
        available: dish.available ?? true,
        veg: dish.veg,
        showInMenu: dish.showInMenu,
    };
}

function formValuesToDish(values: DishFormValues): Omit<Dish, 'key'> {
    return {
        name: values.name.trim(),
        description: values.description.trim(),
        price: parseFloat(values.price),
        currency: '₹',
        category: values.category,
        imageUrl: values.imageUrl?.trim() || undefined,
        available: values.available,
        veg: values.veg,
        showInMenu: values.showInMenu
    };
}

// ─── Price Field ──────────────────────────────────────────────────────────────

export interface PriceFieldProps {
    value: string;
    onChange: (v: string) => void;
    onBlur: () => void;
    error?: string;
}

export const PriceField: React.FC<PriceFieldProps> = ({ value, onChange, onBlur, error }) => {
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = () => Animated.spring(borderAnim, {
        toValue: 1, useNativeDriver: false, speed: 22, bounciness: 4,
    }).start();

    const handleBlur = () => {
        onBlur();
        Animated.spring(borderAnim, {
            toValue: 0, useNativeDriver: false, speed: 22, bounciness: 0,
        }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [T.inputBorder, T.accent],
    });

    return (
        <View style={fieldStyles.wrapper}>
            <View style={fieldStyles.labelRow}>
                <Text style={fieldStyles.label}>Price</Text>
            </View>
            <Animated.View style={[
                fieldStyles.inputWrap,
                priceStyles.inputWrap,
                { borderColor },
            ]}>
                <View style={priceStyles.currencyBadge}>
                    <Text style={priceStyles.currencyText}>₹</Text>
                </View>
                <View style={priceStyles.divider} />
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder="0.00"
                    placeholderTextColor={T.textPlaceholder}
                    keyboardType="decimal-pad"
                    style={[fieldStyles.input, priceStyles.input]}
                />
            </Animated.View>
            {error && <Text style={fieldStyles.error}>⚠ {error}</Text>}
        </View>
    );
};

const priceStyles = StyleSheet.create({
    inputWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 0, overflow: 'hidden' },
    currencyBadge: { paddingHorizontal: 14, paddingVertical: 13, backgroundColor: T.currencyBadgeBg, alignItems: 'center', justifyContent: 'center' },
    currencyText: { color: T.currencyText, fontSize: FONT_SIZES.lg, fontWeight: '700' },
    divider: { width: 1, alignSelf: 'stretch', backgroundColor: T.priceDivider },
    input: { flex: 1, paddingHorizontal: 14 },
});

// ─── Category Select ──────────────────────────────────────────────────────────

interface CategorySelectProps {
    value: string;
    onChange: (v: string) => void;
    error?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, error }) => {
    const options = CATEGORIES.filter(c => c.key !== 'all');

    return (
        <View style={catStyles.wrapper}>
            <View style={fieldStyles.labelRow}>
                <Text style={fieldStyles.label}>Category</Text>
            </View>
            <View style={catStyles.grid}>
                {options.map(cat => {
                    const active = cat.key === value;
                    return (
                        <TouchableOpacity
                            key={cat.key}
                            style={[catStyles.chip, active && catStyles.chipActive]}
                            onPress={() => onChange(cat.key)}
                            activeOpacity={0.7}
                        >
                            <Text style={[catStyles.chipText, active && catStyles.chipTextActive]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {error && <Text style={fieldStyles.error}>⚠ {error}</Text>}
        </View>
    );
};

const catStyles = StyleSheet.create({
    wrapper: { marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: T.inputBorder, backgroundColor: T.inputBg },
    chipActive: { borderColor: T.accent, backgroundColor: T.accentFaint },
    chipText: { color: T.textPrimary, fontSize: FONT_SIZES.sm, fontWeight: '600' },
    chipTextActive: { color: T.accent },
});

// ─── Section Header ───────────────────────────────────────────────────────────
export const Section: React.FC<{ title: string }> = ({ title }) => (
    <View style={sectionStyles.wrap}>
        <Text style={sectionStyles.title}>{title}</Text>
        <View style={sectionStyles.line} />
    </View>
);

const sectionStyles = StyleSheet.create({
    wrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginTop: 6 },
    title: {
        color: T.textSectionTitle,
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        marginRight: 10
    },
    line: { flex: 1, height: 1, backgroundColor: T.divider },
});

// ─── DishFormModal ────────────────────────────────────────────────────────────

export const DishFormModal: React.FC<DishFormModalProps> = ({
    visible,
    onClose,
    defaultValues,
    onSubmit,
    submitLabel = 'Save Item',
    isSubmitting = false,
}) => {

    const { info } = useBottomToast();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<DishFormValues>({
        // ✅ Zod resolver — all validation rules live in dishSchema above
        resolver: zodResolver(dishSchema),
        defaultValues: {
            name: '',
            description: '',
            price: '',
            currency: '₹',
            category: '',
            imageUrl: '',
            available: true,
            veg: false,
            showInMenu: true,
            ...dishToFormValues(defaultValues),
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const [category] = useWatch({ control, name: ['category'] });

    useEffect(() => {
        if (defaultValues) {
            reset({ ...dishToFormValues(defaultValues) } as DishFormValues);
        }
    }, [defaultValues?.key]);

    const onValid: SubmitHandler<DishFormValues> = (values) => {
        onSubmit(formValuesToDish(values));
        onClose();
    };

    const onInvalid: SubmitErrorHandler<DishFormValues> = (errs) => {
        console.warn('[DishFormModal] Validation failed', errs);
        info('Resolve all the errors before submitting');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={modalStyles.root}>
                {/* ── Header ── */}
                <View style={modalStyles.header}>
                    <View style={modalStyles.dragPill} />
                    <View style={modalStyles.headerRow}>
                        <Text style={modalStyles.title}>
                            {defaultValues?.key ? 'Edit Item' : 'New Item'}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={modalStyles.closeBtn}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text style={modalStyles.closeBtnText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Form ── */}
                <ScrollView
                    style={modalStyles.scroll}
                    contentContainerStyle={modalStyles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Section title="Basic Info" />

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <Field
                                label="Dish Name"
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder="e.g. Butter Chicken"
                                error={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <Field
                                label="Description"
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder="A short, appetising description"
                                multiline
                                error={errors.description?.message}
                            />
                        )}
                    />

                    <Section title="Pricing" />

                    <Controller
                        control={control}
                        name="price"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <PriceField
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={errors.price?.message}
                            />
                        )}
                    />

                    <Section title="Classification" />

                    <Controller
                        control={control}
                        name="category"
                        render={({ field: { value, onChange } }) => (
                            <CategorySelect
                                value={value}
                                onChange={onChange}
                                error={errors.category?.message}
                            />
                        )}
                    />

                    <Section title="Media" />

                    <Controller
                        control={control}
                        name="imageUrl"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <Field
                                label="Image URL"
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder="https://..."
                                keyboardType="url"
                                optional
                                error={errors.imageUrl?.message}
                            />
                        )}
                    />

                    <Section title="Settings" />

                    <Controller
                        control={control}
                        name="available"
                        render={({ field: { value, onChange } }) => (
                            <ToggleRow
                                label="Available"
                                subLabel={value ? 'Visible to customers' : 'Hidden from menu'}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="veg"
                        render={({ field: { value, onChange } }) => (
                            <ToggleRow
                                label="Vegetarian"
                                subLabel={value ? 'Marked as veg 🟢' : 'Marked as non-veg 🔴'}
                                value={category === 'non-veg' ? false : category === 'veg' ? true : value}
                                onChange={onChange}
                                disabled={category === 'non-veg' || category === 'veg'}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="showInMenu"
                        render={({ field: { value, onChange } }) => (
                            <ToggleRow
                                label="Show in Menu"
                                subLabel={value ? 'Customers can see this Item in Menu' : 'Hidden for Customers'}
                                value={value || false}
                                onChange={onChange}
                            />
                        )}
                    />

                    <TouchableOpacity
                        style={[
                            submitStyles.btn,
                            (!isDirty || isSubmitting) && submitStyles.btnDisabled,
                        ]}
                        onPress={handleSubmit(onValid, onInvalid)}
                        activeOpacity={0.85}
                        disabled={!isDirty || isSubmitting}
                    >
                        <Text style={submitStyles.btnText}>
                            {isSubmitting ? 'Saving…' : submitLabel}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const modalStyles = StyleSheet.create({
    root: { flex: 1, backgroundColor: T.screenBg },
    header: { paddingTop: 12, paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: T.divider },
    dragPill: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: T.dragPill, marginBottom: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { color: T.textPrimary, fontSize: FONT_SIZES.xl, fontWeight: '700', letterSpacing: 0.2 },
    closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: T.closeBtn, alignItems: 'center', justifyContent: 'center' },
    closeBtnText: { color: T.closeBtnText, fontSize: FONT_SIZES.sm, fontWeight: '700' },
    scroll: { flex: 1 },
    content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: Platform.OS === 'ios' ? 48 : 32 },
});

const submitStyles = StyleSheet.create({
    btn: {
        marginTop: 8,
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: T.accent,
        alignItems: 'center',
        shadowColor: T.accent,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8
    },
    btnDisabled: { opacity: 0.45, shadowOpacity: 0, elevation: 0 },
    btnText: { color: T.textPrimary, fontSize: FONT_SIZES.lg, fontWeight: '700', letterSpacing: 0.3 },
});

export default DishFormModal;