import { SPACING } from "@/constants/themes/spacing";
import { StyleSheet } from "react-native";

import { ContentTabs } from "../interactive/contentTabs";
import { DiscountSection } from "./discountSection";
import { TaxEditor } from "./taxEditor";

interface PriceEditorSectionProps {

}

export const PriceEditorSection: React.FC<PriceEditorSectionProps> = () => {

    return <ContentTabs
        defaultValue="discount"
        style={styles.tabs}
        sections={[
            {
                key: 'discount',
                label: 'Discount',
                content: <DiscountSection />,
            },
            {
                key: 'tax',
                label: 'Tax',
                // TaxEditor edits a single tax rule — dropped in here for now
                // just to try it out inside the Tax tab.
                content: <TaxEditor />,
            },
        ]}
    />
}


const styles = StyleSheet.create({
    tabs: {
        marginVertical: SPACING.xl,
    },
})
