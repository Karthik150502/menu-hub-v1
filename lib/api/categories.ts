import { api } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { PaginatedResponse } from './types';

// ─── Backend categories API ───────────────────────────────────────────────────
// Wraps FastAPI's /restaurants/{restaurant_id}/categories route.

export interface CategoryRead {
    id: string;
    label: string;
}

export interface ListCategoriesParams {
    page?: number;
    page_size?: number;
}

// The endpoint is paginated (page/page_size/has_next), but nothing consumes
// more than page 1 yet — infinite scroll lands later (see useCategories).
// Returning the full envelope now means that work won't need a signature
// change here, just a new call site.
export async function listCategories(
    restaurantId: string,
    { page = 1, page_size = 50 }: ListCategoriesParams = {},
): Promise<PaginatedResponse<CategoryRead>> {
    return api.get<PaginatedResponse<CategoryRead>>(
        ENDPOINTS.restaurants.categories(restaurantId),
        { page, page_size },
    );
}
