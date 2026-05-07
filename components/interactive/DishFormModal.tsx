import { CATEGORIES } from '@/constants/mock-data';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { dishSchema } from '@/types/zod/validations/dish';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import AppButton from '../custom/AppButton';

import { AppModal } from '../custom/AppModal';
import Field, { fieldStyles } from '../custom/inputField';
import { PriceField } from '../custom/priceField';
import ToggleRow from '../custom/ToggleRow';
import { useBottomToast } from '../feedback/BottomToast';
import { FormGrid, FormItem } from '../forms/formGrid';
import { Dish } from './dishes';

export interface Category { key: string; label: string; }

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

const T = {
    screenBg: DESIGN_TOKENS.background_1,
    inputBg: DESIGN_TOKENS.inputBg,
    inputBorder: DESIGN_TOKENS.whiteFadeXs,
    accent: DESIGN_TOKENS.accentDefault,
    accentFaint: DESIGN_TOKENS.accentFaint,
    textPrimary: DESIGN_TOKENS.textPrimary,
    textPlaceholder: DESIGN_TOKENS.textPlaceholder,
    textSectionTitle: DESIGN_TOKENS.textSectionTitle,
    divider: DESIGN_TOKENS.disabled,
} as const;

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
        tag: dish.tag ?? '',
    };
}

function formValuesToDish(values: DishFormValues): Omit<Dish, 'id'> {
    return {
        name: values.name.trim(),
        description: values.description?.trim() ?? '',
        price: parseFloat(values.price),
        currency: '₹',
        category: values.category,
        imageUrl: values.imageUrl?.trim() ?? undefined,
        available: values.available,
        veg: values.veg,
        showInMenu: values.showInMenu,
        tag: values.tag ?? '',
    };
}

interface CategorySelectProps { value: string; onChange: (v: string) => void; error?: string; }

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
                        <TouchableOpacity key={cat.key} style={[catStyles.chip, active && catStyles.chipActive]} onPress={() => onChange(cat.key)} activeOpacity={0.7}>
                            <Text style={[catStyles.chipText, active && catStyles.chipTextActive]}>{cat.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {error && <Text style={fieldStyles.error}>⚠ {error}</Text>}
        </View>
    );
};

const catStyles = StyleSheet.create({
    wrapper: { marginBottom: SPACING.xl },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    chip: { paddingHorizontal: SPACING.bg, paddingVertical: SPACING.sm, borderRadius: 20, borderWidth: 1.5, borderColor: T.inputBorder, backgroundColor: T.inputBg },
    chipActive: { borderColor: T.accent, backgroundColor: T.accentFaint },
    chipText: { color: T.textPrimary, ...TYPOGRAPHY.body },
    chipTextActive: { color: T.accent },
});

export const Section: React.FC<{ title: string }> = ({ title }) => (
    <View style={sectionStyles.wrap}>
        <Text style={sectionStyles.title}>{title}</Text>
        <View style={sectionStyles.line} />
    </View>
);

const sectionStyles = StyleSheet.create({
    wrap: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, marginTop: SPACING.sm, gap: SPACING.sm },
    title: { color: T.textSectionTitle, ...TYPOGRAPHY.caption_bold, textTransform: 'uppercase', flexShrink: 0 },
    line: { flex: 1, height: 1, backgroundColor: T.divider },
});

