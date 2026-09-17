// ─── Shared API response shapes ───────────────────────────────────────────────
// Every backend list endpoint wraps its results in this paginated envelope —
// shared here so each resource file (restaurants.ts, categories.ts, …) types
// against the same shape instead of redeclaring it.

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    total: number;
    page: number;
    page_size: number;
    has_next: boolean;
}
