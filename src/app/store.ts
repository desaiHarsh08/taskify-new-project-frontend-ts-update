import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from '@/app/slices/loadingSlice'
import refetchReducer from '@/app/slices/refetchSlice'

export const store = configureStore({
    reducer: {
        loading: loadingReducer,
        refetch: refetchReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch