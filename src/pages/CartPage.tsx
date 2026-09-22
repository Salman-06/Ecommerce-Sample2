import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import { getCart, updateCartQuantity, removeFromCart, getSettings } from '../services/storeService';

interface CartPageProps {
  onNavigate: (view: string) => void;
  onProceedToCheckout: (appliedDiscount: number, couponCode: string) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigate,
  onProceedToCheckout,
  onShowToast
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const settings = getSettings();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const refreshCart = () => {
    setCart(getCart());
  };

  const handleUpdateQuantity = (productId: number, qty: number) => {
    updateCartQuantity(productId, qty);
    refreshCart();
  };

  const handleRemove = (productId: number, name: string) => {
    removeFromCart(productId);
    refreshCart();
    onShowToast(`Removed ${name} from cart`, 'info');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
  const shipping = (subtotal >= settings.freeShippingThreshold || subtotal === 0) ? 0 : settings.shippingFee;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);
  const freeShippingAway = Math.max(0, settings.freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'LUMERA10') {
      const disc = Math.round(subtotal * 0.10);
      setDiscountAmount(disc);
      setAppliedCoupon('LUMERA10');
      onShowToast('✓ 10% Discount Coupon LUMERA10 Applied!', 'success');
    } else {
      onShowToast('Invalid coupon code. Try LUMERA10', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F5F1EB] text-stone-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif-luxury font-bold text-stone-900">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          Looks like you haven’t added any skincare essentials yet. Discover our clinical serums, cleansers, and barrier treatments.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-8 py-3.5 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs uppercase font-bold tracking-widest transition-colors shadow-md"
        >
          Explore Formulations
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#EAE4DC] pb-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Review Order</span>
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1C1917] mt-1">
          Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
        </h1>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#EAE4DC] flex items-center justify-between text-xs">
        {freeShippingAway === 0 ? (
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Congratulations! You qualify for Free Express Shipping.</span>
          </div>
        ) : (
          <div className="text-stone-700">
            Add <strong>₹{freeShippingAway.toLocaleString('en-IN')}</strong> more to your bag for <strong>Free Express Shipping</strong>!
          </div>
        )}
        <span className="font-bold text-[#9E7D58]">Threshold: ₹{settings.freeShippingThreshold}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => (
            <div
              key={item.productId}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE4DC] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-stone-100 flex-shrink-0"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#9E7D58]">
                    {item.product.category}
                  </span>
                  <h3 className="text-base font-serif-luxury font-bold text-stone-900">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Price: ₹{item.product.discountPrice.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[11px] text-stone-400">
                    Stock available: {item.product.stock}
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                
                {/* Quantity box */}
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    className="p-2 text-stone-600 hover:bg-stone-200"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-800">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={item.quantity >= item.product.stock}
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    className="p-2 text-stone-600 hover:bg-stone-200 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Total */}
                <div className="text-right min-w-[80px]">
                  <span className="text-sm font-bold text-stone-900">
                    ₹{(item.product.discountPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemove(item.productId, item.product.name)}
                  className="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  title="Remove from Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue shopping link */}
          <div className="pt-2">
            <button
              onClick={() => onNavigate('products')}
              className="text-xs font-bold uppercase tracking-wider text-stone-600 hover:text-[#9E7D58] flex items-center gap-1 transition-colors"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        {/* Right: Cart Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#EAE4DC] shadow-sm space-y-6">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h3>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-bold text-stone-900">
                  {shipping === 0 ? <span className="text-emerald-700">FREE</span> : `₹${shipping}`}
                </span>
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-bold text-stone-900">
                <span>Grand Total</span>
                <span className="text-xl text-[#9E7D58]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#9E7D58]" />
                <span>Apply Promo Code</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. LUMERA10"
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase font-medium outline-none focus:border-[#9E7D58]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-[#9E7D58] text-white text-xs font-bold uppercase rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] text-stone-400 mt-1">Hint: Use <strong>LUMERA10</strong> for 10% discount</p>
            </form>

            {/* Proceed to Checkout Button */}
            <button
              type="button"
              onClick={() => onProceedToCheckout(discountAmount, appliedCoupon || '')}
              className="w-full py-4 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 shadow-md transition-all group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 text-[11px] text-stone-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#9E7D58]" />
              <span>Safe 256-bit encrypted SSL checkout</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
