import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Search, 
  Sparkles,
  MessageSquare,
  Store,
  CheckCircle2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Product, Order, Customer, StoreSettings, ContactMessage, ProductCategory } from '../types';
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  getOrders, 
  updateOrderStatus, 
  getCustomers, 
  getSettings, 
  updateSettings, 
  getContactMessages, 
  adminLogout 
} from '../services/storeService';

interface AdminDashboardProps {
  onReturnToStore: () => void;
  onLogout: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onReturnToStore,
  onLogout,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'messages' | 'settings'>('dashboard');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(getSettings());

  // Product CRUD Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Order Details Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Search in Products
  const [productSearch, setProductSearch] = useState('');

  // Form State for Add / Edit Product
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Serum');
  const [formOriginalPrice, setFormOriginalPrice] = useState(999);
  const [formDiscountPrice, setFormDiscountPrice] = useState(799);
  const [formStock, setFormStock] = useState(50);
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formBenefits, setFormBenefits] = useState('');
  const [formHowToUse, setFormHowToUse] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formNewLaunch, setFormNewLaunch] = useState(false);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formStatus, setFormStatus] = useState<0 | 1>(1);

  // Settings form state
  const [settingsStoreName, setSettingsStoreName] = useState('');
  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsPhone, setSettingsPhone] = useState('');
  const [settingsShippingFee, setSettingsShippingFee] = useState(99);
  const [settingsFreeThreshold, setSettingsFreeThreshold] = useState(999);
  const [settingsAddress, setSettingsAddress] = useState('');

  const loadData = () => {
    setProducts(getProducts());
    setOrders(getOrders());
    setCustomers(getCustomers());
    setMessages(getContactMessages());
    const s = getSettings();
    setSettings(s);
    setSettingsStoreName(s.storeName || 'LUMÉRA SKIN Store');
    setSettingsEmail(s.email || 'care@lumeraskin.com');
    setSettingsPhone(s.phone || '+91 1800-419-LUMERA');
    setSettingsShippingFee(s.shippingFee);
    setSettingsFreeThreshold(s.freeShippingThreshold);
    setSettingsAddress(s.address || 'No. 402, 100ft Road, Indiranagar, Bengaluru, Karnataka 560038');
  };

  useEffect(() => {
    loadData();
  }, []);

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const lowStockProducts = products.filter(p => p.stock <= 15);

  // Handle open Add Product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`LMR-SKU-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory('Serum');
    setFormOriginalPrice(899);
    setFormDiscountPrice(699);
    setFormStock(40);
    setFormShortDesc('');
    setFormDesc('');
    setFormIngredients('Aqua, Glycerin, Botanical Extracts, Sodium Hyaluronate, Phenoxyethanol.');
    setFormBenefits('Boosts moisture retention and strengthens natural dermal barriers.');
    setFormHowToUse('Apply 3-4 drops evenly onto cleansed facial skin day and night.');
    setFormImage('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80');
    setFormNewLaunch(true);
    setFormFeatured(false);
    setFormStatus(1);
    setIsProductModalOpen(true);
  };

  // Handle open Edit Product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormCategory(p.category);
    setFormOriginalPrice(p.originalPrice);
    setFormDiscountPrice(p.discountPrice);
    setFormStock(p.stock);
    setFormShortDesc(p.shortDescription);
    setFormDesc(p.description);
    setFormIngredients(p.ingredients);
    setFormBenefits(p.benefits);
    setFormHowToUse(p.howToUse);
    setFormImage(p.image);
    setFormNewLaunch(p.newLaunch);
    setFormFeatured(p.featured);
    setFormStatus(p.status);
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSku || !formImage) {
      onShowToast('Please provide Product Name, SKU, and Image URL', 'error');
      return;
    }

    if (editingProduct) {
      // Update
      const updated = updateProduct({
        ...editingProduct,
        name: formName,
        sku: formSku,
        category: formCategory,
        originalPrice: Number(formOriginalPrice),
        discountPrice: Number(formDiscountPrice),
        stock: Number(formStock),
        shortDescription: formShortDesc,
        description: formDesc,
        ingredients: formIngredients,
        benefits: formBenefits,
        howToUse: formHowToUse,
        image: formImage,
        newLaunch: formNewLaunch,
        featured: formFeatured,
        status: formStatus
      });
      if (updated) {
        onShowToast(`✓ Product "${formName}" updated successfully!`, 'success');
      }
    } else {
      // Create
      addProduct({
        name: formName,
        sku: formSku,
        category: formCategory,
        originalPrice: Number(formOriginalPrice),
        discountPrice: Number(formDiscountPrice),
        stock: Number(formStock),
        shortDescription: formShortDesc,
        description: formDesc,
        ingredients: formIngredients,
        benefits: formBenefits,
        howToUse: formHowToUse,
        image: formImage,
        newLaunch: formNewLaunch,
        featured: formFeatured,
        status: formStatus,
        rating: 5.0,
        reviewsCount: 1
      });
      onShowToast(`✓ New formulation "${formName}" added to catalog!`, 'success');
    }

    setIsProductModalOpen(false);
    loadData();
  };

  // Delete product
  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    loadData();
    onShowToast('Product deleted from catalog', 'info');
  };

  // Quick toggle New Launch
  const handleToggleNewLaunch = (p: Product) => {
    updateProduct({
      ...p,
      newLaunch: !p.newLaunch
    });
    loadData();
    onShowToast(`Updated "${p.name}" New Launch badge to ${!p.newLaunch ? 'ON' : 'OFF'}`, 'success');
  };

  // Quick toggle Status
  const handleToggleStatus = (p: Product) => {
    updateProduct({
      ...p,
      status: p.status === 1 ? 0 : 1
    });
    loadData();
    onShowToast(`Product "${p.name}" is now ${p.status === 1 ? 'Inactive' : 'Active'}`, 'info');
  };

  // Update Order Status
  const handleUpdateOrderStatus = (orderId: number, newStatus: Order['orderStatus']) => {
    updateOrderStatus(orderId, newStatus);
    loadData();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
    onShowToast(`Order #${orderId} status changed to ${newStatus}`, 'success');
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName: settingsStoreName,
      email: settingsEmail,
      phone: settingsPhone,
      shippingFee: Number(settingsShippingFee),
      freeShippingThreshold: Number(settingsFreeThreshold),
      address: settingsAddress
    });
    loadData();
    onShowToast('✓ Store configuration updated successfully!', 'success');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-stone-900 flex flex-col">
      
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#1C1917] text-white border-b border-stone-800 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#292524] text-[#C5A880] flex items-center justify-center font-serif-luxury font-bold">
            L
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase font-serif-luxury text-[#FAF8F5]">
              LUMÉRA SKIN <span className="text-[#C5A880] text-xs font-mono font-normal">| Admin Suite</span>
            </h1>
            <p className="text-[10px] text-stone-400">Production-Style Store & Database Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToStore}
            className="px-3.5 py-1.5 bg-[#292524] hover:bg-[#3E3835] text-stone-200 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="hidden sm:inline">View Customer Store</span>
          </button>

          <button
            onClick={() => {
              adminLogout();
              onLogout();
            }}
            className="px-3.5 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-red-800/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Tabs (Desktop & Tablet) */}
        <aside className="w-full md:w-64 bg-white border-r border-[#EAE4DC] p-4 flex md:flex-col gap-1 overflow-x-auto scrollbar-none flex-shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-colors whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-[#1C1917] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap ${
              activeTab === 'products' ? 'bg-[#1C1917] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Products</span>
            </div>
            <span className="text-[10px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-bold">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-[#1C1917] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders</span>
            </div>
            <span className="text-[10px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-bold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap ${
              activeTab === 'customers' ? 'bg-[#1C1917] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </div>
            <span className="text-[10px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-bold">
              {customers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors whitespace-nowrap ${
              activeTab === 'messages' ? 'bg-[#1C1917] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries</span>
            </div>
            <span className="text-[10px] bg-stone-200 text-stone-800 px-2 py-0.5 rounded-full font-bold">
              {messages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-colors whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-[#1C1917] text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Store Settings</span>
          </button>
        </aside>

        {/* Workspace Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Live Telemetry</span>
                <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900">
                  Store Performance & Metrics
                </h2>
              </div>

              {/* Top 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-[#EAE4DC] shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-bold uppercase tracking-wider">Total Revenue</span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-stone-900">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% this month
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#EAE4DC] shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-bold uppercase tracking-wider">Total Orders</span>
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-stone-900">
                    {totalOrdersCount}
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    All completed & pending orders
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#EAE4DC] shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-bold uppercase tracking-wider">Products Catalog</span>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-stone-900">
                    {totalProductsCount}
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    {products.filter(p => p.status === 1).length} active formulations
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-[#EAE4DC] shadow-xs">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                    <span className="font-bold uppercase tracking-wider">Low Stock Warning</span>
                    <div className="p-2 rounded-xl bg-red-50 text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {lowStockProducts.length}
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Products with stock ≤ 15 units
                  </span>
                </div>
              </div>

              {/* Low Stock Alerts Banner if any */}
              {lowStockProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Inventory Replenishment Notice</p>
                      <p className="text-amber-700">
                        {lowStockProducts.map(p => `${p.name} (${p.stock} left)`).join(', ')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="px-4 py-2 bg-amber-800 text-white rounded-xl font-bold uppercase tracking-wider text-[10px] hover:bg-amber-900"
                  >
                    Manage Inventory
                  </button>
                </div>
              )}

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl p-6 border border-[#EAE4DC] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="text-lg font-serif-luxury font-bold text-stone-900">Recent Customer Orders</h3>
                    <p className="text-xs text-stone-500">Live order flow with immediate status overrides</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold uppercase tracking-wider text-[#9E7D58] hover:underline"
                  >
                    View All Orders ({orders.length}) →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 uppercase font-bold tracking-wider">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Items</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-3 font-mono font-bold text-stone-900">{o.orderNumber}</td>
                          <td className="py-3">
                            <div className="font-semibold text-stone-900">{o.customerName}</div>
                            <div className="text-[10px] text-stone-400">{o.customerEmail}</div>
                          </td>
                          <td className="py-3 text-stone-600">{o.items.length} items</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {o.paymentMethod} ({o.paymentStatus})
                            </span>
                          </td>
                          <td className="py-3 font-bold text-stone-900">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800">
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="px-2.5 py-1 text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Catalog Management</span>
                  <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
                    Formulations & Inventory ({products.length})
                  </h2>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-5 py-3 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Formulation</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl p-3 border border-[#EAE4DC] flex items-center gap-3">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter by product name, SKU or category..."
                  className="w-full text-xs outline-none bg-transparent"
                />
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-[#EAE4DC] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 uppercase font-bold tracking-wider">
                      <tr>
                        <th className="p-4">Product</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price / MRP</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4">New Launch</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-[#FAF8F5]">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 object-cover rounded-xl bg-stone-100 flex-shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-stone-900">{p.name}</h4>
                                <span className="text-[10px] text-stone-400">Rating: {p.rating} ★</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-stone-600">{p.sku}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-semibold">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-stone-900">₹{p.discountPrice}</span>
                            <span className="text-[10px] text-stone-400 line-through block">₹{p.originalPrice}</span>
                          </td>
                          <td className="p-4">
                            <span className={`font-bold ${p.stock <= 15 ? 'text-red-600' : 'text-stone-800'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => handleToggleNewLaunch(p)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                                p.newLaunch
                                  ? 'bg-[#1C1917] text-white hover:bg-stone-800'
                                  : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                              }`}
                            >
                              {p.newLaunch ? '★ Active' : 'Off'}
                            </button>
                          </td>
                          <td className="p-4">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(p)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                                p.status === 1
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-stone-100 text-stone-400'
                              }`}
                            >
                              {p.status === 1 ? 'Published' : 'Draft'}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-2 text-stone-600 hover:text-black hover:bg-stone-100 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(p.id)}
                                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Fulfillment Queue</span>
                <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
                  Customer Orders ({orders.length})
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-[#EAE4DC] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 uppercase font-bold tracking-wider">
                      <tr>
                        <th className="p-4">Order #</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Quick Update</th>
                        <th className="p-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-[#FAF8F5]">
                          <td className="p-4 font-mono font-bold text-stone-900">{o.orderNumber}</td>
                          <td className="p-4">
                            <div className="font-semibold text-stone-900">{o.customerName}</div>
                            <div className="text-[10px] text-stone-400">{o.customerPhone}</div>
                          </td>
                          <td className="p-4 text-stone-600">{o.date}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {o.paymentMethod} • {o.paymentStatus}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-stone-900">₹{o.total.toLocaleString('en-IN')}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800">
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            <select
                              value={o.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                              className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[11px] outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="px-3 py-1.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-lg text-[11px] font-bold tracking-wider uppercase transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Customer Registry</span>
                <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
                  Registered Clients ({customers.length})
                </h2>
              </div>

              <div className="bg-white rounded-3xl border border-[#EAE4DC] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-500 uppercase font-bold tracking-wider">
                      <tr>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Joined Date</th>
                        <th className="p-4">Lifetime Orders</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {customers.map(c => (
                        <tr key={c.id} className="hover:bg-[#FAF8F5]">
                          <td className="p-4 font-bold text-stone-900">{c.name}</td>
                          <td className="p-4">
                            <div className="text-stone-800">{c.email}</div>
                            <div className="text-[11px] text-stone-400">{c.phone}</div>
                          </td>
                          <td className="p-4 text-stone-600">{c.registeredDate}</td>
                          <td className="p-4 font-semibold text-stone-800">{c.ordersCount} orders</td>
                          <td className="p-4 text-right">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              Active Client
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Inquiries & Feedback</span>
                <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
                  Customer Messages ({messages.length})
                </h2>
              </div>

              <div className="space-y-4">
                {messages.map(m => (
                  <div key={m.id} className="bg-white rounded-2xl p-6 border border-[#EAE4DC] shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500 border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{m.name}</span>
                        <span>•</span>
                        <span>{m.email}</span>
                      </div>
                      <span>{m.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#1C1917]">{m.subject}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed bg-[#FAF8F5] p-3 rounded-xl">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">System Configuration</span>
                <h2 className="text-2xl font-serif-luxury font-bold text-stone-900">
                  Global Store Settings
                </h2>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4DC] shadow-xs space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Store Display Name
                    </label>
                    <input
                      type="text"
                      value={settingsStoreName}
                      onChange={(e) => setSettingsStoreName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Support Phone Number
                    </label>
                    <input
                      type="text"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Free Shipping Threshold (₹)
                    </label>
                    <input
                      type="number"
                      value={settingsFreeThreshold}
                      onChange={(e) => setSettingsFreeThreshold(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Standard Shipping Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={settingsShippingFee}
                      onChange={(e) => setSettingsShippingFee(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                      Physical Laboratory / Store Address
                    </label>
                    <input
                      type="text"
                      value={settingsAddress}
                      onChange={(e) => setSettingsAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-md"
                >
                  Save Store Configurations
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif-luxury font-bold text-stone-900 mb-1">
              {editingProduct ? 'Edit Formulation' : 'Add New Formulation'}
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Updates in this form immediately synchronize to the customer catalog and home screen.
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ceramide Barrier Rescue Cream"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  >
                    <option value="Serum">Serum</option>
                    <option value="Cleanser">Cleanser</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="Sun Care">Sun Care</option>
                    <option value="Face Care">Face Care</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Original Price / MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Discounted Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formDiscountPrice}
                    onChange={(e) => setFormDiscountPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 uppercase mb-1">Product Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 uppercase mb-1">Short Description (for cards)</label>
                  <input
                    type="text"
                    value={formShortDesc}
                    onChange={(e) => setFormShortDesc(e.target.value)}
                    placeholder="Brief 1-line formulation note"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 uppercase mb-1">Full Description</label>
                  <textarea
                    rows={3}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 uppercase mb-1">Ingredients Breakdown</label>
                  <textarea
                    rows={2}
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">Key Benefits</label>
                  <input
                    type="text"
                    value={formBenefits}
                    onChange={(e) => setFormBenefits(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">How To Use</label>
                  <input
                    type="text"
                    value={formHowToUse}
                    onChange={(e) => setFormHowToUse(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none focus:border-[#9E7D58]"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formNewLaunch}
                    onChange={(e) => setFormNewLaunch(e.target.checked)}
                    className="rounded text-[#1C1917] focus:ring-0"
                  />
                  <span className="font-bold text-stone-800">Flag as "New Launch" (Shows on Homepage)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded text-[#1C1917] focus:ring-0"
                  />
                  <span className="font-bold text-stone-800">Featured in Catalog</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formStatus === 1}
                    onChange={(e) => setFormStatus(e.target.checked ? 1 : 0)}
                    className="rounded text-[#1C1917] focus:ring-0"
                  />
                  <span className="font-bold text-stone-800">Active / Published</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 border border-stone-300 text-stone-700 rounded-xl font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl font-bold uppercase transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-serif-luxury font-bold text-stone-900">Delete Formulation?</h4>
            <p className="text-xs text-stone-500">
              Are you sure you want to permanently remove this product from the database catalog?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-stone-300 rounded-xl text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS INSPECTOR */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-500"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E7D58]">
                Order Inspector
              </span>
              <h3 className="text-xl font-serif-luxury font-bold text-stone-900">
                {selectedOrder.orderNumber}
              </h3>
              <p className="text-xs text-stone-400">Placed on {selectedOrder.date}</p>
            </div>

            {/* Customer & Delivery */}
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE4DC] text-xs space-y-2">
              <div>
                <span className="font-bold text-stone-700 block">Customer:</span>
                <span className="text-stone-900 font-semibold">{selectedOrder.customerName}</span> ({selectedOrder.customerEmail}, {selectedOrder.customerPhone})
              </div>
              <div>
                <span className="font-bold text-stone-700 block">Destination Address:</span>
                <span className="text-stone-800">{selectedOrder.shippingAddress}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span>Tracking Number:</span>
                <span className="font-mono font-bold text-[#9E7D58]">{selectedOrder.trackingNumber}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-stone-600">Ordered Items ({selectedOrder.items.length})</h4>
              <div className="divide-y divide-stone-100">
                {selectedOrder.items.map(i => (
                  <div key={i.productId} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={i.product.image} alt={i.product.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <div className="font-semibold text-stone-900">{i.product.name}</div>
                        <div className="text-[10px] text-stone-400">Qty: {i.quantity} × ₹{i.product.discountPrice}</div>
                      </div>
                    </div>
                    <span className="font-bold">₹{i.product.discountPrice * i.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status change select */}
            <div className="p-4 border border-stone-200 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-bold text-stone-700">Update Order Status:</span>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as any)}
                className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl font-semibold outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
