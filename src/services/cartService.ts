import axiosClient from './axiosClient';
import { Cart, AddToCartRequest, UpdateCartItemRequest, CartItem } from '@/types';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    return axiosClient.get<Cart>('/cart') as unknown as Promise<Cart>;
  },

  addToCart: async (data: AddToCartRequest): Promise<CartItem> => {
    return axiosClient.post<CartItem>('/cart', data) as unknown as Promise<CartItem>;
  },

  updateCartItem: async (id: number, data: UpdateCartItemRequest): Promise<CartItem> => {
    return axiosClient.put<CartItem>(`/cart/${id}`, data) as unknown as Promise<CartItem>;
  },

  removeFromCart: async (id: number): Promise<void> => {
    return axiosClient.delete(`/cart/${id}`) as unknown as Promise<void>;
  },

  clearCart: async (): Promise<void> => {
    return axiosClient.delete('/cart') as unknown as Promise<void>;
  }
};
