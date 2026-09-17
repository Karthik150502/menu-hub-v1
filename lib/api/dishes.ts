import { api } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { PaginatedResponse } from './types';

// ─── Backend dishes API ───────────────────────────────────────────────────────
// Wraps FastAPI's /restaurants/{restaurant_id}/dishes route.

export interface DishCategoryRead {
    id: string;
    label: string;
}

export interface DishDiscountRead {
    type: string;
    on: string;
    value: number;
    label: string;
    valid_from: string;
    valid_until: string;
}

export interface DishPriceRead {
    id: string;
    dish_id: string;
    base_price: number;
    currency_code: string;
    total_tax_amount: number;
    final_price: number;
    mrp: number;
    discount: DishDiscountRead | null;
    created_at: string;
    updated_at: string;
}

export interface DishRead {
    id: string;
    restaurant_id: string;
    name: string;
    description: string | null;
    category: DishCategoryRead;
    image_url: string | null;
    available: boolean;
    veg: boolean;
    show_in_menu: boolean;
    tag: string | null;
    created_at: string;
    updated_at: string;
    price: DishPriceRead;
}

export interface ListDishesParams {
    page?: number;
    page_size?: number;
    /** Omit to get every dish for the restaurant — used for the UI-only "All" category. */
    category_id?: string;
}

export async function listDishes(
    restaurantId: string,
    { page = 1, page_size = 50, category_id }: ListDishesParams = {},
): Promise<PaginatedResponse<DishRead>> {
    return api.get<PaginatedResponse<DishRead>>(
        ENDPOINTS.restaurants.dishes(restaurantId),
        category_id ? { page, page_size, category_id } : { page, page_size },
    );
}
