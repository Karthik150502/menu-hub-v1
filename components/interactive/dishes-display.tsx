import { ALL_CATEGORY_ID } from "@/hooks/use-categories";
import { useDishes } from "@/hooks/use-dishes";
import { DishRead } from "@/lib/api/dishes";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { TYPOGRAPHY } from "@/constants/themes/font";
import { BORDER_RADIUS } from "@/constants/themes/dimensions";
import { SPACING } from "@/constants/themes/spacing";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
// eslint-disable-next-line import/no-named-as-default
import DishList, { Dish } from "./dishes";
import CategoryBar from "./filter-chip";

// Adapts the backend's richer shape (nested category/price objects) to the
// flat Dish shape DishCard/DishList render. `availableOverride` lets the
// availability toggle patch the UI instantly — there's no PATCH endpoint for
// it yet, so this stays a local-only override rather than a real mutation.
function toDish(d: DishRead, availableOverride?: boolean): Dish {
    return {
        id: d.id,
        name: d.name,
        description: d.description ?? undefined,
        price: d.price.final_price,
        currency: d.price.currency_code,
        available: availableOverride ?? d.available,
        imageUrl: d.image_url ?? undefined,
        category: d.category.id,
        categoryLabel: d.category.label,
        veg: d.veg,
        showInMenu: d.show_in_menu,
        tag: d.tag ?? undefined,
    };
}

const DishesDisplay: React.FC = () => {

    const [activeCategories, setActiveCategories] = useState<string[]>([ALL_CATEGORY_ID]);
    // TODO: drop once dish availability has a real PATCH endpoint — until
    // then, toggling is a local-only patch over the fetched data.
    const [availabilityOverrides, setAvailabilityOverrides] = useState<Record<string, boolean>>({});

    const { data: rawDishes, isLoading: dishesLoading, isError: dishesError, refetch: refetchDishes } = useDishes(activeCategories);

    const dishes = useMemo<Dish[]>(
        () => rawDishes.map((d) => toDish(d, availabilityOverrides[d.id])),
        [rawDishes, availabilityOverrides],
    );

    const handleToggle = (id: string, available: boolean) => {
        setAvailabilityOverrides((prev) => ({ ...prev, [id]: available }));
    };

    return (
        <View style={styles.container}>
            <CategoryBar selected={activeCategories} onSelect={setActiveCategories} />
            <DishList
                dishes={dishes}
                loading={dishesLoading}
                error={dishesError}
                onRetry={refetchDishes}
                onToggleAvailability={handleToggle}
                onDishPress={(dish) => console.log("Tapped:", dish.name)}
                style={styles.list}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    screen: {
        flex: 1,
        backgroundColor: DESIGN_TOKENS.primaryAccent3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.sm,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: DESIGN_TOKENS.disabled,
    },
    headerTitle: {
        color: DESIGN_TOKENS.textPrimary,
        ...TYPOGRAPHY.h1,
        letterSpacing: -0.5,
    },
    headerSub: {
        color: DESIGN_TOKENS.textSubtle,
        ...TYPOGRAPHY.bodySmall,
        marginTop: SPACING.xxs,
    },
    headerBadge: {
        backgroundColor: DESIGN_TOKENS.primaryAccent3,
        borderRadius: BORDER_RADIUS.card,
        paddingHorizontal: SPACING.bg,
        paddingVertical: SPACING.sm,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.iconMuted,
    },
    headerBadgeText: {
        color: DESIGN_TOKENS.primaryAccent4,
        ...TYPOGRAPHY.bodySmall,
    },
    list: {
        flex: 1,
    },
});

export default DishesDisplay;
