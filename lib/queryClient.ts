import { QueryClient } from '@tanstack/react-query';

// ─── React Query client ───────────────────────────────────────────────────────
// Single instance for the app's lifetime — created at module scope (not
// inside a component) so it survives re-renders and Fast Refresh without
// losing its cache. Provided to the tree via <QueryClientProvider> in
// app/_layout.tsx; import this directly wherever a hook is inconvenient
// (e.g. clearing the cache on sign-out — see Sidebar's logout handler).
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data doesn't need to be re-fetched the instant a screen
            // remounts (e.g. tab focus) — treat it as fresh for a minute so
            // navigating around the app doesn't refire every query.
            staleTime: 60_000,
            // Keep unused data around for a bit after its last observer
            // unmounts, so a quick back-and-forth doesn't refetch from
            // scratch.
            gcTime: 5 * 60_000,
            retry: 2,
            refetchOnReconnect: true,
            // No window/tab focus concept on native — avoid the extra
            // refetch-on-focus churn RN's AppState-based default triggers.
            refetchOnWindowFocus: false,
        },
    },
});
