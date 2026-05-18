import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import uiReducer from './uiSlice';

// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
    reducer: {
        ui: uiReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Supabase session objects aren't fully serialisable — suppress the warning
            serializableCheck: {
                ignoredActions: ['auth/setSession'],
                ignoredPaths: ['auth.session'],
            },
        }),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ─── Typed hooks ─────────────────────────────────────────────────────────────
// Always import these instead of the raw react-redux versions so the store
// types flow through without any manual casting.

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;