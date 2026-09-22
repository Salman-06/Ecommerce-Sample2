import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { CartItem, Order } from '../types';
import { getCart, getSettings, getCustomerSession, createOrder } from '../services/storeService';

interface CheckoutPageProps {
  appliedDiscount: number;
  couponCode: string;
  onOrderSuccess: (order: Order) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  onNavigate: (view: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  appliedDiscount,
  couponCode,
  onOrderSuccess,
  onShowToast,
  onNavigate
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const settings = getSettings();
  const session = getCustomerSession();

  // Form Fields
  const [fullName, setFullName] = useState(session.customerName || '');
  const [email, setEmail] = useState(session.customerEmail || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Flat 402, Radiant Towers, Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('Online');

  // Online payment gateway simulation modal state
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentType, setPaymentType] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');

  useEffect(() => {
    const currentCart = getCart();
    if (currentCart.length === 0) {
      onNavigate('cart');
    }
    setCart(currentCart);
  }, [onNavigate]);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0);
  const shipping = (subtotal >= settings.freeShippingThreshold || subtotal === 0) ? 0 : settings.shippingFee;
  const grandTotal = Math.max(0, subtotal - appliedDiscount + shipping);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      onShowToast('Please fill out all mandatory shipping fields.', 'error');
      return;
    }

    if (paymentMethod === 'Online') {
      // Launch payment gateway simulation modal
      setShowPaymentGateway(true);
    } else {
      // COD order direct creation
      setIsProcessing(true);
      setTimeout(() => {
        const order = createOrder({
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: `${address}, ${city}, ${state} - ${pincode}`,
          items: cart,
          subtotal,
          discount: appliedDiscount,
          shipping,
          total: grandTotal,
          paymentMethod: 'COD',
          paymentStatus: 'Pending',
          couponCode: couponCode || undefined
        });

        setIsProcessing(false);
        onOrderSuccess(order);
      }, 1000);
    }
  };

  const handleOnlinePaymentSuccess = () => {
    setIsProcessing(true);
    setShowPaymentGateway(false);

    setTimeout(() => {
      const order = createOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: `${address}, ${city}, ${state} - ${pincode}`,
        items: cart,
        subtotal,
        discount: appliedDiscount,
        shipping,
        total: grandTotal,
        paymentMethod: 'Online',
        paymentStatus: 'Paid',
        couponCode: couponCode || undefined
      });

      setIsProcessing(false);
      onOrderSuccess(order);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#EAE4DC] pb-4">
        <span className="text-xs uppercase font-bold tracking-widest text-[#9E7D58]">Secure Checkout</span>
        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1C1917] mt-1">
          Shipping & Payment Details
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Customer & Address Form (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Contact info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4DC] shadow-xs space-y-5">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 border-b border-stone-100 pb-3">
              1. Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aanya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aanya@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Mobile Number (for delivery tracking SMS) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4DC] shadow-xs space-y-5">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 border-b border-stone-100 pb-3">
              2. Shipping Address
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  Flat, House No., Building, Street *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 402, Radiant Towers, 12th Main"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560038"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-[#9E7D58]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Options */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4DC] shadow-xs space-y-4">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 border-b border-stone-100 pb-3">
              3. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Online payment option */}
              <label 
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'Online' 
                    ? 'border-[#9E7D58] bg-[#FAF8F5]' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#9E7D58]" />
                    <span className="text-sm font-bold text-stone-900">Online Payment</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Online'}
                    onChange={() => setPaymentMethod('Online')}
                    className="accent-[#9E7D58]"
                  />
                </div>
                <p className="text-xs text-stone-500">
                  Instant UPI (GPay/PhonePe), Credit & Debit Card, Net Banking. Highly Recommended.
                </p>
                <span className="mt-2 text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                  Fastest dispatch & zero COD surcharge
                </span>
              </label>

              {/* COD option */}
              <label 
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'COD' 
                    ? 'border-[#9E7D58] bg-[#FAF8F5]' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-stone-600" />
                    <span className="text-sm font-bold text-stone-900">Cash on Delivery</span>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-[#9E7D58]"
                  />
                </div>
                <p className="text-xs text-stone-500">
                  Pay with cash or UPI to our courier agent at the time of doorstep delivery.
                </p>
                <span className="mt-2 text-[10px] text-stone-400 font-medium">
                  Verified mobile number required
                </span>
              </label>

            </div>
          </div>

        </div>

        {/* Right: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4DC] shadow-sm space-y-6 sticky top-24">
            <h3 className="text-lg font-serif-luxury font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Items ({cart.reduce((s, i) => s + i.quantity, 0)})
            </h3>

            {/* Item list */}
            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.productId} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1C1917] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[11px] text-stone-500">₹{item.product.discountPrice} each</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    ₹{(item.product.discountPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-stone-900">
                  {shipping === 0 ? <span className="text-emerald-700">FREE</span> : `₹${shipping}`}
                </span>
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-bold text-stone-900">
                <span>Total Payable</span>
                <span className="text-2xl text-[#9E7D58]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Place order CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 shadow-md transition-all disabled:bg-stone-300"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isProcessing ? 'Confirming Order...' : paymentMethod === 'Online' ? 'Proceed to Online Payment' : 'Confirm Cash on Delivery'}
              </span>
            </button>

            <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#9E7D58]" />
              <span>Encrypted Transaction • Automated Inventory Sync</span>
            </div>
          </div>
        </div>

      </form>

      {/* Online Payment Gateway Simulation Modal */}
      {showPaymentGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            
            {/* Gateway Header */}
            <div className="bg-[#1C1917] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">LUMÉRA Secure Gateway</span>
                <h4 className="text-base font-bold">Complete Payment of ₹{grandTotal.toLocaleString('en-IN')}</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentGateway(false)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Tabs for Payment Mode */}
              <div className="flex border-b border-stone-200">
                <button
                  type="button"
                  onClick={() => setPaymentType('upi')}
                  className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider ${
                    paymentType === 'upi' ? 'border-b-2 border-[#1C1917] text-[#1C1917]' : 'text-stone-400'
                  }`}
                >
                  UPI Apps
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('card')}
                  className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider ${
                    paymentType === 'card' ? 'border-b-2 border-[#1C1917] text-[#1C1917]' : 'text-stone-400'
                  }`}
                >
                  Cards
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('netbanking')}
                  className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider ${
                    paymentType === 'netbanking' ? 'border-b-2 border-[#1C1917] text-[#1C1917]' : 'text-stone-400'
                  }`}
                >
                  Net Banking
                </button>
              </div>

              {paymentType === 'upi' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-600">Enter your UPI VPA ID to initiate request:</p>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs outline-none focus:border-[#9E7D58]"
                  />
                  <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-500">
                    Supports Google Pay, PhonePe, Paytm, BHIM & Apple Pay.
                  </div>
                </div>
              )}

              {paymentType === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8821"
                      className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">Expiry</label>
                      <input type="text" defaultValue="08/28" className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">CVV</label>
                      <input type="password" defaultValue="342" className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs" />
                    </div>
                  </div>
                </div>
              )}

              {paymentType === 'netbanking' && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase">Select Bank</label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-xl text-xs">
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>State Bank of India</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handleOnlinePaymentSuccess}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs uppercase font-bold tracking-widest transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize & Pay ₹{grandTotal.toLocaleString('en-IN')}</span>
              </button>

              <p className="text-[10px] text-stone-400 text-center">
                HMAC-SHA256 signature verification enabled on server.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
