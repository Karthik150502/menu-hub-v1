import { api } from './apiClient';
import { ENDPOINTS } from './endpoints';

// ─── Backend restaurants API ──────────────────────────────────────────────────
// Wraps FastAPI's /restaurants routes. Only "my restaurants" is needed for
// now — the home screen shows just the current owner's restaurant name/open
// state (see hooks/use-my-restaurant.ts) — the rest of RestaurantRead
// (address, timings, currency, …) is reserved for later screens.

// Every backend list response is wrapped in this paginated envelope.
export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    total: number;
    page: number;
    page_size: number;
    has_next: boolean;
}

export interface RestaurantRead {
    id: string;
    owner_id: string;
    name: string;
    description: string | null;
    is_open: boolean;
    currency: string;
    logo_url: string | null;
    image_url: string | null;
    address_line: string | null;
    pincode: string | null;
    city: string | null;
    state: string | null;
    country: string;
    shop_timings: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

export async function listMyRestaurants(): Promise<RestaurantRead[]> {
    // One owner has exactly one restaurant for now — page_size=1 is enough,
    // and cheaper than pulling the default page of 20 just to read data[0].
    // Revisit once an owner can run more than one.
    const res = await api.get<PaginatedResponse<RestaurantRead>>(
        ENDPOINTS.restaurants.me,
        { page: 1, page_size: 1 },
    );
    return res.data;
}
