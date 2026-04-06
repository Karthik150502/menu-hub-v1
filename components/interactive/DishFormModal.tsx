import { CATEGORIES } from '@/constants/mock-data';
import { DESIGN_TOKENS } from '@/constants/theme';
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
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
    key: string;
    label: string;
}

export interface Dish {
    key: string;
    name: string;
    description: string;
    price: number;
    currency?: string;
    color: string | [string, string];
    available: boolean;
    badge?: string;
    imageUrl?: string;
    category: string;
    veg: boolean;
}

interface DishFormValues {
    name: string;
    description: string;
    price: string;
    currency: string;
    category: string;
    imageUrl: string;
    available: boolean;
    veg: boolean;
}

export interface DishFormModalProps {
    visible: boolean;
    onClose: () => void;
    defaultValues?: Partial<Dish>;
    onSubmit: (dish: Omit<Dish, 'key'>) => void;
    submitLabel?: string;
    isSubmitting?: boolean;
}

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
        veg: dish.veg ?? false,
    };
}

function formValuesToDish(values: DishFormValues): Omit<Dish, 'key'> {
    return {
        name: values.name.trim(),
        description: values.description.trim(),
        price: parseFloat(values.price),
        currency: '₹',
        category: values.category,
        imageUrl: values.imageUrl.trim() || undefined,
        color: '#F97316',
        available: values.available,
        veg: values.veg,
    };
}

// ─── Animated Field ───────────────────────────────────────────────────────────

interface FieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    onBlur: () => void;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'url';
    multiline?: boolean;
    error?: string;
    hint?: string;
    optional?: boolean;
}

const Field: React.FC<FieldProps> = ({
    label, value, onChange, onBlur, placeholder,
    keyboardType = 'default', multiline, error, hint, optional,
}) => {
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
        outputRange: [error ? DESIGN_TOKENS.subNegativeDark : 'rgba(255,255,255,0.08)', DESIGN_TOKENS.accentDefault],
    });

    return (
        <View style={fieldStyles.wrapper}>
            <View style={fieldStyles.labelRow}>
                <Text style={fieldStyles.label}>{label}</Text>
                {optional && <Text style={fieldStyles.optional}>optional</Text>}
            </View>
            <Animated.View style={[
                fieldStyles.inputWrap,
                { borderColor },
                error && fieldStyles.inputWrapError,
            ]}>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    keyboardType={keyboardType}
                    multiline={multiline}
                    underlineColorAndroid="transparent"
                    numberOfLines={multiline ? 3 : 1}
                    autoCapitalize={keyboardType === 'default' ? 'sentences' : 'none'}
                    autoCorrect={keyboardType === 'default'}
                    style={[fieldStyles.input, multiline && fieldStyles.inputMulti]}
                />
            </Animated.View>
            {error
                ? <Text style={fieldStyles.error}>⚠ {error}</Text>
                : hint
                    ? <Text style={fieldStyles.hint}>{hint}</Text>
                    : null
            }
        </View>
    );
};

const fieldStyles = StyleSheet.create({
    wrapper: { marginBottom: 20 },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    label: { color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: '700', letterSpacing: 1.1, textTransform: 'uppercase' },
    optional: { marginLeft: 8, color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: '500' },
    inputWrap: { borderWidth: 1.5, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 14 },
    inputWrapError: { backgroundColor: 'rgba(248,113,113,0.05)' },
    input: { color: '#F0F0F5', fontSize: 15, paddingVertical: 13, },
    inputMulti: { minHeight: 80, textAlignVertical: 'top', paddingTop: 12 },
    error: { color: DESIGN_TOKENS.subNegativeDark, fontSize: 11, fontWeight: '500', marginTop: 6 },
    hint: { color: 'rgba(255,255,255,0.28)', fontSize: 11, marginTop: 6 },
});

// ─── Price Field (fixed ₹ prefix) ─────────────────────────────────────────────

interface PriceFieldProps {
    value: string;
    onChange: (v: string) => void;
    onBlur: () => void;
    error?: string;
}

