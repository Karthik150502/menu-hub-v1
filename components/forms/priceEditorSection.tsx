import { useState } from "react";

import { TYPOGRAPHY } from "@/constants/themes/font";
import { SPACING } from "@/constants/themes/spacing";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
import { StyleSheet, View } from "react-native";

import Field from "../custom/inputField";
// eslint-disable-next-line import/no-named-as-default
import SectionSwitcher from "../interactive/sectionSwitcher";
import { FormGrid, FormItem } from "./formGrid";

interface PriceEditorSectionProps {

}

export const PriceEditorSection: React.FC<PriceEditorSectionProps> = () => {


    const [mode, setMode] = useState<"simple" | "discount" | "tax">("simple");
    const [simple, setSimple] = useState("");
    const [discount, setDiscount] = useState("");
    const [tax, setTax] = useState("");

    const SimpleComponent = () => {
        return <FormGrid>
            <FormItem span={"full"}>
                <View style={styles.content}>
                    <Field
                        value={simple}
                        onChange={(value) => {
                            setSimple(value)
                        }}
                        label="Simple"
                        onBlur={() => { }}
                    />
                </View>
            </FormItem>
        </FormGrid>
    }
    const DiscountComponent = () => {
        return <View style={styles.content}>
            <Field
                value={discount}
                onChange={(value) => {
                    setDiscount(value)
                }}
                label="Discount"
                onBlur={() => { }}
            />
        </View>
    }
    const TaxComponent = () => {
        return <View style={styles.content}>
            <Field
                value={tax}
                onChange={(value) => {
                    setTax(value)
                }}
                label="Tax"
                onBlur={() => { }}
            />
        </View>
    }


    return <SectionSwitcher
        label="Pricing"
        tabs={[
            { key: 'simple', label: 'Simple' },
            { key: 'discount', label: 'With discount' },
            { key: 'tax', label: 'With tax' },
        ]}
        value={mode}
        onChange={setMode}
    >
        {{
            simple: <SimpleComponent />,
            discount: <DiscountComponent />,
            tax: <TaxComponent />,
        }}
    </SectionSwitcher>
}


const styles = StyleSheet.create({
    content: {
        color: DESIGN_TOKENS.titleText,
        ...TYPOGRAPHY.body_bold,
        marginBottom: SPACING.xxs,
        width: "100%",
    },
})