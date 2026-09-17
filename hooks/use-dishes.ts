import { ALL_CATEGORY_ID } from '@/hooks/use-categories';
import { useMyRestaurant } from '@/hooks/use-my-restaurant';
import { DishRead, listDishes } from '@/lib/api/dishes';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const dishKeys = {
    all: ['dishes'] as const,
    list: (restaurantId: string | undefined, categoryId: string | undefined) =>
        [...dishKeys.all, 'list', restaurantId, categoryId ?? ALL_CATEGORY_ID] as const,
};

/**
 * Dishes for the signed-in owner's restaurant, filtered by the selected
 * category ids from the filter bar.
 *
 * ALL_CATEGORY_ID means "no filter" — selecting it (or selecting nothing)
 * fetches every dish by omitting `category_id` from the request entirely,
 * per the endpoint's own contract. Selecting one or more real categories
 * issues one request per category (the endpoint filters on exactly one id
 * at a time) via useQueries, and the pages are merged — a dish belongs to
 * exactly one category, so there's no overlap to dedupe.
 */
export function useDishes(categoryIds: string[]) {
    // Dishes are scoped to a restaurant, so this can't fire until we know
    // which one — piggyback on useMyRestaurant rather than duplicating the
    // auth-gating it already does.
    const { data: restaurant } = useMyRestaurant();
    const restaurantId = restaurant?.id;

    const showAll = categoryIds.length === 0 || categoryIds.includes(ALL_CATEGORY_ID);
    const filterIds: (string | undefined)[] = showAll ? [undefined] : categoryIds;

    const queries = useQueries({
        queries: filterIds.map((categoryId) => ({
            queryKey: dishKeys.list(restaurantId, categoryId),
            queryFn: async (): Promise<DishRead[]> => {
                const res = await listDishes(restaurantId!, { page: 1, page_size: 100, category_id: categoryId });
                return res.data;
            },
            enabled: !!restaurantId,
            // Availability/price can change more often than categories —
            // keep this shorter than useCategories' staleTime.
            staleTime: 60_000,
        })),
    });

    const isLoading = queries.some((q) => q.isLoading);
    const isError = queries.some((q) => q.isError);
    const dishes = useMemo(() => queries.flatMap((q) => q.data ?? []), [queries]);
    const refetch = () => queries.forEach((q) => q.refetch());

    return { data: dishes, isLoading, isError, refetch };
}

export default useDishes;
