import { Dish } from "@/components/interactive/dishes";
import { Category } from "@/components/interactive/filter-chip";


export const CATEGORIES: Category[] = [
    { key: "all", label: "All" },
    { key: "non-veg", label: "Non Veg", filter: (d: Dish) => d.category === "starter" },
    { key: "veg", label: "Veg", filter: (d: Dish) => d.category === "main" },
    { key: "beverages", label: "Beverages", filter: (d: Dish) => d.category === "drink" },
];

// ─── Initial data ─────────────────────────────────────────────────────────────
export const INITIAL_DISHES: Dish[] = [
    {
        key: 'butter-chicken',
        name: 'Butter Chicken',
        description: 'Rich creamy tomato gravy with tender chicken pieces',
        price: 320,
        color: ['#F97316', '#EA580C'],
        available: true,
        badge: 'Bestseller 🔥',
        category: "non-veg"
    },
    {
        key: 'paneer-tikka',
        name: 'Paneer Tikka',
        description: 'Smoky grilled cottage cheese with spiced marinade',
        price: 250,
        color: ['#22C55E', '#16A34A'],
        available: true,
        category: "veg"
    },
    {
        key: 'masala-dosa',
        name: 'Masala Dosa',
        description: 'Crispy rice crepe with spiced potato filling',
        price: 180,
        color: ['#EF4444', '#B91C1C'],
        available: false,
        category: "veg"
    },
    {
        key: 'biryani',
        name: 'Chicken Biryani',
        description: 'Slow-cooked basmati rice layered with spiced chicken',
        price: 380,
        color: ['#EAB308', '#CA8A04'],
        available: true,
        badge: "Chef's Pick 👨‍🍳",
        category: "non-veg"
    },
    {
        key: 'dal-makhani',
        name: 'Dal Makhani',
        description: 'Slow simmered black lentils in buttery tomato sauce',
        price: 200,
        color: ['#8B5CF6', '#6D28D9'],
        available: true,
        category: "veg"
    },
    {
        key: 'garlic-naan',
        name: 'Garlic Naan',
        description: 'Soft leavened bread with garlic butter and herbs',
        price: 60,
        color: ['#F59E0B', '#D97706'],
        available: true,
        category: "veg"
    },
    {
        key: 'mango-lassi',
        name: 'Mango Lassi',
        description: 'Chilled yogurt drink blended with Alphonso mango',
        price: 120,
        color: ['#FB923C', '#F97316'],
        available: true,
        badge: 'New 🥭',
        category: "beverages"
    },
];