import { INITIAL_DISHES } from "@/constants/mock-data";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
// eslint-disable-next-line import/no-named-as-default
import DishList, { Dish } from "./dishes";
import CategoryBar from "./filter-chip";

const DishesDisplay: React.FC = () => {

    const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
    const [activeCategories, setActiveCategories] = useState<string[]>(["all"]);

    const visibleDishes = useMemo<Dish[]>(() => {
        return dishes.filter(dish => activeCategories.includes(dish.category) || activeCategories.includes("all"))
    }, [activeCategories, dishes])

    const handleToggle = (key: string, available: boolean) => {
        setDishes((prev) =>
            prev.map((d) => (d.key === key ? { ...d, available } : d))
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
        backgroundColor: '#0D0D14',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.06)',
    },
    headerTitle: {
        color: '#F0F0F5',
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    headerSub: {
        color: 'rgba(255,255,255,0.38)',
        fontSize: 12,
        marginTop: 2,
        fontWeight: '500',
    },
    headerBadge: {
        backgroundColor: '#1C1C26',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    headerBadgeText: {
        color: '#F97316',
        fontSize: 12,
        fontWeight: '700',
    },
    list: {
        flex: 1,
    },
});

export default DishesDisplay; 