const PriceField: React.FC<PriceFieldProps> = ({ value, onChange, onBlur, error }) => {
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
        outputRange: [error ? DESIGN_TOKENS.subNegativeDark : 'rgba(255,255,255,0.08)', DESIGN_TOKENS.accentDefault],
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
                error && fieldStyles.inputWrapError,
            ]}>
                {/* Fixed currency badge */}
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
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    keyboardType="decimal-pad"
                    style={[fieldStyles.input, priceStyles.input]}
                />
            </Animated.View>
            {error && <Text style={fieldStyles.error}>⚠ {error}</Text>}
        </View>
    );
};

const priceStyles = StyleSheet.create({
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 0,
        overflow: 'hidden',
    },
    currencyBadge: {
        paddingHorizontal: 14,
        paddingVertical: 13,
        backgroundColor: 'rgba(249,115,22,0.10)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currencyText: {
        color: DESIGN_TOKENS.accentDefault,
        fontSize: 16,
        fontWeight: '700',
    },
    divider: {
        width: 1,
        alignSelf: 'stretch',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    input: {
        flex: 1,
        paddingHorizontal: 14,
    },
});

// ─── Category Select ──────────────────────────────────────────────────────────

interface CategorySelectProps {
    value: string;
    onChange: (v: string) => void;
    error?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange, error }) => {
    // Filter out "all" from the selectable options in a form context
    const options = CATEGORIES.filter(c => c.key !== 'all');

    return (
        <View style={catStyles.wrapper}>
            <View style={fieldStyles.labelRow}>
                <Text style={fieldStyles.label}>Category</Text>
            </View>

            {/* Chip grid */}
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
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.10)',
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    chipActive: {
        borderColor: DESIGN_TOKENS.accentDefault,
        backgroundColor: 'rgba(249,115,22,0.15)',
    },
    chipText: {
        color: '#F0F0F5',
        fontSize: 13,
        fontWeight: '600',
    },
    chipTextActive: {
        color: DESIGN_TOKENS.accentDefault,
    },
});

// ─── Toggle Row ───────────────────────────────────────────────────────────────

interface ToggleRowProps {
    label: string;
    subLabel: string;
    value: boolean;
    onChange: (v: boolean) => void;
    activeColor?: string;
    disabled?: boolean
}

const ToggleRow: React.FC<ToggleRowProps> = ({
    label, subLabel, value, onChange, activeColor = '#22C55E',
    disabled
}) => {
    return <View style={{
        ...toggleStyles.row, ...(disabled && {
            opacity: 0.55
        })
    }}>
        <View style={toggleStyles.text}>
            <Text style={toggleStyles.label}>{label}</Text>
            <Text style={toggleStyles.sub}>{subLabel}</Text>
        </View>
        <Switch
            disabled={disabled}
            value={value}
            onValueChange={onChange}
            trackColor={{ false: '#2E2E38', true: activeColor }}
            thumbColor="#fff"
            ios_backgroundColor="#2E2E38"
        />
    </View>
}

const toggleStyles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 14 },
    text: { flex: 1, marginRight: 12 },
    label: { color: '#F0F0F5', fontSize: 14, fontWeight: '600' },
    sub: { color: 'rgba(255,255,255,0.38)', fontSize: 12, marginTop: 2 },
});

// ─── Section Header ───────────────────────────────────────────────────────────

const Section: React.FC<{ title: string }> = ({ title }) => (
    <View style={sectionStyles.wrap}>
        <Text style={sectionStyles.title}>{title}</Text>
        <View style={sectionStyles.line} />
    </View>
);

const sectionStyles = StyleSheet.create({
    wrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, marginTop: 6 },
    title: { color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase', marginRight: 10 },
    line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' },
});

// ─── DishFormModal ────────────────────────────────────────────────────────────

