import { Dish } from "@/components/interactive/dishes";
import { Category } from "@/components/interactive/filter-chip";
import data from "./mock-data.json";

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

export const INITIAL_DISHES = data as Dish[];