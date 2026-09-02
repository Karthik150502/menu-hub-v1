import { useState } from "react";

import { DIMENSIONS } from "@/constants/themes/dimensions";
import { SPACING } from "@/constants/themes/spacing";
import { DiscountOnType, DiscountType } from "@/types/price";
import { StyleSheet, View } from "react-native";

import ChipSelect from "../custom/ChipSelect";
import Field from "../custom/inputField";
import ToggleRow from "../custom/ToggleRow";
// eslint-disable-next-line import/no-named-as-default
import DatePicker from "../utils/DatePicker";

// ─── Options ──────────────────────────────────────────────────────────────────
// Mirrors the discount_* columns on item_prices (types/database.ts) /
// the Discount shape in types/price.ts.

const DISCOUNT_TYPE_OPTIONS: { key: DiscountType; label: string }[] = [
    { key: 'percentage', label: 'Percentage' },
    { key: 'fixed', label: 'Flat amount' },
];

const DISCOUNT_ON_OPTIONS: { key: DiscountOnType; label: string }[] = [
    { key: 'basePrice', label: 'Base price' },
    { key: 'priceIncludingTaxes', label: 'Price + taxes' },
];

interface DiscountSectionProps {

}

export const DiscountSection: React.FC<DiscountSectionProps> = () => {

    // Master switch — the fields below are meaningless (and stay disabled)
    // until a discount is actually being configured for this item.
    const [enabled, setEnabled] = useState(false);

    const [type, setType] = useState<DiscountType>('percentage');
    const [on, setOn] = useState<DiscountOnType>('basePrice');
    const [value, setValue] = useState("");
    const [label, setLabel] = useState("");
    // Held for a future onDiscountChange-style callback — DatePicker owns its
    // own committed range internally, so nothing here reads these back yet.
    const [, setValidFrom] = useState<Date | null>(null);
    const [, setValidUntil] = useState<Date | null>(null);

    return <View style={styles.content}>

        <ToggleRow
            label="Configure discount details for this item"
            subLabel={enabled ? 'Fields below are editable' : 'Enable to set up a discount'}
            value={enabled}
            onChange={setEnabled}
        />

        {/* pointerEvents blocks interaction outright; opacity signals it visually —
            both are keyed off the same toggle so the two states can't drift apart. */}
        <View
            style={[styles.fields, !enabled && styles.fieldsDisabled]}
            pointerEvents={enabled ? 'auto' : 'none'}
        >
            <ChipSelect
                label="Discount Type"
                options={DISCOUNT_TYPE_OPTIONS}
                value={type}
                onChange={(key) => setType(key as DiscountType)}
            />

            <ChipSelect
                label="Applies On"
                options={DISCOUNT_ON_OPTIONS}
                value={on}
                onChange={(key) => setOn(key as DiscountOnType)}
            />

            <Field
                value={value}
                onChange={setValue}
                onBlur={() => { }}
                label="Discount Value"
                keyboardType="decimal-pad"
                placeholder={type === 'percentage' ? 'e.g. 10' : 'e.g. 50'}
                hint={type === 'percentage'
                    ? 'Percentage off the selected base'
                    : 'Flat amount off the selected base'}
            />

            <Field
                value={label}
                onChange={setLabel}
                onBlur={() => { }}
                label="Discount Label"
                placeholder="e.g. Festive Offer"
                optional
            />

            <DatePicker
                label="Valid Duration"
                placeholder="Select a validity window"
                mode="range"
                disabled={!enabled}
                dateConstraint={{ type: 'future' }}
                onRangeChange={(from, to) => {
                    setValidFrom(from);
                    setValidUntil(to);
                }}
                onClear={() => {
                    setValidFrom(null);
                    setValidUntil(null);
                }}
            />
        </View>

    </View>
}

const styles = StyleSheet.create({
    content: {
        width: "100%",
        gap: SPACING.xs,
    },
    fields: {
        width: "100%",
        gap: SPACING.xs,
    },
    fieldsDisabled: {
        opacity: DIMENSIONS.opacityDisabled,
    },
})

export default DiscountSection;
