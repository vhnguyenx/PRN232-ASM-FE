import axiosClient from './axiosClient';
import { RegisterRequest, LoginRequest, AuthResponse, User } from '@/types';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // axiosClient interceptor already returns response.data
    const response = await axiosClient.post<AuthResponse>('/auth/register', data) as unknown as AuthResponse;
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    return response;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // axiosClient interceptor already returns response.data
    const response = await axiosClient.post<AuthResponse>('/auth/login', data) as unknown as AuthResponse;
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async (): Promise<User> => {
    // axiosClient interceptor already returns response.data
    return axiosClient.get<User>('/auth/profile') as unknown as Promise<User>;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    // axiosClient interceptor already returns response.data
    return axiosClient.put<User>('/auth/profile', data) as unknown as Promise<User>;
  },

  getCurrentUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};
