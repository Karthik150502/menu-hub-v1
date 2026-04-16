import { INITIAL_DISHES } from "@/constants/mock-data";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { FONT_SIZES } from "@/constants/themes/font";
import { DESIGN_TOKENS } from "@/constants/themes/theme";
import DishList, { Dish } from "./dishes";
import CategoryBar from "./filter-chip";
import { SPACING } from "@/constants/themes/spacing";

const DishesDisplay: React.FC = () => {

    const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
    const [activeCategories, setActiveCategories] = useState<string[]>(["all"]);

    const visibleDishes = useMemo<Dish[]>(() => {
        return dishes.filter(dish => activeCategories.includes(dish.category) || activeCategories.includes("all"))
    }, [activeCategories, dishes])

    const handleToggle = (id: string, available: boolean) => {
        setDishes((prev) =>
            prev.map((d) => (d.id === id ? { ...d, available } : d))
        );
    };

    return (
        <View style={styles.container}>
            <CategoryBar selected={activeCategories} onSelect={setActiveCategories} />
            <DishList
                dishes={visibleDishes}
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
        borderBottomColor: DESIGN_TOKENS.sidebarDividerSoft,
    },
    headerTitle: {
        color: DESIGN_TOKENS.primaryWhite,
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    headerSub: {
        color: DESIGN_TOKENS.textSubtle,
        fontSize: FONT_SIZES.sm,
        marginTop: 2,
        fontWeight: '500',
    },
    headerBadge: {
        backgroundColor: DESIGN_TOKENS.primaryAccent3,
        borderRadius: 20,
        paddingHorizontal: SPACING.bg,
        paddingVertical: SPACING.sm,
        borderWidth: 1,
        borderColor: DESIGN_TOKENS.sidebarChevron,
    },
    headerBadgeText: {
        color: DESIGN_TOKENS.primaryAccent4,
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
    },
    list: {
        flex: 1,
    },
});

export default DishesDisplay; 