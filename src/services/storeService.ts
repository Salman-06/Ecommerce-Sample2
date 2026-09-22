import { 
  Product, 
  CartItem, 
  WishlistItem, 
  Order, 
  Customer, 
  ContactMessage, 
  StoreSettings, 
  OrderStatus,
  PaymentMethod
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_MESSAGES, 
  INITIAL_SETTINGS 
} from '../data/initialData';

// Local storage storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'lumera_skin_products',
  CART: 'lumera_skin_cart',
  WISHLIST: 'lumera_skin_wishlist',
  ORDERS: 'lumera_skin_orders',
  CUSTOMERS: 'lumera_skin_customers',
  MESSAGES: 'lumera_skin_messages',
  SETTINGS: 'lumera_skin_settings',
  ADMIN_SESSION: 'lumera_skin_admin_logged',
  CUSTOMER_SESSION: 'lumera_skin_cust_logged'
};

// Event listener helper for multi-tab / reactive UI updates
const listeners: Array<() => void> = [];

export function subscribeToStore(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}

function notifyListeners() {
  listeners.forEach(fn => fn());
}

// Helpers for localStorage
function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

// Ensure default settings has all required fields
const DEFAULT_SETTINGS: StoreSettings = {
  brandName: 'LUMÉRA SKIN',
  storeName: 'LUMÉRA SKIN Store',
  tagline: 'Pure Care. Visible Glow.',
  currency: '₹',
  shippingFee: 99,
  freeShippingThreshold: 999,
  paymentKey: 'rzp_test_lumera_98124Key',
  paymentSecret: 'sec_lumera_secret_77298Hash',
  paymentMode: 'Test / Sandbox',
  adminEmail: 'admin@lumeraskin.com',
  email: 'care@lumeraskin.com',
  phone: '+91 1800-419-LUMERA',
  address: 'No. 402, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038'
};