export const DishFormModal: React.FC<DishFormModalProps> = ({
    visible, onClose, defaultValues, onSubmit,
    submitLabel = 'Save Item', isSubmitting = false,
}) => {
    const { info } = useBottomToast();

    const { control, handleSubmit, reset, formState: { errors, isDirty } } = useForm<DishFormValues>({
        resolver: zodResolver(dishSchema),
        defaultValues: {
            name: '', description: '', price: '', currency: '₹',
            category: '', imageUrl: '', available: true, veg: false,
            showInMenu: true, tag: '',
            ...dishToFormValues(defaultValues),
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    useEffect(() => {
        if (defaultValues) reset({ ...dishToFormValues(defaultValues) } as DishFormValues);
    }, [defaultValues?.id]);

    const onValid: SubmitHandler<DishFormValues> = (values) => { onSubmit(formValuesToDish(values)); onClose(); };
    const onInvalid: SubmitErrorHandler<DishFormValues> = (errs) => {
        console.warn('[DishFormModal] Validation failed', errs);
        info('Resolve all the errors before submitting');
    };

    return (
        <AppModal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
            modalTitle={defaultValues?.id ? 'Edit Item' : 'New Item'}
        >
            <>
                {/*
                  FormGrid + FormItem handle responsive columns automatically.
                    mobile  < 600px  → 1 column  (fields stack vertically)
                    tablet  600-900  → 2 columns (Name|Tag side-by-side, toggles 2-across)
                    desktop > 900px  → 3 columns (Name|Tag|Price on one row, toggles 3-across)

                  span="full" always expands to the full row width regardless of breakpoint.
                  span={1} occupies one column slot.
                */}
                <FormGrid>

                    {/* ── Basic Info ── */}
                    <FormItem span="full"><Section title="Basic Info" /></FormItem>

                    {/* Name + Tag: side-by-side on tablet/desktop, stacked on mobile */}
                    <FormItem span={1}>
                        <Controller control={control} name="name"
                            render={({ field: { value, onChange, onBlur } }) => (
                                <Field label="Item Name" value={value} onChange={onChange} onBlur={onBlur}
                                    placeholder="e.g. Butter Chicken" error={errors.name?.message} />
                            )}
                        />
                    </FormItem>

                    <FormItem span={1}>
                        <Controller control={control} name="tag"
                            render={({ field: { value, onChange, onBlur } }) => (
                                <Field label="Tag" value={value ?? ''} onChange={onChange} onBlur={onBlur}
                                    placeholder="e.g. 40% off 💚" error={errors.tag?.message} />
                            )}
                        />
                    </FormItem>

                    {/* Description always full — multiline needs all the width */}
                    <FormItem span="full">
                        <Controller control={control} name="description"
                            render={({ field: { value, onChange, onBlur } }) => (
                                <Field label="Description" value={value ?? ''} onChange={onChange} onBlur={onBlur}
                                    placeholder="A short, appetising description" multiline error={errors.description?.message} />
                            )}
                        />
                    </FormItem>

                    {/* ── Pricing ── */}
                    <FormItem span="full"><Section title="Pricing" /></FormItem>

                    {/* Price in one column; on desktop it leaves 2 cols blank — intentional breathing room */}
                    <FormItem span={1}>
                        <Controller control={control} name="price"
                            render={({ field: { value, onChange, onBlur } }) => (
                                <PriceField value={value} onChange={onChange} onBlur={onBlur} error={errors.price?.message} />
                            )}
                        />
                    </FormItem>

                    {/* ── Classification ── */}
                    <FormItem span="full"><Section title="Classification" /></FormItem>

                    {/* Category chips must be full width — they wrap internally */}
                    <FormItem span="full">
                        <Controller control={control} name="category"
                            render={({ field: { value, onChange } }) => (
                                <CategorySelect value={value} onChange={onChange} error={errors.category?.message} />
                            )}
                        />
                    </FormItem>

                    {/* ── Settings ── */}
                    <FormItem span="full"><Section title="Settings" /></FormItem>
                    <FormItem span={1}>
                        <Controller control={control} name="available"
                            render={({ field: { value, onChange } }) => (
                                <ToggleRow label="Available"
                                    subLabel={value ? 'Visible to customers' : 'Hidden from menu'}
                                    value={value} onChange={onChange} />
                            )}
                        />
                    </FormItem>

                    <FormItem span={1}>
                        <Controller control={control} name="veg"
                            render={({ field: { value, onChange } }) => (
                                <ToggleRow label="Vegetarian"
                                    subLabel={value ? 'Marked as veg 🟢' : 'Marked as non-veg 🔴'}
                                    value={value} onChange={onChange} />
                            )}
                        />
                    </FormItem>

                    <FormItem span={1}>
                        <Controller control={control} name="showInMenu"
                            render={({ field: { value, onChange } }) => (
                                <ToggleRow label="Show in Menu"
                                    subLabel={value ? 'Visible in customer menu' : 'Hidden for customers'}
                                    value={value ?? false} onChange={onChange} />
                            )}
                        />
                    </FormItem>

                    <FormItem span={"full"}>
                        <AppButton
                            label={isSubmitting ? 'Saving…' : submitLabel}
                            disabled={!isDirty || isSubmitting}
                            onPress={handleSubmit(onValid, onInvalid)}
                            fullWidth
                        />
                    </FormItem>

                </FormGrid>
            </>
        </AppModal>
    );
};

export default DishFormModal;