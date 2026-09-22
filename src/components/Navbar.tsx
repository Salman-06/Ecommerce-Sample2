import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import { getCart, getWishlist, getCurrentCustomer, customerLogout, isAdminLoggedIn } from '../services/storeService';

interface NavbarProps {
  currentView: string;
  cartCount?: number;
  wishlistCount?: number;
  onNavigate: (view: string, data?: any) => void;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
  onOpenAdminLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  cartCount: propCartCount,
  wishlistCount: propWishlistCount,
  onNavigate,
  onOpenAuth,
  onOpenSearch,
  onOpenAdminLogin
}) => {
  const [cartCount, setCartCount] = useState<number>(propCartCount ?? 0);
  const [wishlistCount, setWishlistCount] = useState<number>(propWishlistCount ?? 0);
  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (propCartCount !== undefined) setCartCount(propCartCount);
    if (propWishlistCount !== undefined) setWishlistCount(propWishlistCount);
  }, [propCartCount, propWishlistCount]);

  useEffect(() => {
    const updateCounts = () => {
      const cart = getCart();
      const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQty);

      const wishlist = getWishlist();
      setWishlistCount(wishlist.length);

      setCustomer(getCurrentCustomer());
    };

    updateCounts();
    window.addEventListener('storage', updateCounts);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'products', label: 'Products' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#1C1917] text-[#FAF8F5] text-xs py-2 px-4 text-center tracking-wider flex items-center justify-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A880]"></span>
        <span>Complimentary Express Delivery on all orders above ₹999 &nbsp;|&nbsp; Use code <strong className="text-[#C5A880] tracking-widest font-semibold">LUMERA10</strong> for 10% OFF</span>
      </div>

      {/* Main Sticky Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#EAE4DC]' : 'bg-[#FAF8F5] border-b border-[#EAE4DC]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-700 hover:text-[#1C1917] transition-colors rounded-lg focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex flex-col items-center lg:items-start cursor-pointer" onClick={() => onNavigate('home')}>
              <span className="text-2xl sm:text-3xl font-serif-luxury font-semibold tracking-[0.2em] text-[#1C1917] uppercase">
                LUMÉRA SKIN
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C827A] font-medium hidden sm:block -mt-1">
                Pure Care. Visible Glow.
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map(link => {
                const isActive = currentView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`text-sm tracking-widest uppercase font-medium transition-colors duration-200 py-1 relative ${
                      isActive 
                        ? 'text-[#1C1917] font-semibold' 
                        : 'text-stone-600 hover:text-[#1C1917]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C5A880] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons: Search, Wishlist, Cart, Account, and subtle Admin link */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Search Icon */}
              <button
                onClick={onOpenSearch}
                className="p-2 text-stone-700 hover:text-[#1C1917] hover:bg-stone-200/50 rounded-full transition-colors"
                title="Search Products"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon with Counter */}
              <button
                onClick={() => onNavigate('wishlist')}
                className="p-2 text-stone-700 hover:text-red-500 hover:bg-stone-200/50 rounded-full transition-colors relative"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Icon with Counter */}
              <button
                onClick={() => onNavigate('cart')}
                className="p-2 text-stone-700 hover:text-[#1C1917] hover:bg-stone-200/50 rounded-full transition-colors relative"
                title="Shopping Bag"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#1C1917] text-[#FAF8F5] text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-[#FAF8F5] shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Customer Account Button */}
              <div className="relative">
                <button
                  onClick={() => {
                    if (customer) {
                      setUserMenuOpen(!userMenuOpen);
                    } else {
                      onOpenAuth();
                    }
                  }}
                  className="p-2 text-stone-700 hover:text-[#1C1917] hover:bg-stone-200/50 rounded-full transition-colors flex items-center gap-1.5"
                  title={customer ? `Signed in as ${customer.name}` : 'Login / Register'}
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                  {customer && (
                    <span className="text-xs font-medium text-stone-800 hidden md:inline max-w-[90px] truncate">
                      {customer.name}
                    </span>
                  )}
                </button>

                {/* Account Dropdown for Logged In Customer */}
                {customer && userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-500">Signed in as</p>
                      <p className="text-sm font-semibold text-stone-800 truncate">{customer.name}</p>
                      <p className="text-xs text-stone-400 truncate">{customer.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('cart');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      My Orders & Cart
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('wishlist');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      Saved Wishlist
                    </button>
                    <button
                      onClick={() => {
                        customerLogout();
                        setCustomer(null);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-stone-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Subtly styled Admin Panel Link (Mandatory Requirement) */}
              <div className="pl-2 border-l border-stone-300 hidden sm:block">
                <button
                  onClick={() => {
                    if (onOpenAdminLogin && !isAdminLoggedIn()) {
                      onOpenAdminLogin();
                    } else {
                      onNavigate('admin');
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-200/60 hover:bg-stone-300/70 border border-stone-300/80 transition-all shadow-xs"
                  title="Open Admin Management Panel"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9E7D58]" />
                  <span>Admin Panel</span>
                  {isAdminLoggedIn() && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Admin Active" />
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] border-b border-[#EAE4DC] px-4 pt-3 pb-6 space-y-3">
            <nav className="flex flex-col space-y-2">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-sm uppercase tracking-wider font-medium ${
                    currentView === link.id
                      ? 'bg-stone-200/70 text-[#1C1917] font-semibold'
                      : 'text-stone-600 hover:text-[#1C1917]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium bg-stone-200/80 text-stone-800"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#9E7D58]" />
                  <span>Admin Management Panel</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-stone-300">
                  Manage Store
                </span>
              </button>

              {customer ? (
                <div className="flex items-center justify-between px-3 py-2 text-xs text-stone-600">
                  <span>Logged in as <strong>{customer.name}</strong></span>
                  <button
                    onClick={() => {
                      customerLogout();
                      setCustomer(null);
                    }}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full text-center py-2.5 text-xs font-medium bg-[#1C1917] text-white rounded-lg"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
