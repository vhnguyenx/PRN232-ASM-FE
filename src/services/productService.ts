import axiosClient from './axiosClient';
import { Product } from '../redux/productsSlice';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    return await axiosClient.get('/product');
  },

  getProductById: async (id: number): Promise<Product> => {
    return await axiosClient.get(`/product/${id}`);
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    return await axiosClient.post('/product', product);
  },

  updateProduct: async (id: number, product: Product): Promise<Product> => {
    return await axiosClient.put(`/product/${id}`, product);
  },

  deleteProduct: async (id: number): Promise<void> => {
    return await axiosClient.delete(`/product/${id}`);
  },
};