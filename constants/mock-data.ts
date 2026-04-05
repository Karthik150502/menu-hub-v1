import { Dish } from "@/components/interactive/dishes";
import { Category } from "@/components/interactive/filter-chip";


export const CATEGORIES: Category[] = [
    { key: "all", label: "All" },
    { key: "non-veg", label: "Non Veg" },
    { key: "veg", label: "Veg" },
    { key: "beverages", label: "Beverages" },
    { key: "deserts", label: "Deserts" },
    { key: "chats", label: "Chats" },
    { key: "liqour", label: "Liqour/ Alcholol", },
    { key: "chinese", label: "Chinese" },
];

// ─── Initial  data ─────────────────────────────────────────────────────────────
export const INITIAL_DISHES: Dish[] = [
    // ─── NON-VEG ─────────────────────────────────────────
    {
        key: 'butter-chicken',
        name: 'Butter Chicken',
        description: 'Rich creamy tomato gravy with tender chicken pieces',
        price: 320,
        color: ['#F97316', '#EA580C'],
        available: true,
        badge: 'Bestseller 🔥',
        category: "non-veg",
        veg: false
    },
    {
        key: 'chicken-tikka',
        name: 'Chicken Tikka',
        description: 'Grilled chicken marinated in spices and yogurt',
        price: 280,
        color: ['#FB7185', '#E11D48'],
        available: true,
        category: "non-veg",
        veg: false
    },
    {
        key: 'mutton-rogan-josh',
        name: 'Mutton Rogan Josh',
        description: 'Kashmiri style slow-cooked mutton curry',
        price: 420,
        color: ['#7C2D12', '#B91C1C'],
        available: true,
        category: "non-veg",
        veg: false
    },
    {
        key: 'fish-fry',
        name: 'Fish Fry',
        description: 'Crispy fried fish with coastal spices',
        price: 300,
        color: ['#38BDF8', '#0EA5E9'],
        available: true,
        category: "non-veg",
        veg: false
    },
    {
        key: 'prawn-curry',
        name: 'Prawn Curry',
        description: 'Spicy coconut-based prawn curry',
        price: 350,
        color: ['#F97316', '#FB923C'],
        available: true,
        category: "non-veg",
        veg: false
    },
    {
        key: 'chicken-65',
        name: 'Chicken 65',
        description: 'Spicy deep-fried chicken bites',
        price: 260,
        color: ['#DC2626', '#991B1B'],
        available: true,
        category: "non-veg",
        veg: false
    },
    {
        key: 'egg-curry',
        name: 'Egg Curry',
        description: 'Boiled eggs in spicy gravy',
        price: 180,
        color: ['#FACC15', '#EAB308'],
        available: true,
        category: "non-veg",
        veg: false
    },
    {
        key: 'chicken-korma',
        name: 'Chicken Korma',
        description: 'Creamy Mughlai chicken curry',
        price: 340,
        color: ['#FDE68A', '#F59E0B'],
        available: true,
        category: "non-veg",
        veg: false

    },
    {
        key: 'keema-pav',
        name: 'Keema Pav',
        description: 'Spiced minced meat served with bread',
        price: 220,
        color: ['#A16207', '#78350F'],
        available: true,
        category: "non-veg",
        veg: false
    },
    {
        key: 'chicken-lollipop',
        name: 'Chicken Lollipop',
        description: 'Fried chicken wings in Indo-Chinese style',
        price: 280,
        color: ['#EF4444', '#B91C1C'],
        available: true,
        category: "non-veg",
        veg: false
    },

    // ─── VEG ─────────────────────────────────────────────
    {
        key: 'paneer-butter-masala',
        name: 'Paneer Butter Masala',
        description: 'Creamy tomato gravy with paneer cubes',
        price: 260,
        color: ['#F97316', '#EA580C'],
        available: true,
        category: "veg",
        veg: true
    },
    {
        key: 'veg-biryani',
        name: 'Veg Biryani',
        description: 'Aromatic basmati rice with vegetables',
        price: 240,
        color: ['#EAB308', '#CA8A04'],
        available: true,
        category: "veg",
        veg: true
    },
    {
        key: 'palak-paneer',
        name: 'Palak Paneer',
        description: 'Spinach gravy with paneer',
        price: 230,
        color: ['#16A34A', '#15803D'],
        available: true,
        category: "veg",
        veg: true
    },
    {
        key: 'aloo-gobi',
        name: 'Aloo Gobi',
        description: 'Potato and cauliflower curry',
        price: 180,
        color: ['#FACC15', '#EAB308'],
        available: true,
        category: "veg",
        veg: true
    },
    {
        key: 'veg-korma',
        name: 'Veg Korma',
        description: 'Mixed vegetables in creamy gravy',
        price: 210,
        color: ['#FDE68A', '#F59E0B'],
        available: true,
        category: "veg",
        veg: true
    },
    {
        key: 'chole-bhature',
        name: 'Chole Bhature',
        description: 'Spicy chickpeas with fried bread',
        price: 200,
        color: ['#92400E', '#78350F'],
        available: true,
        category: "veg",
        veg: true
    },
    {
        key: 'rajma-chawal',
        name: 'Rajma Chawal',
        description: 'Kidney beans with rice',
        price: 190,
        color: ['#7F1D1D', '#991B1B'],
        available: true,
        category: "veg",
        veg: true
    },
    {
        key: 'veg-fried-rice',
        name: 'Veg Fried Rice',
        description: 'Rice stir-fried with vegetables',
        price: 170,
        color: ['#86EFAC', '#22C55E'],
        available: true,
        category: "veg",
        veg: true
    },
    {
        key: 'paneer-bhurji',
        name: 'Paneer Bhurji',
        description: 'Scrambled paneer with spices',
        price: 210,
        color: ['#FCD34D', '#F59E0B'],
        available: true,
        category: "veg",
        veg: true
    },
    {
        key: 'veg-noodles',
        name: 'Veg Noodles',
        description: 'Stir-fried noodles with vegetables',
        price: 160,
        color: ['#A7F3D0', '#34D399'],
        available: true,
        category: "veg",
        veg: true
    },

    // ─── BEVERAGES ──────────────────────────────────────
    {
        key: 'cold-coffee',
        name: 'Cold Coffee',
        description: 'Chilled coffee with ice cream',
        price: 140,
        color: ['#7C2D12', '#92400E'],
        available: true,
        category: "beverages",
        veg: true
    },
    {
        key: 'fresh-lime-soda',
        name: 'Fresh Lime Soda',
        description: 'Refreshing lime soda',
        price: 90,
        color: ['#4ADE80', '#22C55E'],
        available: true,
        category: "beverages",
        veg: true
    },
    {
        key: 'oreo-shake',
        name: 'Oreo Shake',
        description: 'Milkshake blended with Oreo cookies',
        price: 160,
        color: ['#1F2937', '#111827'],
        available: true,
        category: "beverages",
        veg: true
    },
    {
        key: 'banana-shake',
        name: 'Banana Shake',
        description: 'Creamy banana milkshake',
        price: 130,
        color: ['#FACC15', '#EAB308'],
        available: true,
        category: "beverages",
        veg: true
    },
    {
        key: 'masala-chai',
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea',
        price: 40,
        color: ['#92400E', '#78350F'],
        available: true,
        category: "beverages",
        veg: true
    },
    {
        key: 'green-tea',
        name: 'Green Tea',
        description: 'Healthy herbal green tea',
        price: 60,
        color: ['#16A34A', '#15803D'],
        available: true,
        category: "beverages",
        veg: true
    },
    {
        key: 'buttermilk',
        name: 'Buttermilk',
        description: 'Cooling yogurt-based drink',
        price: 50,
        color: ['#E0F2FE', '#BAE6FD'],
        available: true,
        category: "beverages",
        veg: true
    },
    {
        key: 'watermelon-juice',
        name: 'Watermelon Juice',
        description: 'Fresh watermelon juice',
        price: 110,
        color: ['#F87171', '#DC2626'],
        available: true,
        category: "beverages",
        veg: true
    },

    // ─── DESSERTS (your key: deserts) ───────────────────
    {
        key: 'gulab-jamun',
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in syrup',
        price: 90,
        color: ['#7C2D12', '#991B1B'],
        available: true,
        category: "deserts",
        veg: true
    },
    {
        key: 'rasmalai',
        name: 'Rasmalai',
        description: 'Soft paneer balls in sweet milk',
        price: 120,
        color: ['#FDE68A', '#FACC15'],
        available: true,
        category: "deserts",
        veg: true
    },
    {
        key: 'chocolate-brownie',
        name: 'Chocolate Brownie',
        description: 'Warm chocolate brownie',
        price: 150,
        color: ['#451A03', '#78350F'],
        available: true,
        category: "deserts",
        veg: true
    },
    {
        key: 'ice-cream-sundae',
        name: 'Ice Cream Sundae',
        description: 'Ice cream with toppings',
        price: 140,
        color: ['#FBCFE8', '#F472B6'],
        available: true,
        category: "deserts",
        veg: true
    },
    {
        key: 'kheer',
        name: 'Kheer',
        description: 'Rice pudding with dry fruits',
        price: 100,
        color: ['#FEF3C7', '#FDE68A'],
        available: true,
        category: "deserts",
        veg: true
    },

    // ─── CHATS ─────────────────────────────────────────
    {
        key: 'pani-puri',
        name: 'Pani Puri',
        description: 'Crispy puris with tangy water',
        price: 50,
        color: ['#FBBF24', '#F59E0B'],
        available: true,
        category: "chats",
        veg: true
    },
    {
        key: 'bhel-puri',
        name: 'Bhel Puri',
        description: 'Puffed rice with chutneys',
        price: 60,
        color: ['#F59E0B', '#D97706'],
        available: true,
        category: "chats",
        veg: true
    },
    {
        key: 'sev-puri',
        name: 'Sev Puri',
        description: 'Flat puris topped with sev',
        price: 70,
        color: ['#FACC15', '#CA8A04'],
        available: true,
        category: "chats",
        veg: true
    },
    {
        key: 'dahi-puri',
        name: 'Dahi Puri',
        description: 'Puris filled with yogurt and chutneys',
        price: 80,
        color: ['#E0F2FE', '#38BDF8'],
        available: true,
        category: "chats",
        veg: true
    },

    // ─── LIQUOR (typo preserved: liqour) ────────────────
    {
        key: 'beer',
        name: 'Beer',
        description: 'Chilled lager beer',
        price: 200,
        color: ['#FACC15', '#CA8A04'],
        available: true,
        category: "liqour",
        veg: true
    },
    {
        key: 'whiskey',
        name: 'Whiskey',
        description: 'Premium aged whiskey',
        price: 350,
        color: ['#92400E', '#78350F'],
        available: true,
        category: "liqour",
        veg: true
    },
    {
        key: 'vodka',
        name: 'Vodka',
        description: 'Classic vodka shot',
        price: 300,
        color: ['#E5E7EB', '#9CA3AF'],
        available: true,
        category: "liqour",
        veg: true
    },

    // ─── CHINESE ───────────────────────────────────────
    {
        key: 'veg-manchurian',
        name: 'Veg Manchurian',
        description: 'Fried veggie balls in sauce',
        price: 180,
        color: ['#DC2626', '#991B1B'],
        available: true,
        category: "chinese",
        veg: true
    },
    {
        key: 'chicken-manchurian',
        name: 'Chicken Manchurian',
        description: 'Chicken balls in spicy sauce',
        price: 220,
        color: ['#EF4444', '#B91C1C'],
        available: true,
        category: "chinese",
        veg: false
    },
    {
        key: 'hakka-noodles',
        name: 'Hakka Noodles',
        description: 'Stir-fried noodles',
        price: 170,
        color: ['#FDE68A', '#F59E0B'],
        available: true,
        category: "chinese",
        veg: true
    },
    {
        key: 'schezwan-rice',
        name: 'Schezwan Fried Rice',
        description: 'Spicy fried rice',
        price: 190,
        color: ['#F97316', '#EA580C'],
        available: true,
        category: "chinese",
        veg: true
    },
    {
        key: 'spring-rolls',
        name: 'Spring Rolls',
        description: 'Crispy rolls with filling',
        price: 150,
        color: ['#A3E635', '#65A30D'],
        available: true,
        category: "chinese",
        veg: true
    }
];