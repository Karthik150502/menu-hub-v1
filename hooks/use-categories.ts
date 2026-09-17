import { CategoryRead, listCategories } from '@/lib/api/categories';
import { useMyRestaurant } from '@/hooks/use-my-restaurant';
import { useQuery } from '@tanstack/react-query';

// "All" isn't a category row in the database — it's UI-only logic meaning
// "no category filter", used by the filter bar (adds a synthetic chip for
// it) and useDishes (omits category_id from the request for it). Lives here
// because it's conceptually part of the category list, not the dish one.
export const ALL_CATEGORY_ID = 'all';

// ─── Query keys ───────────────────────────────────────────────────────────────
// Scoped by restaurant so switching restaurants (or a cache clear on
// sign-out, see AuthSync in app/_layout.tsx) never serves a stale list from
// a different one.

export const categoryKeys = {
    all: ['categories'] as const,
    list: (restaurantId: string | undefined) => [...categoryKeys.all, 'list', restaurantId] as const,
};

/**
 * Categories for the signed-in owner's restaurant, used to populate the
 * dish category filter bar. Only fetches page 1 today — the endpoint is
 * paginated, but infinite scroll isn't wired up yet (see lib/api/categories.ts).
 */
export function useCategories() {
    // Categories are scoped to a restaurant, so this can't fire until we know
    // which one — piggyback on useMyRestaurant rather than duplicating the
    // auth-gating it already does.
    const { data: restaurant } = useMyRestaurant();
    const restaurantId = restaurant?.id;

    return useQuery({
        queryKey: categoryKeys.list(restaurantId),
        queryFn: async (): Promise<CategoryRead[]> => {
            const res = await listCategories(restaurantId!, { page: 1, page_size: 50 });
            return res.data;
        },
        enabled: !!restaurantId,
        // Categories change about as rarely as the restaurant profile does.
        staleTime: 5 * 60_000,
    });
}

export default useCategories;
