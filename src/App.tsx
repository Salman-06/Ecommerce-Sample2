import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { AdminLoginModal } from './admin/AdminLoginModal';
import { AdminDashboard } from './admin/AdminDashboard';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { ContactPage } from './pages/ContactPage';

import { Product, Order } from './types';
import { getCartCount, getWishlistCount, isAdminLoggedIn } from './services/storeService';

export default function App() {
  // Navigation View Router
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initialCategory, setInitialCategory] = useState<string>('All');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Checkout discount tracking
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutCoupon, setCheckoutCoupon] = useState('');

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Badge counters
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const refreshBadges = () => {
    setCartCount(getCartCount());
    setWishlistCount(getWishlistCount());
  };

  useEffect(() => {
    refreshBadges();
    window.scrollTo(0, 0);
  }, [currentView]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    refreshBadges();
  };

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'products' && data?.category) {
      setInitialCategory(data.category);
    } else if (view === 'products') {
      setInitialCategory('All');
    }

    if (view === 'admin') {
      if (!isAdminLoggedIn()) {
        setIsAdminLoginOpen(true);
        return;
      }
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshBadges();
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = (appliedDiscount: number, couponCode: string) => {
    setCheckoutDiscount(appliedDiscount);
    setCheckoutCoupon(couponCode);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setLastPlacedOrder(order);
    setCurrentView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`✓ Order ${order.orderNumber} placed successfully!`, 'success');
  };

  // If in Admin Dashboard view
  if (currentView === 'admin' && isAdminLoggedIn()) {
    return (
      <div className="min-h-screen bg-[#F7F5F0]">
        <AdminDashboard
          onReturnToStore={() => handleNavigate('home')}
          onLogout={() => {
            handleNavigate('home');
            showToast('Logged out of Admin Portal', 'info');
          }}
          onShowToast={showToast}
        />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] font-sans antialiased selection:bg-[#9E7D58] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onQuickView={(p) => setQuickViewProduct(p)}
            onProductClick={handleProductClick}
            onShowToast={showToast}
          />
        )}

        {currentView === 'products' && (
          <ProductsPage
            initialCategory={initialCategory}
            onQuickView={(p) => setQuickViewProduct(p)}
            onProductClick={handleProductClick}
            onShowToast={showToast}
          />
        )}

        {currentView === 'product-details' && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => handleNavigate('products')}
            onQuickView={(p) => setQuickViewProduct(p)}
            onProductClick={handleProductClick}
            onShowToast={showToast}
          />
        )}

        {currentView === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentView === 'contact' && (
          <ContactPage onShowToast={showToast} />
        )}

        {currentView === 'cart' && (
          <CartPage
            onNavigate={handleNavigate}
            onProceedToCheckout={handleProceedToCheckout}
            onShowToast={showToast}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            onNavigate={handleNavigate}
            onProductClick={handleProductClick}
            onShowToast={showToast}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            appliedDiscount={checkoutDiscount}
            couponCode={checkoutCoupon}
            onOrderSuccess={handleOrderSuccess}
            onShowToast={showToast}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'order-success' && lastPlacedOrder && (
          <OrderSuccessPage
            order={lastPlacedOrder}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetails={handleProductClick}
        onShowToast={showToast}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleProductClick}
      />

      {/* Global Customer Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(name) => showToast(`Welcome back, ${name}!`, 'success')}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Global Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => {
          showToast('✓ Admin session authenticated!', 'success');
          setCurrentView('admin');
        }}
      />

      {/* Global Notification Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
