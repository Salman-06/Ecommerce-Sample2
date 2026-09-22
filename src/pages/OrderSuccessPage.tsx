import React from 'react';
import { CheckCircle2, Package, Truck, Calendar, MapPin, ArrowRight, Printer } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessPageProps {
  order: Order;
  onNavigate: (view: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  order,
  onNavigate
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Hero Success Badge */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE4DC] shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#9E7D58]">
          Order Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#1C1917]">
          Thank You, {order.customerName.split(' ')[0]}!
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
          Your order <strong>{order.orderNumber}</strong> has been received and is being prepared in our climate-controlled laboratory for shipment.
        </p>

        {/* Highlight Metadata Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-6 bg-[#FAF8F5] rounded-2xl border border-[#EAE4DC] text-left mt-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Order Number</span>
            <span className="text-sm font-bold text-stone-900">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Date</span>
            <span className="text-sm font-bold text-stone-900">{order.date}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Payment Method</span>
            <span className="text-sm font-bold text-stone-900">
              {order.paymentMethod} ({order.paymentStatus})
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Tracking ID</span>
            <span className="text-sm font-bold text-[#9E7D58] font-mono">{order.trackingNumber}</span>
          </div>
        </div>
      </div>

      {/* Shipment Details & Items List */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Ordered items (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4DC] shadow-xs space-y-4">
          <h3 className="text-base font-serif-luxury font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#9E7D58]" />
            <span>Package Contents ({order.items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          </h3>

          <div className="divide-y divide-stone-100">
            {order.items.map(item => (
              <div key={item.productId} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">{item.product.name}</h4>
                    <p className="text-[11px] text-stone-500">Qty: {item.quantity} × ₹{item.product.discountPrice}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-900">
                  ₹{(item.product.discountPrice * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-stone-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold text-stone-900">
                {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
              <span>Amount Paid / Due</span>
              <span className="text-lg text-[#9E7D58]">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Estimate (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4DC] shadow-xs space-y-5">
            <h3 className="text-base font-serif-luxury font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#9E7D58]" />
              <span>Delivery Status</span>
            </h3>

            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#9E7D58] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800 block">Estimated Arrival</span>
                  <span>{order.estimatedDelivery}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9E7D58] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800 block">Deliver To</span>
                  <span>{order.shippingAddress}</span>
                  <p className="text-[11px] text-stone-400 mt-0.5">Phone: {order.customerPhone}</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl text-[11px] text-stone-500 border border-[#EAE4DC]">
              A confirmation email and SMS dispatch link has been sent to <strong>{order.customerEmail}</strong>.
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="w-full py-3 bg-[#1C1917] hover:bg-[#9E7D58] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
