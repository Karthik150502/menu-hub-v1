import { CATEGORIES } from '@/constants/mock-data';
import { FONT_SIZES } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { dishSchema } from '@/types/zod/validations/dish';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef } from 'react';
import {
    Controller,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
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
import AppButton from '../custom/AppButton';
import Field, { fieldStyles } from '../custom/inputField';
import ToggleRow from '../custom/ToggleRow';
import { useBottomToast } from '../feedback/BottomToast';
import { Dish } from './dishes';

export interface Category {
    key: string;
    label: string;
}

export interface DishFormValues {
    name: string;
    description?: string;
    price: string;
    currency: string;
    category: string;
    imageUrl?: string;
    available: boolean;
    veg: boolean;
    showInMenu?: boolean;
    tag?: string;
}

export interface DishFormModalProps {
    visible: boolean;
    onClose: () => void;
    defaultValues?: Partial<Dish>;
    onSubmit: (dish: Omit<Dish, 'id'>) => void;
    submitLabel?: string;
    isSubmitting?: boolean;
}

// ─── Theme tokens (local aliases for readability) ─────────────────────────────
// All color values come from @/constants/theme/theme — zero hardcoded hex here.

const T = {
    // Surfaces
    screenBg: DESIGN_TOKENS.background_1,
    inputBg: DESIGN_TOKENS.inputBg,
    inputBorder: DESIGN_TOKENS.whiteFadeXs,

    // Accent
    accent: DESIGN_TOKENS.accentDefault,
    accentFaint: DESIGN_TOKENS.accentFaint,

    // Text
    textPrimary: DESIGN_TOKENS.primaryWhite,
    textPlaceholder: DESIGN_TOKENS.textPlaceholder,
    textSectionTitle: DESIGN_TOKENS.textSectionTitle,

    // UI chrome
    divider: DESIGN_TOKENS.divider,
    closeBtn: DESIGN_TOKENS.whiteFadeXs,
    closeBtnText: DESIGN_TOKENS.textDismiss,
    dragPill: DESIGN_TOKENS.dragPill,

    // Price field
    currencyBadgeBg: DESIGN_TOKENS.currencyBadgeBg,
    currencyText: DESIGN_TOKENS.accentDefault,
    priceDivider: DESIGN_TOKENS.whiteFadeXs,
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
        tag: dish.tag ?? ""
    };
}

function formValuesToDish(values: DishFormValues): Omit<Dish, 'id'> {
    return {
        name: values.name.trim(),
        description: values.description?.trim() ?? "",
        price: parseFloat(values.price),
        currency: '₹',
        category: values.category,
        imageUrl: values.imageUrl?.trim() ?? undefined,
        available: values.available,
        veg: values.veg,
        showInMenu: values.showInMenu,
        tag: values.tag ?? ""
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
    inputWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.none, overflow: 'hidden' },
    currencyBadge: { paddingHorizontal: SPACING.bg, paddingVertical: SPACING.bg, backgroundColor: T.currencyBadgeBg, alignItems: 'center', justifyContent: 'center' },
    currencyText: { color: T.currencyText, fontSize: FONT_SIZES.lg, fontWeight: '700' },
    divider: { width: 1, alignSelf: 'stretch', backgroundColor: T.priceDivider },
    input: { flex: 1, paddingHorizontal: SPACING.bg },
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
    chip: { paddingHorizontal: SPACING.bg, paddingVertical: SPACING.sm, borderRadius: 20, borderWidth: 1.5, borderColor: T.inputBorder, backgroundColor: T.inputBg },
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

    useEffect(() => {
        if (defaultValues) {
            reset({ ...dishToFormValues(defaultValues) } as DishFormValues);
        }
    }, [defaultValues?.id]);

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
                            {defaultValues?.id ? 'Edit Item' : 'New Item'}
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
                                label="Item Name"
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
                    <Controller
                        control={control}
                        name="tag"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <Field
                                label="Tag"
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder="Latest information on the dish"
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
                                value={value}
                                onChange={onChange}
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
                    <AppButton
                        label={isSubmitting ? 'Saving…' : submitLabel}
                        disabled={!isDirty || isSubmitting}
                        onPress={handleSubmit(onValid, onInvalid)}
                        fullWidth 
                        />
                </ScrollView>
            </View>
        </Modal>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const modalStyles = StyleSheet.create({
    root: { flex: 1, backgroundColor: T.screenBg },
    header: { paddingTop: SPACING.md, paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.lg, borderBottomWidth: 1, borderBottomColor: T.divider },
    dragPill: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: T.dragPill, marginBottom: 16 },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { color: T.textPrimary, fontSize: FONT_SIZES.xl, fontWeight: '700', letterSpacing: 0.2 },
    closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: T.closeBtn, alignItems: 'center', justifyContent: 'center' },
    closeBtnText: { color: T.closeBtnText, fontSize: FONT_SIZES.sm, fontWeight: '700' },
    scroll: { flex: 1 },
    content: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxl, paddingBottom: Platform.OS === 'ios' ? SPACING.giant : SPACING.xxxl },
});

const submitStyles = StyleSheet.create({
    btn: {
        marginTop: 8,
        paddingVertical: SPACING.lg,
        borderRadius: SPACING.bg,
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