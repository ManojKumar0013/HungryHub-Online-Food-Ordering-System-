export type UserRole = 'customer' | 'staff' | 'driver' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  walletBalance: number;
  addresses: Address[];
}

export interface Address {
  id: string;
  title: string;
  addressLine: string;
  city: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

export interface FoodVariant {
  id: string;
  name: string;
  priceExtra: number;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isVeg: boolean;
  rating: number;
  reviewCount: number;
  calories?: number;
  protein?: string;
  prepTimeMinutes: number;
  ingredients: string[];
  variants?: FoodVariant[];
  toppings?: Topping[];
  isAvailable: boolean;
  isPopular?: boolean;
  isBestseller?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  distance: string;
  priceForTwo: number;
  image: string;
  bannerImage: string;
  isFreeDelivery: boolean;
  discountBadge?: string;
  isOpen: boolean;
  address: string;
  phone: string;
  tags: string[];
}

export interface CartItem {
  id: string;
  food: FoodItem;
  quantity: number;
  selectedVariant?: FoodVariant;
  selectedToppings?: Topping[];
  specialInstructions?: string;
  itemTotal: number;
}

export type OrderStatus =
  | 'Placed'
  | 'Preparing'
  | 'Cooking'
  | 'Packed'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'UPI' | 'Card' | 'Wallet' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  deliveryAddress: Address;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverAvatar?: string;
  estimatedDeliveryTime: string;
  otp?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  foodItemName?: string;
  likes: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'driver' | 'restaurant' | 'system';
  text: string;
  timestamp: string;
}