// Initialize store with fallback seed data
export function initializeStore(): void {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    const custs = INITIAL_CUSTOMERS.map(c => ({
      ...c,
      registeredDate: c.registeredAt,
      ordersCount: c.totalOrders
    }));
    setItem(STORAGE_KEYS.CUSTOMERS, custs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const ords = INITIAL_ORDERS.map(o => ({
      ...o,
      orderNumber: o.id.startsWith('LMR') ? o.id : `LMR-${o.id.replace('LUM-', '')}`,
      date: o.createdAt.split('T')[0],
      total: o.grandTotal,
      trackingNumber: `DL-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: '3 - 5 Business Days',
      shippingAddress: `${o.address}, ${o.city}, ${o.state} - ${o.pincode}`,
      items: o.items.map(i => ({
        ...i,
        product: INITIAL_PRODUCTS.find(p => p.id === i.productId) || {
          id: i.productId,
          name: i.productName,
          image: i.productImage,
          discountPrice: i.price
        }
      }))
    }));
    setItem(STORAGE_KEYS.ORDERS, ords);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    const msgs = INITIAL_MESSAGES.map(m => ({
      ...m,
      date: m.createdAt.split('T')[0]
    }));
    setItem(STORAGE_KEYS.MESSAGES, msgs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }
}

// Auto-run initialization on script load
initializeStore();

// ================= PRODUCT OPERATIONS =================
export function getProducts(): Product[] {
  return getItem<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function getProductById(id: number): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id);
}

export function getNewlyLaunchedProducts(): Product[] {
  const products = getProducts();
  return products
    .filter(p => p.newLaunch && p.status === 1)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
  const products = getProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct: Product = {
    ...productData,
    id: newId,
    createdAt: new Date().toISOString()
  };
  products.unshift(newProduct);
  setItem(STORAGE_KEYS.PRODUCTS, products);
  return newProduct;
}

export function updateProduct(product: Product): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index === -1) return null;
  products[index] = {
    ...product,
    updatedAt: new Date().toISOString()
  };
  setItem(STORAGE_KEYS.PRODUCTS, products);
  return products[index];
}

export function deleteProduct(id: number): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  setItem(STORAGE_KEYS.PRODUCTS, filtered);
  return true;
}

// ================= CART OPERATIONS =================
export function getCart(): CartItem[] {
  return getItem<CartItem[]>(STORAGE_KEYS.CART, []);
}

export function getCartCount(): number {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(product: Product, quantity = 1): { success: boolean; message: string } {
  if (product.stock <= 0) {
    return { success: false, message: 'This formulation is currently out of stock.' };
  }

  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.productId === product.id);

  if (existingIndex > -1) {
    const currentQty = cart[existingIndex].quantity;
    const newQty = currentQty + quantity;
    if (newQty > product.stock) {
      cart[existingIndex].quantity = product.stock;
      setItem(STORAGE_KEYS.CART, cart);
      return { success: true, message: `Updated to maximum available laboratory stock (${product.stock}).` };
    }
    cart[existingIndex].quantity = newQty;
    setItem(STORAGE_KEYS.CART, cart);
    return { success: true, message: 'Cart updated with additional quantity.' };
  } else {
    const qty = Math.min(quantity, product.stock);
    cart.push({
      productId: product.id,
      product,
      quantity: qty
    });
    setItem(STORAGE_KEYS.CART, cart);
    return { success: true, message: `Added ${product.name} to your bag.` };
  }
}

export function updateCartQuantity(productId: number, quantity: number): void {
  const cart = getCart();
  const itemIndex = cart.findIndex(i => i.productId === productId);
  if (itemIndex === -1) return;

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const product = getProductById(productId);
  if (product && quantity > product.stock) {
    cart[itemIndex].quantity = product.stock;
  } else {
    cart[itemIndex].quantity = quantity;
  }
  setItem(STORAGE_KEYS.CART, cart);
}

export function removeFromCart(productId: number): void {
  const cart = getCart();
  const updated = cart.filter(i => i.productId !== productId);
  setItem(STORAGE_KEYS.CART, updated);
}

export function clearCart(): void {
  setItem(STORAGE_KEYS.CART, []);
}

// ================= WISHLIST OPERATIONS =================
export function getWishlist(): WishlistItem[] {
  return getItem<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);
}

export function getWishlistCount(): number {
  return getWishlist().length;
}

export function isInWishlist(productId: number): boolean {
  const wishlist = getWishlist();
  return wishlist.some(item => item.productId === productId);
}

export function toggleWishlist(product: Product): { inWishlist: boolean; message: string } {
  const wishlist = getWishlist();
  const existing = wishlist.findIndex(item => item.productId === product.id);
  if (existing > -1) {
    const updated = wishlist.filter(item => item.productId !== product.id);
    setItem(STORAGE_KEYS.WISHLIST, updated);
    return { inWishlist: false, message: 'Removed from your wishlist' };
  } else {
    wishlist.push({
      productId: product.id,
      product,
      addedAt: new Date().toISOString()
    });
    setItem(STORAGE_KEYS.WISHLIST, wishlist);
    return { inWishlist: true, message: 'Saved to your wishlist' };
  }
}

// ================= ORDERS & STOCK MANAGEMENT =================
export function getOrders(): Order[] {
  return getItem<Order[]>(STORAGE_KEYS.ORDERS, []);
}

export function createOrder(data: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  couponCode?: string;
}): Order {
  const orderNumber = 'LMR-' + Math.floor(10000 + Math.random() * 90000);
  const trackingNumber = 'DL-' + Math.floor(10000000 + Math.random() * 90000000);
  const today = new Date().toISOString().split('T')[0];

  // Stock deduction
  const products = getProducts();
  data.items.forEach(item => {
    const idx = products.findIndex(p => p.id === item.productId);
    if (idx > -1) {
      products[idx].stock = Math.max(0, products[idx].stock - item.quantity);
    }
  });
  setItem(STORAGE_KEYS.PRODUCTS, products);

  const newOrder: Order = {
    id: orderNumber,
    orderNumber,
    date: today,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    shippingAddress: data.shippingAddress,
    items: data.items,
    subtotal: data.subtotal,
    discount: data.discount,
    shipping: data.shipping,
    total: data.total,
    grandTotal: data.total,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentStatus,
    orderStatus: data.paymentStatus === 'Paid' ? 'Processing' : 'Pending',
    transactionId: data.paymentMethod === 'Online' ? `TXN_${Date.now()}` : `COD_${Date.now()}`,
    trackingNumber,
    estimatedDelivery: '3 - 5 Business Days',
    couponCode: data.couponCode,
    createdAt: new Date().toISOString()
  };

  const orders = getOrders();
  setItem(STORAGE_KEYS.ORDERS, [newOrder, ...orders]);

  // Update or insert customer
  const customers = getCustomers();
  const custIndex = customers.findIndex(c => c.email.toLowerCase() === data.customerEmail.toLowerCase());
  if (custIndex > -1) {
    customers[custIndex].totalOrders += 1;
    customers[custIndex].ordersCount = customers[custIndex].totalOrders;
    customers[custIndex].totalSpending += data.total;
    setItem(STORAGE_KEYS.CUSTOMERS, customers);
  } else {
    const newCustomer: Customer = {
      id: customers.length + 1,
      name: data.customerName,
      email: data.customerEmail,
      phone: data.customerPhone,
      registeredAt: today,
      registeredDate: today,
      totalOrders: 1,
      ordersCount: 1,
      totalSpending: data.total,
      status: 'Active'
    };
    setItem(STORAGE_KEYS.CUSTOMERS, [newCustomer, ...customers]);
  }

  // Clear cart after checkout
  clearCart();

  return newOrder;
}

export function updateOrderStatus(orderId: any, status: OrderStatus): boolean {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
  if (index === -1) return false;
  orders[index].orderStatus = status;
  orders[index].updatedAt = new Date().toISOString();
  setItem(STORAGE_KEYS.ORDERS, orders);
  return true;
}

// ================= CUSTOMERS =================
export function getCustomers(): Customer[] {
  return getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
}

// ================= CONTACT MESSAGES =================
export function getContactMessages(): ContactMessage[] {
  return getItem<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
}

export function addContactMessage(data: { name: string; email: string; subject: string; message: string; phone?: string }): ContactMessage {
  const messages = getContactMessages();
  const newMessage: ContactMessage = {
    id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
    name: data.name,
    email: data.email,
    phone: data.phone || '',
    subject: data.subject,
    message: data.message,
    date: new Date().toISOString().split('T')[0],
    status: 'New',
    createdAt: new Date().toISOString()
  };
  setItem(STORAGE_KEYS.MESSAGES, [newMessage, ...messages]);
  return newMessage;
}

// ================= SETTINGS =================
export function getSettings(): StoreSettings {
  const s = getItem<StoreSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  return {
    ...DEFAULT_SETTINGS,
    ...s
  };
}

export function updateSettings(newSettings: Partial<StoreSettings>): void {
  const current = getSettings();
  const merged = { ...current, ...newSettings };
  setItem(STORAGE_KEYS.SETTINGS, merged);
}

// ================= AUTHENTICATION =================
export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
}

export function adminLogin(username: string, password: string): { success: boolean; message: string } {
  const u = username.trim().toLowerCase();
  if ((u === 'admin' || u === 'admin@lumeraskin.com') && (password === 'password123' || password === 'admin123')) {
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    notifyListeners();
    return { success: true, message: 'Authenticated successfully.' };
  }
  return { success: false, message: 'Invalid admin credentials. Use admin / password123' };
}

export function adminLogout(): void {
  sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  notifyListeners();
}

export function getCurrentCustomer(): { name: string; email: string } | null {
  return getItem<{ name: string; email: string } | null>(STORAGE_KEYS.CUSTOMER_SESSION, null);
}

export function getCustomerSession(): { customerName: string; customerEmail: string } {
  const cust = getCurrentCustomer();
  return {
    customerName: cust?.name || '',
    customerEmail: cust?.email || ''
  };
}

export function customerLogin(email: string, name?: string): void {
  const cust = {
    name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
    email
  };
  setItem(STORAGE_KEYS.CUSTOMER_SESSION, cust);
}

export function customerLogout(): void {
  localStorage.removeItem(STORAGE_KEYS.CUSTOMER_SESSION);
  notifyListeners();
}
