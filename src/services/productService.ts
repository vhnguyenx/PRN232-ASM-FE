import axiosClient from './axiosClient';
import { Product } from '../redux/productsSlice';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    return await axiosClient.get('/product') as unknown as Promise<Product[]>;
  },

  getProductById: async (id: number): Promise<Product> => {
    return await axiosClient.get(`/product/${id}`) as unknown as Promise<Product>;
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    return await axiosClient.post('/product', product) as unknown as Promise<Product>;
  },

  updateProduct: async (id: number, product: Product): Promise<Product> => {
    return await axiosClient.put(`/product/${id}`, product) as unknown as Promise<Product>;
  },

  deleteProduct: async (id: number): Promise<void> => {
    return await axiosClient.delete(`/product/${id}`) as unknown as Promise<void>;
  },
};