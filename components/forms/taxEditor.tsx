import { useState } from "react";

import { SPACING } from "@/constants/themes/spacing";
import { StyleSheet, View } from "react-native";

import Field from "../custom/inputField";
import ToggleRow from "../custom/ToggleRow";

// ─── Component ────────────────────────────────────────────────────────────────
// Edits a single tax rule — mirrors the user-editable columns on item_taxes
// (types/database.ts): name, rate, inclusive, description. id / created_at /
// updated_at are server-assigned, not entered here.

interface TaxEditorProps {

}

export const TaxEditor: React.FC<TaxEditorProps> = () => {

    const [name, setName] = useState("");
    const [rate, setRate] = useState("");
    const [inclusive, setInclusive] = useState(false);
    const [description, setDescription] = useState("");

    return <View style={styles.content}>

        <Field
            value={name}
            onChange={setName}
            onBlur={() => { }}
            label="Tax Name"
            placeholder="e.g. GST"
        />

        <Field
            value={rate}
            onChange={setRate}
            onBlur={() => { }}
            label="Rate"
            keyboardType="decimal-pad"
            placeholder="e.g. 5"
            hint="Percentage rate for this tax"
        />

        <ToggleRow
            label="Tax Inclusive"
            subLabel={inclusive
                ? 'Already included in the displayed price'
                : 'Added on top of the displayed price'}
            value={inclusive}
            onChange={setInclusive}
        />

        <Field
            value={description}
            onChange={setDescription}
            onBlur={() => { }}
            label="Description"
            placeholder="e.g. Central GST"
            optional
        />

    </View>
}

const styles = StyleSheet.create({
    content: {
        width: "100%",
        gap: SPACING.xs,
    },
})

export default TaxEditor;