export const DishFormModal: React.FC<DishFormModalProps> = ({
    visible,
    onClose,
    defaultValues,
    onSubmit,
    submitLabel = 'Save Dish',
    isSubmitting = false,
}) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<DishFormValues>({
        defaultValues: {
            name: '',
            description: '',
            price: '',
            currency: '₹',
            category: '',
            imageUrl: '',
            available: true,
            veg: false,
            ...dishToFormValues(defaultValues),
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const [category] = useWatch({ control, name: ["category"] });

    useEffect(() => {
        if (defaultValues) {
            reset({ ...dishToFormValues(defaultValues) } as DishFormValues);
        }
    }, [defaultValues?.key]);

    const onValid: SubmitHandler<DishFormValues> = (values) => {
        onSubmit(formValuesToDish(values));
        onClose()
    };

    const onInvalid: SubmitErrorHandler<DishFormValues> = (errs) => {
        console.warn('[DishFormModal] Validation failed', errs);
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
                            {defaultValues?.key ? 'Edit Dish' : 'New Dish'}
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
                    {/* Basic Info */}
                    <Section title="Basic Info" />

                    <Controller
                        control={control}
                        name="name"
                        rules={{
                            required: 'Dish name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters' },
                            maxLength: { value: 60, message: 'Name must be 60 characters or fewer' },
                        }}
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
                        rules={{
                            required: 'Description is required',
                            minLength: { value: 10, message: 'Add a bit more detail (min 10 chars)' },
                            maxLength: { value: 200, message: 'Keep it under 200 characters' },
                        }}
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

                    {/* Pricing */}
                    <Section title="Pricing" />

                    <Controller
                        control={control}
                        name="price"
                        rules={{
                            required: 'Price is required',
                            validate: (v) => {
                                const n = parseFloat(v);
                                if (isNaN(n)) return 'Must be a number';
                                if (n <= 0) return 'Price must be greater than 0';
                                if (n > 100000) return 'Price seems too high';
                                return true;
                            },
                        }}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <PriceField
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                error={errors.price?.message}
                            />
                        )}
                    />

                    {/* Classification */}
                    <Section title="Classification" />

                    <Controller
                        control={control}
                        name="category"
                        rules={{ required: 'Please select a category' }}
                        render={({ field: { value, onChange } }) => (
                            <CategorySelect
                                value={value}
                                onChange={onChange}
                                error={errors.category?.message}
                            />
                        )}
                    />

                    {/* Media */}
                    <Section title="Media" />

                    <Controller
                        control={control}
                        name="imageUrl"
                        rules={{
                            pattern: {
                                value: /^(https?:\/\/).+/,
                                message: 'Must be a valid URL starting with http(s)://',
                            },
                        }}
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

                    {/* Settings */}
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
                                activeColor="#22C55E"
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
                                value={category === "non-veg" ? false : category === "veg" ? true : value}
                                onChange={onChange}
                                disabled={category === "non-veg" || category === "veg"}
                                activeColor="#22C55E"
                            />
                        )}
                    />

                    {/* Submit */}
                    <TouchableOpacity
                        style={[
                            styles.submitBtn,
                            (!isDirty || isSubmitting) && styles.submitBtnDisabled,
                        ]}
                        onPress={handleSubmit(onValid, onInvalid)}
                        activeOpacity={0.85}
                        disabled={!isDirty || isSubmitting}
                    >
                        <Text style={styles.submitBtnText}>
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
    root: {
        flex: 1,
        backgroundColor: '#12121A',
    },
    header: {
        paddingTop: 12,
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    dragPill: {
        alignSelf: 'center',
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginBottom: 16,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: '#F0F0F5',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    closeBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '700',
    },
    scroll: { flex: 1 },
    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: Platform.OS === 'ios' ? 48 : 32,
    },
});

const styles = StyleSheet.create({
    submitBtn: {
        marginTop: 8,
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: DESIGN_TOKENS.accentDefault,
        alignItems: 'center',
        shadowColor: DESIGN_TOKENS.accentDefault,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    submitBtnDisabled: {
        opacity: 0.45,
        shadowOpacity: 0,
        elevation: 0,
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default DishFormModal;