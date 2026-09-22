import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Check, Shield, Sparkles, Leaf } from 'lucide-react';
import { Product } from '../types';
import { isInWishlist, toggleWishlist, addToCart } from '../services/storeService';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetails: (product: Product) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onViewFullDetails,
  onShowToast
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    const res = addToCart(product, quantity);
    onShowToast(res.success ? `✓ Added ${quantity} item(s) to cart` : res.message, res.success ? 'success' : 'error');
  };

  const handleWishlist = () => {
    const res = toggleWishlist(product);
    onShowToast(res.message, res.inWishlist ? 'success' : 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-stone-700 hover:text-black hover:bg-white shadow-sm z-20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 bg-[#F5F1EB] relative flex items-center justify-center p-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 md:h-full object-cover rounded-2xl shadow-xs"
          />
          {product.newLaunch && (
            <span className="absolute top-4 left-4 bg-[#1C1917] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-md">
              New Launch
            </span>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8C827A]">
              {product.category} &nbsp;•&nbsp; SKU: {product.sku}
            </span>

            <h2 className="text-2xl font-serif-luxury font-bold text-[#1C1917] mt-1">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-stone-800">{product.rating}</span>
              <span className="text-xs text-stone-400">({product.reviewsCount} customer reviews)</span>
            </div>

            {/* Price Block */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-2xl font-bold text-[#1C1917]">
                ₹{product.discountPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.discountPrice && (
                <>
                  <span className="text-sm text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs bg-[#EFE9DF] text-[#9E7D58] font-bold px-2 py-0.5 rounded">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* Key badges */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-stone-600">
              <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clean Ingredients</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
                <Shield className="w-3.5 h-3.5 text-[#9E7D58]" />
                <span>Dermatologically Tested</span>
              </div>
            </div>

            {/* Stock indicator */}
            <div className="mt-4 text-xs font-medium">
              {product.stock > 0 ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units available)
                </span>
              ) : (
                <span className="text-red-500">Currently Out of Stock</span>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-6 border-t border-stone-100">
            <div className="flex items-center gap-3 mb-4">
              {/* Quantity selector */}
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-200 disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-semibold text-stone-800">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-200 disabled:opacity-40"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 bg-[#1C1917] hover:bg-[#9E7D58] text-[#FAF8F5] rounded-xl text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 transition-colors disabled:bg-stone-200 disabled:text-stone-400"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              {/* Wishlist */}
              <button
                type="button"
                onClick={handleWishlist}
                className="p-3 border border-stone-200 hover:border-red-300 rounded-xl text-stone-700 hover:text-red-500 transition-colors"
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onViewFullDetails(product);
              }}
              className="w-full text-center text-xs text-[#9E7D58] hover:text-[#1C1917] font-semibold underline underline-offset-4 transition-colors"
            >
              View Full Product Page & Ingredients →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
