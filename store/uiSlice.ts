import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

// ─── Types ────────────────────────────────────────────────────────────────────
// The UI slice owns all ephemeral display state that doesn't belong to any
// single domain slice — modal visibility, sidebar, toasts, active filters etc.

interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
}

interface UiState {
    sidebarOpen: boolean;
    editDishId: string | null;   // which dish modal is open for
    createDishOpen: boolean;
    toasts: Toast[];
    globalLoading: boolean;          // full-screen loader (auth, initial fetch)
}

const initialState: UiState = {
    sidebarOpen: false,
    editDishId: null,
    createDishOpen: false,
    toasts: [],
    globalLoading: false,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Sidebar
        openSidebar: (s) => { s.sidebarOpen = true; },
        closeSidebar: (s) => { s.sidebarOpen = false; },
        toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen; },

        // Dish modals
        openEditDish: (s, a: PayloadAction<string>) => { s.editDishId = a.payload; },
        closeEditDish: (s) => { s.editDishId = null; },
        openCreateDish: (s) => { s.createDishOpen = true; },
        closeCreateDish: (s) => { s.createDishOpen = false; },

        // Toasts
        showToast(s, a: PayloadAction<Omit<Toast, 'id'>>) {
            s.toasts.push({
                ...a.payload,
                id: Date.now().toString(),
            });
        },
        dismissToast(s, a: PayloadAction<string>) {
            s.toasts = s.toasts.filter(t => t.id !== a.payload);
        },
        clearToasts: (s) => { s.toasts = []; },

        // Global loader
        setGlobalLoading: (s, a: PayloadAction<boolean>) => { s.globalLoading = a.payload; },
    },
});

export const {
    openSidebar, closeSidebar, toggleSidebar,
    openEditDish, closeEditDish,
    openCreateDish, closeCreateDish,
    showToast, dismissToast, clearToasts,
    setGlobalLoading,
} = uiSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectSidebarOpen = (s: RootState) => s.ui.sidebarOpen;
export const selectEditDishId = (s: RootState) => s.ui.editDishId;
export const selectCreateDishOpen = (s: RootState) => s.ui.createDishOpen;
export const selectToasts = (s: RootState) => s.ui.toasts;
export const selectGlobalLoading = (s: RootState) => s.ui.globalLoading;

export default uiSlice.reducer;