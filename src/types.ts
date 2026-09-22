export type ProductCategory = 'Serum' | 'Cleanser' | 'Moisturizer' | 'Sun Care' | 'Face Care';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  ingredients: string;
  benefits: string;
  howToUse: string;
  originalPrice: number;
  discountPrice: number;
  stock: number;
  image: string;
  additionalImages?: string[];
  rating: number;
  reviewsCount: number;
  newLaunch: boolean;
  featured: boolean;
  status: 1 | 0; // 1 = Active, 0 = Inactive
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  productId: number;
  product: Product;
  addedAt: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'Online' | 'COD';
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

export interface OrderItem {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
  product?: Product;
}

export interface Order {
  id: any; // e.g. LUM-84920 or number
  orderNumber?: string;
  date?: string;
  customerId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  items: any[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionId: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  couponCode?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  registeredDate?: string;
  totalOrders: number;
  ordersCount?: number;
  totalSpending: number;
  status: 'Active' | 'Inactive';
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  date?: string;
  status: 'New' | 'Read' | 'Replied';
  replyNotes?: string;
}

export interface StoreSettings {
  brandName: string;
  storeName?: string;
  tagline: string;
  currency: string;
  shippingFee: number;
  freeShippingThreshold: number;
  paymentKey: string;
  paymentSecret: string;
  paymentMode: 'Test / Sandbox' | 'Live Production';
  adminEmail: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerReview {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  review: string;
  productName: string;
  verified: boolean;
}
