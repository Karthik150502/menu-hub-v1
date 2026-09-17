import { Dish } from "@/components/interactive/dishes";
import { Category } from "@/components/interactive/filter-chip";
import data from "./mock-data.json";

export const CATEGORIES: Category[] = [
    { key: "4bd54b29-cc9c-432c-9452-86797761331d", label: "Non Veg" },
    { key: "45f10ecc-f691-4a9a-86a0-1cca696dfbe7", label: "Veg" },
    { key: "1f7809e1-0e3b-4108-a9f3-02a7e45c1b5f", label: "Beverages" },
    { key: "c80bc5ad-d150-4339-8f43-0100d5c70733", label: "Deserts" },
    { key: "c972fa1f-1e2b-437d-86d3-d698d58a3f73", label: "Chats" },
    { key: "3af248ff-7bca-447f-bc36-99899c26d727", label: "Liqour/ Alcholol", },
    { key: "f4210096-6602-4aef-9591-303e910a0ed1", label: "Chinese" },
];

export const INITIAL_DISHES = data as Dish[];