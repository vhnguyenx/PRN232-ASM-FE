import axiosClient from './axiosClient';
import { Order, CreateOrderRequest, PayOSPaymentRequest, PayOSPaymentResponse } from '@/types';

export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    return axiosClient.post<Order>('/order', data) as unknown as Promise<Order>;
  },

  getOrder: async (id: number): Promise<Order> => {
    return axiosClient.get<Order>(`/order/${id}`) as unknown as Promise<Order>;
  },

  getUserOrders: async (): Promise<Order[]> => {
    return axiosClient.get<Order[]>('/order') as unknown as Promise<Order[]>;
  },

  updatePaymentStatus: async (id: number, paymentStatus: string): Promise<Order> => {
    return axiosClient.put<Order>(`/order/${id}/payment-status`, { paymentStatus }) as unknown as Promise<Order>;
  },

  createPayOSPayment: async (data: PayOSPaymentRequest): Promise<PayOSPaymentResponse> => {
    return axiosClient.post<PayOSPaymentResponse>('/PayOSPayment', data) as unknown as Promise<PayOSPaymentResponse>;
  }
};
