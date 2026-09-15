import { listMyRestaurants, RestaurantRead } from '@/lib/api/restaurants';
import { selectIsAuthenticated, useAppSelector } from '@/store';
import { useQuery } from '@tanstack/react-query';

// ─── Query keys ───────────────────────────────────────────────────────────────
// A factory rather than inline arrays, so any future restaurant query
// (details, dishes, …) can share/invalidate the same key namespace
// consistently — e.g. queryClient.invalidateQueries({ queryKey: restaurantKeys.all }).

export const restaurantKeys = {
    all: ['restaurants'] as const,
    mine: () => [...restaurantKeys.all, 'me'] as const,
};

/**
 * The signed-in owner's restaurant. Only the name/open-state are used today
 * (home screen header + hero), but RestaurantRead carries everything the
 * backend has (address, currency, timings, …) for screens that need it
 * later — no new fetch required, just read more fields off `data`.
 */
export function useMyRestaurant() {
    // /restaurants/me needs a bearer token — firing it before a session
    // exists would just 401. Gate on auth status (set by AuthSync, see
    // app/_layout.tsx) instead of racing it.
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    return useQuery({
        queryKey: restaurantKeys.mine(),
        queryFn: async (): Promise<RestaurantRead | null> => {
            const restaurants = await listMyRestaurants();
            return restaurants[0] ?? null;
        },
        enabled: isAuthenticated,
        // A restaurant's name/open-state rarely changes — no need to treat
        // it as stale the moment a screen remounts.
        staleTime: 5 * 60_000,
    });
}

export default useMyRestaurant;
