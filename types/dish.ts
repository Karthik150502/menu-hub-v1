import { ItemPrice } from "./price";

export type DishItem = {
    name: string;
    description?: string;
    priceComponent: ItemPrice;
    basePrice: string,
    currency: string;
    category: string;
    imageUrl?: string;
    available: boolean;
    veg: boolean;
    showInMenu?: boolean;
    tag?: string;
}

export type DishFormValues = Omit<DishItem, "priceComponent">