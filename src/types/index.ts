// Auth Types
export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  email: string;
  fullName?: string;
  role?: string;
  token: string;
}

export interface User {
  id: number;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  role: string;
}

// Cart Types
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage?: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

// Order Types
export interface CreateOrderRequest {
  shippingAddress: string;
  phone: string;
  notes?: string;
  paymentMethod: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

// Product Types (existing)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: number;
}
