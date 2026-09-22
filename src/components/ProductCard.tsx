import React from 'react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';
import { isInWishlist, toggleWishlist, addToCart } from '../services/storeService';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onProductClick,
  onShowToast
}) => {
  const isWishlisted = isInWishlist(product.id);
  const discountPercent = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  );

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = toggleWishlist(product);
    onShowToast(result.message, result.inWishlist ? 'success' : 'info');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = addToCart(product, 1);
    onShowToast(
      result.success ? `✓ ${product.name} added to cart` : result.message,
      result.success ? 'success' : 'error'
    );
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;

  return (
    <div 
      className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-[#EAE4DC] hover:border-[#C5A880]/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
      onClick={() => onProductClick(product)}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F5F1EB] mb-4">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.newLaunch && (
            <span className="bg-[#1C1917] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs">
              NEW
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#9E7D58] text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-stone-700 hover:text-red-500 shadow-sm transition-all duration-200 z-10"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Toggle Wishlist"
        >
          <Heart 
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-700'
            }`} 
          />
        </button>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 bg-white/95 backdrop-blur-md hover:bg-[#1C1917] hover:text-white text-stone-800 text-xs font-medium tracking-wider uppercase rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Stock Pill */}
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="uppercase tracking-widest font-semibold text-[#8C827A]">
              {product.category}
            </span>
            {isOutOfStock ? (
              <span className="text-red-500 font-medium">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-medium">Only {product.stock} left</span>
            ) : (
              <span className="text-emerald-700 font-medium">In Stock</span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-serif-luxury font-bold text-[#1C1917] line-clamp-1 group-hover:text-[#9E7D58] transition-colors">
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-stone-700">{product.rating}</span>
            <span className="text-[11px] text-stone-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-[#1C1917]">
                ₹{product.discountPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.discountPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-[#1C1917] text-[#FAF8F5] hover:bg-[#9E7D58] active:scale-95'
            }`}
            title={isOutOfStock ? "Out of Stock" : "Add to Cart"}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
