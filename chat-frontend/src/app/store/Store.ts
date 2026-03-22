import { configureStore } from '@reduxjs/toolkit';
import uiReducer from '../../features/ui/UiSlice';
import uiAuthslice from './slices/authSlices'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    protectRoutes: uiAuthslice
  },
});

// TypeScript definitions - DO NOT SKIP
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;