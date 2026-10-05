// Thin fetch wrapper around the HungryHub backend (Express + PostgreSQL).
// Every function here returns data already shaped to match types.ts,
// so components don't need to change how they consume it.

import {
  Restaurant, FoodItem, Order, UserProfile, Address, Coupon, Review, CartItem, UserRole,
} from './types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('hungryhub_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request to ${path} failed with ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ---------- Auth ----------
export async function login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
  const data = await request<{ token: string; user: UserProfile }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('hungryhub_token', data.token);
  return data;
}

export async function register(input: {
  name: string; email: string; phone?: string; password: string; role: UserRole;
}): Promise<{ token: string; user: UserProfile }> {
  const data = await request<{ token: string; user: UserProfile }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  localStorage.setItem('hungryhub_token', data.token);
  return data;
}

// ---------- Restaurants ----------
export const getRestaurants = () => request<Restaurant[]>('/restaurants');
export const addRestaurant = (restaurant: Omit<Restaurant, 'id'>) =>
  request<Restaurant>('/restaurants', { method: 'POST', body: JSON.stringify(restaurant) });

// ---------- Food Items ----------
export const getFoodItems = (restaurantId?: string) =>
  request<FoodItem[]>(`/food-items${restaurantId ? `?restaurantId=${restaurantId}` : ''}`);

export const addFoodItem = (item: Omit<FoodItem, 'id'> & { restaurantId: string }) =>
  request<FoodItem>('/food-items', { method: 'POST', body: JSON.stringify(item) });

export const toggleFoodAvailability = (foodId: string) =>
  request<{ id: string; isAvailable: boolean }>(`/food-items/${foodId}/availability`, { method: 'PATCH', body: '{}' });

export const deleteFoodItem = (foodId: string) =>
  request<void>(`/food-items/${foodId}`, { method: 'DELETE' });

// ---------- Orders ----------
export const getOrders = (params: { customerId?: string; restaurantId?: string; driverId?: string } = {}) => {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return request<Order[]>(`/orders${qs ? `?${qs}` : ''}`);
};

export interface PlaceOrderInput {
  customerId: string;
  restaurantId: string;
  items: {
    itemId: string;
    quantity: number;
    unitPrice: number;
    variantName?: string;
    toppings?: { id: string; name: string; price: number }[];
    specialInstructions?: string;
  }[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'Wallet' | 'COD';
  deliveryAddress: Address;
}

export const placeOrder = (order: PlaceOrderInput) =>
  request<Order>('/orders', { method: 'POST', body: JSON.stringify(order) });

export const updateOrderStatus = (orderId: string, status: string) =>
  request<Order>(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const completeDeliveryWithOtp = (orderId: string, otp: string) =>
  request<{ success: boolean; order?: Order; error?: string }>(`/orders/${orderId}/complete-delivery`, {
    method: 'PATCH',
    body: JSON.stringify({ otp }),
  });

// Helper: turn the frontend's local CartItem[] into the shape placeOrder expects.
export function cartItemsToOrderItems(cartItems: CartItem[]): PlaceOrderInput['items'] {
  return cartItems.map((ci) => ({
    itemId: ci.food.id,
    quantity: ci.quantity,
    unitPrice: ci.itemTotal / ci.quantity,
    variantName: ci.selectedVariant?.name,
    toppings: ci.selectedToppings,
    specialInstructions: ci.specialInstructions,
  }));
}

// ---------- Users / Admin ----------
export const getCustomers = () => request<UserProfile[]>('/users/customers');
export const deleteCustomer = (id: string) => request<void>(`/users/customers/${id}`, { method: 'DELETE' });
export const getAddresses = (userId: string) => request<Address[]>(`/users/${userId}/addresses`);

// ---------- Categories / Coupons / Reviews ----------
export const getCategories = () => request<{ id: string; name: string; icon: string }[]>('/categories');
export const getCoupons = () => request<Coupon[]>('/coupons');
export const getReviews = (restaurantId?: string) =>
  request<Review[]>(`/reviews${restaurantId ? `?restaurantId=${restaurantId}` : ''}`);
export const addReview = (review: {
  restaurantId: string; foodItemId?: string; userName: string; userAvatar?: string; rating: number; comment: string;
}) => request<Review>('/reviews', { method: 'POST', body: JSON.stringify(review) });
