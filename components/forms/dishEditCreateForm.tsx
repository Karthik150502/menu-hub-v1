import { CATEGORIES } from '@/constants/mock-data';
import { TYPOGRAPHY } from '@/constants/themes/font';
import { SPACING } from '@/constants/themes/spacing';
import { DESIGN_TOKENS } from '@/constants/themes/theme';
import { dishSchema } from '@/types/zod/validations/dish';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import {
    Controller,
    SubmitErrorHandler,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
// eslint-disable-next-line import/no-named-as-default
import AppButton from '../custom/AppButton';
import ChipSelect from '../custom/ChipSelect';
import Field from '../custom/inputField';
import { PriceField } from '../custom/priceField';
import ToggleRow from '../custom/ToggleRow';
import { useBottomToast } from '../feedback/BottomToast';
import { FormGrid, FormItem } from '../forms/formGrid';
import { Dish } from '../interactive/dishes';
// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface DishEditCreateFormProps {
    /** Pre-populate the form when editing an existing dish. Omit for "create" mode. */
    defaultValues?: Partial<Dish>;
    /** Called with the mapped dish data after successful validation. */
    onSubmit: (dish: Omit<Dish, 'id'>) => void;
    /** Label for the submit button. Defaults to "Save Item". */
    submitLabel?: string;
    /** Shows a loading spinner and disables the button while true. */
    isSubmitting?: boolean;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

const T = {
    textSectionTitle: DESIGN_TOKENS.textSectionTitle,
    divider: DESIGN_TOKENS.disabled,
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
        veg: dish.veg ?? false,
        showInMenu: dish.showInMenu ?? true,
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
        imageUrl: values.imageUrl?.trim() || undefined,
        available: values.available,
        veg: values.veg,
        showInMenu: values.showInMenu,
        tag: values.tag ?? '',
    };
}

// ─── Section header ───────────────────────────────────────────────────────────

const Section: React.FC<{ title: string }> = ({ title }) => (
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

// ─── DishEditCreateForm ───────────────────────────────────────────────────────

export const DishEditCreateForm: React.FC<DishEditCreateFormProps> = ({
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
            tag: '',
            ...dishToFormValues(defaultValues),
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    // Sync form when defaultValues changes (switching between edit targets)
    useEffect(() => {
        reset({
            name: '', description: '', price: '', currency: '₹',
            category: '', imageUrl: '', available: true, veg: false,
            showInMenu: true, tag: '',
            ...dishToFormValues(defaultValues),
        });
    }, [defaultValues?.id]);

    const onValid: SubmitHandler<DishFormValues> = (values) => {
        onSubmit(formValuesToDish(values));
    };

    const onInvalid: SubmitErrorHandler<DishFormValues> = (errs) => {
        console.warn('[DishEditCreateForm] Validation failed', errs);
        info('Resolve all the errors before submitting');
    };

    return (
        <FormGrid>

            {/* ── Basic Info ───────────────────────────────────────────── */}
            <FormItem span="full">
                <Section title="Basic Info" />
            </FormItem>

            {/* Name + Tag: side-by-side on tablet/desktop, stacked on mobile */}
            <FormItem span={1}>
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
            </FormItem>

            <FormItem span={1}>
                <Controller
                    control={control}
                    name="tag"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <Field
                            label="Tag"
                            value={value ?? ''}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder="e.g. 40% off 💚"
                            error={errors.tag?.message}
                        />
                    )}
                />
            </FormItem>

            {/* Description always full — multiline needs all the width */}
            <FormItem span="full">
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <Field
                            label="Description"
                            value={value ?? ''}
                            onChange={onChange}
                            onBlur={onBlur}
                            placeholder="A short, appetising description"
                            multiline
                            error={errors.description?.message}
                        />
                    )}
                />
            </FormItem>

            {/* ── Pricing ──────────────────────────────────────────────── */}
            <FormItem span="full">
                <Section title="Pricing" />
            </FormItem>

            <FormItem span={1}>
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
            </FormItem>

            {/* ── Classification ───────────────────────────────────────── */}
            <FormItem span="full">
                <Section title="Classification" />
            </FormItem>

            <FormItem span="full">
                <Controller
                    control={control}
                    name="category"
                    render={({ field: { value, onChange } }) => (
                        <ChipSelect
                            label="Category"
                            options={CATEGORIES.filter(c => c.key !== 'all')}
                            value={value}
                            onChange={onChange}
                            error={errors.category?.message}
                        />
                    )}
                />
            </FormItem>

            {/* ── Settings ─────────────────────────────────────────────── */}
            <FormItem span="full">
                <Section title="Settings" />
            </FormItem>

            {/*
              Toggles: each span={1}
              mobile  → stack (1 col)
              tablet  → Available | Veg  /  ShowInMenu alone
              desktop → all 3 side-by-side
            */}
            <FormItem span={1}>
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
            </FormItem>

            <FormItem span={1}>
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
            </FormItem>

            <FormItem span={1}>
                <Controller
                    control={control}
                    name="showInMenu"
                    render={({ field: { value, onChange } }) => (
                        <ToggleRow
                            label="Show in Menu"
                            subLabel={value ? 'Visible in customer menu' : 'Hidden for customers'}
                            value={value ?? false}
                            onChange={onChange}
                        />
                    )}
                />
            </FormItem>

            {/* Submit — always full width */}
            <FormItem span="full">
                <AppButton
                    label={isSubmitting ? 'Saving…' : submitLabel}
                    disabled={!isDirty || isSubmitting}
                    onPress={handleSubmit(onValid, onInvalid)}
                    fullWidth
                />
            </FormItem>

        </FormGrid>
    );
};

export default DishEditCreateForm;