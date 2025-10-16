import { configureStore } from '@reduxjs/toolkit';
import productsSlice from './productsSlice';
import authSlice from './authSlice';
import cartSlice from './cartSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    auth: authSlice,
    cart: cartSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;